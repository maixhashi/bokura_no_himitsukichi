import pygame
import sys

# 各クラスのインポート
from map import Map, map_data  # map_data をインポート
from camera import Camera
from characters.bocchama import Bocchama
from treasure import Treasure

# Pygame初期化
pygame.init()

# 定数
GAME_NAME = "ぼくらのひみつきち"
SCREEN_WIDTH, SCREEN_HEIGHT = 1600, 800
TILE_SIZE = 128
WHITE = (255, 255, 255)
FPS = 60

# 画面設定
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption(GAME_NAME)
clock = pygame.time.Clock()

# オブジェクト生成
game_map = Map(map_data, TILE_SIZE)  # インポートした map_data を利用
bocchama = Bocchama(x=0, y=TILE_SIZE // 2, speed=5, gravity=5)

# 宝箱の設定
treasure = Treasure(300, 100, 5, "assets/rewards/movie_poster.png")
game_map.treasures.append(treasure)
collected_rewards = []  # 収集済みアイテム

def main():
    # マップ全体のサイズを基にカメラを初期化
    camera = Camera(
        map_width=len(game_map.map_data[0]) * TILE_SIZE,
        map_height=len(game_map.map_data) * TILE_SIZE
    )

    running = True
    while running:
        screen.fill(WHITE)
        
        # イベント処理
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            
            if event.type == pygame.KEYDOWN and event.key == pygame.K_SPACE:
                bocchama.open_treasure_box(TILE_SIZE, game_map.treasures, collected_rewards)
            
        # キー入力
        keys = pygame.key.get_pressed()
        
        # Bocchamaの動作
        bocchama.move(keys, game_map, TILE_SIZE, clock)
        bocchama.dig(keys, game_map)

        # モグラの更新
        game_map.update_moles(clock, TILE_SIZE)
        game_map.update_treasures(clock, TILE_SIZE)

        # カメラを更新
        camera.update(bocchama, SCREEN_WIDTH, SCREEN_HEIGHT)

        # マップとキャラクターの描画
        game_map.draw(screen, camera)
        bocchama.draw(screen, camera)

        # モグラを描画
        for mole in game_map.moles:
            mole.draw(screen, camera)
        
        # 宝箱を描画
        for treasure in game_map.treasures:
            treasure.update_blink()
            treasure.draw(screen, camera)

        # 収集済みアイテムを描画
        game_map.draw_collected_rewards(screen, collected_rewards)

        # 画面更新
        pygame.display.flip()
        clock.tick(FPS)

    pygame.quit()
    sys.exit()

if __name__ == "__main__":
    main()
