<script>
  import { ObjectLink } from "../../../src/index.svelte";

  export let router;

  const route = router.route;
</script>

{#if $route}
  <h2 class="routetitle">Category {$route.name}</h2>

  {#each $route.articles as article}
    <li>
      <ObjectLink object={article}/>
    </li>
  {/each}
{:else}No such category{/if}
