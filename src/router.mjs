import { compile, matcher } from "multi-path-matcher";
import { Route } from "./route.mjs";
import { Transition } from "./transition.mjs";

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
 * @typedef {Object} RouterState
 * @property {Router} router
 * @property {Route} route
 * @property {Object} keys all possible keys of all routes
 * @property {Object} params of current route
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
 * @property {Object} keys all possible keys of all routes
 * @property {Object} params value mapping from keys (from current route)
 * @property {RouterState} state
 * @property {Route} route current
 * @property {Transition} transition ongoing transition
 * @property {string} base url
 */
export class Router {
  static get navigationEventType() {
    return "routerLink";
  }

  constructor(routes = [], base = "") {
    let route;

    routes = compile(routes);

    const stateSubscriptions = new Set();
    const keys = {};
    const params = {};

    for (const key of routes.reduce(
      (a, r) => new Set([...r.keys, ...a]),
      new Set()
    )) {
      const subscriptions = new Set();
      let value;

      const o = {
        name: key,
        subscribe: cb => {
          subscriptions.add(cb);
          cb(value);
          return () => subscriptions.delete(cb);
        },
        set(v) {
          o.value = v;
        }
      };

      Object.defineProperties(o, {
        value: {
          get() {
            return value;
          },
          set(v) {
            value = v;
            subscriptions.forEach(subscription => subscription(value));
          }
        },
        subscriptions: { value: subscriptions }
      });

      keys[key] = o;
    }

    const state = {
      subscribe: subscription => {
        stateSubscriptions.add(subscription);
        subscription(this.state);
        return () => stateSubscriptions.delete(subscription);
      }
    };

    Object.defineProperties(state, {
      router: { value: this },
      route: { get: () => route },
      keys: { value: keys },
      params: {
        set(np) {
          const all = new Set([...Object.keys(params), ...Object.keys(np)]);

          let changed = false;
          all.forEach(key => {
            if (params[key] !== np[key]) {
              const value = np[key];
              params[key] = value;
              const k = keys[key];
              k.value = value;
              changed = true;
            }
          });

          if (changed) {
            stateSubscriptions.forEach(subscription => subscription(state));
          }
        },
        get() {
          return params;
        }
      }
    });

    Object.defineProperties(this, {
      base: { value: base },
      linkNodes: { value: new Set() },
      subscriptions: { value: new Set() },
      state: { value: state },
      keys: { value: keys },
      params: { value: params },
      routes: { value: routes },
      route: {
        get() {
          return route;
        },
        set(value) {
          if (route !== value) {
            route = value;
            this.subscriptions.forEach(subscription => subscription(this));
            stateSubscriptions.forEach(subscription => subscription(state));
          }
        }
      }
    });

    window.addEventListener(Router.navigationEventType, event => {
      const path = event.detail.path;

      //history.pushState({ path }, "", this.base + path);

      this.push(path);
    });

    window.addEventListener("popstate", event => {
      if (event.state) {
        const path = event.state.path;
        const { route, params } = matcher(this.routes, path);
        this.state.params = params;
        this.route = route;
      }
    });

    this.push(window.location.pathname.slice(this.base.length));
  }

  get component() {
    const transition = this.transition;
    if(transition !== undefined && transition.component !== undefined) {
      return transition.component;
    }

    const r = this.route;
    return r !== undefined && r.component;
  }

  async replace(path) {
    await this.push(path);
  }

  /**
   * Leave current route and enter route for given path
   * The work is done by a Transition
   * @param {string} path where to go
   */
  async push(path) {
    const transition = new Transition(this, path);
    return transition.start();
  }

  get path()
  {
    return window.location.pathname.slice(this.base.length);
  }

  /**
   * Router subscription
   * Value changes are fired when the route (or the target component changes)
   * @param {Function} subscription
   */
  subscribe(subscription) {
    this.subscriptions.add(subscription);
    subscription(this);
    return () => this.subscriptions.delete(subscription);
  }

  /**
   * Update the active state of a node
   * @param {Object} node
   */
  updateActive(node) {
    node.classList.remove("active");

    const href = node.getAttribute("href");

    if(this.path === href) {
      node.classList.add("active");
    }
  }
}
