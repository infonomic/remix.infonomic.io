#!/bin/bash

params=("$@")

docker build \
  "${params[@]}" \
  --platform=linux/amd64 \
  --file Dockerfile \
  -t remix:web-1.0.0 .

