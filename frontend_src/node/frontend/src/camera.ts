export class Camera {
  private x: number;
  private y: number;
  private width: number;
  private height: number;

  constructor(mapWidth: number, mapHeight: number) {
    this.x = 0;
    this.y = 0;
    this.width = mapWidth;
    this.height = mapHeight;
  }

  public update(target: { x: number; y: number }, screenWidth: number, screenHeight: number): void {
    // ターゲット（キャラクター）を中心にカメラを移動
    this.x = Math.max(0, Math.min(target.x - Math.floor(screenWidth / 2), this.width - screenWidth));
    this.y = Math.max(0, Math.min(target.y - Math.floor(screenHeight / 2), this.height - screenHeight));
  }

  public getPosition(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }
}

