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
  <h2 class="routetitle">Article {$route.name}</h2>
  <div>Id: {$route.id}</div>
  <div id="price" class="price">{$route.price} $</div>
  <ObjectLink object={$route.category} />

  <div>
    <Link
      href="/article/{('00' + (parseInt($route.id) + 1)).replace(/.*(\d\d)$/, '$1')}">
      Next
    </Link>
    <Link
      href="/article/{('00' + (parseInt($route.id) - 1)).replace(/.*(\d\d)$/, '$1')}">
      Prev
    </Link>
  </div>
{:else}No such article{/if}
