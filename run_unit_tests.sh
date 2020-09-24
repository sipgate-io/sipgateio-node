#!/bin/bash

nodeVersion=$(node -v)

if [[ $nodeVersion == *"v10"* ]]; then
  npm run test:unit:noDom
else
  npm run test:unit
fi

