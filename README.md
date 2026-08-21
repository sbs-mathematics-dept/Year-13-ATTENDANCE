# A Level Mathematics — Attendance

Shared attendance register for Cambridge 9709 option groups at SBS International School Chiangmai.

- **Statistics Group** — Mrs. Cheng (17 students)
- **Mechanics Group** — Ms. Hanna (13 students, also A Level Physics)

## Files

| File | Purpose |
|---|---|
| `index.html` | The whole site — register, summary, CSV export |
| `Code.gs` | Google Apps Script backend that stores marks in a Google Sheet |

## Setup

1. Create a Google Sheet, e.g. *A Level Maths Attendance*.
2. In the sheet: **Extensions → Apps Script**. Delete the sample code, paste `Code.gs`, save.
3. **Deploy → New deployment → Web app**. Execute as **Me**, access **Anyone**. Authorise, then copy the `/exec` URL.
4. In `index.html`, paste that URL into `API_URL` near the top of the script block.
5. Commit to a GitHub repository, then **Settings → Pages → Deploy from branch → main / (root)**.
6. Share the published link with Ms. Hanna.

## Taking a register

Choose the date, group and lesson, then tap P, L, A or E for each student. Absent and excused open a reason box. The counters update as you mark, and marks upload to the sheet as you tap them.

## Time schedule

Set from **Edit time schedule** on the register card. Default slots:

Taken from the Y13MATC timetable (Secondary Sixth Form), six periods a week:

| Group | Lessons | Room |
|---|---|---|
| Statistics | Monday, Period 3, 10:35–11:30 | C394 |
| Statistics | Tuesday, Period 3, 10:35–11:30 | C374 |
| Statistics | Tuesday, Period 4, 11:35–12:30 | C374 |
| Mechanics | Wednesday, Period 6, 14:30–15:25 | C394 |
| Mechanics | Friday, Period 3, 10:35–11:30 | C370 |
| Mechanics | Friday, Period 4, 11:35–12:30 | C174 |

Each slot holds a period name, start and end time, and room. The schedule is saved in the sheet's *Settings* tab, so a change made by either teacher applies to both. Records already taken keep their original lesson time. Any date can also take an *Extra lesson* register.

## Staying up to date

The page reloads from the sheet on open, on every return to the tab, when the device comes back online, and every 30 seconds while it is in front of you. Responses are fetched with `cache: no-store`, so a stale copy is never used.

## Summary & export

Filter by date range, group and student. Shows attendance %, present, late, absent and excused, with a per-student table. Attendance % counts present and late as attended. Thresholds: below 90% watch, below 80% at risk. Export CSV or print the report.

## Adding or removing a student

Edit the `GROUPS` object near the top of the script block in `index.html` and commit. Existing records are unaffected.
