require("dotenv").config();
const fetch = require("node-fetch");
const { GoogleAuth } = require("google-auth-library");
const { genEmbedding } = require("./tools/gen-embedding");
const { SERVICE_ACCOUNT, INDEX_NAME } = process.env;

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
async function upsertDatapoints(texts = []) {
  const token = await auth.getAccessToken();
  const apiUri = `https://us-central1-aiplatform.googleapis.com/v1/${INDEX_NAME}:upsertDatapoints`;

  const datapoints = [];
  for (const text of texts) {
    datapoints.push({
      datapoint_id: text,
      feature_vector: await genEmbedding(text, true),
      restricts: [
        { namespace: "appname", allow_list: ["demo"] },
        { namespace: "username", allow_list: ["daiiz"] },
        {
          namespace: "visible",
          allow_list: [
            // 驚いているものはプライベート
            text.endsWith("!") || text.endsWith("！") ? "private" : "public",
          ],
        },
      ],
    });
  }

  const res = await fetch(apiUri, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ datapoints }),
  });

  if (res.ok) {
    console.log("OK!", await res.json());
  } else {
    console.error(res.status, await res.text());
  }
}

async function main() {
  console.log("newText:", rawInputText);
  await upsertDatapoints([rawInputText]);
}

main();
