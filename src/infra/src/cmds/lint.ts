import {
  calculateActionHash,
  IChangeLogContent,
  IChangeLogLogEntry,
  loadChangelog,
  loadChangelogLog,
} from "../changelog.ts";
import * as Handlers from "../handlers.ts";
import { failOnError } from "../logging.ts";

export type ILintResult = {
  type: "Warning" | "Error";
  handler: string;
  id?: string;
  message: string;
};

export type ILintOptions = {
  logLogFileName: string;
  writeLogLog: boolean;
};

export const lint = async (
  changelogFileName: string,
  options: ILintOptions,
) => {
  const changelog = loadChangelog(changelogFileName);
  const changelogLog = options.writeLogLog
    ? loadChangelogLog(options.logLogFileName)
    : undefined;
  const results = await changeLogErrors(changelog, changelogLog);

  if (results.length > 0) {
    failOnError("Error: Lint", results);
  }
};

const lintChangelog = async (
  lintResults: Array<ILintResult>,
  changelog: IChangeLogContent,
  changelogLog: Array<IChangeLogLogEntry>,
) => {
  const actions = changelog.actions;

  if (actions === undefined) {
    lintResults.push({
      type: "Error",
      handler: "changelog",
      message: ".actions not present in changelog",
    });
  } else if (!Array.isArray(actions)) {
    lintResults.push({
      type: "Error",
      handler: "changelog",
      message: ".actions in changelog is not an array",
    });
  } else {
    const usedIDs = new Set();

    for (const action of actions) {
      if (action.id !== undefined) {
        if (usedIDs.has(action.id)) {
          lintResults.push({
            type: "Error",
            handler: "changelog",
            id: action.id ?? "undefined",
            message: `.id value has already been used in changelog`,
          });
        }
        usedIDs.add(action.id);
      }

      const changelogLogEntry = changelogLog.find((cll) =>
        cll.id === action.id
      );

      if (changelogLogEntry !== undefined) {
        if (calculateActionHash(action) !== changelogLogEntry.hash) {
          lintResults.push({
            type: "Error",
            handler: "changelog",
            id: action.id ?? "undefined",
            message: `Mismatch in hash values`,
          });
        }
      }

      const handler = await Handlers.find(action.type);
      if (handler === undefined) {
        lintResults.push({
          type: "Error",
          handler: "changelog",
          id: action.id ?? "undefined",
          message: `Unknown handler ${action.type}`,
        });
      } else {
        // deno-lint-ignore no-explicit-any
        handler.lint(lintResults, action as any);
      }
    }
  }
};

export const changeLogErrors = async (
  // deno-lint-ignore no-explicit-any
  changelog: any,
  changelogLog: Array<IChangeLogLogEntry> | undefined,
): Promise<Array<ILintResult>> => {
  const result: Array<ILintResult> = [];

  await lintChangelog(result, changelog, changelogLog ?? []);

  return result;
};
