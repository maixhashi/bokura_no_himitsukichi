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

  move(keys: { [key: string]: boolean }, map: any): boolean {
    let isMoving = false;

    if (keys["ArrowLeft"]) {
      this.x -= this.speed;
      this.facingLeft = true;
      isMoving = true;
    }
    if (keys["ArrowRight"]) {
      this.x += this.speed;
      this.facingLeft = false;
      isMoving = true;
    }

    this.y += this.gravity; // 簡易的な重力処理
    return isMoving;
  }

  updateAnimation(FPS: number, isMoving: boolean) {
    if (isMoving) {
      this.animationTimer += 1000 / FPS;
      if (this.animationTimer >= 100) { // フレーム切り替えタイミング
        this.animationTimer = 0;
        this.frameIndex = (this.frameIndex + 1) % this.images.length;
      }
    } else {
      this.frameIndex = 0; // 移動していないときは初期フレーム
    }
  }

  flipImage(image: HTMLImageElement): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get 2D context");
    }

    canvas.width = image.width;
    canvas.height = image.height;

    // 左右反転して描画
    ctx.translate(image.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(image, 0, 0);

    return canvas;
  }
}
