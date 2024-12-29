import pygame

class Treasure:
    def __init__(self, x, y, gravity):
        self.x = x
        self.y = y
        self.gravity = gravity
        self.image = pygame.image.load("assets/treasures/treasure_box.png")  # 宝箱の画像をロード
        self.on_ground = False  # 地面にいるかどうか
        self.width = self.image.get_width()
        self.height = self.image.get_height()

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
