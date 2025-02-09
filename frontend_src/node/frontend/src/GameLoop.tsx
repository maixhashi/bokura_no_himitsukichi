import { Map } from "./map";
import { Camera } from "./camera";
import { mapData } from "./mapData";
import { Bocchama } from "./Bocchama";

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
  const collectedRewards = gameMap.collectedRewards;
  const camera = new Camera(gameMap.width, gameMap.height);

  const initialBocchamaX = TILE_SIZE / 2;
  const initialBocchamaY = TILE_SIZE / 2;
  const bocchama = new Bocchama(initialBocchamaX, initialBocchamaY, 5, 5);

  camera.update(bocchama, SCREEN_WIDTH, SCREEN_HEIGHT);

  let lastTime = 0;

  function gameLoop(time: number) {
    const deltaTime = time - lastTime;
    lastTime = time;

    ctx!.fillStyle = WHITE;
    ctx!.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    bocchama.move(keys, gameMap);
    bocchama.dig(keys, gameMap);
    bocchama.openTreasureBox(keys, TILE_SIZE, gameMap.getTreasures(), collectedRewards);

    gameMap.updateMoles(gameMap, deltaTime);
    gameMap.updateTreasures(gameMap);

    camera.update(bocchama, SCREEN_WIDTH, SCREEN_HEIGHT);
    const { x: cameraX, y: cameraY } = camera.getPosition();

    gameMap.draw(ctx!, cameraX, cameraY, SCREEN_WIDTH, SCREEN_HEIGHT);
    bocchama.draw_on_game(ctx!, cameraX, cameraY);

    for (const mole of gameMap.getMoles()) {
      mole.draw_on_game(ctx!, cameraX, cameraY);
    }

    for (const treasure of gameMap.getTreasures()) {
      treasure.updateBlink();
      treasure.draw(ctx!, camera);
    }

    gameMap.drawCollectedRewards(ctx!);

    requestAnimationFrame(gameLoop);
  }

  // クリックイベント
  canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    collectedRewards.forEach((reward, index) => {
      const x = 1300 - index * 1;
      const y = 10 + index * 1;
      const width = 100;
      const height = 100;

      if (clickX >= x && clickX <= x + width && clickY >= y && clickY <= y + height) {
        console.log("Collected reward clicked! Navigating to /dashboard");
        window.location.href = "/dashboard";
      }
    });
  });

  // マウスムーブイベント（カーソル変更）
  canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    let hoveringOverReward = false;

    collectedRewards.forEach((reward, index) => {
      const x = 1300 - index * 1;
      const y = 10 + index * 1;
      const width = 100;
      const height = 100;

      if (mouseX >= x && mouseX <= x + width && mouseY >= y && mouseY <= y + height) {
        hoveringOverReward = true;
      }
    });

    canvas.style.cursor = hoveringOverReward ? "pointer" : "default";
  });

  requestAnimationFrame(gameLoop);
};
