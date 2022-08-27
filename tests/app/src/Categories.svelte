<script>
  import { writable } from "svelte/store";
  import { sortable, sorter } from "svelte-common";
  import { ObjectLink } from "../../../src/index.svelte";

  export let router;

  const sortBy = writable({});
</script>

<h2 class="routetitle">Categories</h2>

<table class="bordered">
  <thead>
    <th id="name" use:sortable={sortBy}>Name</th>
  </thead>
  <tbody>
    {#each router.value.sort(sorter($sortBy)) as category (category.name)}
      <tr>
        <td>
          <ObjectLink object={category} />
        </td>
      </tr>
    {/each}
  </tbody>
</table>
