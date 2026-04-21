#!/usr/bin/env bash
set -euo pipefail

# Скрипт для деплоя на Timeweb App Platform
# Инструкция:
# 1. Создайте новое приложение в Timeweb Cloud
# 2. Выберите тип "App Platform"
# 3. Подключите репозиторий
# 4. Корень приложения: backend/
# 5. Build command: pip install -r requirements.txt && python manage.py collectstatic --noinput
# 6. Start command: gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000}

echo "Для деплоя на Timeweb просто запушьте код в основную ветку репозитория."
echo "Убедитесь, что настроены переменные окружения в панели Timeweb:"
echo " - DJANGO_SECRET_KEY"
echo " - DATABASE_URL"
echo " - CORS_ALLOWED_ORIGINS (URL вашего фронтенда)"
echo " - DJANGO_DEBUG=0"
