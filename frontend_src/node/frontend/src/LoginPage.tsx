import React, { useEffect, useRef, useState } from "react";
import { Mole } from "./mole";
import { Map } from "./map";
import axios from "axios";
import Layout from "./Layout";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "./utils/axiosInstance";

import "./Form.css";

const SCREEN_WIDTH = 1600;
const SCREEN_HEIGHT = 800;

const mapData = [
  [5, 5],
];

const TILE_SIZE = 800;


const LoginPage: React.FC = () => {
  const navigate = useNavigate(); // useNavigateを初期化

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mole, setMole] = useState<Mole | null>(null);
  const [gameMap, setGameMap] = useState<Map | null>(null);

  // マップとモグラの初期化
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        // マップの初期化
        const newMap = new Map(mapData, TILE_SIZE);
        setGameMap(newMap);

        // 掘削を無効化したモグラの初期化
        const newMole = new Mole(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, 2, 0, false);
        setMole(newMole);
      }
    }
  }, []);

  // 描画ループ
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && gameMap && mole) {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const draw = () => {
        ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT); // 画面クリア

        // 背景タイルを描画
        gameMap.draw(ctx, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

        // モグラの更新と描画
        mole.update(gameMap, 16, TILE_SIZE);
        mole.draw_on_toppage(ctx, -75, 275);

        // 次のフレームを描画
        requestAnimationFrame(draw);
      };

      draw(); // 描画ループ開始
    }
  }, [gameMap, mole]);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(""); // エラーメッセージをリセット
    setSuccess(""); // 成功メッセージをリセット
  
    try {
      // Djangoのログインエンドポイントにリクエストを送信
      const response = await axiosInstance.post(
        "/login/", // ベースURLはaxiosInstanceに設定済み
        {
          username,
          password,
        },
        { withCredentials: true } // Cookieを使用
      );
  
      setSuccess("ログイン成功しました！");
      console.log(response.data.message);
  
      // トップページに遷移
      navigate("/"); // "/" をトップページのパスに変更
      // ページをリロード
      window.location.reload();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.error || "ログインに失敗しました");
    }
  };
  
  return (
    <Layout>
      <div className="login-page-container">
        <div className="form pixel-font">
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
        <div className="canvas-container">
          <canvas
            className="canvas-login-page"
            ref={canvasRef}
            width={SCREEN_WIDTH}
            height={SCREEN_HEIGHT}
          ></canvas>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;