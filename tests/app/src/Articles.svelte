<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { sortable, sorter, filter } from "svelte-common";
  import { Link, ObjectLink } from "../../../src/index.svelte";

  export let router;

  const route = router.route;

  const sortBy = writable({});
  const filterBy = writable({});

  onMount(() => {
    //console.log("onMount",router.searchParams, router.path);
    filterBy.set(Object.fromEntries(router.searchParams.entries()));
    filterBy.subscribe(s => (router.searchParams = s));
  });
</script>

<h2 class="routetitle">Articles</h2>
<table class="bordered">
  <thead>
    <th id="name" use:sortable={sortBy}
      >Name
      <input id="filter" placeholder="Filter" bind:value={$filterBy.name} />
    </th>
    <th id="price" use:sortable={sortBy}>Price</th>
  </thead>
  <tbody>
    {#each route.value
      .filter(filter($filterBy))
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
