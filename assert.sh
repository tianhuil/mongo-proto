#!/usr/bin/sh

for filename in ./src/**/*assert.ts
do
  yarn ts-node "${filename}"
done
