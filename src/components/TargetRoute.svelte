<script>
  import { link } from "../link.mjs";
  import { active } from "../active.mjs";
  import { route } from "../route.mjs";

  export let path;
  export let component;
  export let router;

  const r = route(path, component);
  router.addRoute(r);
</script>

<a href={r.path} use:link={router} use:active={router}>
  <slot />
</a>
