import { SkeletonRoute } from "./routes.mjs";

/**
 * Route holding a ordered collection of values.
 * 
 * @property {any[]} value
 */
export class MasterRoute extends SkeletonRoute {
  constructor(path, options) {
    super(path, options);
    this.value = [];
  }

  propertiesFor(object)
  {
    return undefined;
  }

  async enter(transition, untilRoute) {
    await super.enter(transition, untilRoute);

    const values = [];

    for await (const e of await this.iteratorFor(transition)) {
      values.push(e);
    }

    this.value = values;
  }
}
