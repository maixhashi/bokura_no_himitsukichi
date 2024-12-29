import pygame
import random

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
            map_instance.dig_tile(self.x, self.y, "right", self.width, self.height, self.speed, random.choice(map_instance.reward_images))
        elif keys[pygame.K_LEFT] and keys[pygame.K_SPACE]:
            map_instance.dig_tile(self.x, self.y, "left", self.width, self.height, self.speed, random.choice(map_instance.reward_images))
        elif keys[pygame.K_DOWN] and keys[pygame.K_SPACE]:
            map_instance.dig_tile(self.x, self.y, "down", self.width, self.height, self.speed, random.choice(map_instance.reward_images))

    def open_treasure_box(self, treasures, collected_rewards):
        for treasure in treasures:
            if not treasure.is_opened:  # 未開封の宝箱を開ける
                treasure.open(collected_rewards)
