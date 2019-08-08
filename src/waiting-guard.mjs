export function waitingGuard(component, rampUpTime = 300) {
  let handler;
  return {
    enter: context => {
      handler = setTimeout(() => {
        handler = undefined;
        context.router.component = component;
      }, rampUpTime);
    },
    leave: context => {
      clearTimeout(handler);
    }
  };
}
