<script>
  import {onMount } from "svelte";
  import { ObjectLink } from "../../../src/index.svelte";

  export let router;

  const route = router.route;
  const articles = route.value;
  let filter;

  onMount(() => {
    filter = router.searchParams.get('q');
  });

  $: {
    if (filter && filter.length > 0) {
      router.push(router.path.replace(/\?.*/,'') + "?q=" + filter);
    }
  }
</script>

<h2 class="routetitle">Articles</h2>

<input id="filter" placeholder="Filter" bind:value={filter} />

<ul>
  {#each articles as article}
    <li>
      <ObjectLink object={article} suffix="#price" />
    </li>
  {/each}
</ul>
