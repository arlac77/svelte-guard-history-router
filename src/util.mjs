
/**
 * Walks up the dom tree parents unti a node with a given attribute is found or the root node is reached.
 * @param {Element} element 
 * @param {stringg} attributeName 
 * @returns {Element}
 */
export function findClosestAttribute(element, attributeName) {
  let attribute;
  while ((attribute = element.getAttribute(attributeName)) === null) {
    element = element.parentElement;
    if (element === null) {
      return;
    }
  }

  return attribute;
}

/**
 * Create a named object wich can act as a store.
 * @param {string} name
 * @param {any} value initial value
 * @property {any} value
 * @return {Store}
 */
export function nameValueStore(name, value) {
  const subscriptions = new Set();

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
