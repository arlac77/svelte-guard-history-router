export function waitingGuard(component, rampUpTime = 300) {
  let handler;
  return {
    enter: transition => {
      handler = setTimeout(() => {
        handler = undefined;
        transition.router.component = component;
      }, rampUpTime);
    },
    leave: transition => {
      clearTimeout(handler);
    }
  };
}
