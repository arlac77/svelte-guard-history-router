import { compile, matcher } from "multi-path-matcher";
import { Route } from "./route.mjs";

/**
 * @property {Route[]} routes
 * @property {Object} compiledRoutes
 * @property {Route} current
 * @property {string} prefix
 */
export class Router {
  constructor(routes = [], params = [], prefix = "") {
    let current;

    let compiledRoutes = compile(routes);

    const context = {
      subscribe: cb => {
        this.contextSubscriptions.add(cb);
        cb(this.context);
        return () => this.contextSubscriptions.delete(cb);
      },
      params: {},
      router: this
    };

    const _params = {};

    for(const param of params) {
      _params[param.name] = param;

      param.subscriptions = new Set();
      param.subscribe = (cb) => {
        param.subscriptions.add(cb);
        cb(this.context.param[param]);
        return () => param.subscriptions.delete(cb);
      };
    }

    Object.defineProperties(this, {
      prefix: { value: prefix },
      subscriptions: { value: new Set() },
      contextSubscriptions: { value: new Set() },
      context: { value: context },
      params: { value: _params },
      compiledRoutes: {
        get() {
          return compiledRoutes;
        }
      },
      routes: {
        get() {
          return routes;
        },
        set(value) {
          routes = value;
          compiledRoutes = compile(routes);
        }
      },
      current: {
        get() {
          return current;
        },
        set(value) {
          current = value;
          this.subscriptions.forEach(subscription => subscription(this));
        }
      }
    });

    window.addEventListener("routerLink", event => {
      let path = event.detail.path;

      if (path.startsWith(this.prefix)) {
        history.pushState(event.detail, "", path);
        path = path.substring(this.prefix.length);
      } else {
        event.detail.path = this.prefix + path;
        history.pushState(event.detail, "", this.prefix + path);
      }

      this.push(path);
    });

    window.addEventListener("popstate", event => {
      console.log("POPSTATE", event);
      if (event.state) {
        let path = event.state.path;
        if (path.startsWith(this.prefix)) {
          path = path.substring(this.prefix.length);
        }

        const { route, params } = matcher(this.routes, path);
        this.context.params = params;
        this.current = route;
        this.contextSubscriptions.forEach(subscription =>
          subscription(this.context)
        );
      }
    });

    setTimeout(() => this.initializeCurrent(), 10);
  }

  initializeCurrent() {
    const path = window.location.pathname + window.location.search;
    this.push(path);
  }

  set component(c) {
    this.current = new Route('',c);
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

    const { route, params } = matcher(this.compiledRoutes, path);

    if (this.current !== undefined) {
      await this.current.leave(context, route);
    }

    const old = context.params;
    const keys = new Set([...Object.keys(old),...Object.keys(params)]);

    keys.forEach(key => {
      if(old[key] !== params[key]) {
        const p = this.params[key];
        console.log("param", key, p, old[key], params[key]);

        if(p) {
          p.subscriptions.forEach(subscription =>
            subscription(params[key])
          );
        }
      }
    });

    context.params = params;

    if (route !== undefined) {
      await route.enter(context, this.current);
    }

    this.current = route;

    this.contextSubscriptions.forEach(subscription =>
      subscription(context)
    );
  }

  param(name) {
    this.params 
    return {
      subscribe(cb) {
        this.subscriptions.add(cb);
        cb(this);
        return () => this.subscriptions.delete(cb);
      }
    }; 
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


export function param(name) {
  return {
    name: name
  };
}