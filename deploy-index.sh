#!/bin/bash

curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  "https://us-central1-aiplatform.googleapis.com/v1/$(gcloud ai index-endpoints list --region us-central1 --format 'value(name)'):deployIndex" \
  -d @deploy_index.json
