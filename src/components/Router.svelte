<script>
  import { setContext, onMount } from "svelte";
  import { ROUTER } from "../util.mjs";
  import { BaseRouter } from "../base-router.mjs";

  let { base } = $props();

  const router = new BaseRouter([], base);

  setContext(ROUTER, router);

  onMount(() => router.push(router.path));
</script>

<slot />
