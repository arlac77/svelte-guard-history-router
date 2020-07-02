<script>
  import { ObjectLink, Link } from "../../src/index.svelte";
  import { articleRoute } from "./index.mjs";
</script>

{#if $articleRoute}
  <h2 class="routetitle">Article {$articleRoute.name}</h2>
  <div>Id: {$articleRoute.id}</div>
  <div>Price: {$articleRoute.price}</div>
  <ObjectLink object={$articleRoute.category}/>

  <Link
    href="/article/{('00' + (parseInt($articleRoute.id) + 1)).replace(/.*(\d\d)$/, '$1')}">
    Next
  </Link>
  <Link
    href="/article/{('00' + (parseInt($articleRoute.id) - 1)).replace(/.*(\d\d)$/, '$1')}">
    Prev
  </Link>
{:else}No such article{/if}
