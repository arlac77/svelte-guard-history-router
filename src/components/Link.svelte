<script>
  import { BaseRouter } from '../base-router.mjs';

  export let href;

  function click(e) {
    const ct = e.currentTarget;

    window.dispatchEvent(
      new CustomEvent(BaseRouter.navigationEventType, {
        detail: { path: ct.pathname + ct.hash }
      })
    );
  }
</script>

<a {href} on:click|preventDefault={click}>
  <slot />
</a>
