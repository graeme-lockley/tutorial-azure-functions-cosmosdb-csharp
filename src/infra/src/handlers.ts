import * as YAML from "https://deno.land/std@0.82.0/encoding/yaml.ts";
import {
  Schema,
  validate,
  ValidationError,
} from "https://deno.land/x/jtd@v0.1.0/mod.ts";

import { handler as AzureCliAz } from "./handlers/azure__cli__az.ts";
import { handler as azureCosmosCreate } from "./handlers/azure__cosmos__create.ts";
import { handler as azureResourceGroupDelete } from "./handlers/azure__resource_group__delete.ts";

import { IAction, IActionHandler } from "./handlers/declarations.ts";
import { HandlerSchema } from "./handlers/schema/handler-schema.ts";
import { failOnError } from "./logging.ts";

import schema from "./handlers/schema/handler-schema.json" assert {
  type: "json",
};
import { buildHandler } from "./handlers/spec-handler.ts";

const handlers = [
  AzureCliAz,
  azureCosmosCreate,
  // azureResourceGroupDelete,
];

export const find = async <T extends IAction>(
  name: string,
): Promise<IActionHandler<T> | undefined> => {
  const result = handlers.find((h) => h.type === name) as
    | IActionHandler<T>
    | undefined;

  if (result === undefined) {
    const fileName = `handlers/${name}.yaml`;
    const handlerAsJson = await loadHandler(fileName);
    const errors = lintHandler(handlerAsJson);

    if (errors.length > 0) {
      failOnError(`Error: Lint: ${fileName}:`, result);
    }

    return buildHandler(handlerAsJson);
  }

  return Promise.resolve(result);
};

const loadHandler = async (fileName: string): Promise<HandlerSchema> => {
  try {
    const content = await Deno.readTextFile(fileName);

    return fileName.endsWith(".yaml")
      ? YAML.parse(content) as HandlerSchema
      : JSON.parse(content);
  } catch (e) {
    failOnError(`Error: Unable to handler: ${fileName}\n`, e);
    Deno.exit(1);
  }
};

const lintHandler = (handler: HandlerSchema): Array<string> => {
  const validationErrors = validate(schema as Schema, handler);

  return appendSchemaValidationErrors(validationErrors);
};

const appendSchemaValidationErrors = (
  validationErrors: Array<ValidationError>,
): Array<string> => {
  const result = [] as Array<string>;

  for (const validationError of validationErrors) {
    if (validationError.instancePath.length === 0) {
      result.push(`.${validationError.schemaPath[1]} is undefined`);
    } else {
      result.push(`.${validationError.instancePath.join(".")} is invalid`);
    }
  }

  return result;
};
