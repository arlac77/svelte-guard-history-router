<script>
  import Link from "./Link.svelte";
  import { getContext } from "svelte";
  import { ROUTER } from "../util.mjs";

  export let object;

  const router = getContext(ROUTER);
  const route = router.routeFor(object);

  let href;

  if (route !== undefined) {
    const properties = route.propertiesFor(object);
    href = route.path.replace(/:(\w+)/g, (m, name) => properties[name]);
  }
</script>

{#if href}
  <Link {href}>
    <slot />
  </Link>
{:else}
  <slot name="noFound" />
{/if}
