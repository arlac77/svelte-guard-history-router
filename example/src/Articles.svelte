<script>
  import { Link } from "../../src/index.svelte";

  export let context;

  let articles;

  context.subscribe(c => (articles = Object.values(c.articles)));
</script>

<h2 class="routetitle">Articles</h2>

<ul>
  {#each articles as article}
    <li>
      {article.id}
      <Link href="/article/{article.id}">{article.name}</Link>
    </li>
  {/each}
</ul>
