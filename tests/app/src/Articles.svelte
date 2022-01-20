<script>
  import { onMount } from "svelte";
  import { ObjectLink } from "../../../src/index.svelte";

  export let router;

  const route = router.route;
  const articles = route.value;
  let filter;
  let searchParams;

  onMount(() => {
    searchParams = router.searchParams;
    filter = searchParams.get("q");
  });

  $: {
    if (filter && filter.length > 0) {
      searchParams.set("q", filter);
      router.searchParams = searchParams;
      //route.emit();
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
