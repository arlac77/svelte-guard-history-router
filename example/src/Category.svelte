<script>
  import { ObjectLink } from "../../src/index.svelte";
  import { categoryRoute } from "./index.mjs";
</script>

{#if $categoryRoute}
  <h2 class="routetitle">Category {$categoryRoute.name}</h2>

  {#each $categoryRoute.articles as article}
    <li>
      <ObjectLink object={article}>{article.name} ({article.id})</ObjectLink>
    </li>
  {/each}
{:else}No such category{/if}
