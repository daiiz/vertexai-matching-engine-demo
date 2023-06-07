require("dotenv").config();
const { GoogleAuth } = require("google-auth-library");
const { PROJECT_ID, LOCATION, SERVICE_ACCOUNT, INDEX_ENDPOINT, INDEX_ID } =
  process.env;
// const { google } = require("googleapis");

const auth = new GoogleAuth({
  scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  credentials: JSON.parse(SERVICE_ACCOUNT || "{}"),
});

// const client = google.aiplatform("v1");
// const auth = new google.auth.GoogleAuth({
//   scopes: ["https://www.googleapis.com/auth/cloud-platform"],
//   credentials: JSON.parse(SERVICE_ACCOUNT || "{}"),
// });

/**
 * https://cloud.google.com/vertex-ai/docs/matching-engine/query-index-public-endpoint
 * いまはこれを生で叩くしかないのでは？
 */
async function findNeighbors() {
  const token = await auth.getAccessToken();
}

async function main() {
  await findNeighbors();
}

main();
