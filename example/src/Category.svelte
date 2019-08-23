<script>
  import { Link } from "../../src/index.svelte";
  import { categories } from "./util.mjs";

  export let context;

  let category;

  const categoryKey = context.keys.category;

  $: {
    category = $categories.find(a => a.name === $categoryKey);
  }
</script>


{#if category}
<h2 class="routetitle">Category {category.name}</h2>
{:else}
No such category {context.props.category}
{/if}
