<script>
  import { onMount } from "svelte";
  import { Link, ObjectLink } from "../../../src/index.svelte";

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

<table class="bordered">
  <thead>
    <th>Name</th>
    <th>Price</th>
  </thead>
  <tbody>
    {#each articles as article}
      <tr>
        <td>
          <ObjectLink object={article} suffix="#price" />
        </td>
        <td>
          <Link href={router.pathFor(article)}>{article.price}</Link>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
