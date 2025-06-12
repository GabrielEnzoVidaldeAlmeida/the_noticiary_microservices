"use client";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getNewsById, updateNews } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import { News } from "@/types/news";

export default function EditNewsPage() {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = Number(params?.id);

  const [news, setNews] = useState<News | null>(null);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (!id) return;
    getNewsById(id).then((n) => {
      setNews(n);
      setName(n.name);
      setContent(n.content);
      setDescription(n.description || "");
      setImage(n.image || "");
    });
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return alert("Você precisa estar logado");

    try {
      await updateNews(id, token, { name, content, description, image });
      alert("Notícia atualizada com sucesso!");
      router.push(`/news/${id}`);
    } catch (error) {
      alert("Erro ao atualizar notícia");
      console.error(error);
    }
  };

  if (!news) return <p>Carregando...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4">
      <h1 className="text-2xl font-bold mb-4">Editar Notícia</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Título"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Conteúdo"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Descrição (opcional)"
        />
        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="URL da imagem (opcional)"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:brightness-110 transition"
        >
          Salvar alterações
        </button>
      </form>
    </div>
  );
}
