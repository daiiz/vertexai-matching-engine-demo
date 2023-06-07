#!/bin/bash

gcloud ai index-endpoints undeploy-index \
  $INDEX_ENDPOINT \
  --deployed-index-id="my_demo_index_22" \
  --region=us-central1
