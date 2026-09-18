"use client";

import { useRouter } from "next/navigation";
import { LoginScreen } from "@/components/admin/login-screen";

export default function AdminLoginPage() {
  const router = useRouter();

  const login = async (password: string) => {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      router.replace("/admin");
      router.refresh();
      return true;
    }

    return false;
  };

  return <LoginScreen onLogin={login} />;
}