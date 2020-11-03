<script>
  import { ObjectLink } from "../../../src/index.svelte";

  export let router;

  const route = router.route;

  let filter;

  $: {
    if (filter !== undefined && filter.length > 0) {
      router.push(router.path + "?q=" + filter);
    }
  }
</script>

<h2 class="routetitle">Articles</h2>

<input placeholder="Filter" bind:value={filter} />

<ul>
  {#each $route as article}
    <li>
      <ObjectLink object={article} suffix="#price" />
    </li>
  {/each}
</ul>
