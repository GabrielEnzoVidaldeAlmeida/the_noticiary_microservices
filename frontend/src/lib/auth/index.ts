import axios from "axios";

const AUTH_API_BASE = "http://localhost:8000/docs";

export interface LoginData {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export async function login(data: LoginData): Promise<TokenResponse> {
  const response = await axios.post(`${AUTH_API_BASE}/login`, data);
  return response.data;
}

export async function register(data: LoginData): Promise<void> {
  await axios.post(`${AUTH_API_BASE}/register`, data);
}
