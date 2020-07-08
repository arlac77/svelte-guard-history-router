<script>
  import { BaseRouter } from '../base-router.mjs';

  export let href;

  function click(e) {
    window.dispatchEvent(
      new CustomEvent(BaseRouter.navigationEventType, {
        detail: { path: e.currentTarget.pathname }
      })
    );
  }
</script>

<a {href} on:click|preventDefault={click}>
  <slot />
</a>
