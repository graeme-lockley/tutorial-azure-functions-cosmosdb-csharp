import { handler as AzureCliAz } from "./handlers/azure__cli__az.ts";
import { handler as azureCosmosCreate } from "./handlers/azure__cosmos__create.ts";
import { handler as azureResourceGroupCreate } from "./handlers/azure__resource_group__create.ts";
import { handler as azureResourceGroupDelete } from "./handlers/azure__resource_group__delete.ts";
import { IAction, IActionHandler } from "./handlers/declarations.ts";

const handlers = [
  AzureCliAz,
  azureCosmosCreate,
  azureResourceGroupCreate,
  azureResourceGroupDelete,
];

export const find = <T extends IAction>(
  name: string,
): Promise<IActionHandler<T> | undefined> => {
  const result = handlers.find((h) => h.type === name) as
    | IActionHandler<T>
    | undefined;

  return Promise.resolve(result);
};
