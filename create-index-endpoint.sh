#!/bin/bash

# Public Endpoint の IndexEndpoint を作成する
# 参考: https://zenn.dev/google_cloud_jp/articles/getting-started-matching-engine

curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  "https://us-central1-aiplatform.googleapis.com/v1/projects/$(gcloud config get project)/locations/us-central1/indexEndpoints" \
  -d '{"display_name": "my-demo-index-22", "publicEndpointEnabled": true}'
