<script>
  import { Link } from "../../src/index.svelte";

  export let context;

  let articles;

  $: articles = Object.values($context.articles || {});
</script>

<h2 class="routetitle">Articles</h2>

<ul>
  {#each articles as article}
    <li>
      <Link href="/article/{article.id}">{article.name} ({article.id})</Link>
    </li>
  {/each}
</ul>
