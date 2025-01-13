import { Mole } from './mole';

const MOLE_SPAWN_PROBABILITY = 0.03;

export class Map {
    private mapData: number[][];
    private tileSize: number;
    private tileImages: { [key: string]: HTMLImageElement } = {};
    private allImagesLoaded: boolean = false;
    private  moles: Mole[];
  
    constructor(mapData: number[][], tileSize: number) {
      this.mapData = mapData;
      this.tileSize = tileSize;
      this.loadTileImages();
      this.moles = [];
    }
  
    private loadTileImages(): void {
      const tilePaths: { [key: string]: string } = {
        sky: "assets/tiles/sky.png",
        ground: "assets/tiles/ground.png",
        diggedGround: "assets/tiles/digged_ground.png",
        underground: "assets/tiles/underground.png",
        rockCeilingSoilWallRockFloor: "assets/tiles/rockceiling_soilwall_rockfloor.png",
        rockCeilingSoilWall: "assets/tiles/rockceiling_soilwall.png",
        soilWallRockFloor: "assets/tiles/soilwall_rockfloor.png",
        soilWall: "assets/tiles/soilwall.png",
      };
  
      const keys = Object.keys(tilePaths);
      let loadedCount = 0;
  
      keys.forEach((key) => {
        const img = new Image();
        img.src = tilePaths[key];
        img.onload = () => {
          loadedCount++;
          if (loadedCount === keys.length) {
            this.allImagesLoaded = true;
          }
        };
        img.onerror = () => {
          console.error(`Failed to load image for key: ${key}`);
        };
        this.tileImages[key] = img;
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
      
          switch (tileType) {
            case 0:
              ctx.drawImage(this.tileImages.sky, tileX, tileY, this.tileSize, this.tileSize);
              break;
            case 1:
              ctx.drawImage(this.tileImages.ground, tileX, tileY, this.tileSize, this.tileSize);
              break;
            case 2:
              ctx.drawImage(this.tileImages.underground, tileX, tileY, this.tileSize, this.tileSize);
              break;
            case 3:
              // 上にタイルがあるかを判定
              const hasTileAbove =
                row > 0 && [1, 2, 5].includes(this.mapData[row - 1][col]);
              // 下にタイルがあるかを判定
              const hasTileBelow =
                row < this.mapData.length - 1 && ![0, 3].includes(this.mapData[row + 1][col]);
      
              if (hasTileAbove && hasTileBelow) {
                ctx.drawImage(
                  this.tileImages.rockCeilingSoilWallRockFloor,
                  tileX,
                  tileY,
                  this.tileSize,
                  this.tileSize
                );
              } else if (hasTileAbove && !hasTileBelow) {
                ctx.drawImage(
                  this.tileImages.rockCeilingSoilWall,
                  tileX,
                  tileY,
                  this.tileSize,
                  this.tileSize
                );
              } else if (!hasTileAbove && hasTileBelow) {
                ctx.drawImage(
                  this.tileImages.soilWallRockFloor,
                  tileX,
                  tileY,
                  this.tileSize,
                  this.tileSize
                );
              } else {
                ctx.drawImage(
                  this.tileImages.soilWall,
                  tileX,
                  tileY,
                  this.tileSize,
                  this.tileSize
                );
              }
              break;
            case 4:
              ctx.drawImage(this.tileImages.diggedGround, tileX, tileY, this.tileSize, this.tileSize);
              break;
            case 5:
              ctx.drawImage(this.tileImages.soilWallRockFloor, tileX, tileY, this.tileSize, this.tileSize);
              break;
            case 7:
              ctx.drawImage(this.tileImages.soilWall, tileX, tileY, this.tileSize, this.tileSize);
              break;
            default:
              break;
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
  
      let checkX: number;
      if (direction === "left") {
        checkX = Math.floor((x - speed) / this.tileSize); // 左方向
      } else if (direction === "right") {
        checkX = Math.floor((x + width + speed - 1) / this.tileSize); // 右方向
      } else {
        return false; // 上下方向は衝突判定しない
      }
  
      const footX = Math.floor(x / this.tileSize);
      const footY = Math.floor((y + height) / this.tileSize);
      const isOnTile1 =
        footY >= 0 &&
        footY < this.mapData.length &&
        footX >= 0 &&
        footX < this.mapData[0].length &&
        this.mapData[footY][footX] === 1;
  
      for (let checkY = topY; checkY <= bottomY; checkY++) {
        if (
          checkY >= 0 &&
          checkY < this.mapData.length &&
          checkX >= 0 &&
          checkX < this.mapData[0].length
        ) {
          const tile = this.mapData[checkY][checkX];
          if (isOnTile1 && tile === 1) {
            continue;
          }
          if (tile === 1 || tile === 2) {
            return true; // 衝突対象タイル
          }
        } else {
          return true; // マップ外を衝突とみなす
        }
      }
  
      return false; // 衝突なし
    }

    // const TREASURE_SPAWN_PROBABILITY = 0.1; // 宝物のスポーン確率
    
    // const rewardImages = ["path/to/image1.png", "path/to/image2.png"]; // 報酬画像のパスリスト
    
    digTile(
        x: number, 
        y: number, 
        direction: string, 
        bocchamaWidth: number, 
        bocchamaHeight: number, 
        speed: number, 
        rewardImagePath: string
      ) {
        const tileSize = this.tileSize; // タイルサイズ
        let digX = Math.floor((x + Math.floor(bocchamaWidth / 2)) / tileSize);
        let digY = Math.floor((y + Math.floor(bocchamaHeight / 2)) / tileSize);
      
        // 移動方向に応じて掘削座標を調整
        if (direction === "right") {
          digX = Math.floor((x + bocchamaWidth + speed) / tileSize);
        } else if (direction === "left") {
          digX = Math.floor((x - speed) / tileSize);
        } else if (direction === "down") {
          digY = Math.floor((y + bocchamaHeight + speed) / tileSize);
        }
      
        // 掘削範囲チェック
        if (digY >= 0 && digY < this.mapData.length && digX >= 0 && digX < this.mapData[0].length) {
          console.log(`Tile ID before digging: ${this.mapData[digY][digX]}`);
      
          // タイル変更ロジック (既存の掘削処理)
          const targetTile = this.mapData[digY][digX];
          if (targetTile === 1) {
            this.mapData[digY][digX] = 4; // 掘削済み地面
          } else if (targetTile === 2) {
            this.mapData[digY][digX] = 3; // 掘削済み地下
      
            // モグラをスポーン
            if (Math.random() < MOLE_SPAWN_PROBABILITY) {
              const moleX = digX * tileSize;
              const moleY = digY * tileSize;
              const mole = new Mole(moleX, moleY, 2, 5); // speed: 2, gravity: 5
              this.moles.push(mole);
              console.log(`Mole spawned at (${moleX}, ${moleY})`);
            }
      
            // // 宝物をスポーン
            // if (Math.random() < TREASURE_SPAWN_PROBABILITY) {
            //   const treasureX = digX * tileSize;
            //   const treasureY = digY * tileSize;
            //   const rewardImage = rewardImages[Math.floor(Math.random() * rewardImages.length)];
            //   const treasure = new Treasure(treasureX, treasureY, 5, rewardImage); // gravity: 5
            //   this.treasures.push(treasure);
            //   console.log(`Treasure spawned at (${treasureX}, ${treasureY})`);
            // }
          } else if (targetTile === 4 && direction === "down") {
            if (digY + 1 < this.mapData.length && this.mapData[digY + 1][digX] === 0) {
              this.mapData[digY + 1][digX] = 5; // 新しいタイルを設定
            }
          } else if (targetTile === 5) {
            this.mapData[digY][digX] = 7;
            if (digY + 1 === this.mapData.length) {
              this.mapData.push(new Array(this.mapData[0].length).fill(0));
            }
          }
        } else if (direction === "down" && digY >= this.mapData.length) {
          // 地図範囲外の場合に新しい行を追加
          this.mapData.push(new Array(this.mapData[0].length).fill(0));
        } else {
          console.log(`Tile at (${digX}, ${digY}) is not diggable or out of bounds.`);
        }
      }

      updateMoles(map: any, clock: number, tileSize: number) {
        this.moles.forEach((mole: Mole) => {
          mole.update(map, clock, tileSize);
        });
      }                             
      
  }
  