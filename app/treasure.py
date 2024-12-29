import pygame
import random

class Treasure:
    def __init__(self, x, y):
        # 元の画像をロード
        original_image = pygame.image.load('assets/treasures/treasure_box.png')
        # 画像を縮小
        self.width, self.height = 96, 96  # 宝箱の幅と高さ
        self.treasure_box_image = pygame.transform.scale(original_image, (self.width, self.height))
        # 宝箱の位置を調整
        self.x = x
        self.y = y + (128 - self.height)  # 128は元のタイルサイズ
        self.collected = False

    def draw(self, screen, camera):
        """宝箱を描画"""
        if not self.collected:
            screen.blit(self.treasure_box_image, (self.x - camera.x, self.y - camera.y))

    def collect(self):
        """宝箱が収集されたときの処理"""
        self.collected = True
        print("Treasure collected!")
        return {"score": 100}  # スコアなどの効果を返す
