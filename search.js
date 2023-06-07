require("dotenv").config();
// まだv1beta1にしか存在しない
const { MatchServiceClient } = require("@google-cloud/aiplatform").v1beta1;

const { PROJECT_ID, LOCATION, SERVICE_ACCOUNT, INDEX_ENDPOINT, INDEX_ID } =
  process.env;

const clientOptions = {
  apiEndpoint: "us-central1-aiplatform.googleapis.com",
  credentials: JSON.parse(SERVICE_ACCOUNT),
};
const client = new MatchServiceClient(clientOptions);

async function findNeighbors() {
  // FindNeighborsRequest
  const request = {
    indexEndpoint: INDEX_ENDPOINT,
    return_full_datapoint: true,
    // Query[]
    queries: [
      {
        // IndexDatapoint
        datapoint: {
          datapoint_id: "query",
          feature_vector: [0.5, 0.3, 0.2],
          // Restriction[]
          restricts: [],
        },
        neighbor_count: 1,
      },
    ],
  };

  const [response] = await client.findNeighbors(request);
  // Error: 12 UNIMPLEMENTED: Operation is not implemented, or supported, or enabled.
  // まじか！？
  console.log("[findNeighbors]", response);
}

async function main() {
  await findNeighbors();
}

main();
