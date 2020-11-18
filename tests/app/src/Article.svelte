<script>
  import { ObjectLink, Link } from "../../../src/index.svelte";

  export let router;

  const route = router.route;
</script>

<style>
  .price {
    font-weight: bold;
  }
</style>

{#if $route}
  <div class="card">
    <h2 class="card-title routetitle">Article {$route.name} ({$route.id})</h2>

    <img src="images/article/{$route.id}.jpg" alt={$route.name} />

    <div class="card-content">
      <div class="card-title">Price</div>
      <div id="price" class="price">{$route.price} $</div>
    </div>

    <div class="card-content">
      <div class="card-title">Category</div>
      <ObjectLink object={$route.category} />
    </div>

    <div class="card-content">
      <div class="card-title">ingredients</div>
      <ul>
        {#each $route.ingredients as ingredient}
          <li>{ingredient}</li>
        {/each}
      </ul>
    </div>

    <div class="card-action">
      <ObjectLink object={route.previous()}>Prevoius</ObjectLink>
      <ObjectLink object={route.next()}>Next</ObjectLink>
    </div>
  </div>
{:else}
  <h2 class="routetitle">No such article</h2>
{/if}
