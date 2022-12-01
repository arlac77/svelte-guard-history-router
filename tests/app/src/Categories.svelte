<script>
  import { sortable, sorter, filter, keyPrefixStore } from "svelte-common";
  import { ObjectLink } from "../../../src/index.svelte";

  export let router;

  const sortBy = keyPrefixStore(router.searchParamStore, "sort.");
  const filterBy = keyPrefixStore(router.searchParamStore, "filter.");
</script>

<div class="canvas">
  <h2 class="routetitle">Categories</h2>

  <table class="bordered">
    <thead>
      <th id="name" use:sortable={sortBy}>Name</th>
    </thead>
    <tbody>
      {#each router.value
        .filter(filter($filterBy))
        .sort(sorter($sortBy)) as category (category.name)}
        <tr>
          <td>
            <ObjectLink object={category} />
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
