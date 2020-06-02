<script>
  import { link } from "../link.mjs";
  import { active } from "../active.mjs";
  import { route } from "../route.mjs";

  export let def;
  export let router;

  const r = route(...def);
  router.addRoute(r);
</script>

<a href={r.path} use:link={router} use:active={router}>
  <slot />
</a>
