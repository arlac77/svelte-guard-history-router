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
}
