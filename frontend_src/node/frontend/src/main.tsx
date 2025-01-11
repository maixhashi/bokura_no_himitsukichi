import { Map } from "./map";
import { mapData } from "./mapData";


const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("Canvas context not supported");

const SCREEN_WIDTH = 1600;
const SCREEN_HEIGHT = 800;
const TILE_SIZE = 128;

canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;
document.body.appendChild(canvas);

const tilePaths = [
  "./assets/tiles/sky.png",
  "./assets/tiles/ground.png",
  "./assets/tiles/underground.png",
  "./assets/tiles/rockceiling_soilwall_rockfloor.png",
  "./assets/tiles/digged_ground.png",
  "./assets/tiles/soilwall_rockfloor.png",
  "./assets/tiles/soilwall.png",
];

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
