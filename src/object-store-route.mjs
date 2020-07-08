import { StoreRoute } from "./store-route.mjs";

export class ObjectStoreRoute extends StoreRoute {
  async enter(transition) {
    await super.enter(transition);

    const properties = transition.router.params;
    const object = await this.objectFor(properties);

    this.value = object;
    this.subscriptions.forEach(subscription => subscription(object));
  }
}

export default ObjectStoreRoute;
