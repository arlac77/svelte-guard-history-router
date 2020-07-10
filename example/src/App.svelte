<script>
  import { Router, Route, Outlet, Link } from "../../src/index.svelte";
  import RouterState from "./RouterState.svelte";
  import About from "./About.svelte";
  import Articles from "./Articles.svelte";
  import Article from "./Article.svelte";
  import ArticleLink from "./ArticleLink.svelte";
  import Categories from "./Categories.svelte";
  import Category from "./Category.svelte";
  import CategoryLink from "./CategoryLink.svelte";
  import Login from "./Login.svelte";
  import Home from "./Home.svelte";
  import NoWay from "./NoWay.svelte";
  import {
    ArticlesRoute,
    ArticleRoute,
    CategoriesRoute,
    CategoryRoute,
    enshureSession,
    waitingGuard,
    AlwaysThrowGuard
  } from "./index.mjs";

  let showState = true;
</script>

<Router base="/components/svelte-guard-history-router/example">
  <nav>
    <Route href="/" path="*" component={Home}>Router Example</Route>
    <ul class="left">
      <li>
        <Route path="/about" component={About}>About</Route>
      </li>
      <li>
        <Route
          path="/article"
          factory={ArticlesRoute}
          guards={[enshureSession, waitingGuard]}
          component={Articles}>
          Articles
          <Route
            path="/:article"
            factory={ArticleRoute}
            linkComponent={ArticleLink}
            component={Article} />
        </Route>
      </li>
      <li>
        <Route
          path="/category"
          factory={CategoriesRoute}
          guards={[enshureSession, waitingGuard]}
          component={Categories}>
          Categories
          <Route
            path="/:category"
            factory={CategoryRoute}
            linkComponent={CategoryLink}
            component={Category} />
        </Route>
      </li>
      <li>
        <Route path="/noway" guards={new AlwaysThrowGuard()} component={NoWay}>
          Does Not Work
        </Route>
      </li>
    </ul>
    <ul>
      <li>
        Router
        <input type="checkbox" bind:checked={showState} id="state" />
      </li>
    </ul>
  </nav>
  <Route path="/login" component={Login} />

  <main>
    <Outlet/>
  </main>

  {#if showState}
    <RouterState />
  {/if}
</Router>
