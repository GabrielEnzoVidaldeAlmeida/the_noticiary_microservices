"use client";

import { useEffect, useState } from "react";
import { getMe } from "@/lib/api";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  username: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    getMe(token)
      .then(setUser)
      .catch(() => {
        alert("Token inválido ou expirado");
        router.push("/login");
      });
  }, [router]);

  if (!user) return <p>Carregando...</p>;

  return (
    <main>
      <h1>Bem-vindo, {user.username}!</h1>
      <p>ID do usuário: {user.id}</p>
    </main>
  );
}
