<script>
  import { sortable, sorter, filter, keyPrefixStore } from "svelte-common";
  import { Link, ObjectLink } from "../../../src/index.svelte";

  export let router;

  const sortBy = keyPrefixStore(router.searchParamStore, "sort.");
  const filterBy = keyPrefixStore(router.searchParamStore, "filter.");
</script>

<h2 class="routetitle">Articles</h2>
<table class="bordered">
  <thead>
    <tr>
      <th id="name" use:sortable={sortBy}
        >Name<input
          id="filter_name"
          placeholder="Filter name"
          bind:value={$filterBy.name}
        /></th
      >
      <th id="price" use:sortable={sortBy}
        >Price<input
          id="filter_price"
          placeholder="Filter price"
          bind:value={$filterBy.price}
        /></th
      >
    </tr>
  </thead>
  <tbody>
    {#each router.value
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
