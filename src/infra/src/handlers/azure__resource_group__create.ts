import {
  Schema,
  validate,
  ValidationError,
} from "https://deno.land/x/jtd@v0.1.0/mod.ts";
import { exec } from "../exec.ts";
import { IAction, ILintResult } from "./declarations.ts";

import schema from "./schema/azure__resource_group__create.json" assert {
  type: "json",
};

export const handlerName = "azure/resource-group/create";

export interface IHandlerAction extends IAction {
  name?: string | undefined;
  location?: string | undefined;
}

export const lint = (
  result: Array<ILintResult>,
  action: IHandlerAction,
): void => {
  const validationErrors = validate(schema as Schema, action);

  appendSchemaValidationErrors(
    result,
    "azure/resource-group/create",
    validationErrors,
  );
};

export const commandFromAction = (action: IHandlerAction): string =>
  `az group create -l "${action.location}" -n "${action.name}"`;

const run = async (action: IHandlerAction): Promise<void> => {
  const command = commandFromAction(action);

  await exec(command, handlerName, action.id, action.name);
};

export const handler = {
  type: handlerName,
  lint,
  run,
};

const appendSchemaValidationErrors = (
  result: Array<ILintResult>,
  handlerType: string,
  validationErrors: Array<ValidationError>,
) => {
  for (const validationError of validationErrors) {
    if (validationError.instancePath.length === 0) {
      result.push({
        handler: handlerType,
        message: `.${validationError.schemaPath[1]} is undefined`,
        type: "Error",
      });
    } else {
      result.push({
        handler: handlerType,
        message: `.${validationError.instancePath.join(".")} is invalid`,
        type: "Error",
      });
    }
  }
};
