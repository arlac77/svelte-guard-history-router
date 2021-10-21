<script>
  import * as style from "./main.css";
  import {
    Router,
    Route,
    MasterRoute,
    DetailRoute,
    Outlet,
    WaitingGuard,
    Guard,
    redirectGuard,
    NamedObjectLink
  } from "../../../src/index.svelte";
  import RouterState from "./RouterState.svelte";
  import About from "./About.svelte";
  import Articles from "./Articles.svelte";
  import Article from "./Article.svelte";
  import ArticleLink from "./ArticleLink.svelte";
  import Categories from "./Categories.svelte";
  import Category from "./Category.svelte";
  import Login from "./Login.svelte";
  import Home from "./Home.svelte";
  import NoWay from "./NoWay.svelte";
  import Waiting from "./Waiting.svelte";
  import { articles, categories } from "./data.js";
  import { session } from "./session.mjs";

  let showState = true;

  const waitingGuard = new WaitingGuard(Waiting);
  const enshureSession = redirectGuard("/login", () => !session);

  class AlwaysThrowGuard extends Guard {
    async enter(transition) {
      throw new Error("never go there");
    }
  }

  async function delay(msecs = 1000) {
    return new Promise(r => setTimeout(r, msecs));
  }

  async function* articleIterator(transition) {
    const v = transition.searchParams.get("q");
    const q = v ? new RegExp(v, "i") : /.*/;

    await delay(800);

    for (const a of Object.values(articles)) {
      if (a.name.match(q)) {
        yield a;
      }
    }
  }

  async function* categoryIterator(transition) {
    await delay(600);

    for (const c of Object.values(categories)) {
      yield c;
    }
  }
</script>

<Router initialized={(router=> console.log(router))}>
  <nav>
    <Route href="/" path="*" component={Home}>Router Example</Route>
    <ul class="left">
      <li>
        <Route path="/about" component={About}>About</Route>
      </li>
      <li>
        <Route
          path="/article"
          factory={MasterRoute}
          valueForTransition={articleIterator}
          guard={[enshureSession, waitingGuard]}
          component={Articles}>
          Articles
          <Route
            path="/:article"
            factory={DetailRoute}
            propertyMapping={{ article: 'id' }}
            linkComponent={ArticleLink}
            component={Article} />
        </Route>
      </li>
      <li>
        <Route
          path="/category"
          factory={MasterRoute}
          valueForTransition={categoryIterator}
          guard={[enshureSession, waitingGuard]}
          component={Categories}>
          Categories
          <Route
            path="/:category"
            factory={DetailRoute}
            propertyMapping={{ category: 'cid' }}
            linkComponent={NamedObjectLink}
            component={Category} />
        </Route>
      </li>
      <li>
        <Route path="/noway" guard={new AlwaysThrowGuard()} component={NoWay}>
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
    <Outlet />
    {#if showState}
      <RouterState />
    {/if}
  </main>
</Router>
