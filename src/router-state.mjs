
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

}
