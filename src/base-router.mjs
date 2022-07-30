import { compile, matcher } from "multi-path-matcher";
import { Transition } from "./transition.mjs";
import { BaseTransition } from "./base-transition.mjs";
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
 * @param {Route[]} routes all managed routes
 * @param {string} base url
 * @property {Set<Node>} linkNodes nodes having their active state updated
 * @property {Route[]} routes
 * @property {Object} keys collected keys of all routes
 * @property {Object} params value mapping from keys (from current route)
 * @property {Route} route current
 * @property {Transition} nested ongoing nested transition
 * @property {string} base url
 */
export class BaseRouter extends BaseTransition {

  linkNodes = new Set();
  subscriptions = new Set();
  base;
  keys = {};

  constructor(routes, base) {
    super();

    this.routes = routes;
    this.base = base;

    let route;
    const params = {};

    Object.defineProperties(this, {
      params: {
        set(np) {
          for (const key of Object.keys(this.keys)) {
            const value = np[key];
            if (params[key] !== value) {
              if (value === undefined) {
                delete params[key];
              } else {
                params[key] = value;
              }
              const k = this.keys[key];
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
            this.emit();
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
        if (!this.keys[key]) {
          this.keys[key] = nameValueStore(key);
        }
      });
    }
  }

  /**
   * Current component.
   * Either from a nested transition or from the current route
   * @return {SvelteComponent}
   */
  get component() {
    for (const o of [this.nested, this.route]) {
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
    return this.route && this.route.value;
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
   *
   * @return {string} url path with fragment & query
   */
  get path() {
    const l = window.location;
    return decodeURI(l.href.slice(l.origin.length + this.base.length));
  }

  /**
   * Replace current route.
   * @param {string} path
   */
  set path(path) {
    this.state = matcher(this.routes, decodeURI(path));
    history.replaceState(undefined, undefined, this.base + path);
  }

  /**
   * Replace current route without updating the state.
   * @param {string} path
   * @return {Object} former state
   */
  replace(path) {
    const formerState = this.state;

    this.path = path;

    return formerState;
  }

  /**
   * Leave current route and enter route for given path.
   * The work is done by a Transition.
   * @param {string} path where to go
   * @return {Transition} running transition
   */
  async push(path) {
    return this.nest(decodeURI(path), Transition);
  }

  /**
   * Called from a Transition to manifest the new destination.
   * If path is undefined the Transition has been aborderd.
   * @param {string} path
   */
  finalizePush(path) {
    this.nested = undefined;

    if (path !== undefined) {
      history.pushState(undefined, undefined, this.base + path);
    }

    this.emit();

    this.linkNodes.forEach(n => this.updateActive(n));
  }

  /**
   * Continue a transition to its original destination.
   * Shortcut for this.transition.continue().
   * If there is no transition ongoing and a fallbackPath is
   * present, it will be entered.
   * Otherwise does nothing.
   * @param {string} fallbackPath
   */
  async continue(fallbackPath) {
    if (!(await super.continue()) && fallbackPath) {
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
    if (!(await super.abort()) && fallbackPath) {
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

  emit() {
    this.subscriptions.forEach(subscription => subscription(this));
  }

  /**
   * Update the active state of a node.
   * A node is considered active if it shared the path prefix with the current route.
   * @param {Node} node
   */
  updateActive(node) {
    node.classList.remove("active");

    const href = node.getAttribute("href");

    if (this.path.startsWith(href)) {
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
   * Find Route for a given value.
   * @param {any} value
   * @return {Route} able to support given value
   */
  routeFor(value) {
    for (let i = this.routes.length - 1; i >= 0; i--) {
      const r = this.routes[i];
      if (r.propertiesFor(value)) {
        return r;
      }
    }
  }

  /**
   * Find path for a given value.
   * @param {any} value
   * @param {String} suffix to be appended
   * @return {String} path + suffix
   */
  pathFor(value, suffix) {
    const route = this.routeFor(value);
    if (route) {
      return route.pathFor(value, suffix);
    }
  }
}
