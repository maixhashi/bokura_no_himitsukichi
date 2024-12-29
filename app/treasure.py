import pygame

import pygame

class Treasure:
    def __init__(self, x, y, gravity):
        self.x = x
        self.y = y
        self.gravity = gravity
        self.image_closed = pygame.image.load("assets/treasures/treasure_box.png")  # 閉じた宝箱の画像
        self.image_opened = pygame.image.load("assets/treasures/treasure_box_opened.png")  # 開いた宝箱の画像
        self.image = self.image_closed
        self.on_ground = False  # 地面にいるかどうか
        self.width = self.image.get_width()
        self.height = self.image.get_height()
        self.is_opened = False  # 宝箱が開いているかどうか

    def draw(self, screen, camera):
        """宝箱を描画"""
        screen.blit(self.image, (self.x - camera.x, self.y - camera.y))

    def update(self, map_instance, clock, TILE_SIZE):
        """宝箱の落下処理"""
        # 地面にいるか確認
        self.on_ground, new_y = map_instance.is_on_ground(self.x, self.y, self.height)
        if not self.on_ground:
            # 地面にいない場合、重力を適用して落下
            self.y += self.gravity
        else:
            # 地面にいる場合、位置を修正
            self.y = new_y

    def open(self):
        """宝箱を開ける処理"""
        if not self.is_opened:
            self.is_opened = True
            self.image = self.image_opened  # 開いた画像に切り替え
            self.drop_reward()  # 報酬処理

    def drop_reward(self):
        """報酬をドロップ"""
        print("報酬をドロップしました！")  # 実際にはアイテムを生成する処理を実装

    def handle_event(self, event):
        """イベント処理"""
        if event.type == pygame.MOUSEBUTTONDOWN:
            # マウスクリック位置が宝箱の範囲内なら開く
            mouse_x, mouse_y = event.pos
            if (
                self.x <= mouse_x <= self.x + self.width
                and self.y <= mouse_y <= self.y + self.height
            ):
                self.open()
