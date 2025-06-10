"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // evita recarregar a página
    try {
      const { access_token } = await loginUser(username, password);
      localStorage.setItem("token", access_token);
      router.push("/dashboard");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        alert(
          "Erro ao logar: " + (error.response?.data?.detail || error.message)
        );
      } else if (error instanceof Error) {
        alert("Erro ao logar: " + error.message);
      } else {
        alert("Erro desconhecido ao logar");
      }
    }
  };

  return (
    <main>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>
    </main>
  );
}
