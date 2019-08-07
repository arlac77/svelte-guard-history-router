import { compile, matcher } from "multi-path-matcher";

export class Router {
  constructor(routes = [], prefix = "") {
    let current;

    let compiledRoutes = compile(routes);

    const context = {
      subscribe: cb => {
        this.contextSubscriptions.push(cb);
        cb(this.context);
      },
      params: {},
      router: this
    };

    Object.defineProperties(this, {
      prefix: { value: prefix },
      subscriptions: { value: [] },
      contextSubscriptions: { value: [] },
      context: { value: context },
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

  get component() {
    const r = this.current;
    return r !== undefined && r.component;
  }

  async replace(path) {
    await this.push(path);
  }

  async push(path) {
    const { route, params } = matcher(this.compiledRoutes, path);

    if (this.current !== undefined) {
      await Promise.all(
        this.current.guards
          .filter(p => p.leave !== undefined)
          .map(p => p.leave(this.context))
      );
    }

    this.context.params = params;

    await Promise.all(
      route.guards
        .filter(p => p.enter !== undefined)
        .map(p => p.enter(this.context))
    );

    this.current = route;

    this.contextSubscriptions.forEach(subscription =>
      subscription(this.context)
    );
  }

  subscribe(cb) {
    this.subscriptions.push(cb);
  }
}

export function route(path, ...args) {
  const component = args.pop();
  const route = {
    path,
    component,
    guards: args
  };

  route.guards.forEach(guard => {
    if (guard.attach !== undefined) {
      guard.attach(route);
    }
  });

  return route;
}
