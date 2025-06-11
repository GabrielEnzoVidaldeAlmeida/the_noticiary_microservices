"use client";

import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  if (loading) return null;

  return (
    <nav className="bg-black flex justify-between items-center p-4 sm:p-6 md:p-8">
      <Link href="/">
        <h1 className="text-slate-100 text-xl font-extrabold sm:text-2xl md:text-3xl hover:brightness-75 transition">
          The Noticiary
        </h1>
      </Link>

      {user ? (
        <div className="text-slate-100 font-extrabold flex items-center gap-1 hover:brightness-75 transition">
          <span className="text-sm sm:text-base md:text-xl">
            Olá, {user.username}
          </span>
          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
          >
            Sair
          </button>
        </div>
      ) : (
        <div className="flex gap-8">
          <Link
            href="/login"
            className="text-slate-100 font-extrabold flex items-center gap-1 text-sm sm:text-base md:text-xl hover:brightness-75 transition"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="text-slate-100 border-2 p-2 rounded font-extrabold flex items-center gap-1 text-sm sm:text-base md:text-xl hover:brightness-75 transition"
          >
            Cadastrar-se
          </Link>
        </div>
      )}
    </nav>
  );
}
