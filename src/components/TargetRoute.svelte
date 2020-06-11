<script>
  import { link } from "../link.mjs";
  import { active } from "../active.mjs";
  import { route } from "../route.mjs";

  export let href;
  export let component;
  export let router;

  const r = route(href,component);
  router.addRoute(r);
</script>

<a href={r.path} use:link={router} use:active={router}>
  <slot />
</a>
