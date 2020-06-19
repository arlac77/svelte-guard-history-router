<script>
  import { getContext } from "svelte";
  import { ROUTER } from "../util.mjs";
  import { link } from "../link.mjs";
  import { active } from "../active.mjs";
  import { SkeletonRoute } from "../skeleton-route.mjs";
  import { sequenceGuard } from "../guard.mjs";

  export let path;
  export let guards = [];
  export let component;

  const router = getContext(ROUTER);
  const route = new SkeletonRoute(path, component);

  switch (guards.length) {
    case 1:
      route.guard = guards[0];
    default:
      route.guard = sequenceGuard(guards);
  }

  router.addRoute(route);
</script>

{#if route.keys.length === 0}
  <a href={route.path} use:link={router} use:active={router}>
    <slot />
  </a>
{/if}
