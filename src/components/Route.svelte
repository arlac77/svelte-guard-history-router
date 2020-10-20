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
  export let guard = undefined;
  export let propertyMapping = undefined;
  export let objectInstance = undefined;
  export let iteratorFor = undefined;
  export let objectFor = undefined;
  export let linkComponent = undefined;

  const route = new factory(path, {
    parent: getContext(ROUTE),
    component,
    iteratorFor,
    objectFor,
    linkComponent,
    propertyMapping,
    objectInstance,
    guard
  });

  setContext(ROUTE, route);

  const router = getContext(ROUTER);
  router.addRoute(route);
</script>

{#if route.hasParams}
  <slot />
{:else}
  <a {href} use:link={router} use:active={router}>
    <slot />
  </a>
{/if}
