<<<<<<< HEAD
# Hair of Kashmir — Clinic Webapp

An aesthetic clinic webapp for **Hair of Kashmir** (Dr. Mir Waleed Mansoor, Srinagar). Built with React + Vite, backed by Supabase.

## Features

- **Customer site**: Home, treatments catalog, products shop with cart & checkout, appointment booking with real availability, FAQ + ask-a-question, about, contact
- **Admin console** (at `/#admin`): appointments manager, orders manager, questions/FAQ manager, catalogue toggles, revenue overview

## Local setup

```powershell
# 1. Install deps
npm install

# 2. Create your .env.local from the example
Copy-Item .env.example .env.local
# then edit .env.local with your Supabase URL + publishable key

# 3. Run dev server
npm run dev
```

App runs at http://localhost:5173

## Build for production

```powershell
npm run build
# output is in ./dist
```

## Admin access

Visit `/#admin` — default passcode is **`hok2026`** (change `ADMIN_PASS` in `src/App.jsx` before going live).

## Database

Schema lives in Supabase (project `mhhifytmrlyksfrjacvi`). All tables are prefixed `hok_`:

- `hok_treatment_categories` — catalog categories
- `hok_treatments` — individual treatments
- `hok_products` — shop products
- `hok_customers` — customer records
- `hok_orders` — product orders
- `hok_appointments` — appointment bookings
- `hok_availability` — weekly availability rules
- `hok_blocked_dates` — holiday / leave blocks
- `hok_questions` — customer questions + public FAQ

Row-Level Security is enabled with public read for catalog data and public insert for orders, appointments, and questions.

## Tech

- React 18 + Vite 5
- Supabase (Postgres + RLS, no auth library — admin gated client-side)
- No UI framework — hand-styled with CSS variables for a custom editorial aesthetic

## License

Private. © Hair of Kashmir.
=======
# HOK
waleed's laser clinic 
>>>>>>> bf32915a091d4a3c4226e833536279b1716c2056
