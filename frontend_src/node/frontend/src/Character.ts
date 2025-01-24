export class Character {
  private images: HTMLImageElement[];
  private x: number;
  private y: number;
  private speed: number;
  private gravity: number;
  private frameIndex: number;
  private animationTimer: number;
  private onGround: boolean;
  private currentImage: HTMLImageElement;
  private width: number;
  private height: number;
  private facingLeft: boolean;

  constructor(
    images: HTMLImageElement[],
    x: number,
    y: number,
    speed: number,
    gravity: number
  ) {
    this.images = images;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.gravity = gravity;
    this.frameIndex = 0;
    this.animationTimer = 0;
    this.onGround = false;
    this.currentImage = this.images[0];
    this.width = this.currentImage.width;
    this.height = this.currentImage.height;
    this.facingLeft = false;
  }

  draw(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number): void {
    if (!ctx || !(ctx instanceof CanvasRenderingContext2D)) {
      console.error("Invalid canvas context provided.");
      return;
    }
  
    const currentImage = this.images[this.frameIndex];
  
    if (!currentImage.complete) {
      console.warn("Image not loaded yet:", currentImage.src);
      return;
    }
  
    if (this.facingLeft) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(
        currentImage,
        -(this.x + this.width - cameraX),
        this.y - cameraY,
        this.width,
        this.height
      );
      ctx.restore();
    } else {
      ctx.drawImage(
        currentImage,
        this.x - cameraX,
        this.y - cameraY,
        this.width,
        this.height
      );
    }
  }
  
  move(
    keys: { [key: string]: boolean },
    mapInstance: Map
  ): void {
  
    let isMoving = false;
  
    // 左への移動
    if (
      keys["ArrowLeft"] &&
      !mapInstance.checkCollision(this.x, this.y, this.width, this.height, "left", this.speed)
    ) {
      this.x -= this.speed;
      this.facingLeft = true;
      isMoving = true;
    }
  
    // 右への移動
    if (
      keys["ArrowRight"] &&
      !mapInstance.checkCollision(this.x, this.y, this.width, this.height, "right", this.speed)
    ) {
      this.x += this.speed;
      this.facingLeft = false;
      isMoving = true;
    }
  
    // 接地判定
    const [onGround, newY] = mapInstance.isOnGround(this.x, this.y, this.height);
    this.onGround = onGround;
    if (this.onGround) {
      this.y = newY;
    } else {
      this.y += this.gravity;
    }
  
    // アニメーション更新
    if (isMoving) {
      this.animationTimer += 1;
      if (this.animationTimer >= 10) {
        this.animationTimer = 0;
        this.frameIndex = (this.frameIndex + 1) % this.images.length;
      }
    } else {
    }
  }

  updateAnimation(FPS: number, isMoving: boolean): void {
    if (isMoving) {
      this.animationTimer += 1;
      if (this.animationTimer >= FPS / 6) { // 6 FPS のアニメーション速度
        this.animationTimer = 0;
        this.frameIndex = (this.frameIndex + 1) % this.images.length;
      }
    } else {
      this.frameIndex = 0; // 動いていない場合は静止状態のフレームに戻す
    }
  }
}
