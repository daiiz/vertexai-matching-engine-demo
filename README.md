# vertexai-matching-engine-demo

## Create a new Index

Ref. #5

```sh
$ sh create-stream-index.sh
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

## Undeploy Index

```sh
$ INDEX_ENDPOINT="projects/349.../locations/us-central1/indexEndpoints/689..." sh undeploy-index.sh
```

## Search

Run query in Node.js

```sh
$ node client/search.js "夕飯何にしよう"
```

## Upsert datapoints

Upsert datapoints in Node.js

```sh
$ node client/upsert.js "ステーキ食べたい"
```

![](https://gyazo.com/e8bf1732952cdca7cb75678f2d81b424/raw)

## Experiments

```sh
$ cp sample.env .env
$ node create-index.js
```
