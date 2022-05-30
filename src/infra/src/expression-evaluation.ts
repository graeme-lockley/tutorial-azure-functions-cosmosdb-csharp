import { execExpression } from "./exec.ts";

// The variable env is reported by lint as it is not being used.  This warning
// is ignored because it is a variable that can be accessed from user
// expressions.

// deno-lint-ignore no-unused-vars no-explicit-any
const env = (name: string, value: any | undefined): string | undefined => {
  const current = Deno.env.get(name);

  if (value !== undefined) {
    Deno.env.set(name, value);
    // deno-lint-ignore no-explicit-any
    (window as any)[name] = value;
  }

  return current;
};

// deno-lint-ignore no-unused-vars
const AzIdentityClientId = (
  identityName: string,
  rgName: string,
): Promise<string> =>
  execExpression(
    `az identity show --name ${identityName} --resource-group ${rgName} --only-show-errors --query "clientId" --output tsv`,
  );

export const _myTag = async (
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
  text: string | undefined,
  // deno-lint-ignore no-unused-vars no-explicit-any
  data: any = undefined,
): Promise<string> =>
  text === undefined ? undefined : eval("_myTag`" + text + "`");
