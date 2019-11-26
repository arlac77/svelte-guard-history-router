<script>
  export let router;

  let component, state;

  $: {
    component = $router.component;
    state = $router.state;
  }
</script>

<div>
  {#if component}
    <svelte:component this={component} {state} />
  {:else}
    <slot />
  {/if}
</div>
