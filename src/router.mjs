import { compile, matcher, pathToRegexp } from "multi-path-matcher";
import { Route } from "./route.mjs";
import { Transition } from "./transition.mjs";
import { nameValueStore } from "./util.mjs";

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
export class Router {
  static get navigationEventType() {
    return "routerLink";
  }

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
          const all = new Set(Object.keys(params).concat(Object.keys(np)));

          all.forEach(key => {
            const value = np[key];
            if (params[key] !== value) {
              params[key] = value;
              const k = keys[key];
              k.value = value;
            }
          });
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

    setTimeout(() => this._start(), 10);
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

  _start() {
    window.addEventListener(Router.navigationEventType, event => {
      const path = event.detail.path;

      this.push(path);
    });

    window.addEventListener("popstate", event => {
      if (event.state) {
        this.replace(event.state.path);
      }
    });

    this.push(window.location.pathname.slice(this.base.length));
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

    const { route, params } = matcher(this.routes, path);

    this.params = params;
    this.route = route;

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
   * Leave current route and enter route for given path
   * The work is done by a Transition
   * @param {string} path where to go
   * @return {Transition}
   */
  async push(path) {
    this.transition = new Transition(this, path);
    return this.transition.start();
  }

  finalizePush(path) {
    history.pushState({ path }, "", this.base + path);
    this.linkNodes.forEach(n => this.updateActive(n));
    this.transition = undefined;
    //this.notifySubscriptions();
  }

  /**
   * Continue transition to its original destination.
   * Does nothing if there is no transition.
   */
  continue() {
    if (this.transition) {
      this.transition.continue();
    }
  }

  /**
   * Router subscription
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

  addRoute(route) {
    this.routes.push(route);
    this.compile();
  }
}
