#!/usr/bin/env deno run --allow-read --allow-run --allow-write --allow-env

import * as CLI from "https://raw.githubusercontent.com/littlelanguages/deno-lib-console-cli/0.1.2/mod.ts";
import { deriveChangelogLogFileName } from "./src/changelog.ts";

import * as Lint from "./src/cmds/lint.ts";
import * as Run from "./src/cmds/run.ts";

const runCmd = new CLI.ValueCommand(
  "run",
  "Lint and then run the changelog",
  [],
  {
    name: "Changelog file name",
    optional: false,
    help: "The name of the changelog to be processed",
  },
  async (
    _: CLI.Definition,
    fileName: string | undefined,
    _vals: Map<string, unknown>,
  ) => {
    await Run.run(fileName!, deriveChangelogLogFileName(fileName!));
  },
);

const lintCmd = new CLI.ValueCommand(
  "lint",
  "Lint the changelog and report warnings and errors",
  [],
  {
    name: "Changelog file name",
    optional: false,
    help: "The name of the changelog to lint",
  },
  async (
    _: CLI.Definition,
    fileName: string | undefined,
    _vals: Map<string, unknown>,
  ) => {
    await Lint.lint(fileName!, deriveChangelogLogFileName(fileName!));
  },
);

const cli = {
  name: "infra-runner",
  help: "Infrastructure runner to process a changelog",
  options: [CLI.helpFlag],
  cmds: [lintCmd, runCmd, CLI.helpCmd],
};

CLI.process(cli);
