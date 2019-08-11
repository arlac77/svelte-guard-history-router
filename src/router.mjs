import { compile, matcher } from "multi-path-matcher";
import { Route } from "./route.mjs";

/**
 * @typedef Key {Object}
 * @property {string} name
 * @property {any} value
 */

/**
 * @property {Route[]} routes
 * @property {Map<string,key>} keys
 * @property {Object} params Object mapping from keys
 * @property {Object} context
 * @property {Route} current
 * @property {string} base
 */
export class Router {
  constructor(routes = [], base = "") {
    let current;

    routes = compile(routes);

    const contextSubscriptions = new Set();
    const keys = new Map();
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
            console.log("set", key, value);
            subscriptions.forEach(subscription => subscription(value));
          }
        },
        subscriptions: { value: subscriptions }
      });

      keys.set(key, o);
    }

    const context = {
      subscribe: cb => {
        contextSubscriptions.add(cb);
        cb(this.context);
        return () => contextSubscriptions.delete(cb);
      }
    };

    Object.defineProperties(context, {
      router: { value: this },
      route: { get: () => current },
      keys: { value: keys },
      params: {
        set(np) {
          const all = new Set([...Object.keys(params), ...Object.keys(np)]);

          let changed = false;
          all.forEach(key => {
            if (params[key] !== np[key]) {
              const value = np[key];
              params[key] = value;
              const k = keys.get(key);
              k.value = value;
              changed = true;
            }
          });

          if (changed) {
            contextSubscriptions.forEach(subscription =>
              subscription(this.context)
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
      context: { value: context },
      keys: { value: keys },
      params: { value: params },
      routes: { value: routes },
      current: {
        get() {
          return current;
        },
        set(value) {
          current = value;
          this.subscriptions.forEach(subscription => subscription(this));
          contextSubscriptions.forEach(subscription => subscription(context));
        }
      }
    });

    window.addEventListener("routerLink", event => {
      let path = event.detail.path;

      if (path.startsWith(this.base)) {
        history.pushState(event.detail, "", path);
        path = path.substring(this.base.length);
      } else {
        event.detail.path = this.base + path;
        history.pushState(event.detail, "", this.base + path);
      }

      this.push(path);
    });

    window.addEventListener("popstate", event => {
      if (event.state) {
        let path = event.state.path;
        if (path.startsWith(this.base)) {
          path = path.substring(this.base.length);
        }

        const { route, params } = matcher(this.routes, path);
        this.context.params = params;
        this.current = route;
      }
    });

    setTimeout(() => this.initializeCurrent(), 10);
  }

  initializeCurrent() {
    const path = window.location.pathname + window.location.search;
    this.push(path);
  }

  set component(c) {
    this.current = new Route("", c);
    this.subscriptions.forEach(subscription => subscription(this));
  }

  get component() {
    const r = this.current;
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
    const context = this.context;

    const { route, params } = matcher(this.routes, path);

    if (this.current !== undefined) {
      await this.current.leave(context, route);
    }

    context.params = params;

    if (route !== undefined) {
      await route.enter(context, this.current);
    }

    this.current = route;
  }

  /**
   * Fired when the route (or the target component changes)
   * @param cb
   */
  subscribe(cb) {
    this.subscriptions.add(cb);
    cb(this);
    return () => this.subscriptions.delete(cb);
  }
}
