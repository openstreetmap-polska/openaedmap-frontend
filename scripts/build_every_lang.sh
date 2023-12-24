#!/usr/bin/env bash
set -eu
LANG_PLACEHOLDER=LANG_PLACEHOLDER
VITE_DEFAULT_LANG=$LANG_PLACEHOLDER
npm run build -- --outDir build/$VITE_DEFAULT_LANG --base "/$VITE_DEFAULT_LANG"

for lang in public/locales/*; do
    lang=$(basename "$lang")
    if [[ $lang = "debug" ]]; then
        continue
    fi
    echo "Generating $lang"
    cp -r "build/$LANG_PLACEHOLDER" "build/$lang"
    sed -i -- "s/$LANG_PLACEHOLDER/$lang/g" "build/$lang/index.html" "build/$lang/assets"/*
done
rm -rf "build/$LANG_PLACEHOLDER"
