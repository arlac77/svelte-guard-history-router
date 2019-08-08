<script>
  import About from "./About.svelte";
  import Home from "./Home.svelte";
  import Article from "./Article.svelte";
  import Articles from "./Articles.svelte";
  import ArticleHistory from "./ArticleHistory.svelte";

  import { Outlet, Link, Router, route} from "../../src/index.svelte";

  const articles = {
    '0001' : { name: "Peanutbutter" },
    '0002' : { name: "Cheeskacke" },
    '0003' : { name: "Pizza" }
  };

 Object.keys(articles).forEach(id => articles[id].id = id);

  function prepareArticles() {
    return {
      enter: (context) => {
        context.articles = articles;
      },
      leave: (context) => {
        delete context.articles;
      }
    };
  }

  function prepareArticle() {
    return {
      enter: (context) => {
        const article = articles[context.params.article];
        context.article = article;
      },
      leave: (context) => {
        delete context.article;
      }
    };
  }

  const router = new Router([
    route("/about", About),
    route("/*", Home),
    route("/article", prepareArticles(), Articles),
    route("/article/:article", prepareArticle(), Article),
    route("/article/:article/history", prepareArticle(), ArticleHistory)
    ]);

</script>

<div>
  <h1 class="routetitle">svelte-guard-history-router example</h1>

  <Link href="/about">About</Link>
  <Link href="/">Home</Link>
  <Link href="/sonstwo">Also Home</Link>
  <Link href="/article">List</Link>
  <Link href="/article/0001">Article 1</Link>
  <Link href="/article/0002">Article 2</Link>
  <Link href="/article/0003/history">Article 3 History</Link>
  
  <Outlet {router}>nichts gefunden</Outlet>
</div>
