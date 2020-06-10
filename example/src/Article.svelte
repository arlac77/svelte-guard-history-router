<script>
  import { Link, active, link } from "../../src/index.svelte";
  import { articles } from "./util.mjs";
  import { article, router } from "./index.mjs";
</script>


{#if $article}
  <h2 class="routetitle">Article {$article.name}</h2>
  <div>Id: {$article.id}</div>
  <div>Price: {$article.price}</div>
  <a href="/category/{$article.category}" use:link={router} use:active={router}>{$article.category}</a>

  <Link
    href="/article/{('00' + (parseInt($article.id) + 1)).replace(/.*(\d\d)$/, '$1')}">
    Next
  </Link>
  <Link
    href="/article/{('00' + (parseInt($article.id) - 1)).replace(/.*(\d\d)$/, '$1')}">
    Prev
  </Link>
{:else}No such article {router.params.article}{/if}
