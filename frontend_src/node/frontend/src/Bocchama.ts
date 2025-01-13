import { Character } from "./character";
import { Map } from "./map"; // マップ関連のクラスをインポート

export class Bocchama extends Character {
  isMoving: boolean;

  constructor(x: number, y: number, speed: number, gravity: number) {
    const images = [
      new Image(),
      new Image(),
    ];
    images[0].src = "assets/characters/bocchama_running_start.png";
    images[1].src = "assets/characters/bocchama_running_end.png";
    super(images, x, y, speed, gravity);
    this.isMoving = false;
  }

  draw(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
    super.draw(ctx, cameraX, cameraY);
  }

  move(keys: { [key: string]: boolean }, map: any) {
    this.isMoving = super.move(keys, map);
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

  openTreasureBox(keys: { [key: string]: boolean }, tileSize: number, treasures: any[], collectedRewards: HTMLImageElement[]) {
    // 宝箱を開ける処理
    if (keys[" "]) {
      for (const treasure of treasures) {
        // Bocchamaの位置と宝箱の位置を比較
        if (
          Math.abs(this.x - treasure.x) < tileSize / 2 &&
          Math.abs(this.y - treasure.y) < tileSize / 2
        ) {
          treasure.open(collectedRewards);
          console.log("treasure:", treasure)
          console.log("treasure.x:", treasure.x)
          console.log("treasure.y:", treasure.y)
          console.log("Bocchama.openTreasureBox 発火")
        }
      }
    }
  }
}
