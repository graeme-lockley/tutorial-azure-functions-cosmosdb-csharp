import { assertEquals } from "https://deno.land/std@0.137.0/testing/asserts.ts";

import {
  commandFromAction,
  handlerName,
  IHandlerAction,
  lint,
} from "./azure__resource_group__create.ts";
import { ILintResult } from "./declarations.ts";

Deno.test("Lint action - id undefined", () => {
  // To force a lint error need to turning off TypeScript warning using an explicit any.
  const action = {
    bob: 123,
    // deno-lint-ignore no-explicit-any
  } as any as IHandlerAction;

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
  } as IHandlerAction;

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
  } as IHandlerAction;

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

const assertLint = (action: IHandlerAction, lintErrors: Array<ILintResult>) =>
  assertEquals(lintActions(action), lintErrors);
