/**
 * Transition between routes
 * @param {Router} router
 * @param {string} path destination
 * @property {Router} router
 * @property {string} path destination
 * @property {string} state
 */
export class Transition {
  constructor(router, path) {
    let component;

    Object.defineProperties(this, {
      router: { value: router },
      path: { value: path },
      saved: { value: router.state },
      component: {
        get: () => (this.redirected === undefined ? component : undefined),
        set: value => {
          component = value;
          this.router.notifySubscriptions();
        }
      }
    });
  }

  /**
   * Start the transition
   * - find matching target route @see Router.replace()
   * - leave old route
   * - set params
   * - set current route
   * - enter new route
   */
  async start() {
    const router = this.router;

    try {
      if (this.saved.route !== undefined) {
        await this.saved.route.leave(this);
      }

      router.replace(this.path);

      if (router.route !== undefined) {
        await router.route.enter(this);
      }
    } catch (e) {
      await this.rollback(e);
    } finally {
      this.end();
    }
  }

  /**
   * Cleanup transition
   * Update Nodes active state
   * @see Router.finalizePush
   */
  end() {
    if (this.redirected === undefined) {
      this.router.finalizePush(this.path);
    }
  }

  /**
   * Halt current transition and go to another route.
   * To proceed with the original route by calling continue()
   * @param {string} path new route to enter temporary
   */
  async redirect(path) {
    this.redirected = this.router.replace(path);
  }

  /**
   * Continue a redirected route to its original destination
   */
  async continue() {
    if (this.redirected !== undefined) {
      try {
        this.router.state = this.redirected;

        // try entering 2nd. time
        if (this.router.route !== undefined) {
          await this.router.route.enter(this);
        }
      } catch (e) {
        await this.rollback(e);
      } finally {
        this.redirected = undefined;
        this.end();
      }
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

    this.router.state = this.saved;
    window.history.back();
    setTimeout(() => this.router.finalizePush(), 0);
  }
}
