import { ValueStoreRoute } from "./routes.mjs";

/**
 * Route to represent a slice of the masters list of values.
 * 
 * @property {Route} master route holding the master records
 */
export class DetailRoute extends ValueStoreRoute {

  get master()
  {
    return this.parent;
  }

  /**
   * @return 1st. entry
   */
  async first() {
    return this.master.value[0];
  }

  /**
   * @return last entry
   */
  async last() {
    return this.master.value[this.master.value.length - 1];
  }

  async previous() {
    const i = this.master.value.indexOf(this.value);
    if (i > 0) {
      return this.master.value[i - 1];
    }
  }

  async next() {
    const i = this.master.value.indexOf(this.value);
    if (i >= 0) {
      return this.master.value[i + 1];
    }
  }

  async valueFor(transition) {
    for await (const object of this.master.iteratorFor(transition)) {
      if (this.matches(object, transition.params)) {
        return object;
      }
    }
  }
}
