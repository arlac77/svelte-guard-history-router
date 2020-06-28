<script>
  import { ObjectLink } from "../../src/index.svelte";
  import { articlesRoute } from "./index.mjs"; 
</script>

<h2 class="routetitle">Articles</h2>

<ul>
  {#each $articlesRoute as article}
    <li>
      <ObjectLink object={article}>{article.name} ({article.id})</ObjectLink>
    </li>
  {/each}
</ul>
