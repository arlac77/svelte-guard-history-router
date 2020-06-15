<script>
  import { Link, active, link } from "../../src/index.svelte";
  import { articleRoute, router } from "./index.mjs";
</script>


{#if $articleRoute}
  <h2 class="routetitle">Article {$articleRoute.name}</h2>
  <div>Id: {$articleRoute.id}</div>
  <div>Price: {$articleRoute.price}</div>
  <a href="/category/{$articleRoute.category}" use:link={router} use:active={router}>{$articleRoute.category}</a>

  <Link
    href="/article/{('00' + (parseInt($articleRoute.id) + 1)).replace(/.*(\d\d)$/, '$1')}">
    Next
  </Link>
  <Link
    href="/article/{('00' + (parseInt($articleRoute.id) - 1)).replace(/.*(\d\d)$/, '$1')}">
    Prev
  </Link>
{:else}No such article{/if}
