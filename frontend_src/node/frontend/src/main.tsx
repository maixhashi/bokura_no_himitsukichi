import { Map } from "./map";
// import { Camera } from "./camera";
import { mapData } from "./mapData";
import { Bocchama } from "./bocchama";
import { Treasure } from "./treasure";
import { Mole } from "./mole";
import { tilePaths } from "./utils/image_paths";


// 定数
const GAME_NAME = "ぼくらのひみつきち";
const SCREEN_WIDTH = 1600;
const SCREEN_HEIGHT = 800;
const TILE_SIZE = 128;
const WHITE = "#FFFFFF";
const FPS = 60;

// HTML Canvasの設定
const canvas = document.createElement("canvas");
canvas.id = "gameCanvas";
canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");
if (!ctx) {
  throw new Error("Canvas context not found");
}

type KeyState = { [key: string]: boolean };
const keys: KeyState = {};

// オブジェクト生成
const gameMap = new Map(mapData, TILE_SIZE, tilePaths);
const bocchama = new Bocchama(0, TILE_SIZE / 2, 5, 5);

// 宝箱の設定
const treasure = new Treasure(240, 70, 5, "assets/rewards/movie_poster.png");
gameMap.treasures.push(treasure);
const collectedRewards: any[] = [];

// カメラ
// const camera = new Camera(
//   gameMap.width * TILE_SIZE,
//   gameMap.height * TILE_SIZE
// );

// イベントリスナー
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

let cameraX = 0;
let cameraY = 0;

function main() {
  let lastTime = 0;

  function gameLoop(time: number) {
    const deltaTime = time - lastTime;
    lastTime = time;

    // 画面をクリア
    ctx.fillStyle = WHITE;
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // Bocchamaの動作
    bocchama.move(keys, gameMap);
    bocchama.dig(keys, gameMap);
    // bocchama.openTreasureBox(keys, TILE_SIZE, gameMap.treasures);
    bocchama.openTreasureBox(keys, TILE_SIZE, gameMap.treasures);

    // モグラの更新
    gameMap.updateMoles(gameMap, deltaTime, TILE_SIZE);
    gameMap.updateTreasures(gameMap);

    // カメラを更新
    // camera.update(bocchama, SCREEN_WIDTH, SCREEN_HEIGHT);

    // マップとキャラクターの描画
    gameMap.draw(ctx, cameraX, cameraY, SCREEN_WIDTH, SCREEN_HEIGHT);
    bocchama.draw(ctx, cameraX, cameraY); // 描画処理

    // モグラを描画
    for (const mole of gameMap.moles) {
      mole.draw(ctx, cameraX, cameraY);
    }

    // 宝箱を描画
    for (const treasure of gameMap.treasures) {
      treasure.updateBlink();
      treasure.draw(ctx, cameraX, cameraY);
    }

    // 収集済みアイテムを描画
    // Treasure.drawCollectedRewards(ctx, collectedRewards);

    // 次のフレーム
    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);
}

main();
