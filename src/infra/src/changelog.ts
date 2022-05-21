import hashJs from "https://deno.land/x/hash@v0.1.0/mod-hashjs.ts";
import * as Path from "https://deno.land/std@0.76.0/path/mod.ts";

import { IAction } from "./handlers/declarations.ts";
import { failOnError } from "./logging.ts";

export type IChangeLogContent = {
  actions: Array<IAction>;
};

export type IChangeLogLogEntry = {
  id: string;
  hash: string;
  when: Date;
  output: string;
};

export const loadChangelog = (fileName: string): IChangeLogContent => {
  try {
    const content = Deno.readTextFileSync(fileName);

    return JSON.parse(content);
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
        base: `${parsedFileName.name}-log.json`,
        name: `${parsedFileName.name}-log`,
        ext: ".json",
      },
    ),
  );
};

export const loadChangelogLog = (
  logFileName: string,
): Array<IChangeLogLogEntry> => {
  try {
    const content = Deno.readTextFileSync(logFileName);

    return JSON.parse(content);
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
      JSON.stringify(changelogLog, null, 2),
    );
  } catch (e) {
    failOnError(`Error: Unable to write changelog log: ${logFileName}\n`, e);
    Deno.exit(1);
  }
};

export const calculateActionHash = (action: IAction): string =>
  hashJs.sha256().update(JSON.stringify(action)).digest("hex");
