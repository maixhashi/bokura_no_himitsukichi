import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

const HeaderLinks = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate(); // ページ遷移用フック

  // ログイン中のユーザー情報を取得
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const csrfResponse = await axios.get("http://localhost:8000/api/csrf/", {
          withCredentials: true,
        });
        axios.defaults.headers.common["X-CSRFToken"] = csrfResponse.data.csrfToken;

        const response = await axios.get("http://localhost:8000/api/current-user/", {
          withCredentials: true,
        });
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Error fetching current user:", error);
        setCurrentUser(null);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccess("");

    try {
      const csrfResponse = await axios.get("http://localhost:8000/api/csrf/", {
        withCredentials: true,
      });

      const csrfToken = csrfResponse.data?.csrfToken;

      if (!csrfToken) {
        throw new Error("CSRFトークンの取得に失敗しました");
      }

      axios.defaults.headers.common["X-CSRFToken"] = csrfToken;

      const response = await axios.post(
        "http://localhost:8000/api/logout/",
        {},
        { withCredentials: true }
      );

      setSuccess("ログアウトしました");
      setCurrentUser(null); // ユーザー情報をリセット
      console.log(response.data.message);

      // ログインページにリダイレクト
      navigate("/login");
    } catch (err) {
      console.error("ログアウトエラー:", err);

      setErrorMessage(
        err.response?.data?.error || err.message || "ログアウトに失敗しました"
      );
    }
  };

  return (
    <nav className="HeaderLinks">
      {currentUser ? (
        // ログイン中
        <>
          <span>{currentUser.username}</span>
          <button onClick={handleLogout} className="logout-button">
            ログアウト
          </button>
        </>
      ) : (
        // 未ログイン
        <>
          <Link to="/login">ログイン</Link>
          <Link to="/account-register">アカウントを登録</Link>
        </>
      )}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {success && <p className="success-message">{success}</p>}
    </nav>
  );
};

export default HeaderLinks;
