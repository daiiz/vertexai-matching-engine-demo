#!/bin/bash

gcloud ai indexes delete \
  my-demo-index \
  --project=$PROJECT \
  --region=us-central1
