import { redirect } from "next/navigation";

// หน้าแรกส่งไป dashboard เลย ถ้ายังไม่ได้ล็อกอิน dashboard จะพาไป /login เอง
export default function Home() {
  redirect("/login");
}