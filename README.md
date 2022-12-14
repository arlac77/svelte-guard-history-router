[![Svelte v3](https://img.shields.io/badge/svelte-v3-orange.svg)](https://svelte.dev)
[![npm](https://img.shields.io/npm/v/svelte-guard-history-router.svg)](https://www.npmjs.com/package/svelte-guard-history-router)
[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)
[![Open Bundle](https://bundlejs.com/badge-light.svg)](https://bundlejs.com/?q=svelte-guard-history-router)
[![downloads](http://img.shields.io/npm/dm/svelte-guard-history-router.svg?style=flat-square)](https://npmjs.org/package/svelte-guard-history-router)
[![GitHub Issues](https://img.shields.io/github/issues/arlac77/svelte-guard-history-router.svg?style=flat-square)](https://github.com/arlac77/svelte-guard-history-router/issues)
[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Farlac77%2Fsvelte-guard-history-router%2Fbadge\&style=flat)](https://actions-badge.atrox.dev/arlac77/svelte-guard-history-router/goto)
[![Styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Known Vulnerabilities](https://snyk.io/test/github/arlac77/svelte-guard-history-router/badge.svg)](https://snyk.io/test/github/arlac77/svelte-guard-history-router)
[![Coverage Status](https://coveralls.io/repos/arlac77/svelte-guard-history-router/badge.svg)](https://coveralls.io/github/arlac77/svelte-guard-history-router)
[![Tested with TestCafe](https://img.shields.io/badge/tested%20with-TestCafe-2fa4cf.svg)](https://github.com/DevExpress/testcafe)

# svelte-guard-history-router

svelte guarded history router

# Features

*   Named params `article/:id`
*   Guards to act when entering or leaving a route
*   Automatic route ranking (more specific routes have higher priority)
*   Routes and keys acting as stores
*   Nested Routes with relative paths for route composition (Shared Leave Routes)
*   Route values
*   Object <=> parameter mapping
*   Create links from objects
*   Standart `<a href="/home">Home</a>` elements

## Shared Leave Routes

```html
<DetailRoute>
    <Route path="/detail/:detail"/>
</DetailRoute>

<Router>
    <Route path="/subjectA">
        <DetailRoute/>
    </Route>
    <Route path="/subjectB">
        <DetailRoute/>
    </Route>
</Router>
```

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
or the [live example](https://svelte-guard-history-router.pages.dev/).

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

*   [active](#active)
    *   [Parameters](#parameters)
*   [Key](#key)
    *   [Properties](#properties)
*   [BaseRouter](#baserouter)
    *   [Parameters](#parameters-1)
    *   [Properties](#properties-1)
    *   [component](#component)
    *   [value](#value)
    *   [path](#path)
    *   [path](#path-1)
        *   [Parameters](#parameters-2)
    *   [replace](#replace)
        *   [Parameters](#parameters-3)
    *   [push](#push)
        *   [Parameters](#parameters-4)
    *   [finalizePush](#finalizepush)
        *   [Parameters](#parameters-5)
    *   [continue](#continue)
        *   [Parameters](#parameters-6)
    *   [abort](#abort)
        *   [Parameters](#parameters-7)
    *   [subscribe](#subscribe)
        *   [Parameters](#parameters-8)
    *   [updateActive](#updateactive)
        *   [Parameters](#parameters-9)
    *   [addRoute](#addroute)
        *   [Parameters](#parameters-10)
    *   [routeFor](#routefor)
        *   [Parameters](#parameters-11)
    *   [pathFor](#pathfor)
        *   [Parameters](#parameters-12)
*   [BaseTransition](#basetransition)
    *   [searchParams](#searchparams)
    *   [searchParams](#searchparams-1)
        *   [Parameters](#parameters-13)
    *   [nest](#nest)
        *   [Parameters](#parameters-14)
    *   [continue](#continue-1)
    *   [abort](#abort-1)
        *   [Parameters](#parameters-15)
*   [DetailRoute](#detailroute)
    *   [Properties](#properties-2)
    *   [master](#master)
    *   [first](#first)
    *   [last](#last)
    *   [previous](#previous)
    *   [next](#next)
*   [Guard](#guard)
    *   [enter](#enter)
        *   [Parameters](#parameters-16)
    *   [leave](#leave)
        *   [Parameters](#parameters-17)
*   [redirectGuard](#redirectguard)
    *   [Parameters](#parameters-18)
*   [sequenceGuard](#sequenceguard)
    *   [Parameters](#parameters-19)
*   [parallelGuard](#parallelguard)
    *   [Parameters](#parameters-20)
*   [MasterRoute](#masterroute)
    *   [Parameters](#parameters-21)
    *   [Properties](#properties-3)
*   [nullGuard](#nullguard)
*   [RootRoute](#rootroute)
    *   [hasParams](#hasparams)
    *   [path](#path-2)
    *   [propertyMapping](#propertymapping)
    *   [guard](#guard-1)
*   [SkeletonRoute](#skeletonroute)
    *   [Parameters](#parameters-22)
    *   [Properties](#properties-4)
    *   [enter](#enter-1)
        *   [Parameters](#parameters-23)
    *   [leave](#leave-1)
        *   [Parameters](#parameters-24)
    *   [isAcceptable](#isacceptable)
        *   [Parameters](#parameters-25)
    *   [propertiesFor](#propertiesfor)
        *   [Parameters](#parameters-26)
    *   [commonAncestor](#commonancestor)
        *   [Parameters](#parameters-27)
    *   [valueFor](#valuefor)
        *   [Parameters](#parameters-28)
    *   [value](#value-1)
    *   [propertyMapping](#propertymapping-1)
    *   [objectInstance](#objectinstance)
*   [ValueStoreRoute](#valuestoreroute)
*   [Transition](#transition)
    *   [Parameters](#parameters-29)
    *   [Properties](#properties-5)
    *   [start](#start)
    *   [end](#end)
    *   [redirect](#redirect)
        *   [Parameters](#parameters-30)
    *   [abort](#abort-2)
        *   [Parameters](#parameters-31)
*   [findClosestAttribute](#findclosestattribute)
    *   [Parameters](#parameters-32)
*   [dispatchNavigationEvent](#dispatchnavigationevent)
    *   [Parameters](#parameters-33)
*   [nameValueStore](#namevaluestore)
    *   [Parameters](#parameters-34)
    *   [Properties](#properties-6)
*   [WaitingGuard](#waitingguard)
    *   [Parameters](#parameters-35)

## active

*   **See**: {Router.updateActive}

Keeps the the node active state in sync.

### Parameters

*   `node` **any**&#x20;
*   `router` **Router**&#x20;

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

*   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&#x20;
*   `value` **any**&#x20;
*   `subscriptions` **[Set](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)**&#x20;

## BaseRouter

**Extends BaseTransition**

key subscriptions:

```js
const aKey = router.keys.aKey;
$aKey // fired if value of aKey changes
```

### Parameters

*   `routes` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)\<Route>** all managed routes
*   `base` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** url

### Properties

*   `linkNodes` **[Set](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)<[Node](https://developer.mozilla.org/docs/Web/API/Node/nextSibling)>** nodes having their active state updated
*   `routes` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)\<Route>**&#x20;
*   `keys` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** collected keys of all routes
*   `params` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** value mapping from keys (from current route)
*   `route` **Route** current
*   `nested` **[Transition](#transition)** ongoing nested transition
*   `base` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** url

### component

Current component.
Either from a nested transition or from the current route

Returns **SvelteComponent**&#x20;

### value

Value if the current route

Returns **any**&#x20;

### path

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** url path with fragment & query

### path

Replace current route.

#### Parameters

*   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&#x20;

### replace

Replace current route without updating the state.

#### Parameters

*   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&#x20;

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** former state

### push

Leave current route and enter route for given path.
The work is done by a Transition.

#### Parameters

*   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** where to go

Returns **[Transition](#transition)** running transition

### finalizePush

Called from a Transition to manifest the new destination.
If path is undefined the Transition has been aborderd.

#### Parameters

*   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&#x20;

### continue

Continue a transition to its original destination.
Shortcut for this.transition.continue().
If there is no transition ongoing and a fallbackPath is
present, it will be entered.
Otherwise does nothing.

#### Parameters

*   `fallbackPath` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&#x20;

### abort

Abort a transition.
Shortcut for this.transition.abort()
If there is no transition ongoing and a fallbackPath is
present it will be entered.
Otherwise does nothing.

#### Parameters

*   `fallbackPath` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&#x20;

### subscribe

Router subscription.
Changes in the current route will trigger a update

#### Parameters

*   `subscription` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)**&#x20;

### updateActive

Update the active state of a node.
A node is considered active if it shared the path prefix with the current route.

#### Parameters

*   `node` **[Node](https://developer.mozilla.org/docs/Web/API/Node/nextSibling)**&#x20;

### addRoute

Add a new Route.

#### Parameters

*   `route` **Route**&#x20;

### routeFor

Find Route for a given value.

#### Parameters

*   `value` **any**&#x20;

Returns **Route** able to support given value

### pathFor

Find path for a given value.

#### Parameters

*   `value` **any**&#x20;
*   `suffix` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** to be appended

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** path + suffix

## BaseTransition

### searchParams

Deliver url search params form the current location.

Returns **URLSearchParams** as extracted from the path

### searchParams

Replaces the search part of the path with the given searchParams.

#### Parameters

*   `searchParams` **(URLSearchParams | [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object))**&#x20;

### nest

Add another transition nesting level.
Starts a transition from the given factory.

#### Parameters

*   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&#x20;
*   `factory` **[Transition](#transition)**&#x20;

### continue

Continue a nested route to its original destination.
Does nothing if the transition has not been nested.

### abort

Abort the transition.

#### Parameters

*   `error` &#x20;

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** truen in case there was a nesten transition

## DetailRoute

**Extends ValueStoreRoute**

Route to represent a slice of the masters list of values.

### Properties

*   `master` **Route** route holding the master records

### master

Route holding the list ov values

Returns **Route** our master

### first

Returns **any** 1st. entry

### last

Returns **any** last entry

### previous

Returns **any** previous value

### next

Returns **any** next value

## Guard

Enforces conditions of routes
Like the presents of values in the context

### enter

Called while entering a route (current outlet is not yet set)

#### Parameters

*   `transition` **[Transition](#transition)**&#x20;

### leave

Called before leaving a route

#### Parameters

*   `transition` **[Transition](#transition)**&#x20;

## redirectGuard

Redirects to a given path if condition is met.

### Parameters

*   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&#x20;
*   `condition` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** redirects when returning true

## sequenceGuard

Execute guards in a sequence.

### Parameters

*   `children` **Iterable<[Guard](#guard)>**&#x20;

## parallelGuard

Execute guards in a parallel.

### Parameters

*   `children` **Iterable<[Guard](#guard)>**&#x20;

## MasterRoute

**Extends SkeletonRoute**

Route holding a ordered collection of values.

### Parameters

*   `path` &#x20;
*   `options` &#x20;

### Properties

*   `value` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)\<any>**&#x20;

## nullGuard

Default empty guard does nothing.

## RootRoute

Route at the root of the tree.
This route has no parent.
All other routes are below of this one.

### hasParams

Are there parameters in the path.

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** true if route has parameters (:key)

### path

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** empty as we are the root

### propertyMapping

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** empty object

### guard

Returns **[Guard](#guard)** empty guard which does nothing

## SkeletonRoute

**Extends RootRoute**

Route
Subscriptions on Routes fire when the route value changes.

### Parameters

*   `path` &#x20;
*   `options`   (optional, default `{}`)

### Properties

*   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** full path of the Route including all parents
*   `component` **SvelteComponent** target to show
*   `linkComponent` **SvelteComponent** content for [ObjectLink](ObjectLink)
*   `propertyMapping` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** Map properties to object attributes
    Keys are the property names and values are the keys in the resulting object.
*   `priority` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)**&#x20;
*   `keys` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** as found in the path
*   `regex` **RegEx**&#x20;
*   `value` **any**&#x20;

### enter

Enter the route from a former one.
All parent routes up to the common ancestor are entered first.

#### Parameters

*   `transition` **[Transition](#transition)**&#x20;
*   `untilRoute` **Route** the common ancestor with the former route

### leave

Leave the route to a new one.
All parent routes up to the common ancestor are left.

#### Parameters

*   `transition` **[Transition](#transition)**&#x20;
*   `untilRoute` **Route** the common ancestor with the future route

### isAcceptable

Check if value and properties are acceptable for the route.

#### Parameters

*   `value` **any** to be placed into route
*   `properties` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** as presented in the route

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** true if value can be accepted

### propertiesFor

Extract properties from a value.
All property values must be strings.

#### Parameters

*   `value` **any** source of the properties

Returns **([Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) | [undefined](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined))** properties extracted from given value

### commonAncestor

Find common ancestor with an other Route.

#### Parameters

*   `other` **Route**&#x20;

Returns **(Route | [undefined](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined))** common ancestor Route between receiver and other

### valueFor

Deliver value for a given set of properties of the transition.
Default implemantation asks the parent route.

#### Parameters

*   `transition` **[Transition](#transition)**&#x20;

Returns **any** for matching properties

### value

Deliver route value.
Default implemantation asks the parent route.

Returns **any**&#x20;

### propertyMapping

Deliver property mapping.
Default implemantation asks the parent route.

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** for matching properties

### objectInstance

Default implemantation asks the parent route.

## ValueStoreRoute

**Extends SkeletonRoute**

Route holding a single value

## Transition

**Extends BaseTransition**

Transition between routes.

### Parameters

*   `router` **Router**&#x20;
*   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** new destination

### Properties

*   `router` **Router**&#x20;
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
To proceed with the original route call [continue()](continue\(\))
The original transition will keept in place and can be continued afterwards.

#### Parameters

*   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** new route to enter temporary

### abort

Bring back the router into the state before the transition has started.
All nested transitions also will be termniated.

#### Parameters

*   `e` **(Exception | [undefined](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined))**&#x20;

## findClosestAttribute

Walks up the dom tree parents unti a node with a given attribute is found or the root node is reached.

### Parameters

*   `element` **[Element](https://developer.mozilla.org/docs/Web/API/Element)**&#x20;
*   `attributeName` **stringg**&#x20;

Returns **[Element](https://developer.mozilla.org/docs/Web/API/Element)**&#x20;

## dispatchNavigationEvent

Dispatches a NAVIGATION\_EVENT with pathname and hash

### Parameters

*   `event` **[Event](https://developer.mozilla.org/docs/Web/API/Event)**&#x20;

## nameValueStore

Create a named object which also acts as a store.

### Parameters

*   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&#x20;
*   `value` **any** initial value

### Properties

*   `value` **any**&#x20;

Returns **Store**&#x20;

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
