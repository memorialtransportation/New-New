import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import fs from "fs";

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 10000;
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// ===== Demo employee credentials (SERVER-SIDE) =====
// Username is stored in plain text. Password is NOT stored in plain text.
// We store a salted PBKDF2 hash and verify the password at login time.
const DEMO_EMPLOYEE = {
  username: "memorialtransportation",
  // PBKDF2-SHA256 parameters
  saltB64: "OUC/IzfwuVIiBobZ+tdSFw==",
  hashB64: "sh3/PmSpCThJUlcjiG2GWdT5q5Ip1xkC1lPGDsgSdX4=",
  iterations: 200000,
};

function pbkdf2Hash(password, saltB64, iterations) {
  const salt = Buffer.from(saltB64, "base64");
  const dk = crypto.pbkdf2Sync(password, salt, iterations, 32, "sha256");
  return dk.toString("base64");
}

function timingSafeEqualB64(aB64, bB64) {
  const a = Buffer.from(aB64, "base64");
  const b = Buffer.from(bB64, "base64");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// ===== Very simple session token (cookie) =====
// For demo use only: we sign a short-lived token kept in memory.
const sessions = new Map(); // token -> { username, expiresAt }
const SESSION_TTL_MS = 1000 * 60 * 60 * 8; // 8 hours

function newToken() {
  return crypto.randomBytes(32).toString("hex");
}

function getSession(req) {
  const token = req.cookies?.mt_session;
  if (!token) return null;
  const s = sessions.get(token);
  if (!s) return null;
  if (Date.now() > s.expiresAt) {
    sessions.delete(token);
    return null;
  }
  return { token, ...s };
}

function requireAuth(req, res, next) {
  const s = getSession(req);
  if (!s) return res.status(401).json({ ok: false, error: "UNAUTHORIZED" });
  req.user = { username: s.username };
  next();
}

// ===== API =====
app.post("/api/login", (req, res) => {
  const { username, password } = req.body || {};

  if (typeof username !== "string" || typeof password !== "string") {
    return res.status(400).json({ ok: false, error: "INVALID_INPUT" });
  }

  if (username !== DEMO_EMPLOYEE.username) {
    return res.status(401).json({ ok: false, error: "INVALID_CREDENTIALS" });
  }

  const computed = pbkdf2Hash(password, DEMO_EMPLOYEE.saltB64, DEMO_EMPLOYEE.iterations);
  const matches = timingSafeEqualB64(computed, DEMO_EMPLOYEE.hashB64);

  if (!matches) {
    return res.status(401).json({ ok: false, error: "INVALID_CREDENTIALS" });
  }

  const token = newToken();
  sessions.set(token, { username, expiresAt: Date.now() + SESSION_TTL_MS });
  res.cookie("mt_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_TTL_MS,
  });

  return res.json({ ok: true, user: { username } });
});

app.post("/api/logout", (req, res) => {
  const s = getSession(req);
  if (s?.token) sessions.delete(s.token);
  res.clearCookie("mt_session");
  return res.json({ ok: true });
});

app.get("/api/me", requireAuth, (req, res) => {
  return res.json({ ok: true, user: req.user });
});

// ===== Static hosting =====
const distDir = path.join(__dirname, "dist");
const isDev = process.argv.includes("--dev");

if (!isDev) {
  // Serve built assets
  app.use(express.static(distDir));
  // SPA fallback
  app.get("*", (req, res) => {
    const indexPath = path.join(distDir, "index.html");
    return res.sendFile(indexPath);
  });
} else {
  // In dev, show a helpful message if someone hits the server directly.
  app.get("/", (req, res) => {
    res.type("text").send("Dev mode: run Vite separately or just use `npm run dev` (this server starts and Vite serves the UI).");
  });
}

app.listen(PORT, () => {
  console.log(`MemorialTransportation server running on port ${PORT}`);
});
