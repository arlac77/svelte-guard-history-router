import { matcher } from "multi-path-matcher";

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
   * - leave old route
   * - find matching target route @see matcher()
   * - set params
   * - set current route
   * - enter new route
   */
  async start() {
    try {
      const router = this.router;
      const state = matcher(router.routes, this.path);

      if (state.route) {
        const ancestor = state.route.commonAncestor(this.saved.route);

        if (this.saved.route !== undefined) {
          await this.saved.route.leave(this, ancestor);
        }

        router.state = state;

        await router.route.enter(this, ancestor);
      }
    } catch (e) {
      await this.abort(e);
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
   * To proceed with the original route by calling {@link continue()}
   * The original transition will cept in place and be continued afterwards
   * @param {string} path new route to enter temporary
   */
  async redirect(path) {
    this.redirected = { state: this.router.replace(path) };

    return new Promise((resolve, reject) => {
      this.redirected.continue = async () => {
        try {
          this.router.state = this.redirected.state;
          resolve();
        } catch (e) {
          await this.abort(e);
          reject(e);
        } finally {
          this.redirected = undefined;
        }
      };

      this.redirected.abort = () => {
        this.redirected = undefined;
        reject();
      };
    });
  }

  /**
   * Continue a redirected route to its original destination.
   * Does nothing if the transition has not been redirected
   */
  async continue() {
    if (this.redirected !== undefined) {
      return this.redirected.continue();
    }
  }

  /**
   * Bring back the router into the state before the transition has started
   * @param {Exception|undefined} e
   */
  async abort(e) {
    if (e) {
      this.router.error(e);
    }

    if (this.redirected !== undefined) {
      await this.redirected.abort();
    }

    this.router.state = this.saved;
    history.back();
    setTimeout(() => this.router.finalizePush(), 0);
  }
}
