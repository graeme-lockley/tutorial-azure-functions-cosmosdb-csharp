import { exec as execLib } from "https://deno.land/x/garn_exec@0.4.2/exec.js";

import { failOnError } from "./logging.ts";

export type ExecOptions = {
  showScript?: boolean;
  showOutput?: boolean;
  exitOnError?: boolean;
};

export const defaultExecOptions: ExecOptions = {
  showScript: true,
  showOutput: false,
  exitOnError: true,
};

export const exec = async (
  command: string,
  handlerName: string,
  id: string,
  name: string | undefined = undefined,
  options: ExecOptions | undefined = undefined,
): Promise<string> => {
  const opts = Object.assign({}, defaultExecOptions, options);

  if (opts.showScript) {
    console.log(`${handlerName}: ${command}`);
  }

  try {
    const result = await execLib(command);

    if (opts.showOutput) {
      console.info(result.stdout, result.stderr);
    }

    if (opts.exitOnError && (result.code !== 0 || !result.success)) {
      failOnError(
        `Error: id=${id}, name=${name}: Action returned error:`,
        result.stdout,
        result.stderr,
      );
      Deno.exit(1);
    }

    return (result.stdout + result.stderr).trim();
  } catch (error) {
    if (opts.exitOnError) {
      failOnError(
        `Error: id=${id}, name=${name}: Action returned error:`,
        error.stdout,
        error.stderr,
      );
    }

    return (error.stdout + error.stderr).trim();
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
