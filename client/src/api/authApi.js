import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // ✅ 반드시 서버 주소
});

export const requestVerify = (email) => api.post("/auth/verify", { email });
export const requestRegister = (data) => api.post("/auth/register", data);
export const login = (data) => api.post("/auth/login", data);
