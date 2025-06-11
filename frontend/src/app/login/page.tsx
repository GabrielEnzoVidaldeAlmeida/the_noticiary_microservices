"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api";
import axios from "axios";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { access_token } = await loginUser(username, password);
      login(access_token);
      router.push("/");
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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-slate-100 border-2 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-center text-black mb-6">
          Entrar
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-black mb-1">
              Usuário
            </label>
            <input
              placeholder="Seu nome de usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-1">
              Senha
            </label>
            <input
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black font-medium"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-slate-100 py-2 rounded-lg text-lg font-bold hover:brightness-125 transition"
          >
            Entrar
          </button>
        </form>

        <p className="text-center text-sm text-black mt-6">
          Não tem uma conta?{" "}
          <Link
            href="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
