<script>
  import { dispatchNavigationEvent } from "../util.mjs";
  let { href } = $props();
</script>

<a {href} onclick={dispatchNavigationEvent}>
  <slot />
</a>
