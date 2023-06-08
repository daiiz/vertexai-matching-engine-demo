#!/bin/bash

gcloud ai index-endpoints undeploy-index \
  $INDEX_ENDPOINT \
  --deployed-index-id="my_demo_vecstore" \
  --region=us-central1
