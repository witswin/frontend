import type { ConfigFile } from "@rtk-query/codegen-openapi"

const config: ConfigFile = {
  schemaFile: "http://localhost:4444/api/schema.json",
  apiFile: "./src/store/api.ts",
  apiImport: "emptySplitApi",
  outputFile: "./src/store/api.ts",
  exportName: "witsApi",
  hooks: true,
}

export default config
