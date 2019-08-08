<script>
  export let context;

  let username = "";
  let password = "";
  let message;

  async function submit() {
    try {
      await login(username, password);
      context.router.push("/");
    } catch (e) {
      message = e;
    }
  }

  async function login(username, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === "user1" && password === "1234") {
          resolve();
        } else {
          reject(new Error("invalid credentials"));
        }
      }, 500);
    });
  }
</script>

<div>
  <form on:submit|preventDefault={submit}>

    {#if message}
      <div>{message}</div>
    {/if}

    <fieldset>
      <label>Username</label>
      <input
        type="text"
        placeholder="Username"
        name="username"
        bind:value={username} />
    </fieldset>

    <fieldset>
      <label>Password</label>
      <input
        type="password"
        placeholder="Password"
        name="password"
        bind:value={password} />
    </fieldset>

    <div>
      <button type="submit" disabled={!username || !password}>Login</button>
    </div>
  </form>
</div>
