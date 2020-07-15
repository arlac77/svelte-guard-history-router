<script>
  import Link from "./Link.svelte";
  import { getContext } from "svelte";
  import { ROUTER } from "../util.mjs";

  export let object;
  export let suffix = "";

  const router = getContext(ROUTER);
  const route = router.routeFor(object);

  let href;

  if (route !== undefined) {
    const properties = route.propertiesFor(object);
    href =
      route.path.replace(/:(\w+)/g, (m, name) => properties[name]) + suffix;
  }
</script>

{#if href}
  <Link {href}>
    {#if route.linkComponent}
      <svelte:component this={route.linkComponent} {object} />
    {/if}
    <slot />
  </Link>
{:else}
  <slot name="noFound" />
{/if}
