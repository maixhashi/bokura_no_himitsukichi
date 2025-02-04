// Mole.ts
import { Character } from "./Character";
import { Map } from "./map";

export class Mole extends Character {
  private aiTimer: number;
  private direction: string;

  constructor(x: number, y: number, speed: number, gravity: number) {
    const images = [new Image(), new Image()];
    images[0].src = "assets/characters/mole_running_start.png";
    images[1].src = "assets/characters/mole_running_end.png";
    super(images, x, y, speed, gravity);

    this.aiTimer = 0;
    this.direction = Math.random() > 0.5 ? "left" : "right";
    this.width = images[0].width;
    this.height = images[0].height;
  }

  update(mapInstance: Map, deltaTime: number) {
    // AI タイマーの更新
    this.aiTimer += deltaTime;

    if (this.aiTimer >= 1000) {
      this.aiTimer = 0;
      const actions = ["left", "right"]; // "dig" を削除
      this.direction = actions[Math.floor(Math.random() * actions.length)];
    }

    // 動作の実行
    switch (this.direction) {
      case "left":
        if (!mapInstance.checkCollision(this.x, this.y, this.width, this.height, "left", this.speed)) {
          this.x -= this.speed;
          this.facingLeft = true;
        }
        break;
      case "right":
        if (!mapInstance.checkCollision(this.x, this.y, this.width, this.height, "right", this.speed)) {
          this.x += this.speed;
          this.facingLeft = false;
        }
        break;
    }

    // 重力の適用と地面の確認
    const [isOnGround, newY] = mapInstance.isOnGround(this.x, this.y, this.height);
    if (isOnGround) {
      this.y = newY; // 接地している場合、Y座標を修正
    } else {
      this.y += this.gravity; // 重力を適用
    }

    // アニメーションの更新
    this.animationTimer += deltaTime;
    if (this.animationTimer >= 60) {
      this.animationTimer = 0;
      this.frameIndex = (this.frameIndex + 1) % this.images.length;
    }
  }


  draw_on_game(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
    const width = this.images[0].width
    const height = this.images[0].height
    super.draw(ctx, cameraX, cameraY, width, height);
  }

  draw_on_toppage(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const width = 500
    const height = 500
    super.draw(ctx, x, y, width, height);
  }
}
