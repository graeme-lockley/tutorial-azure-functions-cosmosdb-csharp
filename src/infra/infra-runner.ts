#!/usr/bin/env -S deno run --allow-read --allow-run --allow-write --allow-env

import * as CLI from "https://raw.githubusercontent.com/littlelanguages/deno-lib-console-cli/0.1.2/mod.ts";
import { deriveChangelogLogFileName } from "./src/changelog.ts";

import * as Lint from "./src/cmds/lint.ts";
import * as Run from "./src/cmds/run.ts";

const runCmd = new CLI.ValueCommand(
  "run",
  "Lint and then run the changelog",
  [
    new CLI.FlagOption(
      ["--no-log", "-nl"],
      "Does not write out the runner state to a changelog log file",
    ),
  ],
  {
    name: "Changelog file name",
    optional: false,
    help: "The name of the changelog to be processed",
  },
  (
    _: CLI.Definition,
    fileName: string | undefined,
    values: Map<string, unknown>,
  ) =>
    Run.run(fileName!, {
      logLogFileName: deriveChangelogLogFileName(fileName!),
      writeLogLog: !values.has("no-log"),
    }),
);

const lintCmd = new CLI.ValueCommand(
  "lint",
  "Lint the changelog and report warnings and errors",
  [
    new CLI.FlagOption(
      ["--no-log", "-nl"],
      "Does not write out the runner state to a changelog log file",
    ),
  ],
  {
    name: "Changelog file name",
    optional: false,
    help: "The name of the changelog to lint",
  },
  (
    _: CLI.Definition,
    fileName: string | undefined,
    values: Map<string, unknown>,
  ) =>
    Lint.lint(fileName!, {
      logLogFileName: deriveChangelogLogFileName(fileName!),
      writeLogLog: !values.has("no-log"),
    }),
);

const cli = {
  name: "infra-runner",
  help: "Infrastructure runner to process a changelog",
  options: [CLI.helpFlag],
  cmds: [lintCmd, runCmd, CLI.helpCmd],
};

CLI.process(cli);
