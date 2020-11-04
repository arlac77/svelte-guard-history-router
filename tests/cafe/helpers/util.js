import { Selector } from "testcafe";

export const base =
  "http://localhost:5000/components/svelte-guard-history-router/tests/app";

export async function login(t) {
  if (await Selector("#submit").exists) {
    await t
      .typeText("#username", "user", { replace: true })
      .typeText("#password", "secret", { replace: true })
      .click("#submit");
  }
}
