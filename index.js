/**
 * 参考:
 * https://www.npmjs.com/package/@google-cloud/aiplatform
 */
const { EndpointServiceClient } = require("@google-cloud/aiplatform");
require("dotenv").config();

const { PROJECT_ID, LOCATION } = process.env;

const clientOptions = {
  apiEndpoint: "us-central1-aiplatform.googleapis.com",
};

const client = new EndpointServiceClient(clientOptions);

async function listEndpoints() {
  const parent = `projects/${PROJECT_ID}/locations/${LOCATION}`;
  const request = {
    parent,
  };
  console.log("request: ", request);
  const [result] = await client.listEndpoints(request);
  console.log("result: ", result);
}

listEndpoints();
