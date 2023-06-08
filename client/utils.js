const fs = require("fs");
const crypto = require("crypto");

const calcHash = (str) => {
  const hash = crypto.createHash("md5");
  hash.update(str);
  return hash.digest("hex");
};

// 永続化: ファイルに書き出しておく
// 初期データとして食わせられる形式で保存しておく
// "allow_list"ではなくて"allow"であることに注意
const saveStreamingData = async (text, embedding, restricts, outDir) => {
  const filePath = `${outDir}/${calcHash(text)}.json`;
  await fs.promises.writeFile(
    filePath,
    JSON.stringify({
      id: text,
      embedding,
      restricts: restricts.map(({ namespace, allow_list }) => ({
        namespace,
        allow: allow_list,
      })),
    }),
    {
      encoding: "utf8",
    }
  );
  console.log(">", filePath);
};

module.exports = {
  saveStreamingData,
};
