import { exec } from "../exec.ts";
import { IAction, ILintResult, lintFieldNotUndefinedNotEmpty } from "./declarations.ts";

const handlerName = "azure/cosmos/create";

interface IHandlerAction extends IAction {
  name?: string | undefined;
  rg?: string | undefined;
}

const lint = (result: Array<ILintResult>, action: IHandlerAction): void => {
  lintFieldNotUndefinedNotEmpty(action.id, handlerName, "id", result);
  lintFieldNotUndefinedNotEmpty(action.name, handlerName, "name", result);
  lintFieldNotUndefinedNotEmpty(action.rg, handlerName, "rg", result);
};

const run = async (action: IHandlerAction): Promise<void> => {
  const command =
    `az cosmosdb create --name "${action.name}" --resource-group "${action.rg}"`;

  await exec(command, handlerName, action.id, action.name);
};

export const handler = {
  type: handlerName,
  lint,
  run,
};
