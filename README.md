[![Svelte v3](https://img.shields.io/badge/svelte-v3-orange.svg)](https://svelte.dev)
[![npm](https://img.shields.io/npm/v/svelte-guard-history-router.svg)](https://www.npmjs.com/package/svelte-guard-history-router)
[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)
[![minified size](https://badgen.net/bundlephobia/min/svelte-guard-history-router)](https://bundlephobia.com/result?p=svelte-guard-history-router)
[![downloads](http://img.shields.io/npm/dm/svelte-guard-history-router.svg?style=flat-square)](https://npmjs.org/package/svelte-guard-history-router)
[![GitHub Issues](https://img.shields.io/github/issues/arlac77/svelte-guard-history-router.svg?style=flat-square)](https://github.com/arlac77/svelte-guard-history-router/issues)
[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Farlac77%2Fsvelte-guard-history-router%2Fbadge\&style=flat)](https://actions-badge.atrox.dev/arlac77/svelte-guard-history-router/goto)
[![Styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Known Vulnerabilities](https://snyk.io/test/github/arlac77/svelte-guard-history-router/badge.svg)](https://snyk.io/test/github/arlac77/svelte-guard-history-router)
[![Coverage Status](https://coveralls.io/repos/arlac77/svelte-guard-history-router/badge.svg)](https://coveralls.io/github/arlac77/svelte-guard-history-router)
[![Tested with TestCafe](https://img.shields.io/badge/tested%20with-TestCafe-2fa4cf.svg)](https://github.com/DevExpress/testcafe)
[![Netlify Status](https://api.netlify.com/api/v1/badges/e6da37be-57f8-40d4-bf85-07ad688a73b1/deploy-status)](https://app.netlify.com/sites/svelte-guard-history-router/deploys)

# svelte-guard-history-router

svelte guarded history router

# Features

*   Named params `article/:id`
*   Guards to act when entering / leaving a route
*   Automatic route ranking
*   Routes and keys acting as stores
*   Nested Routes with relative paths for route composition
*   Route values
*   Object <=> parameter mapping
*   Create links from objects
*   Standart `<a href="/home">Home</a>` elements

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

### Table of Contents

*   [Key](#key)
    *   [Properties](#properties)
*   [BaseRouter](#baserouter)
    *   [Parameters](#parameters)
    *   [Properties](#properties-1)
    *   [component](#component)
    *   [value](#value)
    *   [path](#path)
    *   [replace](#replace)
        *   [Parameters](#parameters-1)
    *   [push](#push)
        *   [Parameters](#parameters-2)
    *   [finalizePush](#finalizepush)
        *   [Parameters](#parameters-3)
    *   [continue](#continue)
        *   [Parameters](#parameters-4)
    *   [abort](#abort)
        *   [Parameters](#parameters-5)
    *   [subscribe](#subscribe)
        *   [Parameters](#parameters-6)
    *   [updateActive](#updateactive)
        *   [Parameters](#parameters-7)
    *   [addRoute](#addroute)
        *   [Parameters](#parameters-8)
    *   [routeFor](#routefor)
        *   [Parameters](#parameters-9)
    *   [pathFor](#pathfor)
        *   [Parameters](#parameters-10)
*   [BaseTransition](#basetransition)
    *   [searchParams](#searchparams)
    *   [nest](#nest)
        *   [Parameters](#parameters-11)
    *   [continue](#continue-1)
*   [first](#first)
*   [last](#last)
*   [Guard](#guard)
    *   [enter](#enter)
        *   [Parameters](#parameters-12)
    *   [leave](#leave)
        *   [Parameters](#parameters-13)
*   [redirectGuard](#redirectguard)
    *   [Parameters](#parameters-14)
*   [sequenceGuard](#sequenceguard)
    *   [Parameters](#parameters-15)
*   [parallelGuard](#parallelguard)
    *   [Parameters](#parameters-16)
*   [MasterRoute](#masterroute)
    *   [Parameters](#parameters-17)
*   [hasParams](#hasparams)
*   [SkeletonRoute](#skeletonroute)
    *   [Parameters](#parameters-18)
    *   [Properties](#properties-2)
    *   [enter](#enter-1)
        *   [Parameters](#parameters-19)
    *   [leave](#leave-1)
        *   [Parameters](#parameters-20)
    *   [matches](#matches)
        *   [Parameters](#parameters-21)
    *   [propertiesFor](#propertiesfor)
        *   [Parameters](#parameters-22)
    *   [commonAncestor](#commonancestor)
        *   [Parameters](#parameters-23)
    *   [objectFor](#objectfor)
        *   [Parameters](#parameters-24)
*   [Transition](#transition)
    *   [Parameters](#parameters-25)
    *   [Properties](#properties-3)
    *   [start](#start)
    *   [end](#end)
    *   [redirect](#redirect)
        *   [Parameters](#parameters-26)
    *   [abort](#abort-1)
        *   [Parameters](#parameters-27)
*   [nameValueStore](#namevaluestore)
    *   [Parameters](#parameters-28)
    *   [Properties](#properties-4)
*   [WaitingGuard](#waitingguard)
    *   [Parameters](#parameters-29)

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

*   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
*   `value` **any** 
*   `subscriptions` **[Set](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)** 

## BaseRouter

**Extends BaseTransition**

key subscriptions:

```js
const aKey = router.keys.aKey;
$aKey // fired if value of aKey changes
```

### Parameters

*   `routes` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)\<Route>** 
*   `base` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** url

### Properties

*   `linkNodes` **[Set](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)<[Node](https://developer.mozilla.org/docs/Web/API/Node/nextSibling)>** nodes having their active state updated
*   `routes` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)\<Route>** 
*   `keys` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** collected keys of all routes
*   `params` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** value mapping from keys (from current route)
*   `route` **Route** current
*   `nested` **[Transition](#transition)** ongoing nested
*   `base` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** url

### component

Current component.
Either from a nested transition or from the current route

Returns **SvelteComponent** 

### value

Value if the current route

Returns **any** 

### path

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** url path with fragment & query

### replace

Replace current route

#### Parameters

*   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** former state

### push

Leave current route and enter route for given path.
The work is done by a Transition.

#### Parameters

*   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** where to go

Returns **[Transition](#transition)** running transition

### finalizePush

Called from a transition to manifest the new destination.
If path is undefined the transition has been aborderd.

#### Parameters

*   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

### continue

Continue a transition to its original destination.
Shortcut for this.transition.continue().
If there is no transition ongoing and a fallbackPath is
present, it will be entered.
Otherwise does nothing.

#### Parameters

*   `fallbackPath` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

### abort

Abort a transition.
Shortcut for this.transition.abort()
If there is no transition ongoing and a fallbackPath is
present it will be entered.
Otherwise does nothing.

#### Parameters

*   `fallbackPath` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

### subscribe

Router subscription.
Changes in the current route will trigger a update

#### Parameters

*   `subscription` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** 

### updateActive

Update the active state of a node.

#### Parameters

*   `node` **[Node](https://developer.mozilla.org/docs/Web/API/Node/nextSibling)** 

### addRoute

Add a new Route.

#### Parameters

*   `route` **Route** 

### routeFor

Find Route for a given object.

#### Parameters

*   `object` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **Route** able to support given object

### pathFor

Find path for a given object.

#### Parameters

*   `object` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
*   `suffix` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

Returns **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

## BaseTransition

### searchParams

Deliver url search params form the current location.

Returns **URLSearchParams** as extracted from the path

### nest

Add another tarnsition nesting level.

#### Parameters

*   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
*   `factory` **[Transition](#transition)** 

### continue

Continue a nested route to its original destination.
Does nothing if the transition has not been nested.

## first

Returns **any** 1st. entry

## last

Returns **any** last entry

## Guard

Enforces conditions of routes
Like the presents of values in the context

### enter

Called while entering a route (current outlet is not yet set)

#### Parameters

*   `transition` **[Transition](#transition)** 

### leave

Called before leaving a route

#### Parameters

*   `transition` **[Transition](#transition)** 

## redirectGuard

Redirects to a given path if condition is met.

### Parameters

*   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
*   `condition` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** redirects when returning true

## sequenceGuard

Execute guards in a sequence.

### Parameters

*   `children` **Iterable<[Guard](#guard)>** 

## parallelGuard

Execute guards in a parallel.

### Parameters

*   `children` **Iterable<[Guard](#guard)>** 

## MasterRoute

**Extends SkeletonRoute**

Route holding a ordered collection of objects.

### Parameters

*   `path`  
*   `options`  

## hasParams

Are there parameters in the path.

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** true if route has parameters (:key)

## SkeletonRoute

**Extends RootRoute**

Route
Subscriptions on Routes fire when the route value changes.

### Parameters

*   `path`  
*   `options`   (optional, default `{}`)

### Properties

*   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** full path of the Route including all parents
*   `component` **SvelteComponent** target to show
*   `linkComponent` **SvelteComponent** content for [ObjectLink](ObjectLink)
*   `propertyMapping` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** Map properties to object attributes
    Keys are the property names and values are the keys in the resulting object.
*   `priority` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** 
*   `keys` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** as found in the path
*   `regex` **RegEx** 
*   `value` **any** 

### enter

Enter the route from a former one.

#### Parameters

*   `transition` **[Transition](#transition)** 
*   `untilRoute` **Route** the common ancestor with the former route

### leave

Leave the route to a new one.

#### Parameters

*   `transition` **[Transition](#transition)** 
*   `untilRoute` **Route** the common ancestor with the next route

### matches

Check properties against object.

#### Parameters

*   `object` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
*   `properties` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** true if object properties are matching with the given proerties

### propertiesFor

Extract properties from object.
All property values are strings.

#### Parameters

*   `object` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** source of the values

Returns **([Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) | [undefined](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined))** properties extracted from given object

### commonAncestor

Find common ancestor with another Route.

#### Parameters

*   `other` **Route** 

Returns **(Route | [undefined](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined))** common ancestor Route between receiver and other

### objectFor

Deliver object for a given set of properties

#### Parameters

*   `transition` **[Transition](#transition)** 

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** for matching properties

## Transition

**Extends BaseTransition**

Transition between routes.

### Parameters

*   `router` **Router** 
*   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** new destination

### Properties

*   `router` **Router** 
*   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** new destination

### start

Start the transition

*   leave old route
*   find matching target route @see matcher()
*   enter new route
*   set params
*   set current route

### end

*   **See**: Router.finalizePush

Cleanup transition.
Update Nodes active state

### redirect

Halt current transition and go to another route.
To proceed with the original route by calling [continue()](continue\(\))
The original transition will keept in place and be continued afterwards.

#### Parameters

*   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** new route to enter temporary

### abort

Bring back the router into the state before the transition has started.

#### Parameters

*   `e` **(Exception | [undefined](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined))** 

## nameValueStore

Create a named object wich can act as a store.

### Parameters

*   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
*   `initialValue` **any** 

### Properties

*   `value` **any** 

Returns **Store** 

## WaitingGuard

**Extends Guard**

Shows a component during transition.

### Parameters

*   `component` **SvelteComponent** to show up during th transition
*   `rampUpTime` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** initial delay for the componnt to show up (optional, default `300`)

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

*   /deploymantLocation is the location of the frontend in the servers file system
*   /serviceBase is the url path as seen from the browser

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
