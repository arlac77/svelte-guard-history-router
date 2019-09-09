<script>
  import { Outlet, Link, RouterState } from "../../src/index.svelte";
  import { router } from "./index.mjs";
</script>

<nav>
  <a href="/">
    <h1 class="routetitle">Router Example</h1>
  </a>
  <ul>
    <li>
      <Link href="/about">About</Link>
    </li>
    <li>
      <Link href="/article">Articles</Link>
    </li>
    <li>
      <Link href="/category">Categories</Link>
    </li>
    <li>
      <Link href="/noway">Does Not Work</Link>
    </li>
  </ul>
</nav>
<main>
  <Outlet {router}>nothing there</Outlet>
</main>
<RouterState {router} />
