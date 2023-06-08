// node tools/gen-embedding-palm.js こんにちは > "./sampledata/text768/$(uuidgen).json"

require("dotenv").config();
const fetch = require("node-fetch");
const { GoogleAuth } = require("google-auth-library");
const { SERVICE_ACCOUNT, PROJECT_NUMBER } = process.env;

const rawInputText = process.argv[2];

const auth = new GoogleAuth({
  scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  credentials: JSON.parse(SERVICE_ACCOUNT || "{}"),
});

async function genEmbedding(inputText, omitOutput = false) {
  if (!inputText) {
    throw new Error("inputText is required");
  }

  const model = "textembedding-gecko";
  const endpointName = `projects/${PROJECT_NUMBER}/locations/us-central1/publishers/google/models/${model}`;
  const apiUri = `https://us-central1-aiplatform.googleapis.com/v1/${endpointName}:predict`;

  const token = await auth.getAccessToken();

  // PaLM API
  const res = await fetch(apiUri, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      instances: [
        {
          content: inputText,
        },
      ],
    }),
  });

  if (res.ok) {
    const { predictions } = await res.json();
    // 今回は1件のみ
    const { embeddings } = predictions[0];
    const embedding = embeddings.values;

    // Vertex AI
    const restricts = [
      { namespace: "appname", allow: ["demo"] },
      { namespace: "username", allow: ["daiiz"] },
      {
        namespace: "visible",
        allow: [
          // 驚いているものはプライベート
          inputText.endsWith("!") || inputText.endsWith("！")
            ? "private"
            : "public",
        ],
      },
    ];

    if (!omitOutput) {
      console.log(
        JSON.stringify({
          id: inputText,
          embedding,
          restricts,
        })
      );
    }

    // 出力完了
    return embedding;
  } else {
    console.error("error", res.status, await res.text());
  }

  return [];
}

async function main() {
  await genEmbedding(rawInputText);
}

if (require.main === module) {
  if (!rawInputText) {
    console.error("Usage: node tools/gen-embedding.js <input_text>");
    process.exit(1);
  }

  main();
}

module.exports = {
  genEmbedding,
};
