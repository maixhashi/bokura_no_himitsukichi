import React, { useEffect } from "react";
import { startGameLoop } from "./GameLoop";

const GamePage: React.FC = () => {
  useEffect(() => {
    // ゲームループの開始
    startGameLoop();

    return () => {
      // クリーンアップ処理
      window.removeEventListener("keydown", () => {});
      window.removeEventListener("keyup", () => {});
    };
  }, []);

  return (
    <div>
      <canvas id="gameCanvas"></canvas>
    </div>
  );
};

export default GamePage;
