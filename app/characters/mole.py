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
