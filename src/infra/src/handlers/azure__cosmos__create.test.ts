import { assertEquals } from "https://deno.land/std@0.137.0/testing/asserts.ts";

import {
  commandFromAction,
  handler as handlerAction,
  IHandlerAction,
} from "./azure__cosmos__create.ts";
import { ILintResult } from "./declarations.ts";

Deno.test("Lint action - everything is undefined", () => {
  const action = {
    bob: 123,
  };

  assertLint(action, [
    {
      handler: "azure/cosmos/create",
      message: ".id is undefined",
      type: "Error",
    },
    {
      handler: "azure/cosmos/create",
      message: ".type is undefined",
      type: "Error",
    },
    {
      handler: "azure/cosmos/create",
      message: ".name is undefined",
      type: "Error",
    },
    {
      handler: "azure/cosmos/create",
      message: ".rg is undefined",
      type: "Error",
    },
    {
      handler: "azure/cosmos/create",
      message: ".bob is invalid",
      type: "Error",
    },
  ]);
});

Deno.test("Validate command without location from action", () => {
  const action = {
    id: "id",
    type: handlerAction.type,
    name: "fred",
    rg: "bob",
  };

  assertEquals(lintActions(action), []);
  assertEquals(commandFromAction(action), 'az cosmosdb create --name "fred" --resource-group "bob"');
});

Deno.test("Validate command with location from action", () => {
  const action = {
    id: "id",
    type: handlerAction.type,
    name: "fred",
    rg: "bob",
    location: "heaven"
  };

  assertEquals(lintActions(action), []);
  assertEquals(commandFromAction(action), 'az cosmosdb create --name "fred" --resource-group "bob" --locations "regionName=heaven"');
});

const lintActions = (handler: IHandlerAction) => {
  const results: Array<ILintResult> = [];

  handlerAction.lint(results, handler);

  return results;
};

// deno-lint-ignore no-explicit-any
const assertLint = (action: any, lintErrors: Array<ILintResult>) =>
  assertEquals(lintActions(action), lintErrors);
