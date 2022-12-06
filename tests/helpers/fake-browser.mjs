if (!globalThis.window) {
    const window = {
      addEventListener() {},
      location: {
        pathname: ""
      }
    };
  
    globalThis.window = window;
  
    const history = {
      replaceState() {},
      pushState() {}
    };
  
    globalThis.history = history;
  }
  