<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { sortable, sorter } from "svelte-common";
  import { Link, ObjectLink } from "../../../src/index.svelte";

  export let router;

  const route = router.route;
  let filter;
  let searchParams;

  const sortBy = writable({});

  onMount(() => {
    searchParams = router.searchParams;
    filter = searchParams.get("name");
    sortBy.set(searchParams); 
  });

  $: {
    if (searchParams) {
      searchParams.set("name", filter);
      router.searchParams = searchParams;
      route.emit();
    }
  }

  function doFilter(x) {
    return filter ? x.name.match(filter) : true;
  }
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
    {#each route.value
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
