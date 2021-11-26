/**
 *
 */
export class BaseTransition {
  /**
   * Deliver url search params form the current location.
   * @return {URLSearchParams} as extracted from the path
   */
  get searchParams() {
    const path = this.path;
    const i = path.indexOf("?");
    return new URLSearchParams(i >= 0 ? path.substring(i + 1) : undefined);
  }

  /**
   * Replaces the search part of the path with the given searchParams.
   * @param {URLSearchParams} searchParams
   */
  set searchParams(searchParams) {
    const path = this.path;
    const i = path.indexOf("?");
    this.path = (i >= 0 ? path.substring(0, i) : path) + `?${searchParams}`;
  }

  /**
   * Add another tarnsition nesting level.
   * Starts a transition from the given factory.
   * @param {string} path
   * @param {Transition} factory
   */
  async nest(path, factory) {
    if(this.nested) {
      await this.nested.abort();
    }
    this.nested = new factory(this, path);
    return this.nested.start();
  }

  async start() {}

  /**
   * Continue a nested route to its original destination.
   * Does nothing if the transition has not been nested.
   */
  async continue() {
    if (this.nested !== undefined) {
      await this.nested.continue();
      this.nested = undefined;
      return true;
    }

    return false;
  }

  /**
   * Abort the transition.
   * @param error
   * @return {boolean} truen in case there was a nesten transition
   */
  async abort(error) {
    if (error) {
      console.error(error);
    }

    if (this.nested !== undefined) {
      await this.nested.abort(error);
      this.nested = undefined;
      return true;
    }

    return false;
  }
}
