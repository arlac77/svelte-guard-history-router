<script>
  import { Link } from "../../src/index.svelte";
  import { categoryRoute } from "./index.mjs";
</script>

{#if $categoryRoute}
  <h2 class="routetitle">Category {$categoryRoute.name}</h2>

  {#each $categoryRoute.articles as article}
    <li>
      <Link href="/article/{article.id}">{article.name} ({article.id})</Link>
    </li>
  {/each}
{:else}No such category{/if}
