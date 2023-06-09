#!/bin/bash

curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  "https://us-central1-aiplatform.googleapis.com/v1/projects/$(gcloud config get project)/locations/us-central1/indexes" \
  -d @metadata/my-index-ada-002.json
