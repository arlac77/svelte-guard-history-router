<script>
  import About from "./About.svelte";
  import Home from "./Home.svelte";
  import Waiting from "./Waiting.svelte";
  import Login from "./Login.svelte";
  import Article from "./Article.svelte";
  import Articles from "./Articles.svelte";
  import ArticleHistory from "./ArticleHistory.svelte";
  import { loadArticles, articles } from "./util.mjs";

  import { Outlet, Link, Router, param, Route, route, waitingGuard } from "../../src/index.svelte";


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

  const guardArticle = {
    enter: context => {
      console.log("enter article");
      const article = articles[context.params.article];
      context.article = article;
    },
    leave: context => {
      console.log("leave article");
      delete context.article;
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

  const wg = waitingGuard(Waiting,300);

  const router = new Router([
      route("/*", Home),
      route("/about", About),
      route("/login", Login),
      route("/article", wg, guardLogin, guardArticles, Articles),
      route("/article/:article", wg, guardLogin, guardArticle, Article),
      route(
        "/article/:article/history",
        wg,
        guardLogin,
        guardArticle,
        ArticleHistory
      )
    ],
    [param('article')]
    );

    let article;

    $: article = $router.param.article;

</script>

<div>
  <h1 class="routetitle">svelte-guard-history-router example</h1>
  <div>{article}</div>
  <Link href="/about">About</Link>
  <Link href="/">Home</Link>
  <Link href="/article">List</Link>
  <Link href="/article/01">Article 01</Link>
  <Link href="/article/02">Article 02</Link>
  <Link href="/article/03/history">Article 03 History</Link>
  
  <Outlet {router}>nichts gefunden</Outlet>
</div>
