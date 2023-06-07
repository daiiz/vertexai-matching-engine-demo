#!/bin/bash

# https://cloud.google.com/vertex-ai/docs/matching-engine/using-matching-engine?hl=ja#create-index
gcloud ai indexes list \
  --project=$PROJECT \
  --region=us-central1

gcloud ai indexes create \
  --metadata-file="metadata/my-demo-index.json" \
  --display-name="my-demo-index-22" \
  --project=$PROJECT \
  --region=us-central1
