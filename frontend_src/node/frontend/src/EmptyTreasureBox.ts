import { Map } from "./map";

export class EmptyTreasureBox {
  private x: number;
  private y: number;
  private gravity: number;
  private imageClosed: HTMLImageElement;
  private imageOpened: HTMLImageElement;
  private image: HTMLImageElement;
  private width: number;
  private height: number;
  private isOpened: boolean;
  private blinkCounter: number;

  constructor(x: number, y: number, gravity: number) {
    this.x = x;
    this.y = y;
    this.gravity = gravity;
    this.imageClosed = this.loadImage("assets/treasures/treasure_box.png");
    this.imageOpened = this.loadImage("assets/treasures/treasure_box_opened.png");
    this.image = this.imageClosed;
    this.width = this.imageClosed.width;
    this.height = this.imageClosed.height;
    this.isOpened = false;
    this.blinkCounter = 0;
  }

  private loadImage(src: string): HTMLImageElement {
    const img = new Image();
    img.src = src;
    return img;
  }

  draw(context: CanvasRenderingContext2D, camera: Camera): void {
    if (!this.isOpened || (this.isOpened && this.blinkCounter % 10 < 5)) {
      context.drawImage(this.image, this.x - camera.x, this.y - camera.y);
    }
  }

  draw_on_toppage(context: CanvasRenderingContext2D, x: number, y: number): void {
    this.x = x; // クリック判定のためにx座標を更新
    this.y = y; // クリック判定のためにy座標を更新

    this.width = 500
    this.height = 500
  
    context.save(); // 現在の描画状態を保存
  
    // 描画位置を基準にスケールを反転（-1で反転）
    context.translate(x + this.width / 2, y + this.height / 2); // 中心点に移動
    context.scale(-1, 1); // X軸方向に反転
    context.translate(-(x + this.width / 2), -(y + this.height / 2)); // 元の位置に戻す
  
    if (!this.isOpened) {
      context.drawImage(this.image, x, y, this.width, this.height);
    } else {
      context.drawImage(this.imageOpened, x, y, this.width, this.height);
    }
  
    context.restore(); // 描画状態を元に戻す
  }
    
  update(mapInstance: Map): void {
    const [isOnGround, newY] = mapInstance.isOnGround(this.x, this.y, this.height);
    if (isOnGround) {
      this.y = newY; // 接地している場合、Y座標を修正
    } else {
      this.y += this.gravity; // 重力を適用
    }
  }

  async open(): Promise<void> {
    if (!this.isOpened) {
      this.isOpened = true;
      this.image = this.imageOpened;
      this.blinkCounter = 30;
    }
  }

  handleEvent(event: MouseEvent): void {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    if (
      this.x <= mouseX &&
      mouseX <= this.x + this.width &&
      this.y <= mouseY &&
      mouseY <= this.y + this.height
    ) {
      this.open();
    }
  }

  updateBlink(): void {
    if (this.isOpened && this.blinkCounter > 0) {
      this.blinkCounter--;
    }
  }   
}
