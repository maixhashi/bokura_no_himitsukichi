import React, { useState } from "react";
import axios from "axios";
import Layout from "./Layout";
import "./Form.css";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(""); // エラーメッセージをリセット
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
      setErrorMessage(err.response?.data?.error || "ログインに失敗しました");
    }
  };

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(""); // エラーメッセージをリセット
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
  
      setSuccess("ログアウトしました");
      console.log(response.data.message);
    } catch (err: any) {
      console.error("ログアウトエラー:", err);
  
      setErrorMessage(
        err.response?.data?.error ||
        err.message ||
        "ログアウトに失敗しました"
      );
    }
  };
    
  return (
    <Layout>
      <div className="page-container">
        <div className="form">
          <h2>ログイン</h2>
          <form onSubmit={handleLogin}>
            <div>
              <label>ユーザー名</label>
              <input
                type="text"
                value={username}
                placeholder="ユーザー名を入力してください"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label>パスワード</label>
              <input
                type="password"
                value={password}
                placeholder="パスワードを入力してください"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button type="submit">ログイン</button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
