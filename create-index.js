/**
 * 参考:
 * https://www.npmjs.com/package/@google-cloud/aiplatform
 */
require("dotenv").config();
const {
  EndpointServiceClient,
  IndexServiceClient,
} = require("@google-cloud/aiplatform");

const { PROJECT_ID, LOCATION, SERVICE_ACCOUNT } = process.env;

const clientOptions = {
  apiEndpoint: "us-central1-aiplatform.googleapis.com",
  credentials: JSON.parse(SERVICE_ACCOUNT),
};

const parent = `projects/${PROJECT_ID}/locations/${LOCATION}`;

const client = new EndpointServiceClient(clientOptions);
const indexClient = new IndexServiceClient(clientOptions);

// https://github.com/googleapis/google-cloud-node/blob/main/packages/google-cloud-aiplatform/samples/generated/v1/index_service.create_index.js
// https://cloud.google.com/vertex-ai/docs/reference/rest/v1/projects.locations.indexes#Index
async function createIndex() {
  const request = {
    parent,
    index: {
      displayName: "my-demo-index",
      indexUpdateMethod: "STREAM_UPDATE",
      description: "My frist index",
      metadata: {
        contentsDeltaUri: "gs://my-demo-embbeddings/",
        config: {
          dimensions: 1536,
          shardSize: "SHARD_SIZE_SMALL",
        },
      },
    },
  };
  console.log("[createIndex] request", JSON.stringify(request, null, 2));
  const [operation] = await indexClient.createIndex(request);
  const [response] = await operation.promise();
  console.log("[createIndex]", response);
}

async function listEndpoints() {
  const request = {
    parent,
  };
  const [result] = await client.listEndpoints(request);
  for (const endpoint of result) {
    console.log(`\nEndpoint name: ${endpoint.name}`);
    console.log(`Display name: ${endpoint.displayName}`);
    if (endpoint.deployedModels[0]) {
      console.log(`First deployed model: ${endpoint.deployedModels[0].model}`);
    }
  }
}

async function main() {
  // await createIndex(); // 動かない
  // listEndpoints();
}

main();
