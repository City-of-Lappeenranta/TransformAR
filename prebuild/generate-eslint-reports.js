const { ESLint } = require("eslint");
const { resolve } = require("path");
const { writeJson } = require("fs-extra");

(async function main() {
  const eslint = new ESLint();
  const results = await eslint.lintFiles(["app"]);

  const filteredResults = results.filter((lintResult) => {
    return lintResult.messages.length > 0;
  });

  const stylishFormatter = await eslint.loadFormatter("stylish");
  const stylishFormatterResult = stylishFormatter.format(filteredResults);

  console.log(stylishFormatterResult);

  const jsonFormatter = await eslint.loadFormatter("json");
  const jsonFormatterResult = jsonFormatter.format(filteredResults);

  const file = resolve(__dirname, "..", "reports", "eslint-report.json");
  await writeJson(file, JSON.parse(jsonFormatterResult), { encoding: "utf-8" });

  if (filteredResults.filter((result) => result.errorCount > 0).length > 0) {
    process.exitCode = 1;
    throw new Error();
  }
})().catch((error) => {
  process.exitCode = 1;
  console.error(error);
});
