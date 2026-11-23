# IDSC Faculty Management System (v2)

Node.js + MongoDB Atlas. Role-based logins: **Administrator**, **Department Head**, **Faculty**.
Modules: Faculty, Non-Faculty, Departments, Subjects, Class Schedules, **Leave Requests**, **Attendance**, **Grades**, Reports, Users, Settings.

## Run locally
1. Install Node.js 18+ (LTS).
2. Create a free MongoDB Atlas cluster, a database user, and allow your IP (Network Access).
3. `cp .env.example .env` and paste your Atlas connection string into `MONGODB_URI`.
4. `npm install`
5. (Only if you used the old file version) `npm run migrate` to import `data/db.json`.
6. `npm start`, then open http://localhost:3000. First visit creates the administrator.

## Who can do what
| | Admin | Department head | Faculty |
|---|---|---|---|
| Faculty / staff / departments | full | view own department | view own record |
| Subjects, class schedules | full | manage own department | view own classes |
| Leave requests | review all, delete | approve/reject own department | file and cancel own |
| Attendance | edit all | edit own department | Time in / Time out for self |
| Grades | any class | view own department | enter/edit for own classes |
| User accounts, backup, reset | yes | no | no |

Create accounts in **Users**: link a Faculty account (or a department head who also teaches) to a faculty record.

## Deploy
See the step-by-step in the chat reply, or: host Node on Render/Railway/a school server, set the
variables from `.env.example` in the host's dashboard (never upload `.env`), set `COOKIE_SECURE=1`
and `TRUST_PROXY=1` once HTTPS is on, and add the server's IP to Atlas Network Access.
Health check URL: `/healthz`.
