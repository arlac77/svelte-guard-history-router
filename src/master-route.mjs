import { SkeletonRoute } from "./routes.mjs";

/**
 * Route holding a ordered collection of objects
 */
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

  /**
   * @return 1st. entry
   */
  async first() {
    return this.value[0];
  }

  /**
   * @return last entry
   */
  async last() {
    return this.value[this.value.length - 1];
  }

  async previous(object) {
    const i = this.value.indexOf(object);
    if (i > 0) {
      return this.value[i - 1];
    }
  }

  async next(object) {
    const i = this.value.indexOf(object);
    if (i >= 0) {
      return this.value[i + 1];
    }
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
