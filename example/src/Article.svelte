<script>
  import { ObjectLink, Link } from "../../src/index.svelte";
  import { articleRoute } from "./index.mjs";
</script>

<style>
.price {
  font-weight: bold
}
</style>
{#if $articleRoute}
  <h2 class="routetitle">Article {$articleRoute.name}</h2>
  <div>Id: {$articleRoute.id}</div>
  <div class="price">{$articleRoute.price} $</div>
  <ObjectLink object={$articleRoute.category} />

  <div>
    <Link
      href="/article/{('00' + (parseInt($articleRoute.id) + 1)).replace(/.*(\d\d)$/, '$1')}">
      Next
    </Link>
    <Link
      href="/article/{('00' + (parseInt($articleRoute.id) - 1)).replace(/.*(\d\d)$/, '$1')}">
      Prev
    </Link>
  </div>
{:else}No such article{/if}
