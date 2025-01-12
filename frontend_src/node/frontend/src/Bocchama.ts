import { Character } from "./Character";

export class Bocchama extends Character {
  isMoving: boolean;

  constructor(x: number, y: number, speed: number, gravity: number) {
    const images = [
      new Image(),
      new Image(),
    ];
    images[0].src = "assets/characters/bocchama_running_start.png";
    images[1].src = "assets/characters/bocchama_running_end.png";
    super(images, x, y, speed, gravity);
    this.isMoving = false;
  }

  move(keys: { [key: string]: boolean }, map: any) {
    // 親クラスの move を呼び出して移動状態を取得
    this.isMoving = super.move(keys, map);
  }

  updateAnimation(FPS: number) {
    // 親クラスの共通ロジックを利用
    super.updateAnimation(FPS, this.isMoving);
  }
}
