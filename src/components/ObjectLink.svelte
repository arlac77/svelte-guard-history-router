<script>
  import Link from "./Link.svelte";
  import { getContext } from "svelte";
  import { ROUTER } from "../util.mjs";

  let { object, suffix = "" } = $props();

  const router = getContext(ROUTER);

  let subscription;

  function execute(object) {
    //console.log("EXECUTE");

    if (subscription) {
      const route = router.routeFor(object);
      subscription({
        object,
        href: router.pathFor(object, suffix),
        linkComponent: route?.linkComponent
      });
    }
  }

  const store = {
    subscribe: cb => {
      subscription = cb;
      execute(object);
      return () => (subscription = undefined);
    }
  };

  $effect.pre(async () => {
    const x = await object;
    if (x !== object) {
      execute(x);
      subscription = undefined;
    } else {
      //console.log("NO CHANGE");
    }
  });
</script>

{#if $store.href}
  <Link href={$store.href}>
    {#if $store.linkComponent}
      <svelte:component this={$store.linkComponent} object={$store.object} />
    {/if}
    <slot />
  </Link>
{:else}
  <slot name="notFound" />
{/if}
