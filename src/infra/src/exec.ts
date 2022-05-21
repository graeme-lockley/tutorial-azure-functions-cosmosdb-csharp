import { exec as execLib } from "https://deno.land/x/garn_exec@0.4.2/exec.js";

import { failOnError } from "./logging.ts";

export const exec = async (
  command: string,
  handlerName: string,
  id: string,
  name: string | undefined = undefined,
): Promise<string> => {
  console.log(`${handlerName}: ${command}`);

  try {
    const result = await execLib(command);
    if (result.code === 0 && result.success) {
      console.info(result.stdout, result.stderr);
      return (result.stdout + result.stderr).trim();
    } else {
      failOnError(
        `Error: id=${id}, name=${name}: Action returned error:`,
        result.stdout,
        result.stderr,
      );
      return "";
    }
  } catch (error) {
    failOnError(
      `Error: id=${id}, name=${name}: Action returned error:`,
      error.stdout,
      error.stderr,
    );
    return "";
  }
};

export const execExpression = async (
  command: string,
  id: string | undefined = "builtin",
  name: string | undefined = undefined,
): Promise<string> => {
  try {
    const result = await execLib(command);

    return (result.stdout + result.stderr).trim();
  } catch (error) {
    failOnError(
      `Error: id=${id}, name=${name}: Action returned error:`,
      error.stdout,
      error.stderr,
    );

    return "";
  }
};
