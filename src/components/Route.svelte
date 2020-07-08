<script>
  import { setContext, getContext } from "svelte";
  import { ROUTER } from "../util.mjs";
  import { link } from "../link.mjs";
  import { active } from "../active.mjs";
  import { SkeletonRoute } from "../skeleton-route.mjs";
  import { sequenceGuard } from "../guard.mjs";

  export let path;
  export let href = path;
  export let guards;
  export let component;
  export let factory = SkeletonRoute;

  const ROUTE = "@@private@@-ROUTE";
  const parent = getContext(ROUTE);

  const router = getContext(ROUTER);
  const route = new factory();

  setContext(ROUTE, route);

  route.localPath = path;
  route.component = component;

  if (parent) {
    route.parent = parent;
  }

  if (guards) {
    if (Array.isArray(guards)) {
      switch (guards.length) {
        case 1:
          route.guard = guards[0];
          break;
        default:
          route.guard = sequenceGuard(guards);
      }
    } else {
      route.guard = guards;
    }
  }

  router.addRoute(route);
</script>

{#if route.keys.length === 0}
  <a {href} use:link={router} use:active={router}>
    <slot />
  </a>
{/if}
