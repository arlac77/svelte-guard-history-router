<script>
  import Link from "./Link.svelte";
  import { getContext } from "svelte";
  import { ROUTER } from "../util.mjs";
  const router = getContext(ROUTER);

  export let object;

  const path = router.pathFor(object);
</script>

{#if path}
  <Link href={path}>
    <slot />
  </Link>
{:else}
  <slot name="noFound" />
{/if}
