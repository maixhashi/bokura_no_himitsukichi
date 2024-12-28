class Camera:
    def __init__(self, map_width, map_height):
        self.x = 0
        self.y = 0
        self.width = map_width
        self.height = map_height

    def update(self, target, screen_width, screen_height):
        """ターゲット（キャラクター）を中心にカメラを移動"""
        self.x = max(0, min(target.x - screen_width // 2, self.width - screen_width))
        self.y = max(0, min(target.y - screen_height // 2, self.height - screen_height))
