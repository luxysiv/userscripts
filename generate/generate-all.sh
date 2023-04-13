#!/usr/bin/env bash 
set -euo pipefail 


echo "::group::Generating cosmetic filter script"
cd cosmetic
bash ./generate.sh
cd ..
echo "::endgroup::"
