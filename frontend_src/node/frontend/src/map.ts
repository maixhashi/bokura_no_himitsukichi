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

  draw(
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
    const endCol = Math.min(this.mapData[0].length, Math.ceil((cameraX + screenWidth) / this.tileSize));
    const startRow = Math.max(0, Math.floor(cameraY / this.tileSize));
    const endRow = Math.min(this.mapData.length, Math.ceil((cameraY + screenHeight) / this.tileSize));

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
}
