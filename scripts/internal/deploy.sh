#!/bin/bash

# ==============================================================================
# PhotoTochka VDS Deployment Script (Remote Build Mode)
# ==============================================================================

set -e

# Always run from repo root
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$ROOT"

# Load environment variables
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

if [ -z "${PHOTO_DEPLOY_HOST:-}" ]; then
    echo "❌ Error: PHOTO_DEPLOY_HOST not set in .env"
    exit 1
fi

PHOTO_DEPLOY_USER=${PHOTO_DEPLOY_USER:-"root"}
PHOTO_DEPLOY_PATH=${PHOTO_DEPLOY_PATH:-"/opt/phototochka"}

echo "🚀 Starting remote deployment to $PHOTO_DEPLOY_USER@$PHOTO_DEPLOY_HOST..."

# 1. Prepare VDS directory
echo "🧹 Preparing VDS directory..."
ssh $PHOTO_DEPLOY_USER@$PHOTO_DEPLOY_HOST "mkdir -p $PHOTO_DEPLOY_PATH"

# 2. Transfer source code (exclude bloat, DBs, secrets, caches)
echo "📤 Synchronizing source code via rsync..."
rsync -avz --progress \
    --exclude='.git/' \
    --exclude='.cursor/' \
    --exclude='docs/' \
    --exclude='frontend/node_modules/' \
    --exclude='frontend/dist/' \
    --exclude='backend/.venv/' \
    --exclude='backend/db.sqlite3' \
    --exclude='backend/media/' \
    --exclude='backend/staticfiles/' \
    --exclude='**/__pycache__/' \
    --exclude='.env' \
    ./ $PHOTO_DEPLOY_USER@$PHOTO_DEPLOY_HOST:$PHOTO_DEPLOY_PATH/

# 2.1 Ensure .env exists on VDS (from .env.example if missing; do not overwrite existing)
echo "📋 Checking .env on VDS..."
if ! ssh $PHOTO_DEPLOY_USER@$PHOTO_DEPLOY_HOST "test -f $PHOTO_DEPLOY_PATH/.env"; then
    echo "   Creating .env from .env.example"
    scp .env.example $PHOTO_DEPLOY_USER@$PHOTO_DEPLOY_HOST:$PHOTO_DEPLOY_PATH/.env
else
    echo "   .env already exists on VDS (unchanged)"
fi

# 3. Remote Build and Deploy
echo "🔨 Building and starting services on VDS..."
ssh $PHOTO_DEPLOY_USER@$PHOTO_DEPLOY_HOST "bash -s" << EOF
    set -e
    cd $PHOTO_DEPLOY_PATH

    echo "🏗️  Building Docker images..."
    DOCKER_BUILDKIT=1 docker compose build

    echo "🚀 Deploying services..."
    docker compose down --remove-orphans || true
    
    # Run migrations and seed data
    echo "🔄 Running database migrations..."
    docker compose run --rm backend python manage.py migrate
    
    echo "🌱 Seeding demo data..."
    docker compose run --rm backend python manage.py seed_demo

    echo "⬆️ Starting containers..."
    docker compose up -d --force-recreate

    echo '📊 Service status:'
    docker compose ps
EOF

echo "✅ Deployment successful!"
echo "📊 App is running at http://$PHOTO_DEPLOY_HOST"
