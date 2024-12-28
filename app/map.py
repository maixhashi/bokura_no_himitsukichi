import pygame

# タイル画像の読み込み
ground_tile = pygame.image.load('assets/tiles/ground.png')
digged_ground_tile = pygame.image.load('assets/tiles/digged_ground.png')
underground_tile = pygame.image.load('assets/tiles/underground.png')

rockceiling_soilwall_rockfloor = pygame.image.load('assets/tiles/rockceiling_soilwall_rockfloor.png')
rockceiling_soilwall = pygame.image.load('assets/tiles/rockceiling_soilwall.png')
soilwall_rockfloor = pygame.image.load('assets/tiles/soilwall_rockfloor.png')
soilwall = pygame.image.load('assets/tiles/soilwall.png')

# タイルサイズ
TILE_SIZE = 128


class Map:
    def __init__(self, map_data, tile_size):
        self.map_data = map_data
        self.tile_size = tile_size
        self.ground_mid_height = tile_size // 2  # タイルの中心を計算

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

                if tile == 1:
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

    def dig_tile(self, x, y, direction, bocchama_width, bocchama_height, speed):
        print(f"dig_tile called with direction={direction}, dig_x={x}, dig_y={y}")

        """タイルを掘る"""
        dig_x = (x + bocchama_width // 2) // self.tile_size
        dig_y = (y + bocchama_height // 2) // self.tile_size

        if direction == "right":
            dig_x = (x + bocchama_width + speed) // self.tile_size
        elif direction == "left":
            dig_x = (x - speed) // self.tile_size
        elif direction == "down":
            dig_y = (y + bocchama_height + speed) // self.tile_size

        print(f"tile ID: {self.map_data[dig_y][dig_x]}")

        # tile [0]: 空
        # tile [1]: ground_tile
        # tile [2]: underground_tile
        # tile [3]: underground_tileを掘った後のtile
        # tile [4]: digged_ground_tile
        # tile [5]: soilwall_rockfloor (digged_ground_tileの下)
        # tile [7]: soilwall (残された床)

        if 0 <= dig_y < len(self.map_data) and 0 <= dig_x < len(self.map_data[0]):
            if self.map_data[dig_y][dig_x] == 1:
                # 掘られたground_tileをdigged_ground_tileに変更
                self.map_data[dig_y][dig_x] = 4
            elif self.map_data[dig_y][dig_x] == 2:
                # 地下タイルを掘った場合、背景タイルに変更
                self.map_data[dig_y][dig_x] = 3
            elif self.map_data[dig_y][dig_x] == 4 and direction == "down":
                # 掘られた後のground_tileから地下タイルに変更
                if dig_y + 1 < len(self.map_data):
                    if self.map_data[dig_y + 1][dig_x] == 0:  # 空のタイルを確認
                        self.map_data[dig_y + 1][dig_x] = 5
            elif self.map_data[dig_y][dig_x] == 5:
                # soilwall_rockfloor を掘った場合、soilwall に変更
                print(f"Tile at ({dig_y}, {dig_x}) is 5. Changing to 7.")
                self.map_data[dig_y][dig_x] = 7
                # 下に新しい行が必要な場合は追加
                if dig_y + 1 == len(self.map_data):
                    self.map_data.append([0] * len(self.map_data[0]))
        elif direction == "down" and dig_y >= len(self.map_data):
            self.map_data.append([0] * len(self.map_data[0]))


    def check_collision(self, x, y, bocchama_width, bocchama_height, direction, speed):
        """進行方向に衝突するタイルがあるか確認"""
        top_y = y // TILE_SIZE  # キャラクターの上部タイル
        bottom_y = (y + bocchama_height - 1) // TILE_SIZE  # キャラクターの下部タイル

        # 進行方向のタイル位置を計算
        if direction == "left":
            check_x = (x - speed) // TILE_SIZE  # 左方向
        elif direction == "right":
            check_x = (x + bocchama_width + speed - 1) // TILE_SIZE  # 右方向
        else:
            return False  # 上下方向は衝突判定しない

        # 足元のタイルがtile 1かどうかを確認
        foot_x = x // TILE_SIZE
        foot_y = (y + bocchama_height) // TILE_SIZE
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

        # 衝突なし
        return False

    def is_on_ground(self, x, y, height):
      """キャラクターが地面に接地しているか確認"""
      foot_x = x // self.tile_size
      foot_y = (y + height) // self.tile_size

      if 0 <= foot_y < len(self.map_data) and 0 <= foot_x < len(self.map_data[0]):
          tile = self.map_data[foot_y][foot_x]

          # タイルが1の場合の処理
          if tile == 1 and y + height <= (foot_y * self.tile_size + self.ground_mid_height):
              return True, foot_y * self.tile_size + self.ground_mid_height - height

          # タイルが2の場合の処理
          elif tile == 2:
              return True, foot_y * self.tile_size - height

      # 接地していない場合
      return False, y