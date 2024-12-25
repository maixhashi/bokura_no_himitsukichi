import pygame

# タイル画像の読み込み
ground_tile = pygame.image.load('assets/tiles/ground.png')
underground_tile = pygame.image.load('assets/tiles/underground.png')

# タイルサイズ
TILE_SIZE = 128

class Map:
    def __init__(self, map_data, tile_size):
        self.map_data = map_data
        self.tile_size = tile_size
        self.ground_mid_height = tile_size // 2  # タイルの中心を計算

    def draw(self, screen):
        """マップを描画する"""
        for row_index, row in enumerate(self.map_data):
            for col_index, tile in enumerate(row):
                if tile == 1:
                    screen.blit(ground_tile, (col_index * TILE_SIZE, row_index * TILE_SIZE))
                elif tile == 2:
                    screen.blit(underground_tile, (col_index * TILE_SIZE, row_index * TILE_SIZE))

    def dig_tile(self, x, y, direction, bocchama_width, bocchama_height, speed):
        """タイルを掘る"""
        dig_x = (x + bocchama_width // 2) // TILE_SIZE
        dig_y = (y + bocchama_height // 2) // TILE_SIZE

        if direction == "right":
            dig_x = (x + bocchama_width + speed) // TILE_SIZE
        elif direction == "left":
            dig_x = (x - speed) // TILE_SIZE
        elif direction == "down":
            dig_y = (y + bocchama_height + speed) // TILE_SIZE

        if 0 <= dig_y < len(self.map_data) and 0 <= dig_x < len(self.map_data[0]):
            if self.map_data[dig_y][dig_x] in [1, 2]:
                self.map_data[dig_y][dig_x] = 0
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