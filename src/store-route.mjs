import { Route } from "./route.mjs";

export class StoreRoute extends Route {
  constructor(path, component) {
    super(path, component);

    const properties = {
      subscriptions: { value: new Set() }
    };

    Object.defineProperties(this, properties);
  }

  get value() {
    return undefined;
  }

  subscribe(subscription) {
    this.subscriptions.add(subscription);
    subscription(this.value);
    return () => this.subscriptions.delete(subscription);
  }
}

export default StoreRoute;
