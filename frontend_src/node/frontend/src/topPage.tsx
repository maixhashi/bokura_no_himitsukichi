import React, { useEffect, useRef } from 'react';
import Layout from './Layout';
import { Map } from "./map";
import { Link } from 'react-router-dom';
import { Bocchama } from './Bocchama';
import './TopPage.css';

const TopPage: React.FC = () => {
  const TILE_SIZE = 500;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bocchamaRef = useRef<Bocchama | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    canvas.width = 1600;
    canvas.height = 500;
  
    // マップデータの初期化
    const mapData = [
      [2, 2, 2, 2, 2, 2],
      [2, 2, 2, 2, 2, 2],
    ];
    const map = new Map(mapData, TILE_SIZE);
  
    // Bocchamaの初期化
    const bocchama = new Bocchama(100, 70, 7, 0); // x, y, speed, gravity
    bocchamaRef.current = bocchama;
  
    const FPS = 60;
    let animationFrameId: number;
  
    // アニメーションループ
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Canvasをクリア
  
      // マップを描画
      map.draw(ctx, 0, 0, canvas.width, canvas.height);
  
      // Bocchamaを更新
      const previousX = bocchama.x; // 前回の位置を保存
      bocchama.updatePosition(canvas.width); // Bocchamaの位置を更新
  
      // Bocchamaの進行方向に掘削処理を実行
      if (bocchama.x > previousX) {
        // Bocchamaが右に進んでいる場合のみ掘削
        map.digTile(
          bocchama.x,
          bocchama.y,
          'right', // 掘削方向
          bocchama.width,
          bocchama.height,
          bocchama.speed,
          '' // 報酬画像のパス
        );
      }
  
      // Bocchamaを描画
      bocchama.updateAnimation(FPS); // アニメーションの更新
      bocchama.draw_on_toppage(ctx, 0, 0);
  
      animationFrameId = requestAnimationFrame(loop);
    };
    loop();
  
    // クリーンアップ処理
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
    
  return (
    <Layout>
      <div className="container-toppage">
        <div className='game-title pixel-font-shape-bit'>
          movieDIG!
        </div>
        <div>
          <Link to="/game">
            <button className="button-game-start pixel-font">
              {/* ボタン内に画像を配置 */}
              <img
                src="/assets/icon_art/treasure_box_and_movie_poster.png"
                alt="Tresure Box and Movie Poster"
                className="button-icon"
              />
              ゲームスタート
              <img
                src="/assets/icon_art/scop_and_movie_crapper.png"
                alt="Scop and Movie Crapper"
                className="button-icon"
              />
            </button>
          </Link>
        </div>
      </div>
      <canvas ref={canvasRef} className='canvas-toppage' />
    </Layout>
  );
};

export default TopPage;
