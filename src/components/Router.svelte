<script>
  import { setContext, onMount } from "svelte";
  import { ROUTER } from "../util.mjs";
  import { BaseRouter } from "../base-router.mjs";

  export let routes = [];
  export let base = "";

  const router = new BaseRouter(routes, base);

  setContext(ROUTER, router);

  onMount(() => router.push(router.path));
</script>

<slot />
