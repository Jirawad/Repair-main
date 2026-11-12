"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Info, Lock, User } from "lucide-react";
import { Alert, AuthShell, Field, PrimaryButton } from "@/components/ui";

/**
 * ตรวจสอบความถูกต้องของข้อมูลฟอร์มเข้าสู่ระบบ
 */
function validate({ identifier, password }) {
  const errors = {};
  if (!identifier.trim()) errors.identifier = "กรอกชื่อผู้ใช้หรืออีเมล";
  if (!password) errors.password = "กรอกรหัสผ่าน";
  else if (password.length < 6) errors.password = "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
  return errors;
}

export default function LoginPage() {
  const router = useRouter();
  const [values, setValues] = useState({ identifier: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  // ล็อกอินอยู่แล้วให้ข้ามไปหน้า dashboard
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) router.replace("/dashboard");
  }, [router]);

  // อัปเดตค่าเมื่อพิมพ์และล้างข้อความแจ้งเตือนของช่องนั้น
  const onChange = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
    setFormError("");
  };

  // ตรวจตอนออกจากช่อง เฉพาะช่องที่มีข้อความแล้ว
  const onBlur = (key) => () => {
    if (values[key]) setErrors((er) => ({ ...er, [key]: validate(values)[key] }));
  };

  // ส่งข้อมูลเข้าสู่ระบบไปยัง Backend
  async function handleSubmit(e) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setLoading(true);
    setFormError("");
    try {
      const res = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: values.identifier.trim(),
          password: values.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        router.replace("/dashboard");
      } else {
        setFormError(data.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      }
    } catch (err) {
      console.error(err);
      setFormError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen">
      {/* ปุ่มมุมขวาบนสำหรับไปหน้า About */}
      <Link
        href="/about"
        className="fixed right-4 top-4 z-20 inline-flex items-center gap-1.5 rounded-xl border border-[#3E3E75]/20 bg-white/90 px-3.5 py-2 text-xs font-medium text-[#3E3E75] shadow-sm backdrop-blur transition hover:border-[#4E1F6E]/40 hover:bg-[#98E8DE]/20 hover:text-[#4E1F6E] sm:right-8 sm:top-6 sm:text-sm"
      >
        <Info className="size-4 text-[#45A9A9]" />
        เกี่ยวกับเรา
      </Link>

      <AuthShell
        title="เข้าสู่ระบบ"
        subtitle="ใช้ชื่อผู้ใช้หรืออีเมลที่ลงทะเบียนไว้"
        footer={
          <>
            ยังไม่มีบัญชี?{" "}
            <Link
              href="/register"
              className="font-medium text-[#4E1F6E] hover:text-[#3E3E75] hover:underline"
            >
              สมัครสมาชิก
            </Link>
          </>
        }
      >
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {formError && <Alert>{formError}</Alert>}

          <Field
            id="identifier"
            label="ชื่อผู้ใช้หรืออีเมล"
            icon={User}
            autoComplete="username"
            placeholder="เช่น somchai"
            value={values.identifier}
            onChange={onChange("identifier")}
            onBlur={onBlur("identifier")}
            error={errors.identifier}
            disabled={loading}
          />
          <Field
            id="password"
            label="รหัสผ่าน"
            icon={Lock}
            type="password"
            autoComplete="current-password"
            placeholder="อย่างน้อย 6 ตัวอักษร"
            value={values.password}
            onChange={onChange("password")}
            onBlur={onBlur("password")}
            error={errors.password}
            disabled={loading}
          />

          <PrimaryButton type="submit" loading={loading} loadingText="กำลังเข้าสู่ระบบ..." className="w-full">
            เข้าสู่ระบบ
          </PrimaryButton>
        </form>
      </AuthShell>
    </div>
  );
}