<script>
  import { setContext } from "svelte";
  import { ROUTER } from "../util.mjs";
  import { BaseRouter } from "../base-router.mjs";

  export let router;
  export let routes = [];
  export let base = "";

  if (router === undefined) {
    router = new BaseRouter(routes, base);
  }

  setContext(ROUTER, router);
</script>

<slot />
