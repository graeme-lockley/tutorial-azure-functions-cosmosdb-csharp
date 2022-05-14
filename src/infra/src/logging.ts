import { ICmd } from "./cmds/declarations.ts";

// deno-lint-ignore no-explicit-any
export const failOnError = (...messages: any[]) => {
  console.error.apply(null, messages);
  Deno.exit(1);
};

// deno-lint-ignore no-explicit-any
export const failOnErrorWithUsage = (commands: Array<ICmd>, ...messages: any[]) => {
  console.error.apply(null, messages);
  showUsageHelp(commands);
  Deno.exit(1);
};

const showUsageHelp = (commands: Array<ICmd>) => {
  console.log("Usage: infra-runner [command]");
  console.log();

  console.log("Commands:");
  commands.forEach((cmd) => {
    console.log(
      `  ${cmd.name} ${cmd.shortParameters}\t${cmd.shortDescription}`,
    );
  });
};

