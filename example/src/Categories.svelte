<script>
  import { Link } from "../../src/index.svelte";
  import { categoriesRoute } from "./index.mjs"; 
</script>

<h2 class="routetitle">Categories</h2>

<ul>
  {#each $categoriesRoute as category}
    <li>
      <Link href="/category/{category.name}">{category.name}</Link>
    </li>
  {/each}
</ul>
