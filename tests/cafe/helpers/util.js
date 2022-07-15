import { Selector } from "testcafe";

export const base =
  "http://localhost:4173/examples/svelte-guard-history-router/";

export async function login(t) {
  if (await Selector("#submit").exists) {
    await t
      .typeText("#username", "user", { replace: true })
      .typeText("#password", "secret", { replace: true })
      .click("#submit");
  }
}
