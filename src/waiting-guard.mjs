export function waitingGuard(component, rampUpTime = 300) {
  let handler;
  return {
    enter: state => {
      handler = setTimeout(() => {
        handler = undefined;
        state.router.component = component;
      }, rampUpTime);
    },
    leave: state => {
      clearTimeout(handler);
    }
  };
}
