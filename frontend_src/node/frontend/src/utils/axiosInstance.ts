import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api", // DjangoのAPIのベースURL
  withCredentials: true, // CSRFトークンを送信するためにクッキーを有効化
});

// CSRFトークンを取得し、Axiosインスタンスのデフォルトヘッダーに設定
const getCsrfToken = async () => {
  try {
    const response = await axiosInstance.get("/csrf");
    const csrfToken = response.data.csrfToken || response.headers["x-csrftoken"]; // トークン取得 (クッキーまたはヘッダーから取得)
    axiosInstance.defaults.headers.common["X-CSRFToken"] = csrfToken; // Axiosのデフォルトヘッダーに設定
    console.log("CSRFトークンを取得しました:", csrfToken);
  } catch (error) {
    console.error("CSRFトークンの取得に失敗しました:", error);
  }
};

// アプリケーション初期化時にCSRFトークンを取得
getCsrfToken();

export default axiosInstance;
