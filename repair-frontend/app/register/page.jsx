"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, UserCog } from "lucide-react";
import { Alert, AuthShell, Field, PrimaryButton, SelectField } from "@/components/ui";

const ROLES = [
  { value: "user", label: "ลูกบ้าน (Resident)" },
  { value: "technician", label: "ช่างซ่อม (Technician)" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(v) {
  const errors = {};
  if (!v.username.trim()) errors.username = "กรอกชื่อผู้ใช้";
  else if (v.username.trim().length < 3) errors.username = "ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร";
  else if (!/^[a-zA-Z0-9_.]+$/.test(v.username.trim()))
    errors.username = "ใช้ได้เฉพาะ a-z, 0-9, _ และ .";

  if (!v.email.trim()) errors.email = "กรอกอีเมล";
  else if (!EMAIL_RE.test(v.email.trim())) errors.email = "รูปแบบอีเมลไม่ถูกต้อง";

  if (!v.password) errors.password = "กรอกรหัสผ่าน";
  else if (v.password.length < 6) errors.password = "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";

  if (!v.confirmPassword) errors.confirmPassword = "กรอกรหัสผ่านอีกครั้งเพื่อยืนยัน";
  else if (v.confirmPassword !== v.password) errors.confirmPassword = "รหัสผ่านทั้งสองช่องไม่ตรงกัน";

  if (!ROLES.some((r) => r.value === v.role)) errors.role = "เลือกประเภทผู้ใช้";
  return errors;
}

export default function RegisterPage() {
  const router = useRouter();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // สมัครสำเร็จแล้วพาไปหน้า login อัตโนมัติ
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => router.push("/login"), 1800);
    return () => clearTimeout(t);
  }, [done, router]);

  const onChange = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
    setFormError("");
  };

  const onBlur = (key) => () => {
    if (values[key]) setErrors((er) => ({ ...er, [key]: validate(values)[key] }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setLoading(true);
    setFormError("");
    try {
      const res = await fetch("http://localhost:8080/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: values.username.trim(),
          email: values.email.trim(),
          password: values.password,
          role: values.role,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setDone(true);
      } else {
        setFormError(data.message || "ไม่สามารถสมัครสมาชิกได้");
      }
    } catch (err) {
      console.error(err);
      setFormError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    } finally {
      setLoading(false);
    }
  }

  const footer = (
    <>
      มีบัญชีอยู่แล้ว?{" "}
      <Link href="/login" className="font-medium text-teal-700 hover:text-teal-800 hover:underline">
        เข้าสู่ระบบ
      </Link>
    </>
  );

  if (done) {
    return (
      <AuthShell title="สมัครสมาชิกสำเร็จ" subtitle="กำลังพาไปหน้าเข้าสู่ระบบ..." footer={footer}>
        <Alert tone="success">สร้างบัญชี {values.username.trim()} เรียบร้อยแล้ว</Alert>
        <Link
          href="/login"
          className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-xl bg-teal-700 text-sm font-medium text-white transition-colors hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
        >
          ไปหน้าเข้าสู่ระบบ
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="สมัครสมาชิก" subtitle="สร้างบัญชีเพื่อแจ้งซ่อมหรือรับงานซ่อม" footer={footer}>
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {formError && <Alert>{formError}</Alert>}

        <Field
          id="username"
          label="ชื่อผู้ใช้"
          icon={User}
          autoComplete="username"
          placeholder="เช่น somchai"
          value={values.username}
          onChange={onChange("username")}
          onBlur={onBlur("username")}
          error={errors.username}
          disabled={loading}
        />
        <Field
          id="email"
          label="อีเมล"
          icon={Mail}
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={onChange("email")}
          onBlur={onBlur("email")}
          error={errors.email}
          disabled={loading}
        />
        <Field
          id="password"
          label="รหัสผ่าน"
          icon={Lock}
          type="password"
          autoComplete="new-password"
          placeholder="อย่างน้อย 6 ตัวอักษร"
          value={values.password}
          onChange={onChange("password")}
          onBlur={onBlur("password")}
          error={errors.password}
          disabled={loading}
        />
        <Field
          id="confirmPassword"
          label="ยืนยันรหัสผ่าน"
          icon={Lock}
          type="password"
          autoComplete="new-password"
          placeholder="กรอกรหัสผ่านอีกครั้ง"
          value={values.confirmPassword}
          onChange={onChange("confirmPassword")}
          onBlur={onBlur("confirmPassword")}
          error={errors.confirmPassword}
          disabled={loading}
        />
        <SelectField
          id="role"
          label="ประเภทผู้ใช้"
          icon={UserCog}
          value={values.role}
          onChange={onChange("role")}
          error={errors.role}
          disabled={loading}
        >
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </SelectField>

        <PrimaryButton type="submit" loading={loading} loadingText="กำลังสร้างบัญชี..." className="w-full">
          สมัครสมาชิก
        </PrimaryButton>
      </form>
    </AuthShell>
  );
}