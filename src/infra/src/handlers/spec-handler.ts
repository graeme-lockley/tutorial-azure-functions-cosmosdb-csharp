import { ILintResult } from "../cmds/lint.ts";
import * as Exec from "../exec.ts";
import { evaluate } from "../expression-evaluation.ts";
import { failOnError } from "../logging.ts";
import {
  IAction,
  IActionHandler,
  lintHandlerAction,
  RunOptions,
  Schema,
} from "./declarations.ts";
import { HandlerSchema } from "./schema/handler-schema.ts";

export const lint = (
  name: string,
  schema: Schema,
  result: Array<ILintResult>,
  action: IAction,
): void => lintHandlerAction(result, schema, name, action);

export const buildHandler = (
  schema: HandlerSchema,
): IActionHandler<IAction> => {
  const jsonSchema = JSON.parse(schema.schema);

  return {
    type: schema.name,
    lint: (lintResult: Array<ILintResult>, action: IAction): void =>
      lint(schema.name, jsonSchema, lintResult, action),
    run: (
      action: IAction,
      options: RunOptions | undefined = undefined,
    ): Promise<string> => runScript(schema, action, options),
    rollback: (
      action: IAction,
      options: RunOptions | undefined = undefined,
    ): Promise<string> => rollbackScript(schema, action, options),
  };
};

const runScript = (
  schema: HandlerSchema,
  action: IAction,
  options: RunOptions | undefined,
): Promise<string> => {
  if (schema.script.type === undefined || schema.script.type === "exec") {
    return runExecScript(schema, action, options);
  } else {
    return runJsScript(schema, action, options);
  }
};

const runExecScript = (
  schema: HandlerSchema,
  action: IAction,
  options: RunOptions | undefined,
): Promise<string> => execScript(schema, schema.script.run, action, options);

const runJsScript = (
  schema: HandlerSchema,
  action: IAction,
  options: RunOptions | undefined,
): Promise<string> => jsScript(schema, schema.script.run, action, options);

const rollbackScript = (
  schema: HandlerSchema,
  action: IAction,
  options: RunOptions | undefined,
): Promise<string> => {
  if (schema.script.rollback === undefined) {
    failOnError(`Error: ${schema.name}: Unable to rollback`);
    Deno.exit(1);
  } else if (
    schema.script.type === undefined || schema.script.type === "exec"
  ) {
    return rollbackExecScript(schema, action, options);
  } else {
    return rollbackJsScript(schema, action, options);
  }
};

const rollbackExecScript = (
  schema: HandlerSchema,
  action: IAction,
  options: RunOptions | undefined,
): Promise<string> =>
  execScript(schema, schema.script.rollback!, action, options);

const rollbackJsScript = (
  schema: HandlerSchema,
  action: IAction,
  options: RunOptions | undefined,
): Promise<string> =>
  jsScript(schema, schema.script.rollback!, action, options);

const execScript = async (
  schema: HandlerSchema,
  script: string,
  action: IAction,
  options: RunOptions | undefined,
): Promise<string> => {
  const evaluatedScript = await evaluate(script, action);

  return Exec.exec(
    evaluatedScript,
    schema.name,
    action.id,
    action.name,
    options,
  );
};

const jsScript = async (
  schema: HandlerSchema,
  script: string,
  data: IAction,
  options: RunOptions | undefined,
): Promise<string> => {
  const _outputs: Array<string> = [];

  const exec = async (s: string): Promise<string> => {
    const response = await Exec.exec(
      s,
      schema.name,
      data.id,
      data.name,
      options,
    );

    _outputs.push(response);

    return response;
  };

  // deno-lint-ignore no-unused-vars
  const az = (s: string): Promise<string> => exec(`az ${s}`);

  const jsExpr = "(async () => {\n" + (schema.script.preamble ?? "") + "\n" +
    script + "})();";

  try {
    await await eval(jsExpr);
  } catch (e) {
    const errorMsg = `Error: ${schema.name}: ${e.message}`;
    if (options?.exitOnError) {
      failOnError(errorMsg, e);
    } else {
      _outputs.push(errorMsg);
    }
  }

  return Promise.resolve(_outputs.join("\n").trim());
};
