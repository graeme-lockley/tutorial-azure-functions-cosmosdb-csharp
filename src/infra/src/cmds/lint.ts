import {
  calculateActionHash,
  IChangeLogContent,
  IChangeLogLogEntry,
  loadChangelog,
  loadChangelogLog,
} from "../changelog.ts";
import actionHandlers from "../handlers.ts";
import { failOnError } from "../logging.ts";

export type ILintResult = {
  type: "Warning" | "Error";
  handler: string;
  id?: string;
  message: string;
};

export const lint = (
  changelogFileName: string,
  changelogLogFileName: string,
) => {
  const changelog = loadChangelog(changelogFileName);
  const changelogLog = loadChangelogLog(changelogLogFileName);
  const results = changeLogErrors(changelog, changelogLog);

  if (results.length > 0) {
    failOnError("Error: Lint", results);
  }
};

const lintChangelog = (
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
    actions.forEach((action) => {
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

      const handler = actionHandlers.find((h) => h.type === action.type);
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
    });
  }
};

export const changeLogErrors = (
  // deno-lint-ignore no-explicit-any
  changelog: any,
  changelogLog: Array<IChangeLogLogEntry>,
): Array<ILintResult> => {
  const result: Array<ILintResult> = [];

  lintChangelog(result, changelog, changelogLog);

  return result;
};
