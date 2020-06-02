<script>
  import { link } from "../link.mjs";
  import { active } from "../active.mjs";
  import { route } from "../route.mjs";

  export let href;
  export let router;
  export let target;

  router.addRoute(route(href, target));
</script>

<a {href} use:link={router} use:active={router}>
  <slot />
</a>
