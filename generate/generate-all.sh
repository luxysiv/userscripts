#!/usr/bin/env bash 
set -euo pipefail 

echo "::group::Generating cosmetic filter script"
cd cosmetic
bash ./generate.sh
cd ..
echo "::endgroup::"

# Using GitHub Actions environment variables directly
git config --global user.email "${GITHUB_ACTOR}@users.noreply.github.com"
user_name=$(gh api /users/${GITHUB_REPOSITORY_OWNER} | jq .name -r)
git config --global user.name "${user_name}"

git add cosmetic.user.js || { echo "Failed to add the userscript to repo"; exit 1; }
git commit -m "Update userscript" --author="${user_name} <${{ secrets.GITHUB_EMAIL }}>" || { echo "Failed to commit the userscript to repo"; exit 1; }
git push origin main || { echo "Failed to push the userscript to repo"; exit 1; }
