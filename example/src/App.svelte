<script>
  import About from "./About.svelte";
  import Home from "./Home.svelte";
  import Outlet from "../../src/components/Outlet.svelte";
  import Link from "../../src/components/Link.svelte";
  import { Router, route } from "../../src/router.mjs";

  const router = new Router([route("/about", About), route("/", Home)]);
</script>

<div>
  <h1 class="routetitle">svelte-guard-history-router example</h1>

  <Link href="/about">About</Link>
  <Link href="/">Home</Link>
  
  <Outlet {router}>nichts gefunden</Outlet>
</div>
