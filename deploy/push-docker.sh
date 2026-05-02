#!/usr/bin/env bash
set -x
set -o errexit
set -o nounset
set -o pipefail

SSH_KEY=~/lenovo2025.pem
SSH_HOST=rfc@mouse
REMOTE_DIR=/home/rfc/davet
IMAGE_NAME=davet-bot
IMAGE_TAR="${IMAGE_NAME}.tar"

echo "Building Docker image..."
docker build --platform linux/arm64 -t "$IMAGE_NAME" .

echo "Saving image to tarball..."
docker save "$IMAGE_NAME" -o "$IMAGE_TAR"

echo "Copying files to $SSH_HOST..."
scp -i "$SSH_KEY" "$IMAGE_TAR" docker-compose.yml .env "$SSH_HOST":"$REMOTE_DIR"/

echo "Loading image and starting service on $SSH_HOST..."
ssh -i "$SSH_KEY" "$SSH_HOST" bash -s <<'EOF'
cd /home/rfc/davet
docker load -i davet-bot.tar
docker compose up -d
rm davet-bot.tar
EOF

rm "$IMAGE_TAR"
echo "Done."
