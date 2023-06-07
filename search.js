require("dotenv").config();
const fetch = require("node-fetch");
const { GoogleAuth } = require("google-auth-library");
const {
  SERVICE_ACCOUNT,
  INDEX_ENDPOINT_NAME,
  INDEX_ENDPOINT_PUBLIC_DOMAIN_NAME,
  INDEX_ID,
} = process.env;

const auth = new GoogleAuth({
  scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  credentials: JSON.parse(SERVICE_ACCOUNT || "{}"),
});

/**
 * Query indexes to get nearest neighbors
 * https://cloud.google.com/vertex-ai/docs/matching-engine/query-index-public-endpoint
 * いまはこれを生で叩くしかないのでは？
 */
async function findNeighbors() {
  const token = await auth.getAccessToken();
  let apiUri = `https://${INDEX_ENDPOINT_PUBLIC_DOMAIN_NAME}/v1beta1`;
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
            feature_vector: [0.5, 0.3, 0.2],
            // Restriction[]
            restricts: [
              { namespace: "class", allow_list: ["cat", "dog"] },
              // { namespace: "category", allow_list: ["feline"] },
            ],
          },
          neighbor_count: 30,
        },
      ],
    }),
  });

  if (res.ok) {
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.error("error", res.status, await res.text());
  }
}

async function main() {
  await findNeighbors();
}

main();
