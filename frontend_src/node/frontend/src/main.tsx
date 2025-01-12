import { Map } from "./map";
import { Bocchama } from "./Bocchama";
import { mapData } from "./mapData";
import { SCREEN_WIDTH, SCREEN_HEIGHT, TILE_SIZE } from "./utils/constants";
import { tilePaths } from "./utils/image_paths";

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("Canvas context not supported");

canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;
document.body.appendChild(canvas);

const gameMap = new Map(mapData, TILE_SIZE, tilePaths);
const bocchama = new Bocchama(0, TILE_SIZE / 2, 5, 5);

let cameraX = 0;
let cameraY = 0;

// キーの状態を保持するオブジェクト
const keys: { [key: string]: boolean } = {};

// FPS 設定
const FPS = 60; // フレームレート
const frameInterval = 1000 / FPS; // 1フレームあたりのミリ秒
let lastFrameTime = 0; // 最後のフレーム時間

// イベントリスナーの追加
window.addEventListener("keydown", (e) => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
    e.preventDefault();
  }
  keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

function gameLoop(currentTime: number) {
  const deltaTime = currentTime - lastFrameTime;

  if (deltaTime >= frameInterval) {
    lastFrameTime = currentTime;

    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // マップの描画
    gameMap.draw(ctx, cameraX, cameraY, SCREEN_WIDTH, SCREEN_HEIGHT);

    // Bocchamaの移動と描画
    bocchama.move(keys, gameMap);       // 移動の処理
    bocchama.updateAnimation(FPS);      // アニメーションの更新
    bocchama.draw(ctx, cameraX, cameraY); // 描画処理
  }

  requestAnimationFrame(gameLoop);
}

gameLoop(0);
