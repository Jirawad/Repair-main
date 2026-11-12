/**
 * Data layer ของหน้าบ้าน
 * เชื่อมต่อกับ Backend (Go Fiber) ที่ http://localhost:8080
 */
import { normalizeStatus } from "./status";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
export const MOCK_AUTH = process.env.NEXT_PUBLIC_MOCK_AUTH === "true";
export const MOCK_TICKETS = process.env.NEXT_PUBLIC_MOCK_TICKETS === "true";

const SESSION_KEY = "user";
const MOCK_DB_KEY = "repair.mockdb";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ------------------------------------------------------------------ */
/* Normalizers: แปลง JSON จาก backend ให้เป็นรูปแบบเดียวกัน              */
/* (gorm.Model ไม่มี json tag จึงส่งมาเป็น ID / CreatedAt)              */
/* ------------------------------------------------------------------ */
function normalizeUser(u) {
  if (!u) return null;
  const id = u.id ?? u.ID;
  if (!id) return null;
  return {
    id,
    username: u.username ?? u.Username,
    email: u.email ?? u.Email,
    role: u.role ?? u.Role,
    token: u.token,
  };
}

function normalizeTicket(t) {
  return {
    id: t.id ?? t.ID,
    title: t.title ?? "",
    description: t.description ?? "",
    location: t.location ?? "",
    status: normalizeStatus(t.status),
    createdAt: t.created_at ?? t.CreatedAt,
    userId: t.user_id ?? null,
    technicianId: t.technician_id ?? null,
    user: normalizeUser(t.user),
    technician: normalizeUser(t.technician),
  };
}

/* ------------------------------------------------------------------ */
/* Session                                                             */
/* ------------------------------------------------------------------ */
export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return normalizeUser(parsed) || parsed;
  } catch {
    return null;
  }
}

function saveSession(session) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {}
  return session;
}

export function logout() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {}
}

async function request(path, options = {}) {
  const token = getSession()?.token;
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  } catch {
    throw new Error(`เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ ตรวจสอบว่า backend เปิดอยู่ที่ ${API_BASE}`);
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
  return data;
}

/* ------------------------------------------------------------------ */
/* Mock database (ว่างเปล่า ไม่มีรายการจำลอง)                            */
/* ------------------------------------------------------------------ */
function seedDb() {
  return {
    seq: { user: 1, ticket: 1 },
    users: [],
    tickets: [],
  };
}

function saveDb(db) {
  try {
    localStorage.setItem(MOCK_DB_KEY, JSON.stringify(db));
  } catch {}
}

function loadDb() {
  try {
    const raw = localStorage.getItem(MOCK_DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const db = seedDb();
  saveDb(db);
  return db;
}

const findUser = (db, id) => db.users.find((u) => u.id === id) ?? null;
const hydrate = (db, t) =>
  normalizeTicket({ ...t, user: findUser(db, t.user_id), technician: findUser(db, t.technician_id) });

/* ------------------------------------------------------------------ */
/* Auth                                                                */
/* ------------------------------------------------------------------ */
export async function login({ identifier, password }) {
  if (MOCK_AUTH) {
    await sleep(700);
    const db = loadDb();
    const key = identifier.trim().toLowerCase();
    const user = db.users.find(
      (u) => (u.username.toLowerCase() === key || u.email.toLowerCase() === key) && u.password === password
    );
    if (!user) throw new Error("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    return saveSession(normalizeUser(user));
  }
  const data = await request("/api/login", {
    method: "POST",
    body: JSON.stringify({ username: identifier.trim(), password }),
  });
  return saveSession({ ...normalizeUser(data.user), token: data.token });
}

export async function register({ username, email, password, role }) {
  if (MOCK_AUTH) {
    await sleep(800);
    const db = loadDb();
    const u = username.trim().toLowerCase();
    const e = email.trim().toLowerCase();
    if (db.users.some((x) => x.username.toLowerCase() === u)) throw new Error("ชื่อผู้ใช้นี้ถูกใช้แล้ว");
    if (db.users.some((x) => x.email.toLowerCase() === e)) throw new Error("อีเมลนี้ถูกใช้แล้ว");
    const user = { id: db.seq.user++, username: username.trim(), email: email.trim(), password, role };
    db.users.push(user);
    saveDb(db);
    return normalizeUser(user);
  }
  const data = await request("/api/register", {
    method: "POST",
    body: JSON.stringify({ username: username.trim(), email: email.trim(), password, role }),
  });
  return normalizeUser(data.user ?? data);
}

/* ------------------------------------------------------------------ */
/* Tickets                                                             */
/* ------------------------------------------------------------------ */
export async function listTickets() {
  let list;
  if (MOCK_TICKETS) {
    await sleep(600);
    const db = loadDb();
    list = db.tickets.map((t) => hydrate(db, t));
  } else {
    const raw = await request("/api/tickets");
    const items = Array.isArray(raw) ? raw : (raw?.tickets ?? []);
    list = items.map(normalizeTicket);
  }
  return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function createTicket({ title, location, description }, session) {
  const userId = session?.id ?? session?.ID;
  if (MOCK_TICKETS) {
    await sleep(700);
    const db = loadDb();
    const row = {
      id: db.seq.ticket++,
      title,
      location,
      description,
      status: "Pending",
      user_id: userId,
      technician_id: null,
      created_at: new Date().toISOString(),
    };
    db.tickets.push(row);
    saveDb(db);
    return hydrate(db, row);
  }
  const data = await request("/api/tickets", {
    method: "POST",
    body: JSON.stringify({ title, location, description, user_id: userId }),
  });
  const ticket = normalizeTicket(data?.ticket ?? data);
  // POST ของ backend ไม่ Preload user จึงเติมจาก session
  return ticket.user
    ? ticket
    : { ...ticket, user: { id: userId, username: session.username, email: session.email, role: session.role } };
}

// changes: { status?, technicianId? }
export async function updateTicket(id, { status, technicianId }) {
  if (MOCK_TICKETS) {
    await sleep(500);
    const db = loadDb();
    const row = db.tickets.find((t) => t.id === id);
    if (!row) throw new Error("ไม่พบรายการแจ้งซ่อมนี้");
    if (status) row.status = status;
    if (technicianId !== undefined) row.technician_id = technicianId;
    saveDb(db);
    return hydrate(db, row);
  }
  const body = {};
  if (status) body.status = status;
  if (technicianId !== undefined) body.technician_id = technicianId;
  const data = await request(`/api/tickets/${id}/progress`, { method: "PATCH", body: JSON.stringify(body) });
  return normalizeTicket(data?.ticket ?? data);
}