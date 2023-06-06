/**
 * 参考:
 * https://www.npmjs.com/package/@google-cloud/aiplatform
 */
require("dotenv").config();
const { EndpointServiceClient } = require("@google-cloud/aiplatform");

const { PROJECT_ID, LOCATION } = process.env;

const clientOptions = {
  apiEndpoint: "us-central1-aiplatform.googleapis.com",
  credentials: JSON.parse(process.env.SERVICE_ACCOUNT),
};

const client = new EndpointServiceClient(clientOptions);

async function listEndpoints() {
  const parent = `projects/${PROJECT_ID}/locations/${LOCATION}`;
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

listEndpoints();
