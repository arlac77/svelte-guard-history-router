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

    let context = {};

    Object.defineProperties(this, {
      router: { value: router },
      path: { value: path },
      saved: { value: router.state },
      context: { value: context },
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
   * - find matching target route @see Router.replace()
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
        console.log("CA",router.route.commonAncestor(this.saved.route));
        await router.route.enter(this);
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

    return new Promise(
      (resolve, reject) => {
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
      }
    );
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
   * @param {Exception} e
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
