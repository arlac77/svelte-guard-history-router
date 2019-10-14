[![Build Status](https://secure.travis-ci.org/arlac77/svelte-guard-history-router.png)](http://travis-ci.org/arlac77/svelte-guard-history-router)
[![codecov.io](http://codecov.io/github/arlac77/svelte-guard-history-router/coverage.svg?branch=master)](http://codecov.io/github/arlac77/svelte-guard-history-router?branch=master)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Coverage Status](https://coveralls.io/repos/arlac77/svelte-guard-history-router/badge.svg)](https://coveralls.io/r/arlac77/svelte-guard-history-router)
[![Dependency Status](https://david-dm.org/arlac77/svelte-guard-history-router.svg)](https://david-dm.org/arlac77/svelte-guard-history-router)
[![devDependency Status](https://david-dm.org/arlac77/svelte-guard-history-router/dev-status.svg)](https://david-dm.org/arlac77/svelte-guard-history-router#info=devDependencies)
[![docs](http://inch-ci.org/github/arlac77/svelte-guard-history-router.svg?branch=master)](http://inch-ci.org/github/arlac77/svelte-guard-history-router)
[![downloads](http://img.shields.io/npm/dm/svelte-guard-history-router.svg?style=flat-square)](https://npmjs.org/package/svelte-guard-history-router)
[![GitHub Issues](https://img.shields.io/github/issues/arlac77/svelte-guard-history-router.svg?style=flat-square)](https://github.com/arlac77/svelte-guard-history-router/issues)
[![Greenkeeper](https://badges.greenkeeper.io/arlac77/svelte-guard-history-router.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/arlac77/svelte-guard-history-router/badge.svg)](https://snyk.io/test/github/arlac77/svelte-guard-history-router)
[![minified size](https://badgen.net/bundlephobia/min/svelte-guard-history-router)](https://bundlephobia.com/result?p=svelte-guard-history-router)
[![npm](https://img.shields.io/npm/v/svelte-guard-history-router.svg)](https://www.npmjs.com/package/svelte-guard-history-router)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/arlac77/svelte-guard-history-router)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

# svelte-guard-history-router

svelte guarded history router

# usage

```js
import { Router, route, Guard } from 'svelte-guard-history-router';

let session = undefined;

class SessionGuard extends Guard {
  async enter(transition) {
    if(!session) {
      transition.redirect('/login');
    }
  }
}

export const router = new Router(
  [
    route("*", Home),
    route("/about", About),
    route("/login", Login),
    route("/article", sessionGuard, Articles),
    route("/article/:article", sessionGuard, Article),
    route("/category", sessionGuard, Categories),
    route("/category/:category", sessionGuard, Category)
  ],
  "/base"
);
```

## run tests

```sh
export BROWSER=safari|chrome|...
npm|yarn test
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

### Parameters

-   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `component` **SvelteComponent** target to show

### Properties

-   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `component` **SvelteComponent** target to show
-   `priority` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** 
-   `keys` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** 
-   `regex` **RegEx** 

### enter

Enter the route from a former one.
Calls guard enter on all guards present in our gurad but absent in the former one

#### Parameters

-   `transition` **[Transition](#transition)** 

### leave

Leave the route to a new one.
Calls quard leave on all our guards which are not in the new route

#### Parameters

-   `transition` **[Transition](#transition)** 

## GuardedRoute

**Extends Route**

### Parameters

-   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `component` **SvelteComponent** target to show
-   `guard` **[Guard](#guard)** 

### Properties

-   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `component` **SvelteComponent** target to show
-   `guard` **[Guard](#guard)** 
-   `priority` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** 
-   `keys` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** 
-   `regex` **RegEx** 

### enter

Enter the route from a former one.
Calls guard enter on all guards present in our gurad but absent in the former one

#### Parameters

-   `transition` **[Transition](#transition)** 

### leave

Leave the route to a new one.
Calls quard leave on all our guards which are not in the new route

#### Parameters

-   `transition` **[Transition](#transition)** 

## route

Helper function to create routes with optional guards

### Parameters

-   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `args` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Guard](#guard)>** last one must be a SvelteComponent

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
npm svelte-guard-history-router
```

# license

BSD-2-Clause
