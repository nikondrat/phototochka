"""
Константы обработки медиа: без магических чисел в tasks и валидациях.
"""

# Максимальный размер загружаемого файла (байты) — 10 МБ
MAX_PHOTO_UPLOAD_BYTES = 10 * 1024 * 1024

# WebP/AVIF в фоне (Pillow)
WEBP_QUALITY = 82
AVIF_QUALITY = 55

# Водяной знак: цвет (R, G, B, A) и относительные отступы
WATERMARK_TEXT = "PhotoTochka"
WATERMARK_FILL = (255, 255, 255, 96)
