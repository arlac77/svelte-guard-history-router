<script>
  import About from "./About.svelte";
  import Home from "./Home.svelte";
  import Waiting from "./Waiting.svelte";
  import Login from "./Login.svelte";
  import Article from "./Article.svelte";
  import Articles from "./Articles.svelte";
  import Category from "./Category.svelte";
  import { loadArticles, articles } from "./util.mjs";

  import {

    Outlet,
    Link,
    Router,
    RouterContext,
    Route,
    route,
    waitingGuard
  } from "../../src/index.svelte";

  const guardArticles = {
    enter: async context => {
      console.log("enter articles");
      context.articles = await loadArticles();
    },
    leave: context => {
      console.log("leave articles");
      delete context.articles;
    }
  };

  const guardLogin = {
    enter: async context => {
      console.log("enter login");

      if (!context.session) {
        await context.router.push("/login");
      }

      context.session = true;
    },
    leave: context => {
      console.log("leave login");
      delete context.session;
    }
  };

  const wg = waitingGuard(Waiting, 300);

  const router = new Router([
    route("/*", Home),
    route("/about", About),
    route("/login", Login),
    route("/article", guardArticles, Articles),
    route("/article/:article", guardArticles, Article),
    route("/category/:category", Category)
  ]);

  let article;

  const k = router.keys.get("article");

  $: {
    article = $k;

    const c = $router.context;

    if (c.articles) {
      c.article = c.articles[article];
    } else {
      c.article = {};
    }
    console.log("SET article", article, c.article);
  }

</script>

<div>
  <h1 class="routetitle">svelte-guard-history-router example</h1>
  <Link href="/about">About</Link>
  <Link href="/">Home</Link>
  <Link href="/article">List</Link>
  <Link href="/article/01">Article 01</Link>
  <Link href="/article/02">Article 02</Link>

  <Outlet {router}>nothing there</Outlet>

  <RouterContext {router}/>
</div>
