import { ObjectStoreRoute } from "./routes.mjs";

/**
 * Route to represent a slice of the prarent list of values.
 * 
 * @property {Route} master route holding the master records
 */
export class DetailRoute extends ObjectStoreRoute {

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

  async * valueForTransition(transition) {
    for await (const object of this.master.valueForTransition(transition)) {
      if (this.matches(object, transition.params)) {
        yield object;
      }
    }
  }
}
