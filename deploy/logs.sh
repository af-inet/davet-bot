
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

ssh -i "$SSH_KEY" "$SSH_HOST" "cd $REMOTE_DIR; docker compose logs -f bot"
