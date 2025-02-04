import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Layout from "./Layout";
import { EmptyTreasureBox } from "./EmptyTreasureBox";
import { Map } from "./map";
import "./Form.css";

const SCREEN_WIDTH = 1600;
const SCREEN_HEIGHT = 750;

const mapData = [
  [5, 5],
];

const TILE_SIZE = 800;

const AccountRegisterPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [treasure, setTreasure] = useState<EmptyTreasureBox | null>(null);
  const [gameMap, setGameMap] = useState<Map | null>(null);

  // マップと宝箱の初期化
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        // マップの初期化
        const newMap = new Map(mapData, TILE_SIZE);
        setGameMap(newMap);

        const newTreasure = new EmptyTreasureBox(100, 300, 0);
        setTreasure(newTreasure); // 宝箱を設定

      }
    }
  }, []);

  // 描画ループ
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && gameMap && treasure) {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const draw = () => {
        ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT); // 画面クリア

        // 背景タイルを描画
        gameMap.draw(ctx, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

        // 宝箱の点滅状態を更新
        treasure.updateBlink();

        // 宝箱を描画
        treasure.draw_on_toppage(ctx, 1000, 200);

        // 次のフレームを描画
        requestAnimationFrame(draw);
      };

      draw(); // 描画ループ開始
    }
  }, [gameMap, treasure]);

  // クリックイベントの追加
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && treasure) {
      const handleClick = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // 宝箱のクリック判定
        if (
          mouseX >= treasure.x &&
          mouseX <= treasure.x + treasure.width &&
          mouseY >= treasure.y &&
          mouseY <= treasure.y + treasure.height
        ) {
          console.log("Treasure clicked!");
          treasure.open(); // 宝箱を開く動作のみ実行
        }
      };

      canvas.addEventListener("click", handleClick);
      return () => {
        canvas.removeEventListener("click", handleClick);
      };
    }
  }, [treasure]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setErrorMessage("");

    try {
      const response = await axios.post("http://localhost:8000/api/register/", {
        username,
        password,
      });
      setMessage(response.data.message);
      setUsername("");
      setPassword("");
    } catch (err: any) {
      setErrorMessage(err.response?.data?.error || "An unexpected error occurred.");
    }
  };

  return (
    <Layout>
      <div className="account-register-page-container">
        <div className="form pixel-font">
          <h2>アカウントを作成</h2>
          <form onSubmit={handleRegister}>
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
            {message && <p className="success-message">{message}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button type="submit">作成</button>
          </form>
        </div>
        <div className="canvas-container">
          <canvas
            className="canvas-account-register-page"
            ref={canvasRef}
            width={SCREEN_WIDTH}
            height={SCREEN_HEIGHT}
            style={{ border: "1px solid black" }}
          ></canvas>
        </div>
      </div>
    </Layout>
  );
};

export default AccountRegisterPage;
