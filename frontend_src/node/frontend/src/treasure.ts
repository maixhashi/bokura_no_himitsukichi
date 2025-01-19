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

  constructor(x: number, y: number, gravity: number, rewardImage: HTMLImageElement) {
    this.x = x;
    this.y = y;
    this.gravity = gravity;
    this.imageClosed = this.loadImage("assets/treasures/treasure_box.png");
    this.imageOpened = this.loadImage("assets/treasures/treasure_box_opened.png");
    this.image = this.imageClosed;
    this.rewardImage = rewardImage;
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

  draw(context: CanvasRenderingContext2D, camera: Camera): void {
  // draw(context: CanvasRenderingContext2D): void {
    if (!this.isOpened || (this.isOpened && this.blinkCounter % 10 < 5)) {
      context.drawImage(this.image, this.x - camera.x, this.y - camera.y);
      // context.drawImage(this.image, this.x, this.y);
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

  dropReward(collectedRewards?: HTMLImageElement[]): void {
    if (!collectedRewards) {
      console.warn("collectedRewards is undefined. Cannot drop reward.");
      return;
    }
  
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

  // static drawCollectedRewards(
  //   context: CanvasRenderingContext2D,
  //   collectedRewards: HTMLImageElement[]
  // ): void {
    //   const xOffset = 1300;
    //   const yOffset = 10;
    //   collectedRewards.forEach((reward, idx) => {
      //     context.drawImage(reward, xOffset - idx * 5, yOffset + idx * 5);
      //   });
      // }

    public drawCollectedRewards(
      ctx: CanvasRenderingContext2D,
      collectedRewards: HTMLImageElement[]
    ): void {
      const baseX = 10; // 描画開始位置（X座標）
      const baseY = 10; // 描画開始位置（Y座標）
      const size = 100; // 画像サイズ（幅と高さ）
      const offsetX = 5; // 各アイテム間のX方向のオフセット
      const offsetY = 5;  // 各アイテム間のY方向のオフセット
    
      collectedRewards.forEach((reward, index) => {
        if (reward && reward.complete && reward.naturalWidth > 0) {
          const x = baseX + index * offsetX; // 左方向にずらす
          const y = baseY + index * offsetY; // 下方向にずらす
    
          // 画像のファイル名を取得
          const imageName = reward.src.split('/').pop() || "Unknown";
    
          // 描画
          ctx.drawImage(reward, x, y, size, size);
        } else {
          console.warn(
            `Reward image is not ready to draw or is undefined: ${reward?.src || "undefined"}`
          );
        }
      });
    }
      
}
