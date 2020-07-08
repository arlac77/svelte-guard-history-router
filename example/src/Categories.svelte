<script>
  import { ObjectLink } from "../../src/index.svelte";
  import { categoriesRoute } from "./index.mjs"; 
</script>

<h2 class="routetitle">Categories</h2>

<ul>
  {#each $categoriesRoute as category}
    <li>
      <ObjectLink object={category}/>
    </li>
  {/each}
</ul>
