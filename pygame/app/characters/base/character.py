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
        self.current_image = self.images[0]
        self.width = self.current_image.get_width()
        self.height = self.current_image.get_height()
        self.facing_left = False

    def draw(self, screen, camera):
        current_image = self.images[self.frame_index]
        if self.facing_left:
            current_image = pygame.transform.flip(current_image, True, False)
        screen.blit(current_image, (self.x - camera.x, self.y - camera.y))

    def move(self, keys, map_instance, TILE_SIZE, clock):
        is_moving = False

        if keys[pygame.K_LEFT] and not map_instance.check_collision(
            self.x, self.y, self.width, self.height, "left", self.speed
        ):
            self.x -= self.speed
            self.facing_left = True
            is_moving = True

        if keys[pygame.K_RIGHT] and not map_instance.check_collision(
            self.x, self.y, self.width, self.height, "right", self.speed
        ):
            self.x += self.speed
            self.facing_left = False
            is_moving = True

        self.on_ground, new_y = map_instance.is_on_ground(self.x, self.y, self.height)
        if self.on_ground:
            self.y = new_y
        else:
            self.y += self.gravity

        if is_moving:
            self.animation_timer += clock.get_time()
            if self.animation_timer >= 60:
                self.animation_timer = 0
                self.frame_index = (self.frame_index + 1) % len(self.images)
