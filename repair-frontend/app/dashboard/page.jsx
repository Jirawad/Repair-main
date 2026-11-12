"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Brand, Field, PrimaryButton, SelectField, TextAreaField } from "@/components/ui";
import { createTicket, listTickets, updateTicket } from "@/lib/api";
import { ROLE_LABEL, STATUS, formatDate } from "@/lib/status";
import { LogOut, Plus } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [formValues, setFormValues] = useState({ title: "", location: "", description: "" });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      router.replace("/login");
      return;
    }

    try {
      const parsed = JSON.parse(savedUser);
      setSession({
        ...parsed,
        id: parsed.id ?? parsed.ID,
        username: parsed.username ?? parsed.Username,
        email: parsed.email ?? parsed.Email,
        role: parsed.role ?? parsed.Role,
      });
      loadData();
    } catch {
      localStorage.removeItem("user");
      router.replace("/login");
    }
  }, [router]);

  async function loadData() {
    setLoading(true);
    try {
      const data = await listTickets();
      setTickets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.replace("/login");
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!formValues.title.trim()) return setFormError("กรุณากรอกหัวข้อปัญหา");
    if (!formValues.location.trim()) return setFormError("กรุณากรอกสถานที่");

    setSubmitting(true);
    setFormError("");
    try {
      await createTicket(formValues, session);
      setFormValues({ title: "", location: "", description: "" });
      setShowForm(false);
      await loadData();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await updateTicket(ticketId, {
        status: newStatus,
        technicianId: session.role === "technician" ? session.id : undefined,
      });
      await loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (!session) return null;

  // กรองรายการ: ลูกบ้านเห็นเฉพาะของตัวเอง, ช่างซ่อมเห็นทั้งหมด
  const visibleTickets =
    session.role === "user"
      ? tickets.filter(
          (t) =>
            (session.id != null && t.userId === session.id) ||
            (session.username && t.user?.username === session.username)
        )
      : tickets;

  return (
    <div className="min-h-screen bg-[#98E8DE]/10">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-[#98E8DE]/60 bg-white/95 px-4 py-3 backdrop-blur sm:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Brand />
          <div className="flex items-center gap-4">
            <div className="text-right text-xs sm:text-sm">
              <span className="block font-medium text-[#4E1F6E]">{session.username}</span>
              <span className="text-[#3E3E75]/70">({ROLE_LABEL[session.role] || session.role})</span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#3E3E75]/20 bg-white px-3 py-1.5 text-xs font-medium text-[#3E3E75] transition hover:border-[#4E1F6E]/40 hover:bg-[#98E8DE]/15 hover:text-[#4E1F6E]"
            >
              <LogOut className="size-3.5" />
              ออกจากระบบ
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#4E1F6E] sm:text-2xl">
              {session.role === "user" ? "รายการแจ้งซ่อมของฉัน" : "รายการแจ้งซ่อมทั้งหมด"}
            </h1>
            <p className="mt-1 text-sm text-[#3E3E75]/75">
              {session.role === "user" ? "ติดตามสถานะการแจ้งซ่อมของคุณ" : "ติดตามสถานะและรับงานแจ้งซ่อม"}
            </p>
          </div>
          {session.role === "user" && (
            <PrimaryButton type="button" onClick={() => setShowForm(!showForm)}>
              <Plus className="size-4" />
              แจ้งซ่อมใหม่
            </PrimaryButton>
          )}
        </div>

        {/* Create Form Modal / Box */}
        {showForm && session.role === "user" && (
          <div className="mb-8 rounded-2xl border border-[#98E8DE]/80 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-[#3E3E75]">กรอกข้อมูลแจ้งซ่อม</h2>
            {formError && <Alert className="mb-4">{formError}</Alert>}
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <Field
                id="title"
                label="หัวข้อปัญหา"
                placeholder="เช่น ก๊อกน้ำรั่ว, ไฟดับ"
                value={formValues.title}
                onChange={(e) => setFormValues({ ...formValues, title: e.target.value })}
              />
              <Field
                id="location"
                label="สถานที่ / ตำแหน่งที่ซ่อม"
                placeholder="เช่น ห้องครัว, บ้านเลขที่ 12/3"
                value={formValues.location}
                onChange={(e) => setFormValues({ ...formValues, location: e.target.value })}
              />
              <TextAreaField
                id="description"
                label="รายละเอียดเพิ่มเติม"
                rows={3}
                placeholder="อธิบายอาการเพิ่มเติม..."
                value={formValues.description}
                onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
              />
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-[#3E3E75] transition hover:bg-[#98E8DE]/15"
                >
                  ยกเลิก
                </button>
                <PrimaryButton type="submit" loading={submitting}>
                  บันทึกแจ้งซ่อม
                </PrimaryButton>
              </div>
            </form>
          </div>
        )}

        {/* Ticket List */}
        {loading ? (
          <div className="py-12 text-center text-sm text-[#3E3E75]/70">กำลังโหลดข้อมูล...</div>
        ) : error ? (
          <Alert tone="error">{error}</Alert>
        ) : visibleTickets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#45A9A9]/40 bg-white/60 p-12 text-center text-[#3E3E75]/70">
            {session.role === "user" ? "คุณยังไม่มีรายการแจ้งซ่อม" : "ยังไม่มีรายการแจ้งซ่อมในระบบ"}
          </div>
        ) : (
          <div className="grid gap-4">
            {visibleTickets.map((ticket) => {
              const statusInfo = STATUS[ticket.status] || STATUS.Pending;
              return (
                <div
                  key={ticket.id}
                  className="rounded-2xl border border-[#98E8DE]/70 bg-white p-5 shadow-sm transition hover:border-[#45A9A9]/60"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusInfo.badge}`}>
                        <span className={`size-1.5 rounded-full ${statusInfo.dot}`} />
                        {statusInfo.label}
                      </span>
                      <h3 className="mt-2.5 text-base font-semibold text-[#3E3E75]">{ticket.title}</h3>
                      <p className="mt-1 text-sm text-[#3E3E75]/70">{ticket.location}</p>
                    </div>

                    {/* Status Action for Technician */}
                    {session.role === "technician" && (
                      <div className="flex items-center gap-2">
                        <SelectField
                          id={`status-${ticket.id}`}
                          value={ticket.status}
                          onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                        >
                          <option value="Pending">รอรับงาน</option>
                          <option value="In Progress">กำลังดำเนินการ</option>
                          <option value="Completed">เสร็จสิ้น</option>
                          <option value="Cancelled">ยกเลิก</option>
                        </SelectField>
                      </div>
                    )}
                  </div>

                  {ticket.description && (
                    <p className="mt-3 rounded-xl bg-[#98E8DE]/15 p-3 text-sm text-[#3E3E75]">
                      {ticket.description}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap items-center justify-between border-t border-[#98E8DE]/40 pt-3 text-xs text-[#3E3E75]/60">
                    <div>ผู้แจ้ง: {ticket.user?.username || "ไม่ระบุ"}</div>
                    <div>วันที่: {formatDate(ticket.createdAt)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}