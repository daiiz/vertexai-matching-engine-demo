# vertexai-matching-engine-demo

## Create a new Index

```sh
$ PROJECT=xxxxx sh create-index.sh
```

## Create a new IndexEndpoint

[Public endpoint](https://cloud.google.com/vertex-ai/docs/matching-engine/deploy-index-public#deploy_index_default-drest)

```sh
$ sh create-index-endpoint.sh
```

## Deploy Index

```sh
$ sh deploy-index.sh
```

## Experiments

```sh
$ cp sample.env .env
$ node create-index.js
```
