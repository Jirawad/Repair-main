"use client";

import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Eye,
  EyeOff,
  Loader2,
  Wrench,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Brand                                                               */
/* ------------------------------------------------------------------ */
export function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-xl bg-[#4E1F6E] text-white shadow-sm ring-4 ring-[#98E8DE]/40">
        <Wrench className="size-[18px]" aria-hidden />
      </span>
      <span className="font-semibold tracking-tight text-[#4E1F6E]">แจ้งซ่อมบ้าน</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Form controls                                                       */
/* ------------------------------------------------------------------ */
function inputClass(error, extra = "") {
  return [
    "w-full rounded-xl border bg-white text-sm text-slate-900 outline-none transition placeholder:text-slate-400",
    error
      ? "border-rose-300 focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
      : "border-slate-200 hover:border-[#3E3E75]/40 focus:border-[#45A9A9] focus:ring-4 focus:ring-[#98E8DE]/35",
    extra,
  ].join(" ");
}

function FieldShell({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-[#3E3E75]">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}

export function Field({ id, label, icon: Icon, error, type = "text", ...props }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <FieldShell id={id} label={label} error={error}>
      <div className="relative">
        {Icon && (
          <Icon
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#3E3E75]/60"
            aria-hidden
          />
        )}
        <input
          id={id}
          type={isPassword && show ? "text" : type}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={inputClass(error, `h-11 ${Icon ? "pl-10" : "pl-3.5"} ${isPassword ? "pr-11" : "pr-3.5"}`)}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#3E3E75]/60 transition-colors hover:bg-[#98E8DE]/25 hover:text-[#4E1F6E] focus-visible:outline-2 focus-visible:outline-[#45A9A9]"
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </div>
    </FieldShell>
  );
}

export function SelectField({ id, label, icon: Icon, error, children, ...props }) {
  return (
    <FieldShell id={id} label={label} error={error}>
      <div className="relative">
        {Icon && (
          <Icon
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#3E3E75]/60"
            aria-hidden
          />
        )}
        <select
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={inputClass(error, `h-11 appearance-none pr-10 ${Icon ? "pl-10" : "pl-3.5"}`)}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-[#3E3E75]/60"
          aria-hidden
        />
      </div>
    </FieldShell>
  );
}

export function TextAreaField({ id, label, error, ...props }) {
  return (
    <FieldShell id={id} label={label} error={error}>
      <textarea
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={inputClass(error, "resize-none px-3.5 py-3 leading-relaxed")}
        {...props}
      />
    </FieldShell>
  );
}

/* ------------------------------------------------------------------ */
/* Buttons & alerts                                                    */
/* ------------------------------------------------------------------ */
export function PrimaryButton({ loading = false, loadingText, children, className = "", disabled, ...props }) {
  return (
    <button
      disabled={loading || disabled}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#4E1F6E] px-5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#3E3E75] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#45A9A9] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin text-[#98E8DE]" aria-hidden />}
      {loading && loadingText ? loadingText : children}
    </button>
  );
}

export function Alert({ tone = "error", children, className = "" }) {
  const tones = {
    error: "border-rose-200 bg-rose-50 text-rose-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    info: "border-[#45A9A9]/40 bg-[#98E8DE]/20 text-[#3E3E75]",
  };
  const Icon = tone === "success" ? CheckCircle2 : AlertCircle;
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-sm ${tones[tone]} ${className}`}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div>{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Auth page shell                                                     */
/* ------------------------------------------------------------------ */
const STEPS = [
  { icon: ClipboardList, title: "แจ้งซ่อม", text: "ระบุปัญหาและตำแหน่งที่ต้องซ่อม" },
  { icon: Wrench, title: "รอช่างซ่อม", text: "ช่างกดรับงานและเริ่มดำเนินการ" },
  { icon: CheckCircle2, title: "ซ่อมเสร็จ", text: "สถานะอัปเดตให้เห็นทันที" },
];

export function AuthShell({ title, subtitle, children, footer }) {
  return (
    <main className="grid min-h-screen bg-slate-50/40 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <aside className="hidden flex-col justify-between border-r border-[#98E8DE]/60 bg-gradient-to-b from-[#98E8DE]/20 via-white to-[#98E8DE]/15 p-12 lg:flex">
        <Brand />
        <div>
          <h2 className="max-w-sm text-2xl font-semibold leading-snug tracking-tight text-[#3E3E75]">
            แจ้งปัญหา ติดตามงาน และอัปเดตสถานะได้อย่างเรียลไทม์
          </h2>
          <ol className="mt-10">
            {STEPS.map(({ icon: Icon, title: t, text }, i) => (
              <li key={t} className="relative flex gap-4 pb-8 last:pb-0">
                {i < STEPS.length - 1 && (
                  <span className="absolute left-[17px] top-10 bottom-1 w-px bg-[#98E8DE]" aria-hidden />
                )}
                <span className="grid size-9 shrink-0 place-items-center rounded-full border border-[#45A9A9]/40 bg-[#98E8DE]/25 text-[#45A9A9]">
                  <Icon className="size-4" aria-hidden />
                </span>
                <div className="pt-0.5">
                  <p className="text-sm font-medium text-[#3E3E75]">{t}</p>
                  <p className="mt-0.5 text-sm text-slate-500">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <p className="text-sm font-medium text-[#3E3E75]/60">สำหรับลูกบ้านและช่างซ่อม</p>
      </aside>

      <section className="flex items-center justify-center bg-white px-5 py-10 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Brand />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#4E1F6E]">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-[#3E3E75]/75">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <p className="mt-6 text-center text-sm text-slate-500">{footer}</p>}
        </div>
      </section>
    </main>
  );
}