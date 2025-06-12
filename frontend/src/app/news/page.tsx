"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getNewsList } from "@/lib/api";
import { News } from "@/types/news";
import Image from "next/image";
import { formatDateTime } from "@/utils/format-datetime";
import Link from "next/link";

export default function NewsListPage() {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const isLoadingRef = useRef(false);

  const loadMoreNews = useCallback(async () => {
    if (isLoadingRef.current || !hasMore) return;

    isLoadingRef.current = true;
    setLoading(true);
    try {
      const data = await getNewsList(page, 10);
      console.log(
        "IDs recebidos:",
        data.news.map((n) => n.id)
      );

      setNewsList((prev) => {
        const existingIds = new Set(prev.map((n) => n.id));
        const filteredNews = data.news.filter((n) => !existingIds.has(n.id));
        return [...prev, ...filteredNews];
      });

      if (data.news.length < 10) {
        setHasMore(false);
      } else {
        setPage((prev) => prev + 1);
      }
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [page, hasMore]);

  useEffect(() => {
    setNewsList([]);
    setPage(1);
    setHasMore(true);
  }, []);

  useEffect(() => {
    loadMoreNews();
  }, [loadMoreNews]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.body.offsetHeight - 200;

      if (scrollPosition >= threshold) {
        loadMoreNews();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMoreNews]);

  return (
    <div>
      <h1 className="font-extrabold text-5xl mb-8">Lista de Notícias</h1>
      <ul className="flex flex-col gap-8">
        {newsList.map((news) => (
          <li key={news.id}>
            <Link href={`/news/${news.id}`}>
              <div className="flex group gap-4 cursor-pointer transition">
                {news.image && (
                  <Image
                    src={news.image}
                    alt={news.name}
                    width={320}
                    height={180}
                    className="object-cover object-center rounded-xl group-hover:scale-101 transition"
                  />
                )}
                <div className="flex flex-col justify-between gap-4">
                  <div className="flex flex-col gap-4">
                    <h2 className="font-extrabold text-3xl group-hover:text-slate-700 transition">
                      {news.name}
                    </h2>
                    <p>{news.description}</p>
                  </div>
                  <div>
                    <small>
                      {news.author_username} - {formatDateTime(news.created_at)}
                    </small>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {loading && <p>Carregando mais notícias...</p>}
      {!hasMore && (
        <p className="flex justify-center mt-10 font-bold text-slate-700">
          Não há mais notícias.
        </p>
      )}
    </div>
  );
}
