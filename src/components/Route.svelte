<script>
  import { getContext } from "svelte";
  import { ROUTER } from "../util.mjs";

  import { link } from "../link.mjs";
  import { active } from "../active.mjs";
  import { route } from "../skeleton-route.mjs";

  export let path;
  export let guards = [];
  export let component;

  let router = getContext(ROUTER);

  const r = route(path, ...guards, component);
  router.addRoute(r);
</script>

{#if r.keys.length === 0}
  <a href={r.path} use:link={router} use:active={router}>
    <slot />
  </a>
{/if}
