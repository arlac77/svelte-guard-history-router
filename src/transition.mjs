import { matcher } from "multi-path-matcher";


/**
 * 
 */
export class Transition {
  constructor(router, path) {
    Object.defineProperties(this, {
      router: { value: router },
      path: { value: path },
      saved: { value: { route : router.route, params: router.params }}
    });
  }

  async start() {
    const router = this.router;

    try {
      const { route, params } = matcher(this.router.routes, this.path);

      if (this.saved.route !== undefined) {
        await this.saved.route.leave(router.state, route);
      }

      router.state.params = params;
      router.route = route;

      if (route !== undefined) {
        await route.enter(router.state, route);
      }
    } catch (e) {
      await this.rollback(e);
    } finally {
      history.pushState({ path: this.path }, "", router.base + this.path);
    }
  }

  async rollback(e) {
    if(e) { console.error(e); }
    const router = this.router;
    router.state.params = this.saved.params;
    router.route = this.saved.route;
  }
}
