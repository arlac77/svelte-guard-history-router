<script>
  import About from "./About.svelte";
  import Home from "./Home.svelte";
  import Login from "./Login.svelte";
  import Article from "./Article.svelte";
  import Articles from "./Articles.svelte";
  import ArticleHistory from "./ArticleHistory.svelte";

  import { Outlet, Link, Router, route } from "../../src/index.svelte";

  const articles = {
    "01": { name: "Peanutbutter" },
    "02": { name: "Cheesecake" },
    "03": { name: "Pizza" }
  };

  Object.keys(articles).forEach(id => (articles[id].id = id));

  const guardArticles = {
    enter: context => {
      console.log('enter articles');
      context.articles = articles;
    },
    leave: context => {
      console.log('leave articles');
      delete context.articles;
    }
  };

  const guardArticle = {
    enter: context => {
      console.log('enter article');
      const article = articles[context.params.article];
      context.article = article;
    },
    leave: context => {
      console.log('leave article');
      delete context.article;
    }
  };

  const guardLogin = {
    enter: context => {
      console.log('enter login');
      context.session = true;
    },
    leave: context => {
      console.log('leave login');
      delete context.session;
    }
  };
  
  const router = new Router([
    route("/*", Home),
    route("/about", About),
    route("/login", Login),
    route("/article", guardLogin, guardArticles, Articles),
    route("/article/:article", guardLogin, guardArticle, Article),
    route("/article/:article/history", guardLogin, guardArticle, ArticleHistory)
  ]);
</script>

<div>
  <h1 class="routetitle">svelte-guard-history-router example</h1>

  <Link href="/about">About</Link>
  <Link href="/">Home</Link>
  <Link href="/sonstwo">Also Home</Link>
  <Link href="/article">List</Link>
  <Link href="/article/01">Article 01</Link>
  <Link href="/article/02">Article 02</Link>
  <Link href="/article/03/history">Article 03 History</Link>

  <Outlet {router}>nichts gefunden</Outlet>
</div>
