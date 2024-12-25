import pygame
import sys

# Pygame初期化
pygame.init()

# 画面サイズ
SCREEN_WIDTH, SCREEN_HEIGHT = 800, 600
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("ぼくらのひみつきち")

# 色定義
WHITE = (255, 255, 255)

# ゲームのFPS設定
clock = pygame.time.Clock()
FPS = 60

# タイルデータの読み込み
ground_tile = pygame.image.load('assets/tiles/ground.png')
underground_tile = pygame.image.load('assets/tiles/underground.png')

# キャラクター画像の読み込み
bocchama_images = [
    pygame.image.load('assets/characters/bocchama_running_start.png'),
    pygame.image.load('assets/characters/bocchama_running_end.png')
]
bocchama_width, bocchama_height = bocchama_images[0].get_size()

# アニメーション制御
bocchama_frame_index = 0
animation_timer = 0
ANIMATION_SPEED = 60  # ミリ秒単位でのアニメーション間隔

# マップの設定
TILE_SIZE = 128

# マップデータ
map_data = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
]

# キャラクターの初期位置
bocchama_x = 0
bocchama_y = 2 * TILE_SIZE - bocchama_height
bocchama_speed = 5
gravity = 5
on_ground = False

# 接地判定関数
def check_on_ground(x, y):
    global on_ground
    foot_x = x // TILE_SIZE
    foot_y = (y + bocchama_height) // TILE_SIZE
    ground_mid_height = TILE_SIZE // 2  # タイルの中心を計算

    if foot_y < len(map_data) and foot_x < len(map_data[0]):
        tile = map_data[foot_y][foot_x]
        # タイルが1の場合の処理
        if tile == 1 and y + bocchama_height <= (foot_y * TILE_SIZE + ground_mid_height):
            on_ground = True
            return foot_y * TILE_SIZE + ground_mid_height - bocchama_height
        # タイルが2の場合の処理
        elif tile == 2:
            on_ground = True
            return foot_y * TILE_SIZE - bocchama_height
    # 接地していない場合
    on_ground = False
    return y


def draw_map(map_data):
    for row_index, row in enumerate(map_data):
        for col_index, tile in enumerate(row):
            if tile == 1:
                screen.blit(ground_tile, (col_index * TILE_SIZE, row_index * TILE_SIZE))
            elif tile == 2:
                screen.blit(underground_tile, (col_index * TILE_SIZE, row_index * TILE_SIZE))
            elif tile == 0:
                pass

def main():
    global bocchama_x, bocchama_y, on_ground, bocchama_frame_index, animation_timer
    running = True

    while running:
        screen.fill(WHITE)

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False

        keys = pygame.key.get_pressed()
        is_moving = False
        if keys[pygame.K_LEFT]:
            bocchama_x -= bocchama_speed
            is_moving = True
        if keys[pygame.K_RIGHT]:
            bocchama_x += bocchama_speed
            is_moving = True

        bocchama_y = check_on_ground(bocchama_x, bocchama_y)
        if not on_ground:
            bocchama_y += gravity

        if is_moving:
            animation_timer += clock.get_time()
            if animation_timer >= ANIMATION_SPEED:
                animation_timer = 0
                bocchama_frame_index = (bocchama_frame_index + 1) % len(bocchama_images)

        draw_map(map_data)
        current_image = bocchama_images[bocchama_frame_index] if is_moving else bocchama_images[0]
        screen.blit(current_image, (bocchama_x, bocchama_y))

        pygame.display.flip()
        clock.tick(FPS)

    pygame.quit()
    sys.exit()

if __name__ == "__main__":
    main()
