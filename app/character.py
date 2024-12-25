import pygame

class Character:
    def __init__(self, images, x, y, speed, gravity):
      self.images = images
      self.x = x
      self.y = y
      self.speed = speed
      self.gravity = gravity
      self.frame_index = 0
      self.animation_timer = 0
      self.on_ground = False

    def draw(self, screen):
      """キャラクターを描画する"""
      current_image = self.images[self.frame_index]
      screen.blit(current_image, (self.x, self.y))

    def move(self, keys, map_instance, TILE_SIZE, clock):
      """キャラクターを移動する"""
      is_moving = False

      # 左方向の移動
      if keys[pygame.K_LEFT] and not map_instance.check_collision(
          self.x, self.y, self.images[0].get_width(), self.images[0].get_height(), "left", self.speed
      ):
          self.x -= self.speed
          is_moving = True

      # 右方向の移動
      if keys[pygame.K_RIGHT] and not map_instance.check_collision(
          self.x, self.y, self.images[0].get_width(), self.images[0].get_height(), "right", self.speed
      ):
          self.x += self.speed
          is_moving = True

      # 接地判定と重力
      self.on_ground, new_y = map_instance.is_on_ground(self.x, self.y, self.images[0].get_height())
      if self.on_ground:
          self.y = new_y
      else:
          self.y += self.gravity

      # アニメーション
      if is_moving:
          self.animation_timer += clock.get_time()
          if self.animation_timer >= 60:  # 60ms間隔でアニメーション
              self.animation_timer = 0
              self.frame_index = (self.frame_index + 1) % len(self.images)

    def dig(self, keys, map_instance):
        """掘削処理"""
        if keys[pygame.K_RIGHT] and keys[pygame.K_SPACE]:
            map_instance.dig_tile(self.x, self.y, "right", self.images[0].get_width(), self.images[0].get_height(), self.speed)
        elif keys[pygame.K_LEFT] and keys[pygame.K_SPACE]:
            map_instance.dig_tile(self.x, self.y, "left", self.images[0].get_width(), self.images[0].get_height(), self.speed)
        elif keys[pygame.K_DOWN] and keys[pygame.K_SPACE]:
            map_instance.dig_tile(self.x, self.y, "down", self.images[0].get_width(), self.images[0].get_height(), self.speed)

    def check_on_ground(self, map_instance, TILE_SIZE):
        """接地判定"""
        foot_x = self.x // TILE_SIZE
        foot_y = (self.y + self.images[0].get_height()) // TILE_SIZE
        ground_mid_height = TILE_SIZE // 2  # タイルの中心を計算

        if foot_y < len(map_instance.map_data) and foot_x < len(map_instance.map_data[0]):
            tile = map_instance.map_data[foot_y][foot_x]
            # タイルが1の場合の処理
            if tile == 1 and self.y + self.images[0].get_height() <= (foot_y * TILE_SIZE + ground_mid_height):
                self.on_ground = True
                return foot_y * TILE_SIZE + ground_mid_height - self.images[0].get_height()
            # タイルが2の場合の処理
            elif tile == 2:
                self.on_ground = True
                return foot_y * TILE_SIZE - self.images[0].get_height()
        # 接地していない場合
        self.on_ground = False
        return self.y
