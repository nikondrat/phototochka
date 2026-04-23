import io
import logging

from celery import shared_task
from django.core.files.base import ContentFile
from PIL import Image, ImageDraw

from . import media_constants as mc
from .models import Photo

logger = logging.getLogger(__name__)


@shared_task
def process_photo_media(photo_id: int) -> None:
    try:
        photo = Photo.objects.get(pk=photo_id)
    except Photo.DoesNotExist:
        return
    if photo.is_processed:
        return
    if not photo.image or not photo.image.name:
        return

    try:
        with photo.image.open("rb") as f:
            source = f.read()
        buf_in = io.BytesIO(source)
        image_rgba = Image.open(buf_in).convert("RGBA")
    except OSError as e:
        logger.exception("read image %s: %s", photo_id, e)
        return

    draw = ImageDraw.Draw(image_rgba, "RGBA")
    w, h = image_rgba.size
    margin_x = min(10, max(1, w // 64))
    margin_y = min(10, max(1, h // 64))
    draw.text((margin_x, margin_y), mc.WATERMARK_TEXT, fill=mc.WATERMARK_FILL)

    rgb = image_rgba.convert("RGB")

    buf_webp = io.BytesIO()
    rgb.save(buf_webp, format="WEBP", quality=mc.WEBP_QUALITY, method=4)
    buf_webp.seek(0)
    photo.image_webp.save(
        f"{photo.public_id}.webp",
        ContentFile(buf_webp.read()),
        save=False,
    )

    try:
        buf_avif = io.BytesIO()
        rgb.save(buf_avif, format="AVIF", quality=mc.AVIF_QUALITY)
        buf_avif.seek(0)
        photo.image_avif.save(
            f"{photo.public_id}.avif",
            ContentFile(buf_avif.read()),
            save=False,
        )
    except OSError as avif_err:
        logger.info("AVIF not written for photo %s: %s", photo_id, avif_err)

    photo.is_processed = True
    photo.save(
        update_fields=["image_webp", "image_avif", "is_processed"],
    )
