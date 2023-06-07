require("dotenv").config();
const fetch = require("node-fetch");
const { GoogleAuth } = require("google-auth-library");
const { genEmbedding } = require("./tools/gen-embedding");
const {
  SERVICE_ACCOUNT,
  INDEX_ENDPOINT_NAME,
  INDEX_ENDPOINT_PUBLIC_DOMAIN_NAME,
  INDEX_ID,
} = process.env;

const rawInputText = process.argv[2];

if (!rawInputText) {
  console.error("Usage: node upsert.js <text>");
  process.exit(1);
}

const auth = new GoogleAuth({
  scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  credentials: JSON.parse(SERVICE_ACCOUNT || "{}"),
});

/**
 * Upsert Data points
 * Upsert with restricts
 * https://cloud.google.com/vertex-ai/docs/matching-engine/update-rebuild-index#upsert_with_restricts
 */
async function upsertDatapoint(text) {}

async function main() {
  console.log("newText:", rawInputText);
  // await findNeighbors(rawInputText);
}

main();
