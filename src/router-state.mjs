/**
 *
 */
export class RouterState {

  /**
   * Deliver url search params form the current location.
   * @return {URLSearchParams} as extracted from the path
   */
  get searchParams() {
    const path = this.path;
    const i = path.indexOf("?");
    return new URLSearchParams(i >= 0 ? path.substring(i + 1) : undefined);
  }

  get leave()
  {
    const n = this.nested;
    return n ? n : this;
  }

  /*
  async nest(path) {
    this.nested = new RouterState(path);
  }

  async continue() {
    if (this.nested !== undefined) {
      return this.nested.continue();
    }
  }

  async abort() {
    if (this.nested !== undefined) {
      await this.nested.abort();
    }
  }*/

}
