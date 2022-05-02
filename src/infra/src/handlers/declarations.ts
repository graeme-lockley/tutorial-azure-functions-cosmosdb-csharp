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
