import { exec } from "../exec.ts";
import {
  IAction,
  ILintResult,
  lintFieldNotEmpty,
  lintFieldNotUndefinedNotEmpty,
} from "./declarations.ts";

const handlerName = "azure/cosmos/create";

interface IHandlerAction extends IAction {
  name?: string | undefined;
  rg?: string | undefined;
  location?: string | undefined;
}

const lint = (result: Array<ILintResult>, action: IHandlerAction): void => {
  lintFieldNotUndefinedNotEmpty(action.id, handlerName, "id", result);
  lintFieldNotUndefinedNotEmpty(action.name, handlerName, "name", result);
  lintFieldNotUndefinedNotEmpty(action.rg, handlerName, "rg", result);
  lintFieldNotEmpty(action.location, handlerName, "location", result);
};

const run = async (action: IHandlerAction): Promise<void> => {
  const locationSuffix = action.location === undefined
    ? ""
    : ` --locations "regionName=${action.location}"`;

  const command =
    `az cosmosdb create --name "${action.name}" --resource-group "${action.rg}"${locationSuffix}`;

  await exec(command, handlerName, action.id, action.name);
};

export const handler = {
  type: handlerName,
  lint,
  run,
};
