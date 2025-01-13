import { Character } from "./character";
import { Map } from "./map";

export class Mole extends Character {
  private digTimer: number;
  private aiTimer: number;
  private direction: string;

  constructor(x: number, y: number, speed: number, gravity: number) {
    const images = [
      new Image(),
      new Image(),
    ];
    images[0].src = "assets/characters/mole_running_start.png";
    images[1].src = "assets/characters/mole_running_end.png";
    super(images, x, y, speed, gravity);

    this.digTimer = 0;
    this.aiTimer = 0;
    this.direction = Math.random() > 0.5 ? "left" : "right";
  }

  update(mapInstance: Map, deltaTime: number, tileSize: number) {
    // AI タイマーの更新
    this.aiTimer += deltaTime;

    if (this.aiTimer >= 1000) {
      this.aiTimer = 0;
      const actions = ["left", "right", "dig"];
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
      case "dig":
        const digX = Math.floor(this.x / tileSize);
        const digY = Math.floor(this.y / tileSize);
        mapInstance.digTile(digX, digY, "down", this.width, this.height, this.speed);
        break;
    }

    // 重力の適用と地面の確認
    const groundCheck = mapInstance.isOnGround(this.x, this.y, this.height);
    if (groundCheck.isOnGround) {
      this.y = groundCheck.newY;
    } else {
      this.y += this.gravity;
    }

    // アニメーションの更新
    this.animationTimer += deltaTime;
    if (this.animationTimer >= 60) {
      this.animationTimer = 0;
      this.frameIndex = (this.frameIndex + 1) % this.images.length;
    }
  }

  draw(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
    super.draw(ctx, cameraX, cameraY);
  }
}
