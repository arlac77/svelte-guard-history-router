<script>
  import { getContext } from "svelte";
  import { ROUTER } from "../util.mjs";
  const router = getContext(ROUTER);
</script>

{#if $router.component}
  <svelte:component this={$router.component} />
{:else}
  <slot />
{/if}
