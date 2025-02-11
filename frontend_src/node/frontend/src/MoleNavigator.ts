import { Navigator } from "./Navigator";

export class MoleNavigator extends Navigator {
  private speechTimer: number;
  private speechIndex: number;
  private speeches: string[][];
  private bubbleWidth: number;
  private bubbleHeight: number;
  public facingLeft: boolean;
  private imagesLoaded: boolean;

  constructor() {
    const images = [new Image(), new Image()];
    images[0].src = "assets/characters/mole_running_start.png";
    images[1].src = "assets/characters/mole_running_end.png";
    super(images, 0, 0, 0); // 位置は描画時に設定する

    this.speechTimer = 0;
    this.speechIndex = 0;
    this.speeches = [
      ["スペースキーで", "地面をほることができるよ！"],
      ["お宝、見つかるかな？"],
      ["ポスターを", "クリックしてみよう！"],
    ];
      this.facingLeft = true

    this.bubbleWidth = 280;  // 吹き出しの幅
    this.bubbleHeight = 80;  // 吹き出しの高さ
    this.imagesLoaded = false;

    // 画像がロードされたらフラグを立てる
    let loadedCount = 0;
    images.forEach((img) => {
      img.onload = () => {
        loadedCount++;
        if (loadedCount === images.length) {
          this.imagesLoaded = true;
        }
      };
    });
  }

  update(deltaTime: number) {
    // アニメーションの更新
    this.animationTimer += deltaTime;
    if (this.animationTimer >= 600) {
      this.animationTimer = 0;
      this.frameIndex = (this.frameIndex + 1) % this.images.length;
    }

    // セリフの切り替え
    this.speechTimer += deltaTime;
    if (this.speechTimer >= 10000) { // 3秒ごとに変更
      this.speechTimer = 0;
      this.speechIndex = (this.speechIndex + 1) % this.speeches.length;
    }
  }

  draw(ctx: CanvasRenderingContext2D, screenWidth: number, screenHeight: number) {
    if (!this.imagesLoaded) {
      console.log("MoleNavigator images not loaded yet.");
      return;
    }

    const x = screenWidth - 350;
    const y = screenHeight - 180;
    
    ctx.globalCompositeOperation = "source-over"; // 他のオブジェクトより前面に描画

    // 向きを考慮して描画
    ctx.save();
    if (this.facingLeft) {
        ctx.scale(-1, 1);
        ctx.drawImage(this.images[this.frameIndex], -x - this.images[this.frameIndex].width, y);
    } else {
        ctx.drawImage(this.images[this.frameIndex], x, y);
    }
    ctx.restore();


    // 吹き出しを描画
    this.drawSpeechBubble(ctx, x, y);
  }

  private drawSpeechBubble(ctx: CanvasRenderingContext2D, moleX: number, moleY: number) {
    const padding = 10;
    const lineHeight = 25; // 1行あたりの高さ
    const textX = moleX -100;
    const textY = moleY - this.bubbleHeight - 10;

    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;

    // 吹き出し本体
    ctx.beginPath();
    ctx.roundRect(textX, textY, this.bubbleWidth, this.bubbleHeight, 15);
    ctx.fill();
    ctx.stroke();

    // テキストの描画
    ctx.fillStyle = "black";
    ctx.font = "20px 'PixelFont', Arial";

    // セリフを1行ずつ描画
    const lines = this.speeches[this.speechIndex]; // 配列で管理
    lines.forEach((line, index) => {
        ctx.fillText(line, textX + padding, textY + padding + (index * lineHeight) + 20);
    });
  }

}
