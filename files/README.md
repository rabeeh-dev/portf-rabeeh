# pf-client — Portfolio Frontend

React-based portfolio with a single-page user-facing site and a protected admin dashboard.

## Quick Start

```bash
cd pf-client
npm install
npm start
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Single-page portfolio (Hero → About → Services → Work → Testimonials → Contact) |
| `/admin/login` | Admin login page |
| `/admin` | Admin dashboard (protected) |

## Default Admin Credentials

```
Email:    admin@portfolio.com
Password: admin123
```
> Change these in `src/context/AuthContext.js` or connect to your backend.

## Tech Stack

- **React 18** + React Router v6
- **CSS Variables** for consistent theming (dark navy + electric cyan)
- **Framer-ready** (add `framer-motion` for production animations)
- **localStorage** for dynamic data (swap with Firebase/API in `DataContext.js`)

## Folder Structure

```
src/
├── context/
│   ├── AuthContext.js     # Admin auth state
│   └── DataContext.js     # Services / Projects / Testimonials state
├── pages/
│   ├── Portfolio.js       # Full single-page user portfolio
│   ├── Portfolio.css
│   ├── AdminLogin.js      # Admin login screen
│   ├── AdminLogin.css
│   ├── AdminDashboard.js  # Full admin panel with managers
│   └── AdminDashboard.css
├── App.js                 # Routes
├── index.js
└── index.css              # Global tokens & utilities
```

## Connecting to Backend (pf-backend)

Replace `localStorage` in `DataContext.js` with API calls to your `pf-backend` endpoints:
- `GET/POST/PUT/DELETE /api/services`
- `GET/POST/PUT/DELETE /api/projects`
- `GET/POST/PUT/DELETE /api/testimonials`

For auth, swap the hardcoded login in `AuthContext.js` with a `POST /api/auth/login` call that returns a JWT.
