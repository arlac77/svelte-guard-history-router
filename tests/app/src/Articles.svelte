<script>
  import { ObjectLink } from "../../../src/index.svelte";

  export let router;

  const route = router.route;

  let filter;
</script>

<h2 class="routetitle">Articles</h2>

<input
  aria-label="filter"
  maxlength="75"
  size="32"
  autocorrect="off"
  autocapitalize="off"
  id="filter"
  type="text"
  placeholder="Filter"
  name="filter"
  bind:value={filter} />

<ul>
  {#each $route as article}
    <li>
      <ObjectLink object={article} suffix="#price" />
    </li>
  {/each}
</ul>
