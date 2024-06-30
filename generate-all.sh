#!/usr/bin/env bash 
set -euo pipefail

# Tự định nghĩa lệnh error
error() {
    echo "$1"
    exit 1
}

echo "::group::Generating cosmetic filter script"
cd ./generate/cosmetic || error "Failed to change directory to ./generate/cosmetic"
bash ./generate.sh || error "Failed to execute generate.sh"
cd .. || error "Failed to change directory back"
echo "::endgroup::"
ls

# Kiểm tra sự tồn tại của cosmetic.user.js
if [ ! -f "cosmetic.user.js" ]; then
    error "cosmetic.user.js not found"
fi

git config --global user.email "${GITHUB_ACTOR_ID}+${GITHUB_ACTOR}@users.noreply.github.com" || error "Failed to set git user email"
git config --global user.name "$(gh api /users/${GITHUB_ACTOR} | jq .name -r)" || error "Failed to set git user name"
git add cosmetic.user.js || error "Failed to add the userscript to repo"
git commit -m "Update userscript" --author=. || error "Failed to commit the userscript to repo"
git push origin main || error "Failed to push the userscript to repo"
