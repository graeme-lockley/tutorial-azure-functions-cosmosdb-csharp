import { execExpression } from "./exec.ts";

// The variable env is reported by lint as it is not being used.  This warning
// is ignored because it is a variable that can be accessed from user
// expressions.

// deno-lint-ignore no-unused-vars
const env = (name: string): string | undefined => Deno.env.get(name);

// deno-lint-ignore no-unused-vars
const AzIdentityClientId = (
  identityName: string,
  rgName: string,
): Promise<string> =>
  execExpression(
    `az identity show --name ${identityName} --resource-group ${rgName} --only-show-errors --query "clientId" --output tsv`,
  );

const _myTag = async (
  strings: Array<string>,
  ...keys: Array<Promise<string | undefined> | string>
): Promise<string> => {
  const result: Array<string> = [];

  const resolvedKeys = await Promise.all(keys);

  let lp = 0;
  while (lp < strings.length) {
    result.push(strings[lp]);
    result.push(resolvedKeys[lp] ?? "");
    lp += 1;
  }

  return result.join("");
};

export const evaluate = (
  text: string,
// deno-lint-ignore no-unused-vars no-explicit-any
  data: any = undefined,
): Promise<string> => eval("_myTag`" + text + "`");
