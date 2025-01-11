import pygame
import random
from characters.base.character import Character

class Mole(Character):
    def __init__(self, x, y, speed, gravity):
        # モグラの画像をロード
        images = [
            pygame.image.load('assets/characters/mole_running_start.png'),
            pygame.image.load('assets/characters/mole_running_end.png')
        ]
        super().__init__(images, x, y, speed, gravity)
        self.dig_timer = 0
        self.ai_timer = 0  # AIの行動タイマー
        self.direction = random.choice(["left", "right"])  # 初期方向をランダムに設定

    def update(self, map_instance, clock, TILE_SIZE):
        """モグラの行動ロジックを更新する"""
        self.ai_timer += clock.get_time()

        if self.ai_timer >= 1000:  # 1秒ごとに行動を切り替え
            self.ai_timer = 0
            self.direction = random.choice(["left", "right", "dig"])  # 左右移動または掘る

        if self.direction == "left" and not map_instance.check_collision(
            self.x, self.y, self.width, self.height, "left", self.speed
        ):
            self.x -= self.speed
            self.facing_left = True
        elif self.direction == "right" and not map_instance.check_collision(
            self.x, self.y, self.width, self.height, "right", self.speed
        ):
            self.x += self.speed
            self.facing_left = False
        elif self.direction == "dig":
            # 掘る動作を実行
            dig_x = self.x // TILE_SIZE
            dig_y = self.y // TILE_SIZE
            # map_instance.dig_tile(dig_x, dig_y, "down", self.width, self.height, self.speed)

        # 重力と地面判定
        self.on_ground, new_y = map_instance.is_on_ground(self.x, self.y, self.height)
        if self.on_ground:
            self.y = new_y
        else:
            self.y += self.gravity

        # アニメーション更新
        self.animation_timer += clock.get_time()
        if self.animation_timer >= 60:
            self.animation_timer = 0
            self.frame_index = (self.frame_index + 1) % len(self.images)
