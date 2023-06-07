require("dotenv").config();
// まだv1beta1にしか存在しない
const { MatchServiceClient } = require("@google-cloud/aiplatform").v1beta1;

const { PROJECT_ID, LOCATION, SERVICE_ACCOUNT, INDEX_ENDPOINT } = process.env;

const clientOptions = {
  apiEndpoint: "us-central1-aiplatform.googleapis.com",
  credentials: JSON.parse(SERVICE_ACCOUNT),
};
const client = new MatchServiceClient(clientOptions);

async function findNeighbors() {
  console.log(".......", client);
}

async function main() {
  await findNeighbors();
}

main();
