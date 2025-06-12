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
    <div>
      <h1 className="font-extrabold text-5xl mb-8">Criar Notícia</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <strong className="font-bold text-xl">Título:</strong>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Título"
        />
        <strong className="font-bold text-xl">Conteúdo:</strong>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-80 border p-2 rounded"
          placeholder="Conteúdo"
        />
        <strong className="font-bold text-xl">Descrição:</strong>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Descrição (opcional)"
        />
        <strong className="font-bold text-xl">URL da imagem:</strong>
        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="URL da imagem (opcional)"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:brightness-110 cursor-pointer transition"
        >
          Criar notícia
        </button>
      </form>
    </div>
  );
}
