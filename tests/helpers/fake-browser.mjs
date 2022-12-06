if (!globalThis.window) {
    const window = {
      addEventListener() {},
      location: {
        pathname: "",
        href: ""
      }
    };
  
    globalThis.window = window;
  
    const history = {
      replaceState() {},
      pushState() {}
    };
  
    globalThis.history = history;
  }
  