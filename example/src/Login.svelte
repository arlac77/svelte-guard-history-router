<script>
  import { setSession } from "./index.mjs";

  export let router;

  let username = "user";
  let password = "secret";
  let message;

  async function submit() {
    try {
      await login(username, password);
      setSession({ username });
      await router.continue();
    } catch (e) {
      console.log(e);
      message = e;
    }
  }

  async function login(username, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === "user" && password === "secret") {
          sessionStorage.session = { username, password };
          resolve();
        } else {
          reject(new Error("invalid credentials"));
        }
      }, 500);
    });
  }
</script>

<div class="center">
  <form on:submit|preventDefault={submit}>
    {#if message}
      <div id="message">{message}</div>
    {/if}

    <label for="username">
      Username
      <input
        id="username"
        type="text"
        placeholder="Username"
        name="username"
        size="20"
        required
        bind:value={username} />
    </label>
    <label for="password">
      Password
      <input
        id="password"
        type="password"
        placeholder="Password"
        name="password"
        size="20"
        required
        bind:value={password} />
    </label>
    <button id="submit" type="submit" disabled={!username || !password}>
      Login
    </button>
  </form>
</div>
