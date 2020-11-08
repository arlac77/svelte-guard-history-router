<script>
  import { ObjectLink } from "../../../src/index.svelte";

  export let router;

  const route = router.route;
</script>

{#if $route}
  <div class="card">
    <h2 class="card-title routetitle">Category {$route.name}</h2>

    <div class="card-content">
      {#each $route.articles as article}
        <li>
          <ObjectLink object={article} />
        </li>
      {/each}
    </div>
  </div>
{:else}
  <h2 class="routetitle">No such category</h2>
{/if}
