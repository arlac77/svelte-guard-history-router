<script>
  import { ObjectLink } from "../../../src/index.svelte";

  export let router;

  const route = router.route;
  const categories = route.value;
</script>

<h2 class="routetitle">Categories</h2>

<ul>
  {#each categories as category}
    <li>
      <ObjectLink object={category} />
    </li>
  {/each}
</ul>
