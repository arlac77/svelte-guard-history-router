<script>
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
  import Categories from "./Categories.svelte";
  import Category from "./Category.svelte";
  import ArticlesRoute from "./ArticlesRoute.svelte";
  import Login from "./Login.svelte";
  import Home from "./Home.svelte";
  import NoWay from "./NoWay.svelte";
  import Waiting from "./Waiting.svelte";
  import { articles, categories } from "./data.mjs";
  import { session } from "./session.mjs";
  import { base } from "./constants.mjs";
  import { articleDelay, categoryDelay, showState } from "./localStore.mjs";

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

    await delay(articleDelay);

    for (const a of Object.values(articles)) {
      if (a.name.match(q)) {
        yield a;
      }
    }
  }

  async function* categoryIterator(transition) {
    await delay(categoryDelay);

    for (const c of Object.values(categories)) {
      yield c;
    }
  }
</script>

<Router {base}>
  <nav>
    <Route href="/" path="*" component={Home}>Router Example</Route>
    <ul class="left">
      <li>
        <Route path="/about" component={About}>About</Route>
      </li>
      <li>
        <ArticlesRoute
          guard={[enshureSession, waitingGuard]}
          source={articleIterator}
        >
          Articles
        </ArticlesRoute>
      </li>
      <li>
        <Route
          path="/category"
          factory={MasterRoute}
          iteratorFor={categoryIterator}
          guard={[enshureSession, waitingGuard]}
          component={Categories}
        >
          Categories
          <Route
            path="/:category"
            factory={DetailRoute}
            propertyMapping={{ category: "cid" }}
            linkComponent={NamedObjectLink}
            component={Category}
          >
            <ArticlesRoute />
          </Route>
        </Route>
      </li>
      <li>
        <Route path="/noway" guard={new AlwaysThrowGuard()} component={NoWay}>
          Does Not Work
        </Route>
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
