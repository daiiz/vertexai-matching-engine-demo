require("dotenv").config();
const fetch = require("node-fetch");
const { GoogleAuth } = require("google-auth-library");
const { saveStreamingData } = require("./utils");
const { genEmbedding } = require("../tools/gen-embedding-palm");
const { SERVICE_ACCOUNT, INDEX_NAME } = process.env;

const streamingOutDir = "./sampledata/text768/streaming"; // gen-embedding-palm
const rawInputText = process.argv[2];
const willRemove = process.argv[3] === "remove";

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
  const datapoints = [];
  for (const text of texts) {
    const embedding = await genEmbedding(text, true);
    const restricts = [
      { namespace: "appname", allow_list: ["demo"] },
      { namespace: "username", allow_list: ["daiiz"] },
      {
        namespace: "visible",
        allow_list: [
          // 驚いているものはプライベート
          text.endsWith("!") || text.endsWith("！") ? "private" : "public",
        ],
      },
    ];

    datapoints.push({
      datapoint_id: text,
      feature_vector: embedding,
      restricts,
    });

    // 永続化: ファイルに書き出しておく
    await saveStreamingData(text, embedding, restricts, streamingOutDir);
  }

  // Upsert to existing index
  const token = await auth.getAccessToken();
  const apiUri = `https://us-central1-aiplatform.googleapis.com/v1/${INDEX_NAME}:upsertDatapoints`;
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

/**
 * Remove Data points
 * https://cloud.google.com/vertex-ai/docs/matching-engine/update-rebuild-index#remove_datapoints
 */
async function removeDatapoints(texts = []) {
  const token = await auth.getAccessToken();
  const apiUri = `https://us-central1-aiplatform.googleapis.com/v1/${INDEX_NAME}:removeDatapoints`;

  const res = await fetch(apiUri, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ datapoint_ids: [...texts] }),
  });

  if (res.ok) {
    console.log("OK!", await res.json());
  } else {
    console.error(res.status, await res.text());
  }
}

async function main() {
  if (willRemove) {
    console.log("removeDatapoint:", rawInputText);
    await removeDatapoints([rawInputText]);
  } else {
    console.log("upsertDatapoint:", rawInputText);
    await upsertDatapoints([rawInputText]);
  }
}

main();
