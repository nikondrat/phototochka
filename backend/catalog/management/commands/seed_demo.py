import os
from pathlib import Path
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.core.files import File
from catalog.models import Category, Photo

User = get_user_model()

class Command(BaseCommand):
    help = "Наполняет базу демо-данными из папки frontend/src/assets/images"

    def handle(self, *args, **options):
        # 1. Создаем админа
        admin_email = os.environ.get("SEED_ADMIN_EMAIL", "admin@example.com")
        admin_password = os.environ.get("SEED_ADMIN_PASSWORD", "admin-password")
        
        admin, created = User.objects.get_or_create(
            username="admin",
            defaults={
                "email": admin_email,
                "role": User.Role.ADMIN,
                "display_name": "Главный Админ"
            }
        )
        if created:
            admin.set_password(admin_password)
            admin.save()
            self.stdout.write(self.style.SUCCESS(f"Создан админ: {admin_email}"))

        # 2. Категории
        categories_data = [
            {"name": "Природа", "slug": "nature"},
            {"name": "Архитектура", "slug": "architecture"},
            {"name": "Люди", "slug": "people"},
            {"name": "Технологии", "slug": "tech"},
        ]
        categories = {}
        for cat_data in categories_data:
            cat, _ = Category.objects.get_or_create(name=cat_data["name"], defaults={"slug": cat_data["slug"]})
            categories[cat_data["slug"]] = cat

        # 3. Фотографии из фронтенда
        # Путь: graduation/backend/catalog/management/commands/seed_demo.py -> parents[4] = graduation/
        repo_root = Path(__file__).resolve().parents[4]
        images_dir = repo_root / "frontend" / "src" / "assets" / "images"
        
        if not images_dir.exists():
            self.stdout.write(self.style.ERROR(f"Папка с изображениями не найдена: {images_dir}"))
            return

        image_files = list(images_dir.glob("*.jpg"))
        for i, img_path in enumerate(image_files):
            public_id = img_path.stem
            if Photo.objects.filter(public_id=public_id).exists():
                continue

            # Определяем категорию по индексу для разнообразия
            cat_slugs = list(categories.keys())
            category = categories[cat_slugs[i % len(cat_slugs)]]

            with open(img_path, "rb") as f:
                photo = Photo(
                    public_id=public_id,
                    title=public_id.replace("-", " ").title(),
                    description=f"Красивое фото из категории {category.name}",
                    category=category,
                    orientation=Photo.Orientation.LANDSCAPE,
                    author=admin,
                    price=(i + 1) * 100,
                    tags=[category.slug, "demo", "seed"],
                    license_types=["personal", "commercial"]
                )
                photo.image.save(f"{public_id}.jpg", File(f), save=True)
                self.stdout.write(self.style.SUCCESS(f"Добавлено фото: {public_id}"))

        self.stdout.write(self.style.SUCCESS("Сидирование успешно завершено!"))
