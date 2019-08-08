<script>
  export let router;

  let component, context;

  $: component = $router.component;
  $: context = $router.context;
</script>

<div>
  {#if component}
    <svelte:component this={component} {context} />
  {:else}
    <slot />
  {/if}
</div>
