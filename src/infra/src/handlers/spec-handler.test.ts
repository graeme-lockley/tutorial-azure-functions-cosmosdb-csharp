import * as YAML from "https://deno.land/std@0.82.0/encoding/yaml.ts";

import { assertEquals } from "https://deno.land/std@0.137.0/testing/asserts.ts";
import { buildHandler } from "./spec-handler.ts";
import { HandlerSchema } from "./schema/handler-schema.ts";
import { ILintResult } from "../cmds/lint.ts";

const silentExitOptions = {
  showScript: false,
  showOutput: false,
  exitOnError: true,
};

const silentNoExitOptions = Object.assign({}, silentExitOptions, {
  exitOnError: false,
});

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

  const runResult = await handler.run(input, silentExitOptions);
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

  const runResult = await handler.rollback(input, silentExitOptions);
  assertEquals(
    runResult,
    "az group delete --name fred --only-show-errors",
  );
});

Deno.test("run js handler", async () => {
  const handler = jsHandler();

  const input = JSON.parse(
    `{"id":"fred", "type": "azure/resource-group/delete", "name": "fred", "location": "eastus"}`,
  );

  const runResult = await handler.run(input, silentExitOptions);
  assertEquals(
    runResult,
    ["az group delete --name fred --only-show-errors"],
  );
});

Deno.test("run js handler no-wait", async () => {
  const handler = jsHandler();

  const input = JSON.parse(
    `{"id":"fred", "type": "azure/resource-group/delete", "name": "fred", "location": "eastus", "no-wait": true}`,
  );

  const runResult = await handler.run(input, undefined /*silentExitOptions*/);
  assertEquals(
    runResult,
    ["az group delete --name fred --only-show-errors --no-wait"],
  );
});

Deno.test("rollback js handler", async () => {
  const handler = jsHandler();

  const input = JSON.parse(
    `{"id":"fred", "type": "azure/resource-group/delete", "name": "fred", "location": "eastus"}`,
  );

  const runResult = await handler.rollback(input, silentExitOptions);
  assertEquals(
    runResult,
    ["az group create --name fred --location eastus --only-show-errors"],
  );
});

Deno.test("rollback js handler with error", async () => {
  const handler = jsHandler();

  const input = JSON.parse(
    `{"id":"fred", "type": "azure/resource-group/delete", "name": "fred"}`,
  );

  const runResult = await handler.rollback(
    input,
    silentNoExitOptions,
  );
  assertEquals(
    runResult,
    ["Error: azure/resource-group/delete: .location is undefined"],
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
script:
  run: |
    echo az group create 
      --location "\${data.location}" 
      --name "\${data.name}"
      --only-show-errors
  rollback: |
    echo az group delete 
      --name "\${data.name}"
      --only-show-errors
`;

  const handler = buildHandler(YAML.parse(template) as HandlerSchema);
  assertEquals(handler.type, "azure/resource-group/create");

  return handler;
};

const jsHandler = () => {
  const template = `name: azure/resource-group/delete
schema: |
  {
    "properties": {
      "id": { "type": "string" },
      "type": { "type": "string" },
      "name": { "type": "string" }
    },
    "optionalProperties": {
      "location": { "type": "string" },
      "no-wait": { "type": "boolean" },
      "description": { "type": "string" }
    }
  }
script:
  type: js
  preamble: |
    const name = await evaluate(data.name);
    const location = await evaluate(data.location);
    const noWait = data['no-wait'] === undefined ? false : await evaluate(data['no-wait']) ?? false;
  run: |
    await exec(\`echo az group delete 
      --name "\${name}"
      --only-show-errors
      \${noWait ? "--no-wait" : ""}\`);
  rollback: |
    if (location === undefined)
      throw Error(".location is undefined");
    
    await exec(\`echo az group create 
      --name "\${name}"
      --location "\${location}"
      --only-show-errors
      \${noWait ? "--no-wait" : ""}\`);
`;

  const handler = buildHandler(YAML.parse(template) as HandlerSchema);
  assertEquals(handler.type, "azure/resource-group/delete");

  return handler;
};
