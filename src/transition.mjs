import { matcher } from "multi-path-matcher";

/**
 * @param {Router} router
 * @param {string} path
 * @property {Router} router
 * @property {string} path
 * @property {string} state
 */
export class Transition {
  constructor(router, path) {

    Object.defineProperties(this, {
      router: { value: router },
      path: { value: path },
      saved: { value: { route: router.route, params: router.params } }
    });
  }

  /**
   * start the transition
   * - find matching target route
   * - leave old route
   * - set params
   * - set current route
   * - enter new route
   */
  async start() {
    const router = this.router;

    router.transition = this;
    try {
      const { route, params } = matcher(this.router.routes, this.path);

      if (this.saved.route !== undefined) {
        await this.saved.route.leave(this);
      }

      router.state.params = params;
      router.route = route;

      if (route !== undefined) {
        await route.enter(this);
      }
    } catch (e) {
      await this.rollback(e);
    } finally {
      this.end();
    }
  }

  end() {
    if (this.redirected === undefined) {
      const router = this.router;
      router.transition = undefined;
      history.pushState({ path: this.path }, "", router.base + this.path);
    }
  }

  /**
   *
   * @param {string} path
   */
  async redirect(path) {
    this.redirected = this.save();

    const router = this.router;

    const { route, params } = matcher(router.routes, path);
    router.state.params = params;
    router.route = route;
  }

  async continue() {
    if (this.redirected) {
      const router = this.router;
      router.state.params = this.redirected.params;
      router.route = this.redirected.route;
      this.redirected = undefined;
      this.end();
    }
  }

  /**
   * Bring back the router into the state before the transition has started
   * @param {Exception} e
   */
  async rollback(e) {
    if (e) {
      console.error(e);
    }
    this.restore(this.saved);
  }

  save() {
    const router = this.router;
    return {
      params: router.state.params,
      route: router.route
    };
  }

  restore(state) {
    const router = this.router;
    router.state.params = state.params;
    router.route = state.route;
  }
}
