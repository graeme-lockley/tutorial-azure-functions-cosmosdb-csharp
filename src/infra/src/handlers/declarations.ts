export type ILintResult = {
  type: "Warning" | "Error";
  handler: string;
  id?: string;
  message: string;
};

export type IAction = {
  id: string;
  type: string;
};

export type IActionHandler<T extends IAction> = {
  type: string;
  lint: (lintResult: Array<ILintResult>, action: T) => void;
  run: (action: T) => Promise<void>;
};

export const lintFieldNotUndefinedNotEmpty = (
  value: string | undefined,
  handlerName: string,
  name: string,
  result: Array<ILintResult>,
) => {
  if (value === undefined) {
    result.push({
      type: "Error",
      handler: handlerName,
      message: `.${name} is undefined`,
    });
  }
  if (value === "") {
    result.push({
      type: "Error",
      handler: handlerName,
      message: `.${name} may not be the empty string`,
    });
  }
};
