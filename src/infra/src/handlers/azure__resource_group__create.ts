import { exec } from "../exec.ts";
import {
  IAction,
  ILintResult,
  lintFieldNotUndefinedNotEmpty,
} from "./declarations.ts";

export const handlerName = "azure/resource-group/create";

export interface IHandlerAction extends IAction {
  name?: string | undefined;
  location?: string | undefined;
}

export const lint = (
  result: Array<ILintResult>,
  action: IHandlerAction,
): void => {
  lintFieldNotUndefinedNotEmpty(action.id, handlerName, "id", result);
  lintFieldNotUndefinedNotEmpty(action.name, handlerName, "name", result);
  lintFieldNotUndefinedNotEmpty(
    action.location,
    handlerName,
    "location",
    result,
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
