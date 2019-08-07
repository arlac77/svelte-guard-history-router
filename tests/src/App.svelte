<script>
  import Outlet from "../../src/components/Outlet.svelte";
  import Link from "../../src/components/Link.svelte";
  import { Router } from "../../src/router.mjs";

  const router = new Router([
  ]);
</script>

<div>
  <Outlet {router}>nichts gefunden</Outlet>
</div>
