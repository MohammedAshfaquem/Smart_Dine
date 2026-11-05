# Smart Dine

Smart Dine is a restaurant application with a React frontend and a Django REST backend. It includes staff registration, email verification, admin approval, role-based dashboards, and QR-linked table details. Menu, cart, order, waiter request, and feedback models are available in Django admin; the customer interface is still in development.

## Project structure

```text
Smart_Dine/                       # Repository root (this README)
├── backend/
│   └── project/
│       ├── manage.py            # Run Django commands here
│       ├── requirements.txt
│       ├── project/settings.py  # Database, email, and CORS configuration
│       └── smartdine/           # Models, APIs, routes, and migrations
└── frontend/
    └── smartdine-frontend/
        ├── package.json         # Run npm commands here
        ├── vite.config.js
        └── src/
```

## Requirements

- Python 3.12 is a suitable starting point, also used by the included Dockerfile.
- Node.js 22.12+ with npm, or Node.js 20.19+ (supported by the installed Vite 7 package).
- Two terminals: one for the backend and one for the frontend.

The default database is **SQLite**. PostgreSQL and Docker are not needed for local development. Data is stored in `backend/project/db.sqlite3`; uploaded images and generated QR codes are stored in `backend/project/media/`.

The commands below use **Windows PowerShell**. Start from the repository root, `Smart_Dine`, containing `backend` and `frontend`. If your terminal opens in the parent `Smart Dine` workspace folder, run `cd Smart_Dine` first.

## First-time setup

### 1. Install backend dependencies — terminal 1

Create your own virtual environment. An existing `backend/env` directory may belong to another machine.

```powershell
cd backend/project
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
```

Enter your own email, name, and password. The superuser is created with the `admin` role and is already active, verified, and approved. Use its email and password for both the frontend login and Django admin. There are no default login credentials.

If PowerShell blocks activation, skip it and use the virtual environment's Python directly for each command:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe manage.py migrate
.\.venv\Scripts\python.exe manage.py createsuperuser
```

On macOS/Linux, use `python3 -m venv .venv` and `source .venv/bin/activate`. The remaining Python and npm commands are the same.

### 2. Configure email for local testing

Staff verification and password reset require email. In `backend/project/project/settings.py`, replace the existing `EMAIL_BACKEND` assignment with:

```python
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
```

Emails will print in the backend terminal. Open the printed verification/reset link in your browser; no SMTP account is needed. Keep `FRONTEND_URL = 'http://localhost:3001'` for this setup.

For real delivery, configure your own SMTP settings in that file. Do not rely on the existing SMTP credentials or commit your own credentials. Settings currently live directly in Python: the project does **not** load `.env` files, even though `python-dotenv` is listed as a dependency.

### 3. Start the backend

From `backend/project`, with the virtual environment active:

```powershell
python manage.py check
python manage.py runserver 8000
```

Keep this terminal running. Open [Django admin](http://localhost:8000/admin/) to confirm the server is available.

**A 404 at `http://localhost:8000/` is expected:** the backend has no homepage route.

### 4. Install and start the frontend — terminal 2

Open another terminal at the repository root:

```powershell
cd frontend/smartdine-frontend
npm install --legacy-peer-deps
npm run dev -- --strictPort
```

Open [http://localhost:3001](http://localhost:3001). Vite is also configured to open the browser automatically.

`--legacy-peer-deps` handles an existing dependency conflict: `react-qr-reader` declares support for React 16/17, while this project uses React 19. This allows installation; it does not guarantee complete compatibility of the older package.

`--strictPort` keeps Vite on **3001**. If that port is occupied, stop the other process and retry. Backend CORS settings, email links, and QR URLs currently depend on this port. If PowerShell blocks `npm.ps1`, use `npm.cmd` instead of `npm`.

## Running the app after setup

Open two terminals at the repository root. Reinstall dependencies only when they change; create the superuser once per database.

**Terminal 1 — backend:**

```powershell
cd backend/project
.\.venv\Scripts\Activate.ps1
python manage.py migrate
python manage.py runserver 8000
```

**Terminal 2 — frontend:**

```powershell
cd frontend/smartdine-frontend
npm run dev -- --strictPort
```

Keep both terminals open. Press `Ctrl+C` in each terminal to stop its server. Run `deactivate` to leave the Python virtual environment.

## Login and first use

| Page | URL | Purpose |
| --- | --- | --- |
| Customer entry | [localhost:3001](http://localhost:3001) | Current QR demonstration using table 5 |
| Staff login | [localhost:3001/login](http://localhost:3001/login) | Admin, kitchen, and waiter login |
| Staff registration | [localhost:3001/register](http://localhost:3001/register) | Create a kitchen or waiter account |
| Admin dashboard | [localhost:3001/admin-dashboard](http://localhost:3001/admin-dashboard) | Approve registrations and manage staff |
| Django admin | [localhost:8000/admin/](http://localhost:8000/admin/) | Manage users, tables, and stored records |

To test staff registration:

1. Register a kitchen or waiter account at `/register`.
2. Open the verification link printed in the backend terminal when using console email.
3. Log in with the superuser and approve the verified staff member in the admin dashboard.
4. Log in with the staff account to reach its role's dashboard.

Staff must verify their email and receive admin approval before logging in. Blocked users cannot log in. Public registration cannot create an admin account.

To try table data, log in to Django admin, add a table with table number **5**, and save it. Saving a table generates its QR image. Check [the table API](http://localhost:8000/tables/5/) and [customer table details](http://localhost:3001/customer/dashboard?table=5).

## Useful commands

From `backend/project`, with the virtual environment active:

```powershell
python manage.py check             # Validate Django configuration
python manage.py migrate           # Apply existing database migrations
python manage.py test              # Run available Django tests
```

After intentionally changing models, run `python manage.py makemigrations`, review the generated migration, then run `python manage.py migrate`.

From `frontend/smartdine-frontend`:

```powershell
npm run build                     # Produce the bundle in dist/
npm run preview -- --port 3001     # Preview the built bundle locally
npm run lint                      # Requires an ESLint configuration
```

The backend must also run for frontend preview. A lint script exists, but no ESLint configuration file is currently included in the frontend folder.

## Troubleshooting and current limitations

| Problem | What to check |
| --- | --- |
| `No module named django` | Activate `.venv` and install `requirements.txt` using that environment's Python. |
| `no such table` or migration warning | Run `python manage.py migrate` from `backend/project`. |
| npm reports `ERESOLVE` | Install with `npm install --legacy-peer-deps`. |
| Frontend cannot reach the API | Run Django on port 8000 and use `http://localhost:3001` for the frontend. API addresses are hardcoded in frontend source. |
| Staff login fails | Verify the email, approve the account as admin, and confirm it is not blocked. |
| Registration succeeds but no email arrives | Check the backend terminal. Registration can succeed even if delivery fails. Use console email locally. |
| Backend root returns 404 | Expected; visit `/admin/`. |
| Table API returns 404 | Create that table number in Django admin first. |
| `/table/5` shows “Failed to load table data” | `TablePage.jsx` requests `/api/tables/5/`, but Django exposes `/tables/5/`. Until the mismatch is fixed, use `/customer/dashboard?table=5`. |
| Home page QR image is missing or outdated | The page hardcodes table 5 and an image path. Use the QR attached to the table in Django admin; generated filenames may differ. |
| QR link fails on a phone | QR URLs use `localhost`, which refers to the device opening the link. LAN testing requires reachable URLs and matching frontend/backend configuration. |

Docker files are included in `backend/project`, but Compose binds a machine-specific Windows folder. Update the volume path before using Compose and apply migrations inside the container. The Python setup above avoids this extra configuration.

These instructions cover local development. Review debug mode, secrets, hosts, CORS, email, and serving configuration before deployment.
