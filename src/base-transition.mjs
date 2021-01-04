/**
 *
 */
export class BaseTransition {
  constructor() {
  }

  /**
   * Deliver url search params form the current location.
   * @return {URLSearchParams} as extracted from the path
   */
  get searchParams() {
    const path = this.path;
    const i = path.indexOf("?");
    return new URLSearchParams(i >= 0 ? path.substring(i + 1) : undefined);
  }

  async nest(path, factory) {
    this.nested = new factory(this, path);
    return this.nested.start();
  }

  async start()
  {
  }

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

  async abort() {
    if (this.nested !== undefined) {
      await this.nested.abort();
      this.nested = undefined;
      return true;
    }

    return false;
  }
}
