<script>
  import { setContext, onMount } from "svelte";
  import { ROUTER } from "../util.mjs";
  import { BaseRouter } from "../base-router.mjs";

  export let routes = [];
  export let base = "";
  export let initialized = () => {};

  const router = new BaseRouter(routes, base);

  setContext(ROUTER, router);

  onMount(() => {
    initialized(router);
  });
</script>

<slot />
