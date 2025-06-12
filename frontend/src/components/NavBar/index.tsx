"use client";

import { useAuth } from "@/contexts/auth-context";
import { LogOutIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export default function NavBar() {
  const { user, logout, loading } = useAuth();
  // const router = useRouter();
  const [handleProfile, setHandleProfile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleHandleProfile = () => {
    setHandleProfile((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setHandleProfile(false);
      }
    };

    if (handleProfile) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleProfile]);

  if (loading) return null;

  return (
    <nav className="bg-black flex justify-between items-center p-4 sm:p-6 md:p-8 relative">
      <Link href="/news">
        <h1 className="text-slate-100 text-xl font-extrabold sm:text-2xl md:text-3xl hover:brightness-75 transition">
          The Noticiary
        </h1>
      </Link>

      {user ? (
        <div className="relative">
          <button
            onClick={toggleHandleProfile}
            className="text-slate-100 font-extrabold flex items-center gap-1 text-sm sm:text-base md:text-xl hover:brightness-75 cursor-pointer transition"
          >
            Olá, {user.username}
          </button>

          {handleProfile && (
            <div
              ref={menuRef}
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 p-4 space-y-3 text-black"
            >
              <Link
                href="/news/create"
                className="flex items-center gap-2 hover:text-blue-600 transition"
              >
                <PlusIcon size={18} /> Adicionar notícia
              </Link>

              <button
                onClick={() => {
                  logout();
                  // router.push("/login");
                }}
                className="flex items-center cursor-pointer gap-2 text-red-600 hover:text-red-800 transition"
              >
                <LogOutIcon size={18} /> Sair
              </button>
            </div>
          )}
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
