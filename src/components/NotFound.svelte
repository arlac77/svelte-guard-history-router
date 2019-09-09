<script>
  import Link from "./Link.svelte";

  export let state;
</script>

<div>
  <div class="error">${state.path}</div> No found
  <Link href="/">Home</Link>
</div>
