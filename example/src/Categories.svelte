<script>
  import { Link } from "../../src/index.svelte";
  import { categories } from "./util.mjs"; 
</script>

<h2 class="routetitle">Categories</h2>

<ul>
  {#each $categories as category}
    <li>
      <Link href="/category/{category.name}">{category.name}</Link>
    </li>
  {/each}
</ul>
