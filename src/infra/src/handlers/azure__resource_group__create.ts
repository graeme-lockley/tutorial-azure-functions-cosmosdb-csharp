import { exec } from "../exec.ts";
import { failOnError } from "../logging.ts";
import { IAction, ILintResult } from "./declarations.ts";

const handlerName = "azure/resource-group/create";

interface IHandlerAction extends IAction {
  name?: string | undefined;
  location?: string | undefined;
}

const lintField = (
  value: string | undefined,
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

const lint = (result: Array<ILintResult>, action: IHandlerAction): void => {
  lintField(action.id, "id", result);
  lintField(action.name, "name", result);
  lintField(action.location, "location", result);
};

const run = async (action: IHandlerAction): Promise<void> => {
  const command = `az group create -l "${action.location}" -n "${action.name}"`;

  console.log(`${handlerName}: ${command}`);
  try {
    const result = await exec(command);
    if (result.code === 0 && result.success) {
      console.info(result.stdout, result.stderr);
    } else {
      failOnError(
        `Error: id=${action.id}, name=${action.name}: Action returned error:`,
        result.stdout,
        result.stderr,
      );
    }
  } catch (error) {
    failOnError(
      `Error: id=${action.id}, name=${action.name}: Action returned error:`,
      error.stdout,
      error.stderr,
    );
  }
};

export const handler = {
  type: handlerName,
  lint,
  run,
};
