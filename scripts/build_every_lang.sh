#!/usr/bin/env bash
set -eu

for lang in public/locales/*; do
    lang=$(basename "$lang")
    if [[ $lang = "debug" ]]; then
        continue
    fi
    export VITE_DEFAULT_LANG=$lang
    echo "Generating $lang"
    npm run build -- --outDir "build/$lang" --base "/$lang"
done
