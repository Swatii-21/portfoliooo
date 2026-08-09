# Contact form backend — setup

## 1. Backend (Express + Nodemailer)

```bash
cd server
npm install
cp .env.example .env
```

Fill in `.env`:
- `SMTP_USER` / `SMTP_PASS` — for Gmail, turn on 2-Step Verification, then create an
  **App Password** (Google Account → Security → App passwords). Use that 16-character
  code as `SMTP_PASS`, not your normal Gmail password.
- `CONTACT_TO_EMAIL` — where messages should land (defaults to your email already).

Run it:
```bash
npm start        # or: node index.js
```
It starts on `http://localhost:5000` with one route: `POST /api/contact`.

## 2. Frontend (Portfolio.jsx)

The form already calls `fetch("/api/contact", { method: "POST", ... })`.

- **If your React app runs on a different port than the backend** (e.g. Vite on 5173,
  backend on 5000), add a proxy so `/api/*` forwards to the backend during dev:
  - Vite (`vite.config.js`):
    ```js
    export default {
      server: { proxy: { "/api": "http://localhost:5000" } }
    }
    ```
  - Create React App (`package.json`):
    ```json
    "proxy": "http://localhost:5000"
    ```

- **In production**, deploy the `server/` folder anywhere that runs Node (Render,
  Railway, a VPS, etc.) and either:
  - point your frontend's fetch URL at the full backend URL, e.g.
    `fetch("https://your-backend.onrender.com/api/contact", ...)`, or
  - put both frontend and backend behind the same domain/reverse proxy so `/api`
    routes to the backend automatically (no code change needed).

## 3. Test it

```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Hello!"}'
```
You should get `{"ok":true}` back and an email in your inbox.

## Notes
- Validation happens on both sides — client-side for instant feedback, server-side
  because the client can never be trusted.
- There's a simple in-memory rate limiter (5 requests/minute per IP). Fine for a
  personal portfolio; swap for `express-rate-limit` + Redis if traffic grows.
- CORS is wide open (`cors()`) for local dev — lock it down to your real domain
  before shipping: `cors({ origin: "https://yourdomain.com" })`.
