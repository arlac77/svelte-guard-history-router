<script>
  import { setContext, getContext } from "svelte";
  import { ROUTER, ROUTE } from "../util.mjs";
  import { link } from "../link.mjs";
  import { active } from "../active.mjs";
  import { SkeletonRoute } from "../routes.mjs";

  export let path;
  export let href = path;
  export let factory = SkeletonRoute;

  export let component;
  export let guards;
  export let propertyMapping;
  export let objectInstance;
  export let iteratorFor;
  export let objectFor;
  export let linkComponent;

  const route = new factory(path, {
    parent: getContext(ROUTE),
    component,
    iteratorFor,
    objectFor,
    linkComponent,
    propertyMapping,
    objectInstance,
    guard: guards
  });

  setContext(ROUTE, route);

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
