<script>
  import { Link } from "../../src/index.svelte";
  import { articles } from "./util.mjs";
  import { article } from "./index.mjs";

  export let state;

</script>

{#if $article}
  <h2 class="routetitle">Article {$article.name}</h2>
  <div>Id: {$article.id}</div>
  <div>Price: {$article.price}</div>
  <Link href="/category/{$article.category}">{$article.category}</Link>

  <Link
    href="/article/{('00' + (parseInt($article.id) + 1)).replace(/.*(\d\d)$/, '$1')}">
    Next
  </Link>
  <Link
    href="/article/{('00' + (parseInt($article.id) - 1)).replace(/.*(\d\d)$/, '$1')}">
    Prev
  </Link>
{:else}No such article {state.params.article}{/if}
