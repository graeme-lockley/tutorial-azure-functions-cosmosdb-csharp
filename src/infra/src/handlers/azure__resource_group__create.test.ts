import { assertEquals } from "https://deno.land/std@0.137.0/testing/asserts.ts";

import {
  commandFromAction,
  handler as handlerAction,
} from "./azure__resource_group__create.ts";
import { ILintResult } from "./declarations.ts";

Deno.test("Lint action - id undefined", () => {
  const action = {
    bob: 123,
  };

  assertLint(action, [
    {
      handler: "azure/resource-group/create",
      message: ".id is undefined",
      type: "Error",
    },
    {
      handler: "azure/resource-group/create",
      message: ".type is undefined",
      type: "Error",
    },
    {
      handler: "azure/resource-group/create",
      message: ".name is undefined",
      type: "Error",
    },
    {
      handler: "azure/resource-group/create",
      message: ".location is undefined",
      type: "Error",
    },
    {
      handler: "azure/resource-group/create",
      message: ".bob is invalid",
      type: "Error",
    },
  ]);
});

Deno.test("Lint action - name undefined", () => {
  const action = {
    id: "id",
  };

  assertLint(action, [
    {
      handler: "azure/resource-group/create",
      message: ".type is undefined",
      type: "Error",
    },
    {
      handler: "azure/resource-group/create",
      message: ".name is undefined",
      type: "Error",
    },
    {
      handler: "azure/resource-group/create",
      message: ".location is undefined",
      type: "Error",
    },
  ]);
});

Deno.test("Lint action - location undefined", () => {
  const action = {
    id: "id",
    name: "fred",
  };

  assertLint(action, [
    {
      handler: "azure/resource-group/create",
      message: ".type is undefined",
      type: "Error",
    },
    {
      handler: "azure/resource-group/create",
      message: ".location is undefined",
      type: "Error",
    },
  ]);
});

Deno.test("Validate command from action", () => {
  const action = {
    id: "id",
    type: handlerAction.type,
    name: "fred",
    location: "bob",
  };

  assertEquals(lintActions(action), []);
  assertEquals(commandFromAction(action), 'az group create -l "bob" -n "fred"');
});

// deno-lint-ignore no-explicit-any
const lintActions = (handler: any) => {
  const results: Array<ILintResult> = [];

  handlerAction.lint(results, handler);

  return results;
};

// deno-lint-ignore no-explicit-any
const assertLint = (action: any, lintErrors: Array<ILintResult>) =>
  assertEquals(lintActions(action), lintErrors);
