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

-   Named params
-   Guards to act when entering / leaving a route
-   Automatic route ranking
-   Routes and keys acting as stores
-   Nested Routes
-   Route values
-   Object &lt;=> parameter mapping
-   Create links from objects
-   Standart `<a href="/home">Home</a>` elements

# usage

```js
import { redirectGuard } from 'svelte-guard-history-router';

let session = undefined;

export const enshureSession = redirectGuard("/login", () => !session);
```

```html
<script>
  import { Router, Route, Outlet } from "svelte-guard-history-router";
  import About from "./About.svelte";
  import Categories from "./Categories.svelte";
  import Category from "./Category.svelte";
  import Articles from "./Articles.svelte";
  import Article from "./Article.svelte";

  import { enshureSession } from "./main.mjs";
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
or the [live example](https://arlac77.github.io/components/svelte-guard-history-router/example/index.html).

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
-   [BaseRouter](#baserouter)
    -   [Parameters](#parameters)
    -   [Properties](#properties-1)
    -   [component](#component)
    -   [value](#value)
    -   [replace](#replace)
        -   [Parameters](#parameters-1)
    -   [push](#push)
        -   [Parameters](#parameters-2)
    -   [finalizePush](#finalizepush)
        -   [Parameters](#parameters-3)
    -   [continue](#continue)
    -   [subscribe](#subscribe)
        -   [Parameters](#parameters-4)
    -   [updateActive](#updateactive)
        -   [Parameters](#parameters-5)
    -   [addRoute](#addroute)
        -   [Parameters](#parameters-6)
    -   [routeFor](#routefor)
        -   [Parameters](#parameters-7)
-   [nameValueStore](#namevaluestore)
    -   [Parameters](#parameters-8)
    -   [Properties](#properties-2)
-   [Transition](#transition)
    -   [Parameters](#parameters-9)
    -   [Properties](#properties-3)
    -   [start](#start)
    -   [end](#end)
    -   [redirect](#redirect)
        -   [Parameters](#parameters-10)
    -   [continue](#continue-1)
    -   [rollback](#rollback)
        -   [Parameters](#parameters-11)
-   [SkeletonRoute](#skeletonroute)
    -   [Properties](#properties-4)
    -   [path](#path)
    -   [enter](#enter)
        -   [Parameters](#parameters-12)
    -   [leave](#leave)
        -   [Parameters](#parameters-13)
    -   [propertiesFor](#propertiesfor)
        -   [Parameters](#parameters-14)
    -   [propertyMapping](#propertymapping)
    -   [objectFor](#objectfor)
        -   [Parameters](#parameters-15)
-   [Guard](#guard)
    -   [enter](#enter-1)
        -   [Parameters](#parameters-16)
    -   [leave](#leave-1)
        -   [Parameters](#parameters-17)
-   [redirectGuard](#redirectguard)
    -   [Parameters](#parameters-18)
-   [sequenceGuard](#sequenceguard)
    -   [Parameters](#parameters-19)
-   [parallelGuard](#parallelguard)
    -   [Parameters](#parameters-20)
-   [WaitingGuard](#waitingguard)
    -   [Parameters](#parameters-21)

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

## BaseRouter

key subscriptions:

```js
const aKey = router.keys.aKey;
$aKey // fired if value of aKey changes
```

### Parameters

-   `routes` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;Route>**  (optional, default `[]`)
-   `base` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** url (optional, default `""`)

### Properties

-   `linkNodes` **[Set](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)&lt;[Node](https://developer.mozilla.org/docs/Web/API/Node/nextSibling)>** nodes having their active state updated
-   `routes` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;Route>** 
-   `keys` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** collected keys of all routes
-   `params` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** value mapping from keys (from current route)
-   `route` **Route** current
-   `transition` **[Transition](#transition)** ongoing transition
-   `base` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** url

### component

Current component.
Either from a redirected transition or from the current route

Returns **SvelteComponent** 

### value

Value if the current route

Returns **any** 

### replace

Replace current route

#### Parameters

-   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** former state

### push

Leave current route and enter route for given path
The work is done by a Transition

#### Parameters

-   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** where to go

Returns **[Transition](#transition)** running transition

### finalizePush

Called from a transition to manifest the new destination.
If path is undefined the transition has been aborderd

#### Parameters

-   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

### continue

Continue transition to its original destination.
Shortcut for this.transition.continue()
Does nothing if there is no transition.

### subscribe

Router subscription
Changes in the current route will trigger a update

#### Parameters

-   `subscription` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** 

### updateActive

Update the active state of a node

#### Parameters

-   `node` **[Node](https://developer.mozilla.org/docs/Web/API/Node/nextSibling)** 

### addRoute

Add a new route.

#### Parameters

-   `route` **Route** 

### routeFor

Find Route for a given object

#### Parameters

-   `object` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **Route** able to support given object

## nameValueStore

Create a named object wich can act as a store

### Parameters

-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `initialValue` **any** 

### Properties

-   `value` **any** 

Returns **Store** 

## Transition

Transition between routes

### Parameters

-   `router` **Router** 
-   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** destination

### Properties

-   `router` **Router** 
-   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** destination
-   `state` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

### start

Start the transition

-   leave old route
-   find matching target route @see Router.replace()
-   set params
-   set current route
-   enter new route

### end

-   **See: Router.finalizePush
    **

Cleanup transition
Update Nodes active state

### redirect

Halt current transition and go to another route.
To proceed with the original route by calling [continue()](continue())
The original transition will cept in place and be continued afterwards

#### Parameters

-   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** new route to enter temporary

### continue

Continue a redirected route to its original destination.
Does nothing if the transition has not been redirected

### rollback

Bring back the router into the state before the transition has started

#### Parameters

-   `e` **Exception** 

## SkeletonRoute

Route

### Properties

-   `_path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `component` **SvelteComponent** target to show
-   `linkComponent` **SvelteComponent** content for [ObjectLink](ObjectLink)
-   `priority` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** 
-   `keys` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** as found in the path
-   `regex` **RegEx** 
-   `value` **any** 

### path

Full path of the Route including all parents

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** path

### enter

Enter the route from a former one.

#### Parameters

-   `transition` **[Transition](#transition)** 

### leave

Leave the route to a new one.

#### Parameters

-   `transition` **[Transition](#transition)** 

### propertiesFor

Extract properties from object.

#### Parameters

-   `object` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **([Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) \| [undefined](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined))** properties extracted from given objects

### propertyMapping

Map properties to objects attributes.
Keys are the property names and values are the keys in the resulting object.

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

### objectFor

Deliver object for a given set of properties

#### Parameters

-   `transition`  
-   `properties` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** for matching properties

## Guard

Enforces conditions of routes
Like the presents of values in the context

### enter

Called while entering a route (current outlet is not yet set)

#### Parameters

-   `transition` **[Transition](#transition)** 

### leave

Called before leaving a route

#### Parameters

-   `transition` **[Transition](#transition)** 

## redirectGuard

Redirects to a given url if condition is met

### Parameters

-   `url` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `condition` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** redirects when returning true

## sequenceGuard

Execute guards in a sequence

### Parameters

-   `children` **Iterable&lt;[Guard](#guard)>** 

## parallelGuard

Execute guards in a parallel

### Parameters

-   `children` **Iterable&lt;[Guard](#guard)>** 

## WaitingGuard

**Extends Guard**

Shows a component during transition

### Parameters

-   `component` **SvelteComponent** to show up during th transition
-   `rampUpTime` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** initial delay for the componnt to show up (optional, default `300`)

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
