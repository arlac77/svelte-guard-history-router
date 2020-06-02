<script>
  export let router;

  let component;

  $: component = $router.component;
</script>

{#if component}
  <svelte:component this={component} />
{:else}
  <slot />
{/if}
