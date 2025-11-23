import axios from "axios";

const api = axios.create({
  baseURL: "https://alan-ungazetted-unshrewdly.ngrok-free.dev",
  withCredentials: true,
});

export default api;
