import {
  IChangeLogLogEntry,
  loadChangelog,
  loadChangelogLog,
  saveChangelogLog,
} from "../changelog.ts";
import * as Handlers from "../handlers.ts";
import { IAction } from "../handlers/declarations.ts";
import { failOnError } from "../logging.ts";
import { changeLogErrors } from "./lint.ts";

export type IRollbackOptions = {
  logLogFileName: string;
  all?: boolean | undefined;
  to?: string | undefined;
};

export const rollback = async (
  changelogFileName: string,
  options: IRollbackOptions,
) => {
  const changelog = loadChangelog(changelogFileName);
  const changelogLog = loadChangelogLog(options.logLogFileName);
  const results = await changeLogErrors(changelog, changelogLog);

  if (results.length > 0) {
    failOnError("Error: rollback:", results);
  }

  if (options.all !== undefined && options.all && options.to !== undefined) {
    failOnError("Error: rollback: Cannot simultaneously use --all and --to");
  }

  const actions = changelog.actions;

  if (options.to !== undefined) {
    if (changelogLog.find((cl) => cl.id === options.to) === undefined) {
      failOnError(
        "Error: rollback: --to id is not in the changelog history:",
        options.to,
      );

      while (changelogLog.length > 0) {
        const entry = changelogLog[changelogLog.length - 1];

        await rollbackLast(actions, changelogLog, options);

        if (entry.id === options.to) {
          break;
        }
      }
    }
  } else if (options.all !== undefined && options.all) {
    while (changelogLog.length > 0) {
      await rollbackLast(actions, changelogLog, options);
    }
  } else {
    if (changelogLog.length === 0) {
      failOnError("Error: rollback: All changes rolled back");
    }

    await rollbackLast(actions, changelogLog, options);
  }
};

const rollbackLast = async (
  actions: Array<IAction>,
  changelogLog: Array<IChangeLogLogEntry>,
  options: IRollbackOptions,
) => {
  const entry = changelogLog[changelogLog.length - 1];
  const entryAction = actions.find((action) => action.id === entry.id);

  if (entryAction === undefined) {
    failOnError("Error: rollback: No changelog entry found with id", entry.id);
    Deno.exit(1);
  }
  console.log(
    `---| ${entryAction.id}: ${entryAction.type} |---------------------------------`,
  );

  const actionHandler = await Handlers.find(entryAction.type);

  // deno-lint-ignore no-explicit-any
  await actionHandler!.rollback(entryAction as any, undefined);

  changelogLog.pop();
  await saveChangelogLog(options.logLogFileName, changelogLog);
};
