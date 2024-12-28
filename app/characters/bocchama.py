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

    def special_action(self, keys, map_instance):
        """Bocchama専用のアクション"""
        if keys[pygame.K_UP] and keys[pygame.K_SPACE]:
            print("Bocchama performed a special jump action!")

    def dig(self, keys, map_instance):
        """掘削処理"""
        if keys[pygame.K_RIGHT] and keys[pygame.K_SPACE]:
            map_instance.dig_tile(self.x, self.y, "right", self.width, self.height, self.speed)
        elif keys[pygame.K_LEFT] and keys[pygame.K_SPACE]:
            map_instance.dig_tile(self.x, self.y, "left", self.width, self.height, self.speed)
        elif keys[pygame.K_DOWN] and keys[pygame.K_SPACE]:
            map_instance.dig_tile(self.x, self.y, "down", self.width, self.height, self.speed)

