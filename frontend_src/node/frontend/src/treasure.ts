// interface Camera {
//   x: number;
//   y: number;
// }

import { Map } from "./map";

export class Treasure {
  private x: number;
  private y: number;
  private gravity: number;
  private imageClosed: HTMLImageElement;
  private imageOpened: HTMLImageElement;
  private image: HTMLImageElement;
  private rewardImage: HTMLImageElement;
  private onGround: boolean;
  private width: number;
  private height: number;
  private isOpened: boolean;
  private rewardDropped: boolean;
  private blinkCounter: number;

  constructor(x: number, y: number, gravity: number, rewardImagePath: string) {
    this.x = x;
    this.y = y;
    this.gravity = gravity;
    this.imageClosed = this.loadImage("assets/treasures/treasure_box.png");
    this.imageOpened = this.loadImage("assets/treasures/treasure_box_opened.png");
    this.image = this.imageClosed;
    this.rewardImage = this.loadImage(rewardImagePath);
    this.onGround = false;
    this.width = this.imageClosed.width;
    this.height = this.imageClosed.height;
    this.isOpened = false;
    this.rewardDropped = false;
    this.blinkCounter = 0;
  }

  private loadImage(src: string): HTMLImageElement {
    const img = new Image();
    img.src = src;
    return img;
  }

  // draw(context: CanvasRenderingContext2D, camera: Camera): void {
  draw(context: CanvasRenderingContext2D): void {
    if (!this.isOpened || (this.isOpened && this.blinkCounter % 10 < 5)) {
      // context.drawImage(this.image, this.x - camera.x, this.y - camera.y);
      context.drawImage(this.image, this.x, this.y);
    }
  }

  update(mapInstance: Map): void {
    const [isOnGround, newY] = mapInstance.isOnGround(this.x, this.y, this.height);
    if (isOnGround) {
      this.y = newY; // 接地している場合、Y座標を修正
    } else {
      this.y += this.gravity; // 重力を適用
    }
  }

  open(collectedRewards: HTMLImageElement[]): void {
    if (!this.isOpened) {
      this.isOpened = true;
      this.image = this.imageOpened;
      this.blinkCounter = 30;
      this.dropReward(collectedRewards);
    }
  }

  private dropReward(collectedRewards: HTMLImageElement[]): void {
    if (!this.rewardDropped) {
      this.rewardDropped = true;
      collectedRewards.push(this.rewardImage);
    }
  }

  handleEvent(event: MouseEvent, collectedRewards: HTMLImageElement[]): void {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    if (
      this.x <= mouseX &&
      mouseX <= this.x + this.width &&
      this.y <= mouseY &&
      mouseY <= this.y + this.height
    ) {
      this.open(collectedRewards);
    }
  }

  updateBlink(): void {
    if (this.isOpened && this.blinkCounter > 0) {
      this.blinkCounter--;
    }
  }

  static drawCollectedRewards(
    context: CanvasRenderingContext2D,
    collectedRewards: HTMLImageElement[]
  ): void {
    const xOffset = 1300;
    const yOffset = 10;
    collectedRewards.forEach((reward, idx) => {
      context.drawImage(reward, xOffset - idx * 5, yOffset + idx * 5);
    });
  }
}
