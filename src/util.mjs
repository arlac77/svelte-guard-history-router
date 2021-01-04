export function findClosestAttribute(element, attributeName) {
  let attribute;
  while ((attribute = element.getAttribute(attributeName)) === null) {
    element = element.parentElement;
    if (element === null) {
      return undefined;
    }
  }

  return attribute;
}

/**
 * Create a named object wich can act as a store.
 * @param {string} name
 * @param {any} initialValue
 * @property {any} value
 * @return {Store}
 */
export function nameValueStore(name, initialValue) {
  const subscriptions = new Set();
  let value = initialValue;

  const o = {
    name,
    subscribe: cb => {
      subscriptions.add(cb);
      cb(value);
      return () => subscriptions.delete(cb);
    },
    set(v) {
      o.value = v;
    }
  };

  Object.defineProperties(o, {
    value: {
      get() {
        return value;
      },
      set(v) {
        value = v;
        subscriptions.forEach(subscription => subscription(value));
      }
    },
    subscriptions: { value: subscriptions }
  });

  return o;
}

export const ROUTE = "@private-ROUTE";
export const ROUTER = "@private-ROUTER";
export const NAVIGATION_EVENT = "routeLink";
