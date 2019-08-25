<script>
  import { Outlet, Link, RouterContext } from "../../src/index.svelte";
  import { router } from "./index.mjs";
</script>

<div>
  <h1 class="routetitle">Example</h1>
  <Link href="/about">About</Link>
  <Link href="/">Home</Link>
  <Link href="/article">Articles</Link>
  <Link href="/category">Categories</Link>

  <Outlet {router}>nothing there</Outlet>

  <RouterContext {router} />
</div>
