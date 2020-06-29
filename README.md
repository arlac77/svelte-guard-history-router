[![Svelte v3](https://img.shields.io/badge/svelte-v3-orange.svg)](https://svelte.dev)
[![npm](https://img.shields.io/npm/v/svelte-guard-history-router.svg)](https://www.npmjs.com/package/svelte-guard-history-router)
[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)
[![minified size](https://badgen.net/bundlephobia/min/svelte-guard-history-router)](https://bundlephobia.com/result?p=svelte-guard-history-router)
[![downloads](http://img.shields.io/npm/dm/svelte-guard-history-router.svg?style=flat-square)](https://npmjs.org/package/svelte-guard-history-router)
[![Build Status](https://travis-ci.com/arlac77/svelte-guard-history-router.svg?branch=master)](https://travis-ci.com/arlac77/svelte-guard-history-router)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/arlac77/svelte-guard-history-router.git)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Known Vulnerabilities](https://snyk.io/test/github/arlac77/svelte-guard-history-router/badge.svg)](https://snyk.io/test/github/arlac77/svelte-guard-history-router)

# svelte-guard-history-router

svelte guarded history router

# Features

- Named params
- Guards to act when entering / leaving a route
- Automatic route ranking
- Route stores
- Object / parameter mapping 
- Standart `<a href="/home">Home</a>` elements

# usage

```js
import { BaseRouter, route, Guard } from 'svelte-guard-history-router';
import Article from "./Article.svelte";
import Category from "./Category.svelte";
import Login from "./Login.svelte";

let session = undefined;

class SessionGuard extends Guard {
  async enter(transition) {
    if(!session) {
      return transition.redirect('/login');
    }
  }
}

export const router = new BaseRouter(
  [
    route("/article/:article", sessionGuard, Article),
    route("/category/:category", sessionGuard, Category)
  ],
  "/base"
);
```

```html
<script>
  import { Router, Route, Outlet } from "svelte-guard-history-router";
  import About from "./About.svelte";
  import Categories from "./Categories.svelte";
  import Articles from "./Articles.svelte";

  import { router, sessionGuard } from "./main.mjs";
</script>

<Router {router}>
<nav>
  <Route path="/" component={Home}>Router Example</Route>
  <ul class="left">
    <li>
      <Route path="/about" component={Home}>About</Route>
    </li>
    <li>
      <Route path="/article" guards={sessionGuard} component={Home}>Articles</Route>
    </li>
    <li>
      <Route path="/category" guards={sessionGuard} component={Home}>Categories</Route>
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
or the [live example](https://arlac77.github.io/modules/svelte-guard-history-router/example/index.html).

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

### Table of Contents

-   [Key](#key)
    -   [Properties](#properties)
-   [RouterState](#routerstate)
    -   [Properties](#properties-1)
-   [Router](#router)
    -   [Parameters](#parameters)
    -   [Properties](#properties-2)
    -   [push](#push)
        -   [Parameters](#parameters-1)
    -   [subscribe](#subscribe)
        -   [Parameters](#parameters-2)
    -   [updateActive](#updateactive)
        -   [Parameters](#parameters-3)
-   [Transition](#transition)
    -   [Parameters](#parameters-4)
    -   [Properties](#properties-3)
    -   [start](#start)
    -   [end](#end)
    -   [redirect](#redirect)
        -   [Parameters](#parameters-5)
    -   [continue](#continue)
    -   [rollback](#rollback)
        -   [Parameters](#parameters-6)
-   [Route](#route)
    -   [Parameters](#parameters-7)
    -   [Properties](#properties-4)
    -   [enter](#enter)
        -   [Parameters](#parameters-8)
    -   [leave](#leave)
        -   [Parameters](#parameters-9)
-   [GuardedRoute](#guardedroute)
    -   [Parameters](#parameters-10)
    -   [Properties](#properties-5)
    -   [enter](#enter-1)
        -   [Parameters](#parameters-11)
    -   [leave](#leave-1)
        -   [Parameters](#parameters-12)
-   [route](#route-1)
    -   [Parameters](#parameters-13)
-   [Guard](#guard)
    -   [attach](#attach)
        -   [Parameters](#parameters-14)
    -   [enter](#enter-2)
        -   [Parameters](#parameters-15)
    -   [leave](#leave-2)
        -   [Parameters](#parameters-16)
-   [sequenceGuard](#sequenceguard)
    -   [Parameters](#parameters-17)
-   [parallelGuard](#parallelguard)
    -   [Parameters](#parameters-18)

## Key

Keys also act as svelte stores and can be subscribed.

```js
export const article = derived(
[articles, router.keys.article],
([$articles, $id], set) => {
  set($articles.find(a => a.id === $id));
  return () => {};
}
);
```

Type: [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

### Properties

-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `value` **any** 
-   `subscriptions` **[Set](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)** 

## RouterState

Type: [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

### Properties

-   `router` **[Router](#router)** 
-   `route` **[Route](#route)** 
-   `keys` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** all possible keys of all routes
-   `params` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** of current route

## Router

key subscriptions:

```js
const aKey = router.keys.aKey;
$aKey // fired if value of aKey changes
```

### Parameters

-   `routes` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Route](#route)>**  (optional, default `[]`)
-   `base` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** url (optional, default `""`)

### Properties

-   `routes` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Route](#route)>** 
-   `keys` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** all possible keys of all routes
-   `params` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** value mapping from keys (from current route)
-   `state` **[RouterState](#routerstate)** 
-   `route` **[Route](#route)** current
-   `transition` **[Transition](#transition)** ongoing transition
-   `base` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** url

### push

Leave current route and enter route for given path
The work is done by a Transition

#### Parameters

-   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** where to go

### subscribe

Router subscription
Value changes are fired when the route (or the target component changes)

#### Parameters

-   `subscription` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** 

### updateActive

#### Parameters

-   `node`  

## Transition

Transition between routes

### Parameters

-   `router` **[Router](#router)** 
-   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** destination

### Properties

-   `router` **[Router](#router)** 
-   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** destination
-   `state` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

### start

start the transition

-   find matching target route
-   leave old route
-   set params
-   set current route
-   enter new route

### end

cleanup transition

### redirect

Halt current transition and go to another route.
To proceed with the original route by call continue()

#### Parameters

-   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** new route to enter temprorarly

### continue

Continue a redirected route to its original destination

### rollback

Bring back the router into the state before the transition has started

#### Parameters

-   `e` **Exception** 

## Route

Base route without guard

### Parameters

-   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `component` **SvelteComponent** target to show

### Properties

-   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `component` **SvelteComponent** target to show
-   `priority` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** 
-   `keys` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** as found in the path
-   `regex` **RegEx** 

### enter

Enter the route from a former one.
Calls guard enter on all guards present in our gurad but absent in the former one

#### Parameters

-   `transition` **[Transition](#transition)** 

### leave

Leave the route to a new one.
Calls guard leave on all our guards which are not in the new route

#### Parameters

-   `transition` **[Transition](#transition)** 

## GuardedRoute

**Extends Route**

Route with a guard

### Parameters

-   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `component` **SvelteComponent** target to show
-   `guard` **[Guard](#guard)** 

### Properties

-   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `component` **SvelteComponent** target to show
-   `guard` **[Guard](#guard)** 
-   `priority` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** 
-   `keys` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** as found in the path
-   `regex` **RegEx** 

### enter

Enter the route from a former one.
Calls guard enter on all guards present in our gurad but absent in the former one

#### Parameters

-   `transition` **[Transition](#transition)** 

### leave

Leave the route to a new one.
Calls guard leave on all our guards which are not in the new route

#### Parameters

-   `transition` **[Transition](#transition)** 

## route

Helper function to create routes with optional guards

### Parameters

-   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `args` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** last one must be a SvelteComponent

## Guard

Enforces conditions of routes
Like presents of values in the context

### attach

Called when guard is attached to a route (one time)

#### Parameters

-   `route` **[Route](#route)** 

### enter

Called while entering a route (current outlet is not yet set)

#### Parameters

-   `transition` **[Transition](#transition)** 

### leave

Called before leaving a route

#### Parameters

-   `transition` **[Transition](#transition)** 

## sequenceGuard

execute guards in a sequence

### Parameters

-   `children` **Iterable&lt;[Guard](#guard)>** 

## parallelGuard

execute guards in a parallel

### Parameters

-   `children` **Iterable&lt;[Guard](#guard)>** 

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
  alias /deploymantLocation;
  try_files $uri$args $uri$args/ /sericeBase/index.html;
}
```

# license

BSD-2-Clause
