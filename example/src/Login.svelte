<script>
  export let context;

  let username;
  let password = "";

  async function submit() {
    await login(username, password);
    context.router.push("/");
   }
   
   async function login(username,password) {
     return new Promise((resolve,reject) => {
       setTimeout(() => {
          if(user === 'user1' && password === '1234') 
          resolve() else reject(); } ,2000);
     }
     );
   }
   
</script>

<div>
  <form on:submit|preventDefault={submit}>
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
      <button type="submit" disabled={!username || !password}>
        Login
      </button>
    </div>
  </form>
</div>
