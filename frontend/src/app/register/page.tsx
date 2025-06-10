"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/api";
import axios from "axios";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); // evita reload
    try {
      await registerUser(username, password);
      alert("Usuário registrado com sucesso!");
      router.push("/login"); // redireciona após registro
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        alert(
          "Erro ao registrar: " +
            (error.response?.data?.detail || error.message)
        );
      } else if (error instanceof Error) {
        alert("Erro ao registrar: " + error.message);
      } else {
        alert("Erro desconhecido ao registrar");
      }
    }
  };

  return (
    <main>
      <h1>Registrar</h1>
      <form onSubmit={handleRegister}>
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
        <button type="submit">Cadastrar</button>
      </form>
    </main>
  );
}
