<script>
  import About from "./About.svelte";
  import Home from "./Home.svelte";
  import Waiting from "./Waiting.svelte";
  import Login from "./Login.svelte";
  import Article from "./Article.svelte";
  import Articles from "./Articles.svelte";
  import Categories from "./Categories.svelte";
  import Category from "./Category.svelte";

  import {
    Outlet,
    Link,
    Router,
    RouterContext,
    Route,
    route,
    waitingGuard
  } from "../../src/index.svelte";

  const router = new Router([
    route("/*", Home),
    route("/about", About),
    route("/login", Login),
    route("/article", Articles),
    route("/article/:article", Article),
    route("/category", Categories),
    route("/category/:category", Category)
  ]);

</script>

<div>
  <h1 class="routetitle">Example</h1>
  <Link href="/about">About</Link>
  <Link href="/">Home</Link>
  <Link href="/article">Articles</Link>
  <Link href="/category">Categories</Link>

  <Outlet {router}>nothing there</Outlet>

  <RouterContext {router} />
</div>
