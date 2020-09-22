<script>
  import { NAVIGATION_EVENT } from '../util.mjs';

  export let href;

  function click(e) {
    const ct = e.currentTarget;

    window.dispatchEvent(
      new CustomEvent(NAVIGATION_EVENT, {
        detail: { path: ct.pathname + ct.hash }
      })
    );
  }
</script>

<a {href} on:click|preventDefault={click}>
  <slot />
</a>
