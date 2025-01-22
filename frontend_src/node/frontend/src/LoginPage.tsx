import React, { useState } from "react";
import axios from "axios";
import Layout from "./Layout";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // エラーメッセージをリセット
    setSuccess(""); // 成功メッセージをリセット

    try {
      // CSRFトークンが必要であればリクエストに含める
      const csrfResponse = await axios.get("http://localhost:8000/api/csrf/");
      axios.defaults.headers.common["X-CSRFToken"] = csrfResponse.data.csrfToken;

      // Djangoのログインエンドポイントにリクエストを送信
      const response = await axios.post(
        "http://localhost:8000/api/login/",
        {
          username,
          password,
        },
        { withCredentials: true } // Cookieを使用
      );

      setSuccess("ログイン成功しました！");
      console.log(response.data.message);
    } catch (err: any) {
      setError(err.response?.data?.error || "ログインに失敗しました");
    }
  };

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // エラーメッセージをリセット
    setSuccess(""); // 成功メッセージをリセット
  
    try {
      // CSRFトークン取得
      const csrfResponse = await axios.get("http://localhost:8000/api/csrf/", {
        withCredentials: true, // Cookieを使用
      });
  
      const csrfToken = csrfResponse.data?.csrfToken;
  
      if (!csrfToken) {
        throw new Error("CSRFトークンの取得に失敗しました");
      }
  
      // CSRFトークンをリクエストヘッダーに設定
      axios.defaults.headers.common["X-CSRFToken"] = csrfToken;
  
      // ログアウトリクエスト
      const response = await axios.post(
        "http://localhost:8000/api/logout/",
        {},
        { withCredentials: true } // Cookieを使用
      );
  
      setSuccess("ログアウトに成功しました！");
      console.log(response.data.message);
    } catch (err: any) {
      console.error("ログアウトエラー:", err);
  
      setError(
        err.response?.data?.error ||
        err.message ||
        "ログアウトに失敗しました"
      );
    }
  };
    
  return (
    <Layout>
      <div style={{ maxWidth: "400px", margin: "0 auto", padding: "1rem" }}>
        <h2>ログイン</h2>
        {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}
        {success && <div style={{ color: "green", marginBottom: "1rem" }}>{success}</div>}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="username">ユーザー名:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="password">パスワード:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
            />
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              padding: "0.75rem",
              width: "100%",
              cursor: "pointer",
            }}
          >
            ログイン
          </button>
        </form>
        <form onSubmit={handleLogout}>
          <button
            type="submit"
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              padding: "0.75rem",
              width: "100%",
              cursor: "pointer",
            }}
          >
            ログアウト
          </button>
        </form>

      </div>
    </Layout>
  );
};

export default LoginPage;
