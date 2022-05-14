import {
  Schema,
  validate,
  ValidationError,
} from "https://deno.land/x/jtd@v0.1.0/mod.ts";

export type {
  Schema,
  ValidationError,
} from "https://deno.land/x/jtd@v0.1.0/mod.ts";

export type ILintResult = {
  type: "Warning" | "Error";
  handler: string;
  id?: string;
  message: string;
};

export type IAction = {
  id: string;
  type: string;
};

export type IActionHandler<T extends IAction> = {
  type: string;
  lint: (lintResult: Array<ILintResult>, action: T) => void;
  run: (action: T) => Promise<void>;
};

export const lintFieldNotUndefinedNotEmpty = (
  value: string | undefined,
  handlerName: string,
  name: string,
  result: Array<ILintResult>,
) => {
  if (value === undefined) {
    result.push({
      type: "Error",
      handler: handlerName,
      message: `.${name} is undefined`,
    });
  }
  if (value === "") {
    result.push({
      type: "Error",
      handler: handlerName,
      message: `.${name} may not be the empty string`,
    });
  }
};

export const lintFieldNotEmpty = (
  value: string | undefined,
  handlerName: string,
  name: string,
  result: Array<ILintResult>,
) => {
  if (value !== undefined && value === "") {
    result.push({
      type: "Error",
      handler: handlerName,
      message: `.${name} may not be the empty string`,
    });
  }
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
