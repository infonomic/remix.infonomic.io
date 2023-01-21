#!/bin/bash

params=("$@")

docker build \
  "${params[@]}" \
  --platform=linux/amd64 \
  --file Dockerfile \
  -t remix-infonomic-io-c6b7:web-1.0.0 .

