// app/news/[id]/page.tsx

import NewsDetailClient from ".";

interface PageProps {
  params: { id: string };
}

export default function NewsDetailPage({ params }: PageProps) {
  const { id } = params;

  return <NewsDetailClient id={id} />;
}
