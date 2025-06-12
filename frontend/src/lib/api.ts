import { News, NewsListResponse } from "@/types/news";
import axios from "axios";

const AUTH_BASE_URL = "http://localhost:8000/auth";
const NEWS_BASE_URL = "http://localhost:8001/news";
const INTERACTION_BASE_URL = "http://localhost:8002/interactions";

export const registerUser = async (username: string, password: string) => {
  const response = await axios.post(`${AUTH_BASE_URL}/register`, {
    username,
    password,
  });
  return response.data;
};

export const loginUser = async (username: string, password: string) => {
  const response = await axios.post(`${AUTH_BASE_URL}/login`, {
    username,
    password,
  });
  return response.data;
};

export const getMe = async (token: string) => {
  const response = await axios.get(`${AUTH_BASE_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createNews = async (
  token: string,
  data: {
    name: string;
    content: string;
    description?: string;
    image?: string;
  }
) => {
  // Garantir que a URL da imagem comece com '/'
  if (data.image && !data.image.startsWith("/")) {
    data.image = "/" + data.image;
  }

  const response = await axios.post(`${NEWS_BASE_URL}/`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateNews = async (
  id: number,
  token: string,
  data: {
    name: string;
    content: string;
    description?: string;
    image?: string;
  }
) => {
  const response = await axios.put(`${NEWS_BASE_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteNews = async (id: number, token: string) => {
  const response = await axios.delete(`${NEWS_BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getNewsList = async (
  page: number = 1,
  size: number = 10
): Promise<NewsListResponse> => {
  const response = await axios.get(`${NEWS_BASE_URL}/`, {
    params: { page, size },
  });
  return response.data;
};

export const getNewsById = async (id: number): Promise<News> => {
  const response = await axios.get(`${NEWS_BASE_URL}/${id}`);
  return response.data;
};

export interface InteractionResponse {
  id: number;
  id_user: number;
  id_news: number;
  interaction_type: "like" | "dislike";
  created_at: string;
  username?: string;
}

export interface InteractionStats {
  news_id: number;
  likes_count: number;
  dislikes_count: number;
  total_interactions: number;
}

export interface UserInteractionStatus {
  news_id: number;
  user_interaction?: "like" | "dislike" | null;
  likes_count: number;
  dislikes_count: number;
}

export const getInteractionStats = async (
  newsId: number
): Promise<InteractionStats> => {
  const response = await axios.get(`${INTERACTION_BASE_URL}/stats/${newsId}`);
  return response.data;
};

export const getUserInteractionStatus = async (
  newsId: number,
  token: string
): Promise<UserInteractionStatus> => {
  const response = await axios.get(`${INTERACTION_BASE_URL}/status/${newsId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const likeNews = async (newsId: number, token: string) => {
  const response = await axios.post(
    `${INTERACTION_BASE_URL}/like/${newsId}`,
    null,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const dislikeNews = async (newsId: number, token: string) => {
  const response = await axios.post(
    `${INTERACTION_BASE_URL}/dislike/${newsId}`,
    null,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const removeInteraction = async (
  interactionId: number,
  token: string
) => {
  const response = await axios.delete(
    `${INTERACTION_BASE_URL}/${interactionId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};
