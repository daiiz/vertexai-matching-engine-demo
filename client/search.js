require("dotenv").config();
const fetch = require("node-fetch");
const { GoogleAuth } = require("google-auth-library");
const { genEmbedding } = require("../tools/gen-embedding-palm");
const {
  SERVICE_ACCOUNT,
  INDEX_ENDPOINT_NAME,
  INDEX_ENDPOINT_PUBLIC_DOMAIN_NAME,
  INDEX_ID,
} = process.env;

const SUMMARY_MODE = false;

const rawInputText = process.argv[2];

if (!rawInputText) {
  console.error("Usage: node search.js <query_text>");
  process.exit(1);
}

const auth = new GoogleAuth({
  scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  credentials: JSON.parse(SERVICE_ACCOUNT || "{}"),
});

/**
 * Query indexes to get nearest neighbors
 * https://cloud.google.com/vertex-ai/docs/matching-engine/query-index-public-endpoint
 * いまはこれを生で叩くしかないのでは？
 */
async function findNeighbors(queryText) {
  const token = await auth.getAccessToken();
  let apiUri = `https://${INDEX_ENDPOINT_PUBLIC_DOMAIN_NAME}/v1`;
  apiUri += `/${INDEX_ENDPOINT_NAME}:findNeighbors`;

  const res = await fetch(apiUri, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    // FindNeighborsRequest
    body: JSON.stringify({
      deployed_index_id: INDEX_ID,
      // return_full_datapoint: true,
      queries: [
        {
          // IndexDatapoint
          datapoint: {
            datapoint_id: "query",
            feature_vector: await genEmbedding(queryText, true),
            // Restriction[]
            restricts: [
              { namespace: "appname", allow_list: ["demo"] },
              { namespace: "username", allow_list: ["daiiz"] },
              {
                namespace: "visible",
                allow_list: ["public", "private"],
              },
            ],
          },
          neighbor_count: 10,
        },
      ],
    }),
  });

  if (res.ok) {
    const data = await res.json();
    console.log("result:");
    if (SUMMARY_MODE) {
      const nearestNeighbors = data.nearestNeighbors[0].neighbors || [];
      for (const neighbor of nearestNeighbors) {
        const { datapoint, distance } = neighbor;
        console.log("\t", datapoint.datapointId, "\t", distance);
      }
    } else {
      console.log(JSON.stringify(data, null, 2));
    }
  } else {
    console.error("error", res.status, await res.text());
  }
}

async function main() {
  console.log("queryText:", rawInputText);
  await findNeighbors(rawInputText);
}

main();
