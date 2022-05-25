import { ILintResult } from "../cmds/lint.ts";
import { exec } from "../exec.ts";
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
    run: async (
      action: IAction,
      options: RunOptions | undefined = undefined,
    ): Promise<string> => {
      const script = await evaluate(schema.run.script, action);

      return exec(
        script,
        schema.name,
        action.id,
        action.name,
        options,
      );
    },
    rollback: async (
      action: IAction,
      options: RunOptions | undefined = undefined,
    ): Promise<string> => {
      if (schema.rollback === undefined) {
        failOnError(`Error: ${schema.name}: Unable to rollback`);
        Deno.exit(1);
      } else {
        const script = await evaluate(schema.rollback.script, action);

        return exec(
          script,
          schema.name,
          action.id,
          action.name,
          options,
        );
      }
    },
  };
};
