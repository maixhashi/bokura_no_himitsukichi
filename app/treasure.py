import pygame
import sys

class Treasure:
    def __init__(self, x, y, gravity, reward_image_path):
        self.x = x
        self.y = y
        self.gravity = gravity
        self.image_closed = pygame.image.load("assets/treasures/treasure_box.png")
        self.image_opened = pygame.image.load("assets/treasures/treasure_box_opened.png")
        self.image = self.image_closed
        self.reward_image_path = reward_image_path  # 報酬アイテム（映画ポスター）
        self.reward_image = pygame.image.load(reward_image_path)  # 報酬アイテム（映画ポスター）
        self.on_ground = False
        self.width = self.image.get_width()
        self.height = self.image.get_height()
        self.is_opened = False
        self.reward_dropped = False  # 報酬がドロップ済みか
        self.blink_counter = 0  # 点滅用カウンタ

    def draw(self, screen, camera):
        """宝箱を描画"""
        if not self.is_opened or (self.is_opened and self.blink_counter % 10 < 5):
            # is_opened かつ 点滅が有効な場合のみ描画
            if self.image:  # self.image が None でないことを確認
                screen.blit(self.image, (self.x - camera.x, self.y - camera.y))

    def update(self, map_instance, clock, TILE_SIZE):
        """宝箱の落下処理"""
        if not self.on_ground:
            self.on_ground, new_y = map_instance.is_on_ground(self.x, self.y, self.height)
            if not self.on_ground:
                self.y += self.gravity
            else:
                self.y = new_y

    def open(self, collected_rewards):
        """宝箱を開ける処理"""
        if not self.is_opened:
            self.is_opened = True
            self.image = self.image_opened
            self.blink_counter = 30  # 点滅用カウンタ初期化
            self.drop_reward(collected_rewards)

    def drop_reward(self, collected_rewards):
        """報酬をドロップ"""
        if not self.reward_dropped:
            self.reward_dropped = True
            collected_rewards.append(self.reward_image)  # アイテムをコレクションに追加

    def handle_event(self, event, collected_rewards):
        """イベント処理"""
        if event.type == pygame.MOUSEBUTTONDOWN:
            mouse_x, mouse_y = event.pos
            if (
                self.x <= mouse_x <= self.x + self.width
                and self.y <= mouse_y <= self.y + self.height
            ):
                self.open(collected_rewards)

    def update_blink(self):
        """点滅演出と宝箱を消す処理"""
        if self.is_opened and self.blink_counter > 0:
            self.blink_counter -= 1

    @staticmethod
    def draw_collected_rewards(screen, collected_rewards):
        """画面右上に収集済みのアイテムを描画"""
        x_offset = 10
        y_offset = 10
        for idx, reward in enumerate(collected_rewards):
            screen.blit(reward, (x_offset, y_offset + idx * 50))
