import { Map } from "./map";
import { Camera } from "./camera";
import { mapData } from "./mapData";
import { Bocchama } from "./bocchama";
import { tilePaths } from "./utils/image_paths";

// 定数
const SCREEN_WIDTH = 1600;
const SCREEN_HEIGHT = 800;
const TILE_SIZE = 128;
const WHITE = "#FFFFFF";

// ゲームループのエントリーポイント
export const startGameLoop = () => {
  const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
  if (!canvas) {
    throw new Error("Canvas not found. Make sure to include a canvas element in the DOM.");
  }

  canvas.width = SCREEN_WIDTH;
  canvas.height = SCREEN_HEIGHT;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas context not found");
  }

  const keys: Record<string, boolean> = {};

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

  // オブジェクトの初期化
  const gameMap = new Map(mapData, TILE_SIZE);
  console.log("gameMap.collectedRewards", gameMap.collectedRewards);

  // Bocchamaの初期位置を定義
  const initialBocchamaX = TILE_SIZE / 2;
  const initialBocchamaY = TILE_SIZE / 2;
  const bocchama = new Bocchama(initialBocchamaX, initialBocchamaY, 5, 5);

  // Treasureの初期位置をBocchamaの位置に基づいて設定
  // const treasureX = TILE_SIZE * 2;
  // const treasureY = TILE_SIZE / 2;
  // const treasure = new Treasure(treasureX, treasureY, 5, "assets/rewards/movie_poster.png");
  // gameMap.treasures.push(treasure);

  const collectedRewards = gameMap.collectedRewards
  const camera = new Camera(gameMap.width, gameMap.height);

  // 初期フレームでカメラを更新
  camera.update(bocchama, SCREEN_WIDTH, SCREEN_HEIGHT);

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
    bocchama.openTreasureBox(keys, TILE_SIZE, gameMap.treasures, collectedRewards);

    // モグラの更新
    gameMap.updateMoles(gameMap, deltaTime, TILE_SIZE);
    gameMap.updateTreasures(gameMap);

    // カメラの更新
    camera.update(bocchama, SCREEN_WIDTH, SCREEN_HEIGHT);

    // カメラ座標の取得
    const { x: cameraX, y: cameraY } = camera.getPosition();

    // マップとキャラクターの描画
    gameMap.draw(ctx, cameraX, cameraY, SCREEN_WIDTH, SCREEN_HEIGHT);
    bocchama.draw_on_game(ctx, cameraX, cameraY);

    // モグラを描画
    for (const mole of gameMap.moles) {
      mole.draw_on_game(ctx, cameraX, cameraY);
    }

    // 宝箱を描画
    for (const treasure of gameMap.treasures) {
      treasure.updateBlink();
      treasure.draw(ctx, camera);
    }
    
    // 収集済みアイテムを描画
    gameMap.drawCollectedRewards(ctx);
    // console.log("collectedRewards:", collectedRewards)

    // 次のフレーム
    requestAnimationFrame(gameLoop);
  }

  // 初回ゲームループの開始
  requestAnimationFrame(gameLoop);
};
