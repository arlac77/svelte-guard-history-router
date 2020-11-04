<script>
  import { setContext, onMount } from "svelte";
  import { ROUTER } from "../util.mjs";
  import { BaseRouter } from "../base-router.mjs";

  export let router = undefined;
  export let routes = [];
  export let base = "";

  if (router === undefined) {
    router = new BaseRouter(routes, base);
  }

  setContext(ROUTER, router);

  onMount(() =>
    router.push(
      window.location.href.slice(window.location.origin.length + base.length)
    )
  );
</script>

<slot />
