<script>
  import { setContext, getContext } from "svelte";
  import { ROUTER, ROUTE } from "../util.mjs";
  import { link } from "../link.mjs";
  import { active } from "../active.mjs";
  import { SkeletonRoute } from "../routes.mjs";
  import { sequenceGuard } from "../guard.mjs";

  export let path;
  export let href = path;
  export let component;
  export let guards;
  export let propertyMapping;
  export let objectInstance;
  export let iteratorFor;
  export let objectFor;
  export let linkComponent;
  export let factory = SkeletonRoute;

  const route = new factory(path, getContext(ROUTE));

  setContext(ROUTE, route);

  route.component = component;

  if (iteratorFor) {
    route.iteratorFor = iteratorFor;
  }
  if (objectFor) {
    route.objectFor = objectFor;
  }
  if (linkComponent) {
    route.linkComponent = linkComponent;
  }
  if (propertyMapping) {
    route.propertyMapping = propertyMapping;
  }
  if (objectInstance) {
    route.objectInstance = objectInstance;
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

  const router = getContext(ROUTER);
  router.addRoute(route);
</script>

{#if route.keys.length === 0}
  <a {href} use:link={router} use:active={router}>
    <slot />
  </a>
{:else}
  <slot />
{/if}
