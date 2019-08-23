<script>
  import { derived } from "svelte/store";

  import { Link } from "../../src/index.svelte";
  import { articles } from "./util.mjs";

  export let context;

  let article;

  const articleKey = context.keys.article;

  $: {
    article = $articles.find(a => a.id === $articleKey);
    //article = derived([articles, articleKey], ([$a, $b]) => $a.find($a => $a.id === $b));
  }

</script>

{#if article}
<h2 class="routetitle">Article {article.name}</h2>
<div>
Id: {article.id}
</div>
<Link href="/category/{article.category}">{article.category}</Link>

<Link href="/article/{ ("00" + (parseInt(article.id) + 1)).replace(/.*(\d\d)$/,'$1') }">Next</Link>
<Link href="/article/{ ("00" + (parseInt(article.id) - 1)).replace(/.*(\d\d)$/,'$1') }">Prev</Link>
{:else}
No such article {context.props.article}
{/if}