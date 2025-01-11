import { Character } from "./Character";

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

  move(keys: { [key: string]: boolean }, map: any) {
    this.isMoving = false; // 移動状態を初期化

    if (keys["ArrowLeft"]) {
      this.x -= this.speed;
      this.facingLeft = true;
      this.isMoving = true; // 移動中
    }
    if (keys["ArrowRight"]) {
      this.x += this.speed;
      this.facingLeft = false;
      this.isMoving = true; // 移動中
    }

    // 簡易的な重力処理
    this.y += this.gravity;
  }

  updateAnimation(FPS: number) {
    // 移動中のみアニメーションを更新
    if (this.isMoving) {
      this.animationTimer += 1000 / FPS;
      if (this.animationTimer >= 100) { // フレームごとの切り替えタイミング（調整可能）
        this.animationTimer = 0;
        this.frameIndex = (this.frameIndex + 1) % this.images.length;
      }
    } else {
      this.frameIndex = 0; // 移動していないときは初期フレームを表示
    }
  }
}
