<script>
  import { Link } from "../../src/index.svelte";
  import { category, router } from "./index.mjs";

</script>

{#if $category}
  <h2 class="routetitle">Category {$category.name}</h2>

  {#each $category.articles as article}
    <li>
      <Link href="/article/{article.id}">{article.name} ({article.id})</Link>
    </li>
  {/each}
{:else}No such category {router.state.params.category}{/if}
