<script>
  import { setContext, onMount } from "svelte";
  import { ROUTER } from "../util.mjs";
  import { BaseRouter } from "../base-router.mjs";

  export let base;
  export let initialized = () => {};

  const router = new BaseRouter([], base || new URL('../..',import.meta.url).pathname);

  setContext(ROUTER, router);

  onMount(() => {
    router.push(router.path);
    initialized(router);
  });
</script>

<slot />
