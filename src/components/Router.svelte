<script>
  import { setContext } from "svelte";
  import { ROUTER } from "../util.mjs";

  export let router;

  setContext(ROUTER, router);
</script>

<slot />
