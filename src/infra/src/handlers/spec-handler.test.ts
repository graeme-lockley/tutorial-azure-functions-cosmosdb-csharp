import * as YAML from "https://deno.land/std@0.82.0/encoding/yaml.ts";

import { assertEquals } from "https://deno.land/std@0.137.0/testing/asserts.ts";
import { buildHandler } from "./spec-handler.ts";
import { HandlerSchema } from "./schema/handler-schema.ts";
import { ILintResult } from "../cmds/lint.ts";


Deno.test("lint handler - no errors", () => {
  const handler = azHandler();
  
  const input = JSON.parse(
    `{"id":"fred", "type": "azure/resource-group/create", "name": "fred", "location": "eastus"}`,
  );

  const lintResults: Array<ILintResult> = [];
  handler.lint(lintResults, input);
  assertEquals(lintResults.length, 0);
});

Deno.test("lint handler - with errors", () => {
  const handler = azHandler();
  
  const input = JSON.parse(
    `{"id":"fred", "type": "azure/resource-group/create", "names": "fred", "location": "eastus"}`,
  );

  const lintResults: Array<ILintResult> = [];
  handler.lint(lintResults, input);
  assertEquals(lintResults.length, 2);
  assertEquals(lintResults, [
    {
      handler: "azure/resource-group/create",
      message: ".name is undefined",
      type: "Error",
    },
    {
      handler: "azure/resource-group/create",
      message: ".names is invalid",
      type: "Error",
    },
  ]);
});

Deno.test("run az handler", async () => {
  const handler = azHandler();
  
  const input = JSON.parse(
    `{"id":"fred", "type": "azure/resource-group/create", "name": "fred", "location": "eastus"}`,
  );

  const runResult = await handler.run(input, {
    showScript: false,
    showOutput: false,
    exitOnError: true,
  });
  assertEquals(
    runResult,
    "az group create --location eastus --name fred --only-show-errors",
  );
});

Deno.test("rollback az handler", async () => {
  const handler = azHandler();
  
  const input = JSON.parse(
    `{"id":"fred", "type": "azure/resource-group/create", "name":"fred", "location": "eastus"}`,
  );

  const runResult = await handler.rollback(input, {
    showScript: false,
    showOutput: false,
    exitOnError: true,
  });
  assertEquals(
    runResult,
    "az group delete --name fred --only-show-errors",
  );
});

const azHandler = () => {
  const template = `name: azure/resource-group/create
schema: |
  {
    "properties": {
      "id": { "type": "string" },
      "type": { "type": "string" },
      "name": { "type": "string" },
      "location": { "type": "string" }
    },
    "optionalProperties": {
      "description": { "type": "string" }
    }
  }
run:
  script: |
    echo az group create 
      --location "\${data.location}" 
      --name "\${data.name}"
      --only-show-errors
rollback:
  script: |
    echo az group delete 
      --name "\${data.name}"
      --only-show-errors
`;

  const handler = buildHandler(YAML.parse(template) as HandlerSchema);
  assertEquals(handler.type, "azure/resource-group/create");

  return handler;
}
