export class Map {
  private mapData: number[][];
  private tileSize: number;
  private tileImages: HTMLImageElement[] = [];
  private allImagesLoaded: boolean = false;

  constructor(mapData: number[][], tileSize: number, tilePaths: string[]) {
    this.mapData = mapData;
    this.tileSize = tileSize;
    this.loadTileImages(tilePaths);
  }

  private loadTileImages(tilePaths: string[]): void {
    let loadedCount = 0;

    tilePaths.forEach((path, index) => {
      const img = new Image();
      img.src = path;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === tilePaths.length) {
          this.allImagesLoaded = true;
        }
      };
      img.onerror = () => {
        console.error(`Failed to load image at path: ${path}`);
      };
      this.tileImages[index] = img;
    });
  }

  public draw(
    ctx: CanvasRenderingContext2D,
    cameraX: number,
    cameraY: number,
    screenWidth: number,
    screenHeight: number
  ): void {
    if (!this.allImagesLoaded) {
      console.log("Images are not fully loaded yet.");
      return;
    }

    const startCol = Math.max(0, Math.floor(cameraX / this.tileSize));
    const endCol = Math.min(
      this.mapData[0].length,
      Math.ceil((cameraX + screenWidth) / this.tileSize)
    );
    const startRow = Math.max(0, Math.floor(cameraY / this.tileSize));
    const endRow = Math.min(
      this.mapData.length,
      Math.ceil((cameraY + screenHeight) / this.tileSize)
    );

    for (let row = startRow; row < endRow; row++) {
      for (let col = startCol; col < endCol; col++) {
        const tileType = this.mapData[row][col];
        const tileX = col * this.tileSize - cameraX;
        const tileY = row * this.tileSize - cameraY;

        if (tileType >= 0 && tileType < this.tileImages.length) {
          ctx.drawImage(this.tileImages[tileType], tileX, tileY, this.tileSize, this.tileSize);
        }
      }
    }
  }

  public isOnGround(x: number, y: number, height: number): [boolean, number] {
    const footX = Math.floor(x / this.tileSize);
    const footY = Math.floor((y + height) / this.tileSize);
  
    if (
      footY >= 0 &&
      footY < this.mapData.length &&
      footX >= 0 &&
      footX < this.mapData[0].length
    ) {
      const tile = this.mapData[footY][footX];
  
      if (tile === 1 && y + height <= (footY * this.tileSize + this.tileSize / 2)) {
        return [true, footY * this.tileSize + this.tileSize / 2 - height];
      } else if (tile === 2) {
        return [true, footY * this.tileSize - height];
      }
    }
  
    return [false, y];
  }

  public checkCollision(
    x: number,
    y: number,
    width: number,
    height: number,
    direction: "left" | "right",
    speed: number
  ): boolean {
    const topY = Math.floor(y / this.tileSize); // キャラクターの上部タイル
    const bottomY = Math.floor((y + height - 1) / this.tileSize); // キャラクターの下部タイル
  
    // 進行方向のタイル位置を計算
    let checkX: number;
    if (direction === "left") {
      checkX = Math.floor((x - speed) / this.tileSize); // 左方向
    } else if (direction === "right") {
      checkX = Math.floor((x + width + speed - 1) / this.tileSize); // 右方向
    } else {
      return false; // 上下方向は衝突判定しない
    }
  
    // キャラクターが接地しているかを確認
    const footX = Math.floor(x / this.tileSize);
    const footY = Math.floor((y + height) / this.tileSize);
    const isOnTile1 =
      footY >= 0 &&
      footY < this.mapData.length &&
      footX >= 0 &&
      footX < this.mapData[0].length &&
      this.mapData[footY][footX] === 1;
  
    // 縦方向のタイルをチェック（進行方向のみ判定）
    for (let checkY = topY; checkY <= bottomY; checkY++) {
      if (
        checkY >= 0 &&
        checkY < this.mapData.length &&
        checkX >= 0 &&
        checkX < this.mapData[0].length
      ) {
        const tile = this.mapData[checkY][checkX];
        // 接地している場合、tile 1 を衝突対象から除外
        if (isOnTile1 && tile === 1) {
          continue;
        }
        if (tile === 1 || tile === 2) {
          return true; // 衝突対象タイル
        }
      } else {
        // マップ外を参照している場合、衝突とみなす
        return true;
      }
    }
  
    // 衝突なし
    return false;
  }
    
}
