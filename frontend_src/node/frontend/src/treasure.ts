import { Map } from "./map";
import { Camera } from "./camera";
import axiosInstance from "./utils/axiosInstance";
import { store } from './store'; // Reduxストアをインポート
import { fetchCurrentUser } from './features/auth/authSlice';

export class Treasure {
  public x: number;
  public y: number;
  private gravity: number;
  private imageClosed: HTMLImageElement;
  private imageOpened: HTMLImageElement;
  private image: HTMLImageElement;
  public rewardImage: HTMLImageElement;
  private width: number;
  private height: number;
  private isOpened: boolean;
  private blinkCounter: number;

  constructor(x: number, y: number, gravity: number, rewardImage: HTMLImageElement) {
    this.x = x;
    this.y = y;
    this.gravity = gravity;
    this.imageClosed = this.loadImage("assets/treasures/treasure_box.png");
    this.imageOpened = this.loadImage("assets/treasures/treasure_box_opened.png");
    this.image = this.imageClosed;
    this.rewardImage = rewardImage;
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
      context.drawImage(this.image, this.x - camera.getX(), this.y - camera.getY());
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

  async open(rewardImage: HTMLImageElement, gameMap: Map): Promise<void> {
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
  
      // userId の取得時に null チェックを追加
      const userId = currentUser?.id;
      if (!userId) {
        console.error("User ID is missing.");
        return;
      }
  
      // RewardImageからmovie_poster_idを取得
      const moviePosterId = rewardImage.dataset.moviePosterId;
  
      if (moviePosterId) {
        try {
          const response = await axiosInstance.post("/rewards/collect", {
            movie_poster_id: moviePosterId,
            user_id: userId,
          });
  
          if (response.status === 200) {
            console.log(response.data.message);
            gameMap.getCollectedRewards().push(rewardImage); // ここで Map.collectedRewards に追加
          } else {
            console.error("Failed to collect reward");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    }
  }
  
  updateBlink(): void {
    if (this.isOpened && this.blinkCounter > 0) {
      this.blinkCounter--;
    }
  }

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
  
        // 描画
        ctx.drawImage(reward, x, y, size, size);
      } else {
        console.warn(
          `Reward image is not ready to draw or is undefined: ${reward?.src || "undefined"}`
        );
      }
    });
  }

  getRewardImage(){
    return this.rewardImage;
  }
}
