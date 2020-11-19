<script>
  import Link from "./Link.svelte";
  import { getContext } from "svelte";
  import { ROUTER } from "../util.mjs";

  export let object;
  export let suffix = "";

  const router = getContext(ROUTER);

  async function h() {
    const o = await object;
    const route = router.routeFor(o);
    let href;

    if (route !== undefined) {
      href = route.pathFor(o, suffix);
    }
    //console.log("HHHHH",href, route, o);
    return { href, route, object: o };
  }
</script>

{#await h()}
  loading...
{:then result}
  {#if result.href}
    <Link href={result.href}>
      {#if result.route && result.route.linkComponent}
        <svelte:component
          this={result.route.linkComponent}
          object={result.object} />
      {/if}
      <slot />
    </Link>
  {:else}
    <slot name="noFound" />
  {/if}
{:catch error}
  <slot name="noFound" />
{/await}
