# Faculty Data Model

## Faculty
- `facultyId`: unique string identifier
- `name`: full name
- `department`: department name
- `position`: academic position
- `email`: optional email address
- `status`: `ACTIVE` or `INACTIVE`
- `updatedAt`: ISO date-time of last update
- `disabledAt`: nullable ISO date-time when disabled

Mock records are stored in `server/data/facultyData.js`. The in-memory data resets when the server restarts.
