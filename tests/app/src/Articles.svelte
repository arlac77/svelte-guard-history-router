<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { sortable, sorter } from "svelte-common";
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
    if (searchParams) {
      searchParams.set("q", filter);
      router.searchParams = searchParams;
      route.emit();
    }
  }

  function doFilter(x) {
    return filter ? x.name.match(filter) : true;
  }

  const sortBy = writable({});
</script>

<h2 class="routetitle">Articles</h2>
<table class="bordered">
  <thead>
    <th id="name" use:sortable={sortBy}
      >Name
      <input id="filter" placeholder="Filter" bind:value={filter} />
    </th>
    <th id="price" use:sortable={sortBy}>Price</th>
  </thead>
  <tbody>
    {#each articles
      .filter(doFilter)
      .sort(sorter($sortBy)) as article (article.name)}
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
