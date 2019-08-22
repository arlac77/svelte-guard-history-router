<script>
  import { Router } from '../router.mjs';

  export let href;

  function click(e) {
    window.dispatchEvent(
      new CustomEvent(Router.navigationEventType, {
        detail: { path: e.currentTarget.pathname }
      })
    );
  }
</script>

<a {href} on:click|preventDefault={click}>
  <slot />
</a>
