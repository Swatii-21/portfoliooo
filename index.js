// server/index.js
// Simple Express + Nodemailer backend for the portfolio contact form.
//
// SETUP:
//   1) npm install express nodemailer cors dotenv
//   2) Copy .env.example to .env and fill in your SMTP credentials
//   3) node server/index.js   (or: npm run server, see package.json note below)
//
// The frontend (Portfolio.jsx) POSTs to POST /api/contact with { name, email, message }.

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());          // in production, restrict this to your site's origin
app.use(express.json());

// Basic rate limiting (very simple in-memory version — swap for a real
// rate-limiter like express-rate-limit if you expect real traffic / abuse)
const requestLog = new Map();
function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 5;
  const timestamps = (requestLog.get(ip) || []).filter((t) => now - t < windowMs);
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > maxRequests;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,       // e.g. smtp.gmail.com
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465, // true for port 465, false for 587
  auth: {
    user: process.env.SMTP_USER,     // your sending email address
    pass: process.env.SMTP_PASS,     // app password (NOT your normal password)
  },
});

app.post("/api/contact", async (req, res) => {
  try {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    if (isRateLimited(ip)) {
      return res.status(429).json({ ok: false, error: "Too many requests. Try again in a minute." });
    }

    const { name, email, message } = req.body || {};

    // ---- server-side validation (never trust the client) ----
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ ok: false, error: "Name is required." });
    }
    if (!email || !emailPattern.test(email)) {
      return res.status(400).json({ ok: false, error: "A valid email is required." });
    }
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ ok: false, error: "Message is required." });
    }

    await transporter.sendMail({
      from: `"Portfolio Contact Form" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_TO_EMAIL || "swati.singh.0064@gmail.com",
      replyTo: email,
      subject: `Project inquiry from ${name}`,
      text: `${message}\n\n— ${name} (${email})`,
      html: `<p>${message.replace(/\n/g, "<br/>")}</p><p>— ${name} (${email})</p>`,
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return res.status(500).json({ ok: false, error: "Something went wrong. Please try again later." });
  }
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Contact backend running on http://localhost:${PORT}`);
});
