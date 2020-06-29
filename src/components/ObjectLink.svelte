<script>
  import Link from "./Link.svelte";
  import { getContext } from "svelte";
  import { ROUTER } from "../util.mjs";

  export let object;

  const router = getContext(ROUTER);
  const href = router.pathFor(object);
</script>

{#if href}
  <Link {href}>
    <slot />
  </Link>
{:else}
  <slot name="noFound" />
{/if}
