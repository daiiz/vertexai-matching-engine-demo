// node tools/gen-embedding-palm.js こんにちは > "./sampledata/text/$(uuidgen).json"

require("dotenv").config();
const fetch = require("node-fetch");
const { GoogleAuth } = require("google-auth-library");
const { SERVICE_ACCOUNT, PALM_EMBEDDING_ENDPOINT_NAME } = process.env;

const rawInputText = process.argv[2];

const auth = new GoogleAuth({
  scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  credentials: JSON.parse(SERVICE_ACCOUNT || "{}"),
});

async function genEmbedding(inputText, omitOutput = false) {
  if (!inputText) {
    throw new Error("inputText is required");
  }

  const token = await auth.getAccessToken();
  let apiUri = `https://us-central1-aiplatform.googleapis.com/v1/${PALM_EMBEDDING_ENDPOINT_NAME}:predict`;

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
    console.log(embedding.length);

    //   // Vertex AI
    //   const restricts = [
    //     { namespace: "appname", allow: ["demo"] },
    //     { namespace: "username", allow: ["daiiz"] },
    //     {
    //       namespace: "visible",
    //       allow: [
    //         // 驚いているものはプライベート
    //         inputText.endsWith("!") || inputText.endsWith("！")
    //           ? "private"
    //           : "public",
    //       ],
    //     },
    //   ];

    //   if (!omitOutput) {
    //     console.log(
    //       JSON.stringify({
    //         id: inputText,
    //         embedding,
    //         restricts,
    //       })
    //     );
    //   }

    // 出力完了
    // return embedding;
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
