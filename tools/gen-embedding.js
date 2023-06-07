// node tools/gen-embedding.js こんにちは > "./sampledata/text/$(uuidgen).json"

const fetch = require("node-fetch");
require("dotenv").config();

const rawInputText = process.argv[2];

async function genEmbedding(inputText, omitOutput = false) {
  if (!inputText) {
    throw new Error("inputText is required");
  }
  // OpenAI
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      input: [inputText],
      model: "text-embedding-ada-002",
    }),
  });

  if (res.ok) {
    const { data } = await res.json();
    // 今回は1件のみ
    const { embedding } = data[0];
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
