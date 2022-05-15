import { assertEquals } from "https://deno.land/std@0.137.0/testing/asserts.ts";
import { ILintResult } from "../cmds/lint.ts";

import {
  commandFromAction,
  handler as handlerAction,
} from "./azure__resource_group__delete.ts";

Deno.test("Validate command from action without wait", async () => {
  const action = {
    id: "id",
    type: handlerAction.type,
    name: "fred"
  };

  assertEquals(lintActions(action), []);
  assertEquals(await commandFromAction(action), 'az group delete --name "fred" --yes');
});

Deno.test("Validate command from action with wait false", async () => {
  const action = {
    id: "id",
    type: handlerAction.type,
    name: "fred",
    wait: false
  };

  assertEquals(lintActions(action), []);
  assertEquals(await commandFromAction(action), 'az group delete --name "fred" --no-wait --yes');
});

Deno.test("Validate command from action with wait true", async () => {
  const action = {
    id: "id",
    type: handlerAction.type,
    name: "fred",
    wait: true
  };

  assertEquals(lintActions(action), []);
  assertEquals(await commandFromAction(action), 'az group delete --name "fred" --yes');
});

// deno-lint-ignore no-explicit-any
const lintActions = (handler: any) => {
  const results: Array<ILintResult> = [];

  handlerAction.lint(results, handler);

  return results;
};

