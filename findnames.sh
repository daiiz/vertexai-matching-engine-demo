#!/bin/bash
# このコマンド集かなり便利だ

# Index のリソース名を表示
gcloud ai indexes list \
  --region us-central1 \
  --format "value(displayName,name)"

# IndexEndpoint のリソース名を表示
gcloud ai index-endpoints list \
  --region us-central1 \
  --format "value(displayName,name)"
