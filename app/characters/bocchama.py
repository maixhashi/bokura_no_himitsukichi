import pygame
from characters.base.character import Character

class Bocchama(Character):
    def __init__(self, x, y, speed, gravity):
        # ボッチャマの画像をロード
        images = [
            pygame.image.load('assets/characters/bocchama_running_start.png'),
            pygame.image.load('assets/characters/bocchama_running_end.png')
        ]
        super().__init__(images, x, y, speed, gravity)

    def special_action(self, keys, event, treasures, map_instance):
        """Bocchama専用のアクション"""
        if keys[pygame.K_UP] and keys[pygame.K_SPACE]:
            print("Bocchama performed a special jump action!")

        # 宝箱を開ける処理
        if event.type == pygame.KEYDOWN and event.key == pygame.K_SPACE:
            self.open_treasure_box(treasures)

    def dig(self, keys, map_instance):
        """掘削処理"""
        if keys[pygame.K_RIGHT] and keys[pygame.K_SPACE]:
            map_instance.dig_tile(self.x, self.y, "right", self.width, self.height, self.speed)
        elif keys[pygame.K_LEFT] and keys[pygame.K_SPACE]:
            map_instance.dig_tile(self.x, self.y, "left", self.width, self.height, self.speed)
        elif keys[pygame.K_DOWN] and keys[pygame.K_SPACE]:
            map_instance.dig_tile(self.x, self.y, "down", self.width, self.height, self.speed)

    def open_treasure_box(self, treasures):
        """宝箱をスペースキーで開く処理"""
        for treasure in treasures:
            # 宝箱との衝突判定
            if (
                self.x < treasure.x + treasure.width
                and self.x + self.width > treasure.x
                and self.y < treasure.y + treasure.height
                and self.y + self.height > treasure.y
            ):
                if not treasure.is_opened:  # 宝箱が既に開いている場合はスキップ
                    treasure.open()
                    print("宝箱を開けました！")
