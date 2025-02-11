import React, { useEffect, useRef, useState } from "react";
import { Mole } from "./mole";
import { Map } from "./map";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./utils/axiosInstance";

import "./Form.css";
import "./TopPage.css";

const SCREEN_WIDTH = 1600;
const SCREEN_HEIGHT = 800;

const mapData = [[5, 5]];
const TILE_SIZE = 800;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mole, setMole] = useState<Mole | null>(null);
  const [gameMap, setGameMap] = useState<Map | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        const newMap = new Map(mapData, TILE_SIZE);
        setGameMap(newMap);

        const newMole = new Mole(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, 2, 0);
        setMole(newMole);
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && gameMap && mole) {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const draw = () => {
        ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

        gameMap.draw(ctx, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        mole.update(gameMap, 16);
        mole.draw_on_toppage(ctx, -75, 275);

        requestAnimationFrame(draw);
      };

      draw();
    }
  }, [gameMap, mole]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await axiosInstance.post(
        "/login/",
        { username, password },
        { withCredentials: true }
      );

      console.log(response.data.message);

      navigate("/");
      window.location.reload();
    } catch (err: any) {
      setErrorMessage(err.respon  se?.data?.error || "ログインに失敗しました");
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