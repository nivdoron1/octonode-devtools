import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "./openapi.json",
  output: { path: "./src/gen", indexFile: true },
  plugins: [
    { name: "@hey-api/client-fetch", throwOnError: true },
    "@hey-api/typescript",
    {
      name: "@hey-api/sdk",
      responseStyle: "data",
      operations: {
        strategy: "single",
        containerName: "OctonodeApi",
        methods: "instance",
        nesting: (operation) => {
          const [api, resource, ...path] = operation.path.split("/").filter(Boolean);
          if (resource === "store" && path[0] === "projects") return ["projects", api, ...path.slice(1), operation.method];
          return [resource ?? api, ...(resource ? [api] : []), ...path, operation.method];
        },
      },
    },
  ],
});
