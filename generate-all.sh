#!/usr/bin/env bash 
set -euo pipefail 


echo "::group::Generating cosmetic filter script"
cd ./generate/cosmetic
bash ./generate.sh
cd ..
echo "::endgroup::"

git config --global user.email "${GITHUB_ACTOR_ID}+${GITHUB_ACTOR}@users.noreply.github.com"
git config --global user.name "$(gh api /users/${GITHUB_ACTOR} | jq .name -r)"
git add cosmetic.user.js || error "Failed to add the userscript to repo"
git commit -m "Update userscript" --author=. || error "Failed to commit the userscript to repo"
git push origin main || error "Failed to push the userscript to repo"
