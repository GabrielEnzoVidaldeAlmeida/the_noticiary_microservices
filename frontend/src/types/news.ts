export type News = {
  id: number;
  name: string;
  description?: string;
  content: string;
  image?: string;
  created_at: string;
  author_id: number;
  author_username: string;
};

export type NewsListResponse = {
  news: News[];
  total: number;
  page: number;
  size: number;
};
