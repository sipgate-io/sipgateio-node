#!/usr/bin/env sh

grep '"version":' package.json | sed -e 's/\(.*\),/{\n\1\n}/' > lib/version.json
git add lib/version.json