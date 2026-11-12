// ค่า status ใช้ตามที่ backend (Go) เก็บจริง: "Pending" | "In Progress" | "Completed" | "Cancelled"
export const STATUS = {
  Pending: {
    label: "รอรับงาน",
    step: 0,
    badge: "bg-orange-50 text-orange-700 ring-orange-200",
    dot: "bg-orange-400",
  },
  "In Progress": {
    label: "กำลังดำเนินการ",
    step: 1,
    badge: "bg-sky-50 text-sky-700 ring-sky-200",
    dot: "bg-sky-400",
  },
  Completed: {
    label: "เสร็จสิ้น",
    step: 2,
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
  },
  Cancelled: {
    label: "ยกเลิก",
    step: -1,
    badge: "bg-slate-100 text-slate-500 ring-slate-200",
    dot: "bg-slate-400",
  },
};

const ALIASES = {
  pending: "Pending",
  "in progress": "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
  canceled: "Cancelled",
};

// รองรับทั้ง "In Progress" และ "in_progress"
export function normalizeStatus(raw) {
  const key = String(raw ?? "").trim().toLowerCase().replace(/[_-]+/g, " ");
  return ALIASES[key] ?? "Pending";
}

export const ROLE_LABEL = {
  user: "ลูกบ้าน",
  technician: "ช่างซ่อม",
};

export function formatDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}