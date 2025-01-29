import { Map } from "./map";
import axiosInstance from "./utils/axiosInstance";
import { store } from './store'; // Reduxストアをインポート
import { fetchCurrentUser } from './features/auth/authSlice';

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

  async open(collectedRewards: HTMLImageElement[]): Promise<void> {
    if (!this.isOpened) {
      this.isOpened = true;
      this.image = this.imageOpened;
      this.blinkCounter = 30;
  
      // Reduxストアの状態を直接取得
      let currentUser = store.getState().auth.currentUser;
  
      // currentUserがnullの場合、fetchCurrentUserを実行
      if (!currentUser) {
        console.warn("User is not logged in. Attempting to fetch user...");
        const result = await store.dispatch(fetchCurrentUser() as any); // 型アサーションが必要
        if (result.meta.requestStatus === 'fulfilled') {
          currentUser = store.getState().auth.currentUser; // 状態を更新
        } else {
          console.error("Failed to fetch user.");
          return;
        }
      }
  
      const userId = currentUser.id;
  
      // RewardImageからmovie_poster_idを取得
      const moviePosterId = this.rewardImage.dataset.moviePosterId;
  
      if (moviePosterId) {
        try {
          const response = await axiosInstance.post("/rewards/collect", {
            movie_poster_id: moviePosterId,
            user_id: userId,
          });
  
          if (response.status === 200) {
            console.log(response.data.message);
            collectedRewards.push(this.rewardImage);
          } else {
            console.error("Failed to collect reward");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
  
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
