// app/news/[id]/NewsDetailClient.tsx
"use client";

import React, { useEffect, useState } from "react";

import {
  getNewsById,
  getInteractionStats,
  getUserInteractionStatus,
  likeNews,
  dislikeNews,
  InteractionStats,
  removeInteraction,
  deleteNews,
} from "@/lib/api";
import { News } from "@/types/news";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { SquarePenIcon, SquareXIcon, ThumbsDown, ThumbsUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDateTime } from "@/utils/format-datetime";

interface Props {
  id: string;
}

export default function NewsDetailClient({ id }: Props) {
  const { token } = useAuth();
  const { user } = useAuth();
  const router = useRouter();
  const [news, setNews] = useState<News | null>(null);
  const [stats, setStats] = useState<InteractionStats | null>(null);
  const [userInteraction, setUserInteraction] = useState<
    "like" | "dislike" | null
  >(null);

  const handleDelete = async () => {
    if (!news) return; // garante que news não é null
    const confirmDelete = confirm(
      "Tem certeza que deseja excluir esta notícia?"
    );
    if (!confirmDelete) return;

    try {
      await deleteNews(news.id, token!);
      alert("Notícia excluída com sucesso!");
      router.push("/news");
    } catch (err) {
      alert("Erro ao excluir notícia.");
      console.error(err);
    }
  };

  useEffect(() => {
    if (!id) return;

    getNewsById(Number(id)).then(setNews);
    getInteractionStats(Number(id)).then(setStats);

    if (token) {
      getUserInteractionStatus(Number(id), token).then((status) => {
        setUserInteraction(status.user_interaction ?? null);
        setStats({
          likes_count: status.likes_count,
          dislikes_count: status.dislikes_count,
          total_interactions: status.likes_count + status.dislikes_count,
          news_id: status.news_id,
        });
      });
    }
  }, [id, token]);

  const handleLike = async () => {
    if (!token) return alert("Faça login para interagir");
    if (userInteraction === "like") {
      await removeInteraction(Number(id), token);
      setUserInteraction(null);
    } else {
      await likeNews(Number(id), token);
      setUserInteraction("like");
      setStats((s) =>
        s
          ? {
              ...s,
              likes_count: s.likes_count + 1,
              dislikes_count: Math.max(
                0,
                s.dislikes_count - (userInteraction === "dislike" ? 1 : 0)
              ),
            }
          : null
      );
    }
  };

  const handleDislike = async () => {
    if (!token) return alert("Faça login para interagir");
    if (userInteraction === "dislike") {
      await removeInteraction(Number(id), token);
      setUserInteraction(null);
    } else {
      await dislikeNews(Number(id), token);
      setUserInteraction("dislike");
      setStats((s) =>
        s
          ? {
              ...s,
              dislikes_count: s.dislikes_count + 1,
              likes_count: Math.max(
                0,
                s.likes_count - (userInteraction === "like" ? 1 : 0)
              ),
            }
          : null
      );
    }
  };

  if (!news) return <p>Carregando...</p>;

  return (
    <div className="flex flex-col justify-center">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-6 text-center md:text-left">
        {news.name}
      </h1>
      {news.image && (
        <Image
          src={news.image}
          alt={news.name}
          width={1280}
          height={720}
          className="rounded-xl object-cover w-full h-auto"
          priority
        />
      )}
      <div className="mt-2 italic text-gray-500">
        <label>
          {news.author_username} - {formatDateTime(news.created_at)}
        </label>
      </div>

      <div className="py-6">
        <span className="font-bold italic text-xl text-slate-600 text-justify">
          {news.description}
        </span>
      </div>
      <article className="whitespace-pre-line text-justify">
        {news.content}
      </article>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            style={{ color: userInteraction === "like" ? "green" : "black" }}
          >
            <div className="flex gap-2 cursor-pointer">
              <ThumbsUp /> ({stats?.likes_count ?? 0})
            </div>
          </button>
          <button
            onClick={handleDislike}
            style={{ color: userInteraction === "dislike" ? "red" : "black" }}
          >
            <div className="flex gap-2 cursor-pointer">
              <ThumbsDown /> ({stats?.dislikes_count ?? 0})
            </div>
          </button>
        </div>

        <div className="flex items-center">
          {user?.id === news.author_id && (
            <div className="flex gap-4 mt-4">
              <Link
                href={`/news/edit/${news.id}`}
                className="cursor-pointer text-blue-600 hover:text-blue-800 underline transition"
              >
                <SquarePenIcon />
              </Link>
              <button
                onClick={handleDelete}
                className="cursor-pointer text-red-600 underline hover:text-red-800 transition"
              >
                <SquareXIcon />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
