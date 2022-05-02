// deno-lint-ignore no-explicit-any
export const failOnError = (...messages: any[]) => {
  console.error.apply(null, messages);
  Deno.exit(1);
};

// deno-lint-ignore no-explicit-any
export const failOnErrorWithUsage = (...messages: any[]) => {
  console.error.apply(null, messages);
  // showUsageHelp();
  Deno.exit(1);
};
