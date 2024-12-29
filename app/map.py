import pygame
import random

# クラスのインポート
from characters.mole import Mole  # characters.moleクラスをインポート
from treasure import Treasure  # characters.moleクラスをインポート

# タイル画像の読み込み
sky_tile = pygame.image.load('assets/tiles/sky.png')
ground_tile = pygame.image.load('assets/tiles/ground.png')
digged_ground_tile = pygame.image.load('assets/tiles/digged_ground.png')
underground_tile = pygame.image.load('assets/tiles/underground.png')

rockceiling_soilwall_rockfloor = pygame.image.load('assets/tiles/rockceiling_soilwall_rockfloor.png')
rockceiling_soilwall = pygame.image.load('assets/tiles/rockceiling_soilwall.png')
soilwall_rockfloor = pygame.image.load('assets/tiles/soilwall_rockfloor.png')
soilwall = pygame.image.load('assets/tiles/soilwall.png')

# タイルサイズ
TILE_SIZE = 128
MOLE_SPAWN_PROBABILITY = 0.03
TREASURE_SPAWN_PROBABILITY = 0.01

# マップデータ
map_data = (
    [[0] * 50]
    + [[1] * 50]
    + [[2] * 50 for _ in range(100)]
)

class Map:
    def __init__(self, map_data, tile_size):
        self.map_data = map_data
        self.tile_size = tile_size
        self.ground_mid_height = tile_size // 2  # タイルの中心を計算
        self.moles = []  # モグラのリスト
        self.treasures = []  # 宝箱のリスト

    def draw(self, screen, camera):
        """カメラ座標に基づいてマップを描画"""

        # カメラの範囲に含まれるタイルを計算
        start_col = max(0, (camera.x // self.tile_size))
        end_col = min(len(self.map_data[0]), (camera.x + camera.width) // self.tile_size + 1)
        start_row = max(0, (camera.y // self.tile_size))
        end_row = min(len(self.map_data), (camera.y + camera.height) // self.tile_size + 1)

        # タイルを描画
        for row_index in range(start_row, end_row):
            for col_index in range(start_col, end_col):
                tile = self.map_data[row_index][col_index]
                tile_x = col_index * self.tile_size - camera.x
                tile_y = row_index * self.tile_size - camera.y

                if tile == 0:
                    screen.blit(sky_tile, (tile_x, tile_y))
                elif tile == 1:
                    screen.blit(ground_tile, (tile_x, tile_y))
                elif tile == 2:
                    screen.blit(underground_tile, (tile_x, tile_y))
                elif tile == 3:
                    has_tile_above = (
                        row_index > 0 and self.map_data[row_index - 1][col_index] in [1, 2, 5]
                    )
                    has_tile_below = (
                        row_index < len(self.map_data) - 1 and self.map_data[row_index + 1][col_index] not in [0, 3]
                    )

                    if has_tile_above and has_tile_below:
                        screen.blit(rockceiling_soilwall_rockfloor, (tile_x, tile_y))
                    elif has_tile_above and not has_tile_below:
                        screen.blit(rockceiling_soilwall, (tile_x, tile_y))
                    elif not has_tile_above and has_tile_below:
                        screen.blit(soilwall_rockfloor, (tile_x, tile_y))
                    elif not has_tile_above and not has_tile_below:
                        screen.blit(soilwall, (tile_x, tile_y))
                elif tile == 4:
                    screen.blit(digged_ground_tile, (tile_x, tile_y))
                elif tile == 5:
                    screen.blit(soilwall_rockfloor, (tile_x, tile_y))
                elif tile == 7:
                    screen.blit(soilwall, (tile_x, tile_y))

        # モグラの描画
        for mole in self.moles:
            mole.draw(screen, camera)
        # 宝箱の描画
        for treasure in self.treasures:
            treasure.draw(screen, camera)



    def dig_tile(self, x, y, direction, bocchama_width, bocchama_height, speed):
        """タイルを掘る処理"""
        # デバッグ出力
        print(f"dig_tile called with direction={direction}, x={x}, y={y}")

        # タイル座標を計算 (明示的に整数化)
        dig_x = int((x + bocchama_width // 2) // self.tile_size)
        dig_y = int((y + bocchama_height // 2) // self.tile_size)

        if direction == "right":
            dig_x = int((x + bocchama_width + speed) // self.tile_size)
        elif direction == "left":
            dig_x = int((x - speed) // self.tile_size)
        elif direction == "down":
            dig_y = int((y + bocchama_height + speed) // self.tile_size)

        # 範囲チェック
        if 0 <= dig_y < len(self.map_data) and 0 <= dig_x < len(self.map_data[0]):
            print(f"tile ID before digging: {self.map_data[dig_y][dig_x]}")

            # タイルごとの処理
            if self.map_data[dig_y][dig_x] == 1:
                self.map_data[dig_y][dig_x] = 4
            elif self.map_data[dig_y][dig_x] == 2:
                self.map_data[dig_y][dig_x] = 3
                if random.random() < MOLE_SPAWN_PROBABILITY:
                    mole_x = dig_x * self.tile_size
                    mole_y = dig_y * self.tile_size
                    mole = Mole(mole_x, mole_y, speed=2, gravity=5)
                    self.moles.append(mole)
                    print(f"Mole spawned at ({mole_x}, {mole_y})")
                if random.random() < TREASURE_SPAWN_PROBABILITY:
                    treasure_x = dig_x * self.tile_size
                    treasure_y = dig_y * self.tile_size
                    treasure = Treasure(treasure_x, treasure_y)
                    self.treasures.append(treasure)
                    print(f"Treasure spawned at ({treasure_x}, {treasure_y})")
            elif self.map_data[dig_y][dig_x] == 4 and direction == "down":
                if dig_y + 1 < len(self.map_data) and self.map_data[dig_y + 1][dig_x] == 0:
                    self.map_data[dig_y + 1][dig_x] = 5
            elif self.map_data[dig_y][dig_x] == 5:
                print(f"Tile at ({dig_x}, {dig_y}) is 5. Changing to 7.")
                self.map_data[dig_y][dig_x] = 7
                if dig_y + 1 == len(self.map_data):
                    self.map_data.append([0] * len(self.map_data[0]))
        elif direction == "down" and dig_y >= len(self.map_data):
            self.map_data.append([0] * len(self.map_data[0]))


    def check_collision(self, x, y, bocchama_width, bocchama_height, direction, speed):
        """進行方向に衝突するタイルがあるか確認"""
        top_y = int(y // TILE_SIZE)  # キャラクターの上部タイル
        bottom_y = int((y + bocchama_height - 1) // TILE_SIZE)  # キャラクターの下部タイル

        # 進行方向のタイル位置を計算
        if direction == "left":
            check_x = int((x - speed) // TILE_SIZE)  # 左方向
        elif direction == "right":
            check_x = int((x + bocchama_width + speed - 1) // TILE_SIZE)  # 右方向
        else:
            return False  # 上下方向は衝突判定しない

        # キャラクターが接地しているかを確認
        foot_x = int(x // TILE_SIZE)
        foot_y = int((y + bocchama_height) // TILE_SIZE)
        is_on_tile_1 = (
            0 <= foot_y < len(self.map_data)
            and 0 <= foot_x < len(self.map_data[0])
            and self.map_data[foot_y][foot_x] == 1
        )

        # 縦方向のタイルをチェック（進行方向のみ判定）
        for check_y in range(top_y, bottom_y + 1):
            if 0 <= check_y < len(self.map_data) and 0 <= check_x < len(self.map_data[0]):
                tile = self.map_data[check_y][check_x]
                # 接地している場合、tile 1 を衝突対象から除外
                if is_on_tile_1 and tile == 1:
                    continue
                if tile in [1, 2]:  # 衝突対象タイル
                    return True
            else:
                # マップ外を参照している場合、衝突とみなす
                return True

        # 衝突なし
        return False


    def is_on_ground(self, x, y, height):
        """キャラクターが地面に接地しているか確認"""
        foot_x = int(x // self.tile_size)
        foot_y = int((y + height) // self.tile_size)
        print(f"Debug: foot_x={foot_x}, foot_y={foot_y}, tile_size={self.tile_size}")

        if 0 <= foot_y < len(self.map_data) and 0 <= foot_x < len(self.map_data[0]):
            tile = self.map_data[foot_y][foot_x]
            print(f"Debug: tile={tile}")

            if tile == 1 and y + height <= (foot_y * self.tile_size + self.ground_mid_height):
                return True, foot_y * self.tile_size + self.ground_mid_height - height
            elif tile == 2:
                return True, foot_y * self.tile_size - height

        return False, y

    def update_moles(self, clock, TILE_SIZE):
        for mole in self.moles:
            mole.update(self, clock, TILE_SIZE)  # 各モグラを更新