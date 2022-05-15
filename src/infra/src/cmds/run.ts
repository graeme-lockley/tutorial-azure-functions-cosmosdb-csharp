import {
  calculateActionHash,
  loadChangelog,
  loadChangelogLog,
  saveChangelogLog,
} from "../changelog.ts";
import actionHandlers from "../handlers.ts";
import { failOnError } from "../logging.ts";
import { changeLogErrors } from "./lint.ts";

export type IRunOptions = {
  logLogFileName: string;
  writeLogLog: boolean;
};

export const run = async (
  changelogFileName: string,
  options: IRunOptions,
) => {
  const changelog = loadChangelog(changelogFileName);
  const changelogLog = options.writeLogLog
    ? loadChangelogLog(options.logLogFileName)
    : undefined;
  const results = changeLogErrors(changelog, changelogLog);

  if (results.length > 0) {
    failOnError("Error: Lint", results);
  }

  const actions = changelog.actions;

  for (const action of actions) {
    const changelogLogEntry = changelogLog === undefined
      ? undefined
      : changelogLog.find((cll) => cll.id === action.id);

    if (changelogLogEntry === undefined) {
      const actionHandler = actionHandlers.find((ah) =>
        ah.type === action.type
      );

      console.log(
        `---| ${action.id}: ${action.type} |---------------------------------`,
      );

      // deno-lint-ignore no-explicit-any
      await actionHandler!.run(action as any);

      if (changelogLog !== undefined) {
        changelogLog.push({
          id: action.id,
          hash: calculateActionHash(action),
          when: new Date(),
        });
        await saveChangelogLog(options.logLogFileName, changelogLog);
      }
    }
  }
};
