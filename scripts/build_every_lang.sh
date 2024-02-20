#!/usr/bin/env bash
set -eu

for lang in public/locales/*; do
    lang=$(basename "$lang")
    if [[ $lang = "debug" ]]; then
        continue
    fi
    export VITE_DEFAULT_LANG=$lang
    export VITE_BASE_URL="/$lang/"
    echo "Generating $lang"
    bun run build -- --outDir "build/$lang" --base "/$lang"
done
