<script>
  import {
    TargetRoute,
    Outlet,
    Link,
    link,
    active
  } from "../../src/index.svelte";
  import RouterState from "./RouterState.svelte";
  import About from "./About.svelte";
  import Home from "./Home.svelte";

  import { router } from "./index.mjs";

  let showState = true;
</script>

<nav>
  <a href="/" use:link={router} use:active={router}>Router Example</a>
  <ul class="left">
    <li>
      <TargetRoute href='/about' component={About} {router}>About</TargetRoute>
    </li>
    <li>
      <a href="/article" use:link={router} use:active={router}>Articles</a>
    </li>
    <li>
      <a href="/category" use:link={router} use:active={router}>Categories</a>
    </li>
    <li>
      <a href="/noway" use:link={router} use:active={router}>Does Not Work</a>
    </li>
  </ul>
</nav>
<main>
  <Outlet {router}>nothing there</Outlet>
</main>

<label for="state">
  show router state
  <input type="checkbox" bind:checked={showState} id="state" />
</label>

{#if showState}
  <RouterState {router} />
{/if}
