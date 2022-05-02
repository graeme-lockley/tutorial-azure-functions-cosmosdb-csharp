import { exec } from "../exec.ts";
import {
  IAction,
  ILintResult,
  lintFieldNotUndefinedNotEmpty,
} from "./declarations.ts";

const handlerName = "azure/resource-group/create";

interface IHandlerAction extends IAction {
  name?: string | undefined;
  location?: string | undefined;
}

const lint = (result: Array<ILintResult>, action: IHandlerAction): void => {
  lintFieldNotUndefinedNotEmpty(action.id, handlerName, "id", result);
  lintFieldNotUndefinedNotEmpty(action.name, handlerName, "name", result);
  lintFieldNotUndefinedNotEmpty(
    action.location,
    handlerName,
    "location",
    result,
  );
};

const run = async (action: IHandlerAction): Promise<void> => {
  const command = `az group create -l "${action.location}" -n "${action.name}"`;

  await exec(command, handlerName, action.id, action.name);
};

export const handler = {
  type: handlerName,
  lint,
  run,
};
