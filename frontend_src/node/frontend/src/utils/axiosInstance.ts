import axios from "axios";

const isDevelopment = import.meta.env.MODE === 'development'
const myBaseUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_DEPLOY

const axiosInstance = axios.create({
  // baseURL: "http://localhost:8000/api", // DjangoのAPIのベースURL
  baseURL: myBaseUrl, // DjangoのAPIのベースURL
  timeout: 5000,
  withCredentials: true, // CSRFトークンを送信するためにクッキーを有効化
  headers: {
    "Content-Type":"application/json",
    accept: "application/json"
  }
});

// CSRFトークンを取得し、Axiosインスタンスのデフォルトヘッダーに設定
const getCsrfToken = async () => {
  try {
    const response = await axiosInstance.get("/csrf");
    const csrfToken = response.data.csrfToken || response.headers["x-csrftoken"]; // トークン取得 (クッキーまたはヘッダーから取得)
    axiosInstance.defaults.headers.common["X-CSRFToken"] = csrfToken; // Axiosのデフォルトヘッダーに設定
  } catch (error) {
    console.error("CSRFトークンの取得に失敗しました:", error);
  }
};

// アプリケーション初期化時にCSRFトークンを取得
getCsrfToken();

export default axiosInstance;