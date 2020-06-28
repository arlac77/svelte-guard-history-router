<script>
  import Link from "./Link.svelte";
  import { getContext } from "svelte";
  import { ROUTER } from "../util.mjs";
  const router = getContext(ROUTER);

  export let object;

  const href = router.pathFor(object);
</script>

{#if href}
  <Link {href}>
    <slot />
  </Link>
{:else}
  <slot name="noFound" />
{/if}
