<script>
  import { writable } from "svelte/store";
  import { sortable, sorter, filter } from "svelte-common";
  import { Link, ObjectLink } from "../../../src/index.svelte";

  export let router;

  const route = router.route;

  const sortBy = writable({});
  const filterBy = router.searchParamStore;
</script>

<h2 class="routetitle">Articles</h2>
<table class="bordered">
  <thead>
    <tr>
      <th id="name" use:sortable={sortBy}>Name</th>
      <th id="price" use:sortable={sortBy}>Price</th>
    </tr>
    <tr>
      <th>
        <input id="filter" placeholder="Filter" bind:value={$filterBy.name} />
      </th>
      <th>
        <input id="filter" placeholder="Filter" bind:value={$filterBy.price} />
      </th>
    </tr>
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
