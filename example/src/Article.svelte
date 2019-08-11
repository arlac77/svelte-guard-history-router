<script>
  import { Link } from "../../src/index.svelte";

  export let context;

  let article;

  $: article = $context ? $context.article : { id: "00" };
</script>

<h2 class="routetitle">Article {article.name}</h2>
<div>
Id: {article.id}

</div>
<Link href="/category/{article.category}">{article.category}</Link>

<Link href="/article/{ ("00" + (parseInt(article.id) + 1)).replace(/.*(\d\d)$/,'$1') }">Next</Link>
<Link href="/article/{ ("00" + (parseInt(article.id) - 1)).replace(/.*(\d\d)$/,'$1') }">Prev</Link>
