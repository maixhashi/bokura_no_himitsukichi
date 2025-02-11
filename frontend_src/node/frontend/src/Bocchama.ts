import { Character } from "./Character";
import { Treasure } from "./treasure";
import { Map } from "./map";

export class Bocchama extends Character {
  isMoving: boolean;
  width: number;
  height: number;
  startX: number;

  constructor(x: number, y: number, speed: number, gravity: number) {
    const images = [
      new Image(),
      new Image(),
    ];
    images[0].src = "assets/characters/bocchama_running_start.png";
    images[1].src = "assets/characters/bocchama_running_end.png";
    super(images, x, y, speed, gravity);
    this.isMoving = false;
    this.isMoving = false;
    this.width = images[0].width;
    this.height = images[0].height;
    this.startX = 0;

  }

  updatePosition(canvasWidth: number) {
    // 横に走る
    this.x += this.speed;

    // 画面外に出たらスタート地点に戻す
    if (this.x > canvasWidth) {
      this.x = -this.width; // スタート地点の反対側から登場
    }
  }

  draw_on_game(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
    super.draw(ctx, cameraX, cameraY, this.width, this.height);
  }

  draw_on_toppage(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
    this.width = 390;
    this.height = 390;
    super.draw(ctx, cameraX, cameraY, this.width, this.height);
    this.isMoving = true;
  }

  move(keys: { [key: string]: boolean }, map: any) {
    super.move(keys, map);
    this.isMoving = true;
  }
  
  updateAnimation(FPS: number) {
    super.updateAnimation(FPS, this.isMoving);
  }

  dig(keys: { [key: string]: boolean }, Map: any) {
    if (keys["ArrowRight"] && keys[" "]) {
      Map.digTile(
        this.x,
        this.y,
        "right",
        this.width,
        this.height,
        this.speed,
        // Map.getRandomRewardImage()
      );
    } else if (keys["ArrowLeft"] && keys[" "]) {
      Map.digTile(
        this.x,
        this.y,
        "left",
        this.width,
        this.height,
        this.speed,
        // Map.getRandomRewardImage()
      );
    } else if (keys["ArrowDown"] && keys[" "]) {
      Map.digTile(
        this.x,
        this.y,
        "down",
        this.width,
        this.height,
        this.speed,
        // Map.getRandomRewardImage()
      );
    }
  }

  openTreasureBox(keys: { [key: string]: boolean }, tileSize: number, treasures: Treasure[], gameMap: Map) {
    // 宝箱を開ける処理
    if (keys[" "]) {
      for (const treasure of treasures) {
        // Bocchamaの位置と宝箱の位置を比較
        if (
          Math.abs(this.x - treasure.x) < tileSize / 2 &&
          Math.abs(this.y - treasure.y) < tileSize / 2
        ) {
          treasure.open(treasure.rewardImage, gameMap);
        }
      }
    }
  }
}
