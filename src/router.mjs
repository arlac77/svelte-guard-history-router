import { compile, matcher } from "multi-path-matcher";
import { Route } from "./route.mjs";

/**
 * @typedef Key {Object}
 * @property {string} name
 * @property {any} value
 */

 /**
 * @typedef RouterState {Object}
 * @property {Router} router
 * @property {Route} route
 * @property {Set<Key>} keys
 * @property {Object} params
 */

/**
 * @param {Route[]} routes
 * @param {string} base url
 * @property {Route[]} routes
 * @property {Object} keys
 * @property {Object} params value mapping from keys
 * @property {RouterState} state
 * @property {Route} route current
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
            stateSubscriptions.forEach(subscription =>
              subscription(this.state)
            );
          }
        },
        get() {
          return params;
        }
      }
    });

    Object.defineProperties(this, {
      base: { value: base },
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
          if(route !== value) {
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

    console.log(
      "LOCATION",
      window.location.pathname,
      window.location.pathname.substring(this.base.length)
    );

    this.push(window.location.pathname.substring(this.base.length));
  }

  set component(c) {
    this.route = new Route("", c);
    this.subscriptions.forEach(subscription => subscription(this));
  }

  get component() {
    const r = this.route;
    return r !== undefined && r.component;
  }

  async replace(path) {
    await this.push(path);
  }

  /**
   * Leave current route and enter route for given path
   * @param {string} path where to go
   */
  async push(path) {
    const state = this.state;
    const oldRoute = this.route;
    const oldParams = this.params;

    try {
      const { route, params } = matcher(this.routes, path);

      if (oldRoute !== undefined) {
        await oldRoute.leave(state, route);
      }

      state.params = params;
      this.route = route;

      if (route !== undefined) {
        await route.enter(state, oldRoute);
      }

    } catch (e) {
      console.log("PUSH", path, e);
      state.params = oldParams;
      this.route = oldRoute;
    } finally {
      history.pushState({ path }, "", this.base + path);
    }
  }

  /**
   * Fired when the route (or the target component changes)
   * @param {Function} subscription
   */
  subscribe(subscription) {
    this.subscriptions.add(subscription);
    subscription(this);
    return () => this.subscriptions.delete(subscription);
  }
}
