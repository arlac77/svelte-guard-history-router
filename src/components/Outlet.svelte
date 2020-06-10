<script>
  export let router;
</script>

{#if $router.component}
  <svelte:component this={$router.component} />
{:else}
  <slot />
{/if}
