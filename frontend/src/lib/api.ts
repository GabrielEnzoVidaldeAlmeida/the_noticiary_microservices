import axios from "axios";

const API_BASE_URL = "http://localhost:8000/auth";

export const registerUser = async (username: string, password: string) => {
  const response = await axios.post(`${API_BASE_URL}/register`, {
    username,
    password,
  });
  return response.data;
};

export const loginUser = async (username: string, password: string) => {
  const response = await axios.post(`${API_BASE_URL}/login`, {
    username,
    password,
  });
  return response.data;
};

export const getMe = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
