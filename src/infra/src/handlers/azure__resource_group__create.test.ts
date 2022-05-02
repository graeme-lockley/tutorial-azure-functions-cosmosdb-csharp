import { assertEquals } from "https://deno.land/std@0.137.0/testing/asserts.ts";

import {
  commandFromAction,
  handlerName,
  IHandlerAction,
  lint,
} from "./azure__resource_group__create.ts";
import { ILintResult } from "./declarations.ts";

Deno.test("Validate command from action", () => {
  const action = {
    id: "id",
    type: handlerName,
    name: "fred",
    location: "bob",
  };

  assertEquals(lintActions(action), []);
  assertEquals(commandFromAction(action), 'az group create -l "bob" -n "fred"');
});

const lintActions = (handler: IHandlerAction) => {
  const results: Array<ILintResult> = [];

  lint(results, handler);

  return results;
};
