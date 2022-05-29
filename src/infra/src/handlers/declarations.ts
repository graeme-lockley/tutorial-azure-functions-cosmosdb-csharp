import {
  Schema,
  validate,
  ValidationError,
} from "https://deno.land/x/jtd@v0.1.0/mod.ts";
import { ILintResult } from "../cmds/lint.ts";
import { ExecOptions } from "../exec.ts";

export type {
  Schema,
  ValidationError,
} from "https://deno.land/x/jtd@v0.1.0/mod.ts";

export interface IAction {
  id: string;
  type: string;
  name?: string;
}

export type RunOptions = ExecOptions;

export type IActionHandler<T extends IAction> = {
  type: string;
  lint: (lintResult: Array<ILintResult>, action: T) => void;
  run: (
    action: T,
    options: RunOptions | undefined,
  ) => Promise<string | Array<string>>;
  rollback: (
    action: T,
    options: RunOptions | undefined,
  ) => Promise<string | Array<string>>;
};

export const lintHandlerAction = (
  result: Array<ILintResult>,
  schema: Schema,
  handlerType: string,
  action: IAction,
) => {
  const validationErrors = validate(schema, action);

  appendSchemaValidationErrors(
    result,
    handlerType,
    validationErrors,
  );
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
