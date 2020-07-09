<script>
  import { ObjectLink } from "../../src/index.svelte";

  export let router;

  const route = router.route;
</script>

<h2 class="routetitle">Categories</h2>

<ul>
  {#each $route as category}
    <li>
      <ObjectLink object={category}/>
    </li>
  {/each}
</ul>
