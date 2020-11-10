import { matcher } from "multi-path-matcher";
import { RouterState } from "./router-state.mjs";

/**
 * Transition between routes
 * @param {Router} router
 * @param {string} path new destination
 * @property {Router} router
 * @property {string} path new destination
 */
export class Transition extends RouterState {
  constructor(router, path) {
    super();

    let component;

    Object.defineProperties(this, {
      router: { value: router },
      path: { value: path },
      component: {
        get: () => (this.redirected === undefined ? component : undefined),
        set: value => {
          component = value;
          this.router.notifySubscriptions();
        }
      }
    });

    Object.assign(this, matcher(router.routes, path));
  }

  /**
   * Start the transition
   * - leave old route
   * - find matching target route @see matcher()
   * - enter new route
   * - set params
   * - set current route
   */
  async start() {
    try {
      if (this.route) {
        const old = this.router.route;
        const ancestor = this.route.commonAncestor(old);

        if (old !== undefined) {
          await old.leave(this, ancestor);
        }

        await this.route.enter(this, ancestor);
        this.router.state = this;
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
   * The original transition will keept in place and be continued afterwards.
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

    history.back();
    setTimeout(() => this.router.finalizePush(), 0);
  }
}
