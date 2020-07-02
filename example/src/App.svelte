<script>
  import { Router, Route, Outlet, Link } from "../../src/index.svelte";
  import RouterState from "./RouterState.svelte";
  import About from "./About.svelte";
  import Articles from "./Articles.svelte";
  import Categories from "./Categories.svelte";
  import Login from "./Login.svelte";
  import Home from "./Home.svelte";
  import NoWay from "./NoWay.svelte";
  import {
    categoriesRoute,
    categoryRoute,
    articlesRoute,
    articleRoute,
    sessionGuard,
    waitingGuard,
    AlwaysThrowGuard
  } from "./index.mjs";

  let showState = true;
</script>

<Router
  routes={[categoriesRoute, categoryRoute, articlesRoute, articleRoute]}
  base="/modules/svelte-guard-history-router/example">
  <nav>
    <Route href="/" path="*" component={Home}>Router Example</Route>
    <ul class="left">
      <li>
        <Route path="/about" component={About}>About</Route>
      </li>
      <li>
        <Link href="/article">Articles</Link>
      </li>
      <li>
        <Link href="/category">Categories</Link>
      </li>
      <li>
        <Route path="/noway" guards={new AlwaysThrowGuard()} component={NoWay}>
          Does Not Work
        </Route>
      </li>
    </ul>
  </nav>
  <Route path="/login" component={Login} />

  <main>
    <Outlet>nothing there</Outlet>
  </main>

  <label for="state">
    show router state
    <input type="checkbox" bind:checked={showState} id="state" />
  </label>

  {#if showState}
    <RouterState />
  {/if}
</Router>
