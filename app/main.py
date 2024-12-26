import pygame
import sys

# 各クラスのインポート
from map import Map
from character import Character

# Pygame初期化
pygame.init()

# 定数
GAME_NAME = "ぼくらのひみつきち"
SCREEN_WIDTH, SCREEN_HEIGHT = 1600, 1600
TILE_SIZE = 128
WHITE = (255, 255, 255)
FPS = 60

# 画面設定
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption(GAME_NAME)
clock = pygame.time.Clock()

# マップデータ
map_data = [
    [0] * 50,
    [1] * 50,
    [2] * 50,
    [2] * 50,
    [2] * 50,
    [2] * 50,
    [2] * 50,
    [2] * 50,
    [2] * 50,
]

# オブジェクト生成
game_map = Map(map_data, TILE_SIZE)

bocchama = Character(
    images=[
        pygame.image.load('assets/characters/bocchama_running_start.png'),
        pygame.image.load('assets/characters/bocchama_running_end.png')
    ],
    x=0, y= TILE_SIZE // 2, speed=5, gravity=5
)

def main():
    running = True
    while running:
        screen.fill(WHITE)
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False

        keys = pygame.key.get_pressed()
        bocchama.move(keys, game_map, TILE_SIZE, clock)
        bocchama.dig(keys, game_map)

        game_map.draw(screen)
        bocchama.draw(screen)

        pygame.display.flip()
        clock.tick(FPS)

    pygame.quit()
    sys.exit()

if __name__ == "__main__":
    main()