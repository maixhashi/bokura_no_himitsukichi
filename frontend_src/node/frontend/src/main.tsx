import { Map } from "./map";
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

let cameraX = 0;
let cameraY = 0;

function gameLoop() {
  ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

  // 画像がロードされている場合のみ描画
  gameMap.draw(ctx, cameraX, cameraY, SCREEN_WIDTH, SCREEN_HEIGHT);

  requestAnimationFrame(gameLoop);
}

gameLoop();