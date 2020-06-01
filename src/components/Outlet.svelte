<script>
  export let router;

  let component;

  $: {
    component = $router.component;
  }
</script>

<div>
  {#if component}
    <svelte:component this={component}/>
  {:else}
    <slot />
  {/if}
</div>
