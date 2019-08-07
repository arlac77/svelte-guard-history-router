<script>
  import About from "./About.svelte";
  import Home from "./Home.svelte";
  import Outlet from "../../src/components/Outlet.svelte";
  import Link from "../../src/components/Link.svelte";
  import { Router, route } from "../../src/router.mjs";

  const router = new Router([route("/about", About), route("/", Home)]);
</script>

<div>
  <Outlet {router}>nichts gefunden</Outlet>
</div>
