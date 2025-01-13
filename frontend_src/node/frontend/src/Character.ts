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
    const currentImage = this.images[this.frameIndex];
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
    console.log(`move() called with keys:`, keys); // 呼び出し確認
  
    let isMoving = false;
  
    // 左への移動
    if (
      keys["ArrowLeft"] &&
      !mapInstance.checkCollision(this.x, this.y, this.width, this.height, "left", this.speed)
    ) {
      this.x -= this.speed;
      this.facingLeft = true;
      isMoving = true;
      console.log(`Moving left to x: ${this.x}`);
    }
  
    // 右への移動
    if (
      keys["ArrowRight"] &&
      !mapInstance.checkCollision(this.x, this.y, this.width, this.height, "right", this.speed)
    ) {
      this.x += this.speed;
      this.facingLeft = false;
      isMoving = true;
      console.log(`Moving right to x: ${this.x}`);
    }
  
    // 接地判定
    const [onGround, newY] = mapInstance.isOnGround(this.x, this.y, this.height);
    this.onGround = onGround;
    if (this.onGround) {
      console.log(`Character is on the ground. Adjusting y to: ${newY}`);
      this.y = newY;
    } else {
      console.log(`Character is not on the ground. Applying gravity.`);
      this.y += this.gravity;
    }
  
    // アニメーション更新
    if (isMoving) {
      console.log(`Character is moving. Updating animation.`);
      this.animationTimer += 1;
      if (this.animationTimer >= 10) {
        this.animationTimer = 0;
        this.frameIndex = (this.frameIndex + 1) % this.images.length;
        console.log(`Animation frame updated to: ${this.frameIndex}`);
      }
    } else {
      console.log(`Character is not moving.`);
    }
  }
  
  
}
