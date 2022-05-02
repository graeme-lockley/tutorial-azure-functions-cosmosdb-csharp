import { assertEquals } from "https://deno.land/std@0.137.0/testing/asserts.ts";

import { evaluate } from "./expression-evaluation.ts";

Deno.test("Expression without a $ returns its literal value", async () => {
  assertEquals(await evaluate("hello"), "hello");
  assertEquals(await evaluate(""), "");
});

Deno.test("Expression with a $ and a literal returns the literal", async () => {
  assertEquals(await evaluate("hel ${1} lo"), "hel 1 lo");
  assertEquals(await evaluate("a${123}b"), "a123b");
});

Deno.test("Expression with a $ and an expression returns the result", async () => {
  assertEquals(await evaluate("hel ${1 + 2} lo"), "hel 3 lo");
  assertEquals(
    await evaluate("hel ${(() => { const x = 10 ; return x + 2; })()} lo"),
    "hel 12 lo",
  );
  assertEquals(
    await evaluate("hel ${env('PATH')} lo"),
    `hel ${Deno.env.get("PATH")} lo`,
  );
  assertEquals(
    await evaluate(
      "hel ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((n) => n % 2 === 0).reduce((a, b) => a + b, 0)} lo",
    ),
    `hel 30 lo`,
  );
});
