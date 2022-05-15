import {
  calculateActionHash,
  loadChangelog,
  loadChangelogLog,
  saveChangelogLog,
} from "../changelog.ts";
import actionHandlers from "../handlers.ts";
import { failOnError } from "../logging.ts";
import { changeLogErrors } from "./lint.ts";

export const run = async (
  changelogFileName: string,
  changelogLogFileName: string,
) => {
  const changelog = loadChangelog(changelogFileName);
  const changelogLog = loadChangelogLog(changelogLogFileName);
  const results = changeLogErrors(changelog, changelogLog);

  if (results.length > 0) {
    failOnError("Error: Lint", results);
  }

  const actions = changelog.actions;

  for (const action of actions) {
    const changelogLogEntry = changelogLog.find((cll) => cll.id === action.id);

    if (changelogLogEntry === undefined) {
      const actionHandler = actionHandlers.find((ah) =>
        ah.type === action.type
      );

      console.log(
        `---| ${action.id}: ${action.type} |---------------------------------`,
      );

      // deno-lint-ignore no-explicit-any
      await actionHandler!.run(action as any);

      changelogLog.push({
        id: action.id,
        hash: calculateActionHash(action),
        when: new Date(),
      });
      await saveChangelogLog(changelogLogFileName, changelogLog);
    }
  }
};
