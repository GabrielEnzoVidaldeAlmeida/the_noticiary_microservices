"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createNews } from "@/lib/api";
// import { useAuth } from "@/contexts/auth-context";

export default function CreateNewsPage() {
  const router = useRouter();
  // const { token } = useAuth();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert("Você precisa estar logado para criar uma notícia.");
      return;
    }

    try {
      await createNews(token, {
        name,
        description,
        content,
        image,
      });
      alert("Notícia criada com sucesso!");
      router.push("/news");
    } catch (err) {
      console.error(err);
      alert("Erro ao criar notícia.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-slate-100 border-2 rounded-2xl shadow-2xl p-8 w-full max-w-xl">
        <h1 className="text-3xl font-extrabold text-center text-black mb-6">
          Criar Notícia
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-black mb-1">
              Título
            </label>
            <input
              type="text"
              placeholder="Título da notícia"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-1">
              Descrição
            </label>
            <textarea
              placeholder="Resumo da notícia"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-1">
              Conteúdo
            </label>
            <textarea
              placeholder="Conteúdo completo"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-1">
              URL da Imagem
            </label>
            <input
              type="text"
              placeholder="Link da imagem"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-slate-100 py-2 rounded-lg text-lg font-bold hover:brightness-125 transition"
          >
            Publicar
          </button>
        </form>
      </div>
    </div>
  );
}
