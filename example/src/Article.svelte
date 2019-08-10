<script>
  import { Link } from "../../src/index.svelte";

  export let context;

  let article;

  $: article = $context ? $context.article : {};
</script>

<h2 class="routetitle">Article {article.name}</h2>


<Link href="/category/{article.category}">Category</Link>