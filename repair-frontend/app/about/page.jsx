"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  Info,
  ShieldCheck,
  User,
  UserPlus,
  Wrench,
} from "lucide-react";
import { Brand } from "@/components/ui";

// ข้อมูลขั้นตอนการใช้งานโดยสังเขป 3 ขั้นตอน
const HOW_TO_USE = [
  {
    step: "01",
    icon: UserPlus,
    title: "สมัครสมาชิกและเข้าสู่ระบบ",
    description:
      "ลงทะเบียนเลือกบทบาทผู้ใช้งานให้ตรงกับหน้าที่ ได้แก่ ลูกบ้าน (Resident) สำหรับแจ้งซ่อม หรือ ช่างซ่อม (Technician) สำหรับรับงาน",
  },
  {
    step: "02",
    icon: ClipboardList,
    title: "แจ้งปัญหาและระบุตำแหน่ง",
    description:
      "ลูกบ้านสามารถกดปุ่มแจ้งซ่อมใหม่ กรอกหัวข้อปัญหา สถานที่หรือเลขที่ห้อง พร้อมรายละเอียดอาการเพื่อให้ช่างเตรียมอุปกรณ์ได้ถูกต้อง",
  },
  {
    step: "03",
    icon: Wrench,
    title: "รับงานและติดตามสถานะเรียลไทม์",
    description:
      "ช่างซ่อมอัปเดตสถานะงานตั้งแต่ รอรับงาน กำลังดำเนินการ จนถึงเสร็จสิ้น โดยลูกบ้านสามารถตรวจสอบความคืบหน้าของตนเองได้ทันที",
  },
];

// รายชื่อคณะผู้จัดทำ 3 คน (แก้ไขข้อความในเครื่องหมายคำพูดได้เลย)
const CREATORS = [
  {
    no: "01",
    name: "[ใส่ชื่อ - นามสกุล คนที่ 1]",
    detail: "[รหัสนักศึกษา / หน้าที่รับผิดชอบ]",
  },
  {
    no: "02",
    name: "[ใส่ชื่อ - นามสกุล คนที่ 2]",
    detail: "[รหัสนักศึกษา / หน้าที่รับผิดชอบ]",
  },
  {
    no: "03",
    name: "[ใส่ชื่อ - นามสกุล คนที่ 3]",
    detail: "[รหัสนักศึกษา / หน้าที่รับผิดชอบ]",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#98E8DE]/10 font-sans text-[#3E3E75]">
      {/* แถบเมนูด้านบน (Header) */}
      <header className="sticky top-0 z-10 border-b border-[#98E8DE]/60 bg-white/95 px-4 py-3 backdrop-blur sm:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/dashboard" className="transition-opacity hover:opacity-90">
            <Brand />
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#4E1F6E] px-3.5 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-[#3E3E75] sm:text-sm"
          >
            <ArrowLeft className="size-3.5" />
            หน้าหลัก
          </Link>
        </div>
      </header>

      {/* เนื้อหาหลัก (Main Content) */}
      <main className="mx-auto max-w-5xl space-y-12 px-4 py-10 sm:px-8 sm:py-14">
        {/* ส่วนที่ 1: เว็บนี้มีไว้ทำไม */}
        <section className="relative overflow-hidden rounded-3xl border border-[#98E8DE]/80 bg-gradient-to-br from-[#98E8DE]/25 via-white to-[#98E8DE]/10 p-7 shadow-sm sm:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#45A9A9]/40 bg-[#98E8DE]/30 px-3.5 py-1 text-xs font-medium text-[#3E3E75]">
            <Info className="size-3.5 text-[#45A9A9]" />
            เกี่ยวกับระบบแจ้งซ่อมบ้าน
          </div>

          <h1 className="mt-4 max-w-2xl text-2xl font-bold leading-snug tracking-tight text-[#4E1F6E] sm:text-3xl">
            ศูนย์กลางแจ้งซ่อมและติดตามงานบำรุงรักษา สำหรับลูกบ้านและช่างซ่อม
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#3E3E75]/85 sm:text-base">
            เว็บไซต์ <span className="font-semibold text-[#4E1F6E]">“แจ้งซ่อมบ้าน”</span>{" "}
            จัดทำขึ้นเพื่อเป็นตัวกลางในการแจ้งปัญหาอุปกรณ์ชำรุดภายในที่พักอาศัย เช่น ระบบประปา ไฟฟ้า หรือเครื่องใช้ไฟฟ้า
            ช่วยลดความยุ่งยากจากการจดบันทึกหรือการส่งข้อความที่อาจตกหล่น ทำให้ลูกบ้านสามารถส่งเรื่องแจ้งซ่อมได้ทุกเวลา
            และช่วยให้ช่างซ่อมจัดลำดับงานพร้อมอัปเดตสถานะได้อย่างเป็นระบบ
          </p>

          <div className="mt-6 flex flex-wrap gap-4 pt-2 text-xs font-medium text-[#3E3E75] sm:text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 px-3 py-1.5 ring-1 ring-[#45A9A9]/30">
              <CheckCircle2 className="size-4 text-[#45A9A9]" />
              แจ้งซ่อมสะดวก รู้ตำแหน่งชัดเจน
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 px-3 py-1.5 ring-1 ring-[#45A9A9]/30">
              <ShieldCheck className="size-4 text-[#45A9A9]" />
              แยกสิทธิ์การใช้งานระหว่างลูกบ้านและช่าง
            </span>
          </div>
        </section>

        {/* ส่วนที่ 2: วิธีการใช้งานโดยสังเขป */}
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-bold tracking-tight text-[#3E3E75] sm:text-2xl">
              วิธีการใช้งานโดยสังเขป
            </h2>
            <p className="mt-1 text-sm text-[#3E3E75]/75">
              เริ่มต้นใช้งานได้ง่าย ๆ ใน 3 ขั้นตอน
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {HOW_TO_USE.map(({ step, icon: Icon, title, description }) => (
              <div
                key={step}
                className="flex flex-col justify-between rounded-2xl border border-[#98E8DE]/70 bg-white p-6 shadow-sm transition hover:border-[#45A9A9]/70"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-xl border border-[#45A9A9]/40 bg-[#98E8DE]/25 text-[#45A9A9]">
                      <Icon className="size-5" />
                    </span>
                    <span className="text-xs font-bold tracking-wider text-[#4E1F6E]/60">
                      STEP {step}
                    </span>
                  </div>
                  <h3 className="mt-5 text-base font-semibold text-[#4E1F6E]">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#3E3E75]/80">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ส่วนที่ 3: คณะผู้จัดทำ 3 คน */}
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-bold tracking-tight text-[#3E3E75] sm:text-2xl">
              คณะผู้จัดทำ
            </h2>
            <p className="mt-1 text-sm text-[#3E3E75]/75">
              ผู้พัฒนาโครงงานระบบแจ้งซ่อมบ้าน
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {CREATORS.map((person) => (
              <div
                key={person.no}
                className="flex flex-col items-center rounded-2xl border border-[#98E8DE]/70 bg-white p-6 text-center shadow-sm transition hover:border-[#45A9A9]/70"
              >
                <div className="relative grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-[#4E1F6E] to-[#3E3E75] text-white shadow-sm ring-4 ring-[#98E8DE]/40">
                  <User className="size-7" />
                  <span className="absolute -bottom-1.5 -right-1.5 rounded-full bg-[#45A9A9] px-2 py-0.5 text-[10px] font-bold text-white">
                    {person.no}
                  </span>
                </div>

                <h3 className="mt-4 text-base font-semibold text-[#4E1F6E]">
                  {person.name}
                </h3>
                <p className="mt-1 text-xs text-[#3E3E75]/70">
                  {person.detail}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ส่วนท้าย (Footer) */}
      <footer className="border-t border-[#98E8DE]/60 bg-white/70 py-6 text-center text-xs text-[#3E3E75]/65">
        ระบบแจ้งซ่อมบ้าน — พัฒนาเพื่ออำนวยความสะดวกในการดูแลและซ่อมบำรุงที่พักอาศัย
      </footer>
    </div>
  );
}