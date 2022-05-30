import hashJs from "https://deno.land/x/hash@v0.1.0/mod-hashjs.ts";
import * as Path from "https://deno.land/std@0.76.0/path/mod.ts";
import * as YAML from "https://deno.land/std@0.82.0/encoding/yaml.ts";

import { IAction } from "./handlers/declarations.ts";
import { failOnError } from "./logging.ts";

export type IChangeLogContent = {
  preamble?: string;
  actions: Array<IAction>;
};

export type IChangeLogLogEntry = {
  id: string;
  hash: string;
  when: Date;
  output: string | Array<string>;
};

export const loadChangelog = (fileName: string): IChangeLogContent => {
  try {
    const content = Deno.readTextFileSync(fileName);

    return fileName.endsWith(".yaml")
      ? YAML.parse(content) as IChangeLogContent
      : JSON.parse(content);
  } catch (e) {
    failOnError(`Error: Unable to load changelog file: ${fileName}\n`, e);
    Deno.exit(1);
  }
};

export const deriveChangelogLogFileName = (fileName: string): string => {
  const parsedFileName = Path.parse(fileName);

  return Path.format(
    Object.assign(
      {},
      parsedFileName,
      {
        base: `${parsedFileName.name}-log.yaml`,
        name: `${parsedFileName.name}-log`,
        ext: ".yaml",
      },
    ),
  );
};

export const loadChangelogLog = (
  logFileName: string,
): Array<IChangeLogLogEntry> => {
  try {
    const content = Deno.readTextFileSync(logFileName);

    return YAML.parse(content) as Array<IChangeLogLogEntry>;
  } catch (e) {
    if (e.code === "ENOENT") {
      console.info(
        `Info: Unable to load changelog log: ${logFileName}: Creating`,
      );
      return [];
    } else {
      failOnError(
        `Error: Unable to load changelog log file: ${logFileName}\n`,
        e,
      );
      Deno.exit(1);
    }
  }
};

export const saveChangelogLog = async (
  logFileName: string,
  changelogLog: Array<IChangeLogLogEntry>,
): Promise<void> => {
  try {
    await Deno.writeTextFile(
      logFileName,
      YAML.stringify(changelogLog as unknown as Record<string, unknown>, {
        indent: 2,
      }),
    );
  } catch (e) {
    failOnError(`Error: Unable to write changelog log: ${logFileName}\n`, e);
    Deno.exit(1);
  }
};

export const calculateActionHash = (action: IAction): string =>
  hashJs.sha256().update(JSON.stringify(action)).digest("hex");
