import { exec } from "../exec.ts";
import { IAction, ILintResult, lintField } from "./declarations.ts";

const handlerName = "azure/cosmos/create";

interface IHandlerAction extends IAction {
  name?: string | undefined;
  rg?: string | undefined;
}

const lint = (result: Array<ILintResult>, action: IHandlerAction): void => {
  lintField(action.id, handlerName, "id", result);
  lintField(action.name, handlerName, "name", result);
  lintField(action.rg, handlerName, "rg", result);
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
