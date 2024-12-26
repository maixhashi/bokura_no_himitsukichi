import pygame
import sys
from map import Map
from character import Character

# 初期化
pygame.init()

# 定数
SCREEN_WIDTH, SCREEN_HEIGHT = 1600, 1600
TILE_SIZE = 64  # ズームアウトのためにタイルサイズを小さく
WHITE = (255, 255, 255)
FPS = 60

# 画面設定
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("ぼくらのひみつきち")
clock = pygame.time.Clock()

# マップデータ
map_data = [
    [0] * 50 for _ in range(10)
] + [
    [1] * 50 for _ in range(5)
] + [
    [2] * 50 for _ in range(10)
]

# オブジェクト生成
game_map = Map(map_data, TILE_SIZE)
bocchama = Character(
    images=[
        pygame.image.load('assets/characters/bocchama_running_start.png'),
        pygame.image.load('assets/characters/bocchama_running_end.png')
    ],
    x=0, y=2 * TILE_SIZE - 64, speed=3, gravity=5  # 速度を相対的に調整
)
mole = Character(
    images=[
        pygame.image.load('assets/characters/mole_running_start.png'),
        pygame.image.load('assets/characters/mole_running_end.png')
    ],
    x=0, y=2 * TILE_SIZE - 64, speed=3, gravity=5  # 同上
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
        mole.move(keys, game_map, TILE_SIZE, clock)
        mole.dig(keys, game_map)

        game_map.draw(screen)
        bocchama.draw(screen)
        # mole.draw(screen)

        pygame.display.flip()
        clock.tick(FPS)

    pygame.quit()
    sys.exit()

if __name__ == "__main__":
    main()
