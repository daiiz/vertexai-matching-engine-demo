#!/bin/bash

# https://cloud.google.com/vertex-ai/docs/matching-engine/using-matching-engine?hl=ja#create-index
gcloud ai indexes list \
  --project=$PROJECT \
  --region=us-central1
