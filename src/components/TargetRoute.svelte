<script>
  import { route, link, active } from "svelte-guard-history-router";

  export let router;
  export let href;
  export let target;

  router.addRoute(route(href, target));
</script>

<a {href} use:link={router} use:active={router}>
  <slot />
</a>
