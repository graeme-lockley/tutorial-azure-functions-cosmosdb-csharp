import { handler as azureResourceGroupCreate } from "./handlers/azure__resource_group__create.ts";
import { handler as azureCosmosCreate } from "./handlers/azure__cosmos__create.ts";

export default [
  azureResourceGroupCreate,
  azureCosmosCreate,
];
