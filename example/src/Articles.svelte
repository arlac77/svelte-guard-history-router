<script>
  import { Link } from "../../src/index.svelte";
  import { articlesRoute } from "./index.mjs"; 
</script>

<h2 class="routetitle">Articles</h2>

<ul>
  {#each $articlesRoute as article}
    <li>
      <Link href="/article/{article.id}">{article.name} ({article.id})</Link>
    </li>
  {/each}
</ul>
