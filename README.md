[![Svelte v3](https://img.shields.io/badge/svelte-v3-orange.svg)](https://svelte.dev)
[![npm](https://img.shields.io/npm/v/svelte-guard-history-router.svg)](https://www.npmjs.com/package/svelte-guard-history-router)
[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)
[![minified size](https://badgen.net/bundlephobia/min/svelte-guard-history-router)](https://bundlephobia.com/result?p=svelte-guard-history-router)
[![downloads](http://img.shields.io/npm/dm/svelte-guard-history-router.svg?style=flat-square)](https://npmjs.org/package/svelte-guard-history-router)
[![Styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Netlify Status](https://api.netlify.com/api/v1/badges/e6da37be-57f8-40d4-bf85-07ad688a73b1/deploy-status)](https://app.netlify.com/sites/svelte-guard-history-router/deploys)

# svelte-guard-history-router

svelte guarded history router

# Features

-   Named params `article/:id`
-   Guards to act when entering / leaving a route
-   Automatic route ranking
-   Routes and keys acting as stores
-   Nested Routes with relative paths for route composition
-   Route values
-   Object &lt;=> parameter mapping
-   Create links from objects
-   Standart `<a href="/home">Home</a>` elements

# usage

```html
<script>
  import { Router, Route, Outlet, redirectGuard } from "svelte-guard-history-router";
  import About from "./About.svelte";
  import Categories from "./Categories.svelte";
  import Category from "./Category.svelte";
  import Articles from "./Articles.svelte";
  import Article from "./Article.svelte";

  import { enshureSession } from "./main.mjs";

  export const enshureSession = redirectGuard("/login", () => !session);
  let session = undefined;
</script>

<Router base="/base">
<nav>
  <!-- catch all but link to '/' -->
  <Route href="/" path="*" component={Home}>Router Example</Route>
  <ul class="left">
    <li>
      <Route path="/about" component={About}>About</Route>
    </li>
    <li>
      <Route path="/article" guards={enshureSession} component={Articles}>
        Articles
        <Route path="/:artice" component={Article}/>
      </Route>
    </li>
    <li>
      <Route path="/category" guards={enshureSession} component={Categories}>
        Categories
        <Route path="/:category" component={Category}/>
      </Route>
    </li>
  </ul>
</nav>
<main>
  <Outlet/>
</main>
</Router>
```

## Sample code

Check out the code in the [example](/example) folder,
or the [live example](https://svelte-guard-history-router.netlify.app/tests/app/).

To run the sample, clone the repository, install the dependencies, and start:

```sh
git clone https://github.com/arlac77/svelte-guard-history-router
cd svelte-guard-history-router
npm install
npm start
```

then navigate to [localhost:5000](http://localhost:5000/)

## run tests

```sh
export BROWSER=safari|chrome|...
yarn test
or
npm test
```

# API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

## Table of Contents

# install

With [npm](http://npmjs.org) do:

```shell
npm install svelte-guard-history-router
```

With [yarn](https://yarnpkg.com) do:

```shell
yarn add svelte-guard-history-router
```

# SPA integrating with a nginx backend

All unresolvable requests are redirected to /sericeBase/index.html

-   /deploymantLocation is the location of the frontend in the servers file system
-   /serviceBase is the url path as seen from the browser

```nginx.conf
location /serviceBase {
  alias /deploymentLocation;
  try_files $uri$args $uri$args/ /serviceBase/index.html;
}
```

# SPA integrating with a netlify

publish a \_redirects file into the app root folder

```_redirects
/* /index.html 200
```

# license

BSD-2-Clause
