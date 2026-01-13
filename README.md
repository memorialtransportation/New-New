# Memorial Transportation LLC Website (Demo)

A clean, modern public website + an employee portal (demo login) that works on Render.

## Features
- Public pages: Home, Services, About, Quote Request, Contact
- Employee Portal:
  - Login at `/#/employee/login`
  - Dashboard at `/#/employee/dashboard`
  - Session cookie (demo) + server-side password verification (password not stored in plain text)

## Demo employee credentials
- Username: `memorialtransportation`
- Password: `asiya$08`

## Run locally
```bash
npm install
npm run dev
```
Open:
- Website: http://localhost:5173
- API server (proxy): http://localhost:10000

## Deploy on Render (easiest)
Create a **Web Service** from your GitHub repo and set:

- Environment: **Node**
- Build Command:
```bash
npm install && npm run build
```
- Start Command:
```bash
npm start
```

No database or extra env vars required for the demo.

## Notes
- This is a demo setup. For production, you would:
  - store employees in a database,
  - enforce role-based access,
  - add HTTPS-only cookies and CSRF protections.
