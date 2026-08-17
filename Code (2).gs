/**
 * SBS A Level Mathematics — Attendance backend
 * Bound to a Google Sheet. Deploy as: Web app · Execute as Me · Access: Anyone
 * Tabs "Attendance" and "Settings" are created automatically on first use.
 */

var SHEET_NAME = 'Attendance';
var SETTINGS_NAME = 'Settings';
var HEADERS = ['Date', 'Group', 'Lesson', 'Student', 'Status', 'Note', 'Updated'];

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.getRange('A:A').setNumberFormat('@');
    sh.getRange('C:C').setNumberFormat('@');
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sh;
}

function getSettingsSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SETTINGS_NAME);
  if (!sh) {
    sh = ss.insertSheet(SETTINGS_NAME);
    sh.appendRow(['Key', 'Value']);
    sh.setFrozenRows(1);
  }
  return sh;
}

function readSetting(key) {
  var v = getSettingsSheet().getDataRange().getValues();
  for (var i = 1; i < v.length; i++) if (v[i][0] === key) return String(v[i][1]);
  return '';
}

function writeSetting(key, value) {
  var sh = getSettingsSheet();
  var v = sh.getDataRange().getValues();
  for (var i = 1; i < v.length; i++) {
    if (v[i][0] === key) { sh.getRange(i + 1, 2).setValue(value); return; }
  }
  sh.appendRow([key, value]);
}

function asText(v) {
  if (v instanceof Date) return Utilities.formatDate(v, 'Asia/Bangkok', 'yyyy-MM-dd');
  return String(v).trim();
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Read every record plus the saved lesson schedule. */
function doGet() {
  var values = getSheet().getDataRange().getValues();
  var out = [];
  for (var i = 1; i < values.length; i++) {
    var r = values[i];
    if (!r[0] || !r[3] || !r[4]) continue;
    out.push({
      date: asText(r[0]),
      group: String(r[1]),
      lesson: asText(r[2]),
      student: String(r[3]),
      status: String(r[4]),
      note: r[5] == null ? '' : String(r[5])
    });
  }
  var sched = readSetting('schedule');
  var parsed = null;
  if (sched) { try { parsed = JSON.parse(sched); } catch (e) { parsed = null; } }
  return json({ ok: true, records: out, schedule: parsed, count: out.length });
}

/** Upsert records (empty status deletes) and optionally save settings. */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var payload = JSON.parse(e.postData.contents);

    if (payload.settings && payload.settings.schedule) {
      writeSetting('schedule', JSON.stringify(payload.settings.schedule));
    }

    var records = payload.records || [];
    if (!records.length) return json({ ok: true, saved: 0 });

    var sh = getSheet();
    var values = sh.getDataRange().getValues();
    var index = {};
    for (var i = 1; i < values.length; i++) {
      index[asText(values[i][0]) + '|' + values[i][1] + '|' + asText(values[i][2]) + '|' + values[i][3]] = i + 1;
    }

    var now = new Date();
    var appends = [];
    var deletes = [];

    for (var j = 0; j < records.length; j++) {
      var rec = records[j];
      var row = index[rec.date + '|' + rec.group + '|' + rec.lesson + '|' + rec.student];
      if (!rec.status) { if (row) deletes.push(row); continue; }
      var line = [rec.date, rec.group, rec.lesson, rec.student, rec.status, rec.note || '', now];
      if (row) sh.getRange(row, 1, 1, HEADERS.length).setValues([line]);
      else appends.push(line);
    }

    if (appends.length) {
      sh.getRange(sh.getLastRow() + 1, 1, appends.length, HEADERS.length).setValues(appends);
    }
    deletes.sort(function (a, b) { return b - a; }).forEach(function (row) { sh.deleteRow(row); });

    return json({ ok: true, saved: records.length });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}
