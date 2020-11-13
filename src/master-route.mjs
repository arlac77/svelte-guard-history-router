import { SkeletonRoute } from "./routes.mjs";

export class MasterRoute extends SkeletonRoute {
  constructor(path, options) {
    super(path, options);
    this.value = [];
  }

  async enter(transition, untilRoute) {
    await super.enter(transition, untilRoute);

    const entries = [];

    for await (const e of await this.iteratorFor(transition)) {
      entries.push(e);
    }

    this.value = entries;
  }

  async objectFor(transition) {
    for (const object of this.value) {
      if (this.matches(object, transition.params)) {
        return object;
      }
    }
  }
}

export class IteratorStoreRoute extends MasterRoute {}
