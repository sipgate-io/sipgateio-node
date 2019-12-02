#!/usr/bin/env sh

grep '"version":' package.json | sed -e 's/\(.*\),/{\1}/' > lib/version.json
git add lib/version.json