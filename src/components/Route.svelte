<script>
  import { setContext, getContext } from "svelte";
  import { ROUTER, ROUTE } from "../util.mjs";
  import { link } from "../link.mjs";
  import { active } from "../active.mjs";
  import { SkeletonRoute } from "../routes.mjs";
  import { sequenceGuard } from "../guard.mjs";

  export let path;
  export let href = path;
  export let guards;
  export let propertyMapping;
  export let component;
  export let linkComponent;
  export let factory = SkeletonRoute;

  const parent = getContext(ROUTE);
  const router = getContext(ROUTER);
  const route = new factory();

  setContext(ROUTE, route);

  route._path = path;

  route.component = component;

  if (parent) {
    route._parent = parent;
  }

  if (propertyMapping) {
    route._propertyMapping = propertyMapping;
  }

  if (linkComponent) {
    route.linkComponent = linkComponent;
  }

  if (guards) {
    if (Array.isArray(guards)) {
      switch (guards.length) {
        case 1:
          route._guard = guards[0];
          break;
        default:
          route._guard = sequenceGuard(guards);
      }
    } else {
      route._guard = guards;
    }
  }

  router.addRoute(route);
</script>

{#if route.keys.length === 0}
  <a {href} use:link={router} use:active={router}>
    <slot />
  </a>
{:else}
  <slot />
{/if}
