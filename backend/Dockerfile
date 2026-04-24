FROM python:3.12-slim

# Установка системных зависимостей
RUN apt-get update && apt-get install -y --no-install-recommends \
    libjpeg62-turbo \
    zlib1g \
    libpq-dev \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Зависимости: используем кеширование pip для ускорения повторных билдов
ENV PIP_DEFAULT_TIMEOUT=120
ARG PIP_INDEX_URL=
COPY requirements.txt .
RUN --mount=type=cache,target=/root/.cache/pip \
    if [ -n "$PIP_INDEX_URL" ]; then \
      pip config set global.index-url "$PIP_INDEX_URL"; \
    fi \
    && pip install --retries=10 --default-timeout=600 --no-cache-dir \
       --trusted-host pypi.org --trusted-host files.pythonhosted.org --trusted-host pypi.python.org \
       -r requirements.txt

# Копирование кода
COPY . .


# Настройка переменных окружения
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=config.settings

# Сборка статики и запуск (в проде)
# Для dev используем docker-compose command override
EXPOSE 8000

CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
