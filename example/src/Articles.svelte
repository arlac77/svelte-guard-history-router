<script>
  import { ObjectLink } from "../../src/index.svelte";

  export let router;

  const route = router.route;
</script>

<h2 class="routetitle">Articles</h2>

<ul>
  {#each $route as article}
    <li>
      <ObjectLink object={article} suffix="#price"/>
    </li>
  {/each}
</ul>
