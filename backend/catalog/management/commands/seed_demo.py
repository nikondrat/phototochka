import os
from pathlib import Path

from django.contrib.auth import get_user_model
from django.core.files import File
from django.core.management.base import BaseCommand
from django.db import transaction

from catalog.models import Category, Photo, Orientation
from blog.models import Post
from catalog.tasks import process_photo_media

User = get_user_model()

class Command(BaseCommand):
    help = "Наполняет базу демо-данными из папки frontend/src/assets/images"

    def handle(self, *args, **options):
        # 1. Создаем админа
        admin_email = "admin@example.com"
        admin_password = "12345678"
        
        admin, created = User.objects.get_or_create(
            username="admin",
            defaults={
                "email": admin_email,
                "role": User.Role.ADMIN,
                "display_name": "Администратор"
            }
        )
        admin.set_password(admin_password)
        admin.save()
        self.stdout.write(self.style.SUCCESS(f"Админ обновлен: {admin_email} / {admin_password}"))

        # 1.1 Создаем демонстрационного автора
        author_username = "nik"
        author, created = User.objects.get_or_create(
            username=author_username,
            defaults={
                "email": "nik@example.com",
                "role": User.Role.AUTHOR,
                "display_name": "Nik Photo",
                "bio": "Профессиональный фотограф-путешественник. Снимаю мир во всех его проявлениях.",
                "website": "https://nik-photo.com",
                "instagram": "nik_photo"
            }
        )
        author.set_password("12345678")
        author.save()
        self.stdout.write(self.style.SUCCESS(f"Автор обновлен: {author_username} / 12345678"))

        # 1.2 Создаем личный аккаунт (покупатель)
        me_username = "me"
        me, created = User.objects.get_or_create(
            username=me_username,
            defaults={
                "email": "me@example.com",
                "role": User.Role.BUYER,
                "display_name": "Мой Аккаунт"
            }
        )
        me.set_password("12345678")
        me.save()
        self.stdout.write(self.style.SUCCESS(f"Личный аккаунт обновлен: {me_username} / 12345678"))

        # 2. Категории и Ориентации
        categories_data = [
            {"name": "Природа", "slug": "nature", "name_en": "Nature"},
            {"name": "Архитектура", "slug": "architecture", "name_en": "Architecture"},
            {"name": "Люди", "slug": "people", "name_en": "People"},
            {"name": "Технологии", "slug": "tech", "name_en": "Technology"},
        ]
        categories = {}
        for cat_data in categories_data:
            cat, _ = Category.objects.update_or_create(
                slug=cat_data["slug"], 
                defaults={
                    "name": cat_data["name"],
                    "name_ru": cat_data["name"],
                    "name_en": cat_data["name_en"]
                }
            )
            categories[cat_data["slug"]] = cat

        orientations_data = [
            {"name": "Горизонтальная", "slug": "landscape", "name_en": "Landscape"},
            {"name": "Вертикальная", "slug": "portrait", "name_en": "Portrait"},
            {"name": "Квадратная", "slug": "square", "name_en": "Square"},
        ]
        orientations = {}
        for o_data in orientations_data:
            obj, _ = Orientation.objects.update_or_create(
                slug=o_data["slug"],
                defaults={
                    "name": o_data["name"],
                    "name_ru": o_data["name"],
                    "name_en": o_data["name_en"]
                }
            )
            orientations[o_data["slug"]] = obj

        # 3. Фотографии из демо-пака (в Docker мапится в /app/demo_images)
        images_dir = Path("/app/demo_images")
        if not images_dir.exists():
            # Fallback для локального запуска без Docker
            repo_root = Path(__file__).resolve().parents[4]
            images_dir = repo_root / "frontend" / "src" / "assets" / "images"
        
        if not images_dir.exists():
            self.stdout.write(self.style.ERROR(f"Папка с изображениями не найдена: {images_dir}"))
            return

        image_files = list(images_dir.glob("*.jpg"))
        for i, img_path in enumerate(image_files):
            public_id = img_path.stem
            
            # Обновляем автора у существующих фото, если они были привязаны к админу
            existing_photo = Photo.objects.filter(public_id=public_id).first()
            if existing_photo:
                if existing_photo.author == admin:
                    existing_photo.author = author
                    existing_photo.save()
                    self.stdout.write(self.style.SUCCESS(f"Обновлен автор для фото: {public_id} -> {author_username}"))
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
                    orientation=orientations["landscape"],
                    author=author,
                    price=(i + 1) * 100,
                    tags=[category.slug, "demo", "seed"],
                    license_types=["personal", "commercial"]
                )
                photo.image.save(f"{public_id}.jpg", File(f), save=True)
                self.stdout.write(self.style.SUCCESS(f"Добавлено фото: {public_id}"))
                pid = photo.pk
                transaction.on_commit(
                    lambda p=pid: process_photo_media.delay(p)
                )

        self.stdout.write(self.style.SUCCESS(f"Добавлено {len(image_files)} фото."))

        # 4. Блог
        posts_data = [
            {
                "title": "Как снимать в горах",
                "title_en": "How to shoot in mountains",
                "slug": "mountain-photography",
                "content": "### Советы по съемке\n\n1. Используйте поляризационный фильтр.\n2. Вставайте пораньше.",
                "content_en": "### Tips for shooting\n\n1. Use a polarizing filter.\n2. Get up early."
            },
            {
                "title": "Тренды архитектурной фотографии 2026",
                "title_en": "Architecture Photography Trends 2026",
                "slug": "arch-trends-2026",
                "content": "Минимализм и брутализм возвращаются в моду...",
                "content_en": "Minimalism and brutalism are back in style..."
            }
        ]
        for p_data in posts_data:
            post, created = Post.objects.get_or_create(
                slug=p_data["slug"],
                defaults={
                    "title": p_data["title"],
                    "title_ru": p_data["title"],
                    "title_en": p_data["title_en"],
                    "content": p_data["content"],
                    "content_ru": p_data["content"],
                    "content_en": p_data["content_en"],
                    "author": author,
                    "is_published": True
                }
            )
            if not created and post.author == admin:
                post.author = author
                post.save()
                self.stdout.write(self.style.SUCCESS(f"Обновлен автор для поста: {post.title} -> {author_username}"))
            
            if created:
                self.stdout.write(self.style.SUCCESS(f"Добавлен пост: {post.title}"))

        self.stdout.write(self.style.SUCCESS("Сидирование успешно завершено!"))
