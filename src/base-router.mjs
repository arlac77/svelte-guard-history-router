import { compile, matcher } from "multi-path-matcher";
import { Transition } from "./transition.mjs";
import { nameValueStore, NAVIGATION_EVENT } from "./util.mjs";

/**
 * Keys also act as svelte stores and can be subscribed.
 * ```js
 * export const article = derived(
 * [articles, router.keys.article],
 * ([$articles, $id], set) => {
 *   set($articles.find(a => a.id === $id));
 *   return () => {};
 * }
 * );
 * ```
 * @typedef {Object} Key
 * @property {string} name
 * @property {any} value
 * @property {Set} subscriptions
 */

/**
 * key subscriptions:
 * ```js
 * const aKey = router.keys.aKey;
 * $aKey // fired if value of aKey changes
 * ```
 * @param {Route[]} routes
 * @param {string} base url
 * @property {Set<Node>} linkNodes nodes having their active state updated
 * @property {Route[]} routes
 * @property {Object} keys collected keys of all routes
 * @property {Object} params value mapping from keys (from current route)
 * @property {Route} route current
 * @property {Transition} transition ongoing transition
 * @property {string} base url
 */
export class BaseRouter {
  constructor(routes = [], base = "") {
    let route;

    this.routes = routes;

    const keys = {};
    const params = {};

    Object.defineProperties(this, {
      base: { value: base },
      linkNodes: { value: new Set() },
      subscriptions: { value: new Set() },
      keys: { value: keys },
      params: {
        set(np) {
          for (const key of Object.keys(keys)) {
            const value = np[key];
            if (params[key] !== value) {
              if (value === undefined) {
                delete params[key];
              } else {
                params[key] = value;
              }
              const k = keys[key];
              k.value = value;
            }
          }
        },
        get() {
          return params;
        }
      },
      route: {
        get() {
          return route;
        },
        set(value) {
          if (route !== value) {
            route = value;
            this.notifySubscriptions();
          }
        }
      }
    });
    
    this.compile();

    window.addEventListener(NAVIGATION_EVENT, event =>
      this.push(event.detail.path)
    );

    window.addEventListener("popstate", event =>
      this.replace(window.location.pathname.slice(this.base.length))
    );
  }

  compile() {
    this.routes = compile(this.routes);

    for (const route of this.routes) {
      route.keys.forEach(key => {
        if (this.keys[key]) {
          return;
        }
        this.keys[key] = nameValueStore(key);
      });
    }
  }

  /**
   * Current component.
   * Either from a redirected transition or from the current route
   * @return {SvelteComponent}
   */
  get component() {
    for (const o of [this.transition, this.route]) {
      if (o !== undefined && o.component !== undefined) {
        return o.component;
      }
    }
  }

  /**
   * Value if the current route
   * @return {any}
   */
  get value() {
    return this.route ? this.route.value : undefined;
  }

  get path() {
    return window.location.pathname.slice(this.base.length);
  }

  /**
   * Replace current route
   * @param {string} path
   * @return {Object} former state
   */
  replace(path) {
    const formerState = this.state;

    this.state = matcher(this.routes, path);

    return formerState;
  }

  get state() {
    return {
      params: { ...this.params },
      route: this.route
    };
  }

  set state(state) {
    this.params = state.params;
    this.route = state.route;
  }

  /**
   * Leave current route and enter route for given path.
   * The work is done by a Transition
   * @param {string} path where to go
   * @return {Transition} running transition
   */
  async push(path) {
    this.transition = new Transition(this, path);
    return this.transition.start();
  }

  /**
   * Called from a transition to manifest the new destination.
   * If path is undefined the transition has been aborderd
   * @param {string} path
   */
  finalizePush(path) {
    const c = this.component;
    this.transition = undefined;

    // transition had its own tmp component (waiting... or so)
    if (c !== this.component) {
      this.notifySubscriptions();
    }

    if (path !== undefined) {
      history.pushState(undefined, undefined, this.base + path);
    }

    this.linkNodes.forEach(n => this.updateActive(n));
  }

  /**
   * Continue a transition to its original destination.
   * Shortcut for this.transition.continue().
   * If there is no transition ongoing and a fallbackPath is
   * present it will be entered.
   * Otherwise does nothing.
   * @param {string} fallbackPath
   */
  async continue(fallbackPath) {
    if (this.transition) {
      return this.transition.continue();
    }
    if(fallbackPath) {
      return this.push(fallbackPath);
    }
  }

  /**
   * Abort a transition.
   * Shortcut for this.transition.abort()
   * If there is no transition ongoing and a fallbackPath is
   * present it will be entered.
   * Otherwise does nothing.
   * @param {string} fallbackPath
   */
  async abort(fallbackPath) {
    if (this.transition) {
      return this.transition.abort();
    }
    if(fallbackPath) {
      return this.push(fallbackPath);
    }
  }

  /**
   * Router subscription.
   * Changes in the current route will trigger a update
   * @param {Function} subscription
   */
  subscribe(subscription) {
    this.subscriptions.add(subscription);
    subscription(this);
    return () => this.subscriptions.delete(subscription);
  }

  notifySubscriptions() {
    this.subscriptions.forEach(subscription => subscription(this));
  }

  /**
   * Update the active state of a node
   * @param {Node} node
   */
  updateActive(node) {
    node.classList.remove("active");

    const href = node.getAttribute("href");

    if (this.path === href) {
      node.classList.add("active");
    }
  }

  /**
   * Add a new Route.
   * @param {Route} route
   */
  addRoute(route) {
    this.routes.push(route);
    this.compile();
  }

  /**
   * Find Route for a given object
   * @param {Object} object
   * @return {Route} able to support given object
   */
  routeFor(object) {
    for (let i = this.routes.length - 1; i >= 0; i--) {
      const r = this.routes[i];
      if (r.propertiesFor(object)) {
        return r;
      }
    }
  }

  error(err) {
    console.error(err);
  }
}
