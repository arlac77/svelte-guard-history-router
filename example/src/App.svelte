<script>
  import {
    TheRouter,
    TargetRoute,
    Outlet,
    Link,
    link,
    active
  } from "../../src/index.svelte";
  import RouterState from "./RouterState.svelte";
  import About from "./About.svelte";
  import Articles from "./Articles.svelte";
  import Categories from "./Categories.svelte";
  import Login from "./Login.svelte";
  import Home from "./Home.svelte";
  import NoWay from "./NoWay.svelte";

  import { router, sessionGuard, waitingGuard, AlwaysThrowGuard } from "./index.mjs";

  let showState = true;
</script>

<TheRouter base="" {router}>
  <nav>
    <TargetRoute path="/" component={Home}>Router Example</TargetRoute>
    <ul class="left">
      <li>
        <TargetRoute path="/about" component={About}>About</TargetRoute>
      </li>
      <li>
        <TargetRoute
          path="/article"
          guards={[sessionGuard, waitingGuard]}
          component={Articles}>
          Articles
        </TargetRoute>
      </li>
      <li>
        <TargetRoute
          path="/category"
          guards={[sessionGuard]}
          component={Categories}>
          Categories
        </TargetRoute>
      </li>
      <li>
        <a href="/noway" use:link={router} use:active={router}>Does Not Work</a>
      </li>
    </ul>
  </nav>
  <TargetRoute path="/login" component={Login} />
  <TargetRoute path="/noway" guards={[new AlwaysThrowGuard()]} component={NoWay} />
  <!--
  <TargetRoute path="*" component={Home} />-->


  <main>
    <Outlet>nothing there</Outlet>
  </main>
</TheRouter>

<label for="state">
  show router state
  <input type="checkbox" bind:checked={showState} id="state" />
</label>

{#if showState}
  <RouterState {router} />
{/if}
