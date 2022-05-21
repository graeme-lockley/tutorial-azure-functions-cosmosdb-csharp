import { assertEquals } from "https://deno.land/std@0.137.0/testing/asserts.ts";
import { ILintResult } from "../cmds/lint.ts";

import {
  commandFromAction,
  handler as handlerAction,
} from "./azure__cli__az.ts";

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
      message: ".run is undefined",
      type: "Error",
    },
    {
      handler: "azure/cosmos/create",
      message: ".bob is invalid",
      type: "Error",
    },
  ]);
});

Deno.test("Validate command", async () => {
  const action = {
    id: "id",
    type: handlerAction.type,
    run: "az ad sp list --query \"[?appDisplayName == 'myApp']\"",
  };

  assertEquals(lintActions(action), []);
  assertEquals(
    await commandFromAction(action),
    "az ad sp list --query \"[?appDisplayName == 'myApp']\"",
  );
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
