export class Character {
  x: number;
  y: number;
  speed: number;
  gravity: number;
  width: number;
  height: number;
  facingLeft: boolean;
  frameIndex: number;
  animationTimer: number;
  images: HTMLImageElement[];
  currentImage: HTMLImageElement;

  constructor(images: HTMLImageElement[], x: number, y: number, speed: number, gravity: number) {
    this.images = images;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.gravity = gravity;
    this.facingLeft = false;
    this.frameIndex = 0;
    this.animationTimer = 0;
    this.currentImage = images[0];
    this.width = this.currentImage.width;
    this.height = this.currentImage.height;
  }

  draw(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
    const image = this.facingLeft
      ? this.flipImage(this.images[this.frameIndex])
      : this.images[this.frameIndex];
    ctx.drawImage(image, this.x - cameraX, this.y - cameraY);
  }

  move(keys: { [key: string]: boolean }, map: any) {
    if (keys["ArrowLeft"]) {
      this.x -= this.speed;
      this.facingLeft = true;
    }
    if (keys["ArrowRight"]) {
      this.x += this.speed;
      this.facingLeft = false;
    }
    this.y += this.gravity; // 簡易的な重力処理
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


  flipImage(image: HTMLImageElement): HTMLImageElement {
    // 画像の左右反転処理（詳細は適宜実装）
    return image;
  }
}
