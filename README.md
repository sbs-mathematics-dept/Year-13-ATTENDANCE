# A Level Mathematics — Attendance

Shared attendance register for Cambridge 9709 option groups at SBS International School Chiangmai.

- **Statistics Group** — Mrs. Cheng (14 students)
- **Mechanics Group** — Ms. Hanna (15 students, also A Level Physics)

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

## Lesson schedule

Set from **Edit schedule** on the register card. Default slots:

| Group | Lessons |
|---|---|
| Statistics | Monday 10:30–11:30, Tuesday 10:35–12:30 |
| Mechanics | Wednesday 14:30–15:25, Friday 14:30–15:25 |

The schedule is saved in the sheet's *Settings* tab, so a change made by either teacher applies to both. Records already taken keep their original lesson time. Any date can also take an *Extra lesson* register.

## Summary & export

Filter by date range, group and student. Shows attendance %, present, late, absent and excused, with a per-student table. Attendance % counts present and late as attended. Thresholds: below 90% watch, below 80% at risk. Export CSV or print the report.

## Adding or removing a student

Edit the `GROUPS` object near the top of the script block in `index.html` and commit. Existing records are unaffected.
