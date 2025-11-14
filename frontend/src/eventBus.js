const listeners = {};

export function on(event, fn) {
  if (!listeners[event]) {
    listeners[event] = [];
  }
  listeners[event].push(fn);

  return () => {
    listeners[event] = listeners[event].filter((callback) => callback !== fn);
  };
}

export function emit(event, data) {
  if (listeners[event]) {
    listeners[event].forEach((fn) => fn(data));
  }
}

export function off(event, fn) {
  if (listeners[event]) {
    listeners[event] = listeners[event].filter((callback) => callback !== fn);
  }
}

export function clearListeners(event) {
  if (event) {
    delete listeners[event];
  } else {
    Object.keys(listeners).forEach((key) => {
      delete listeners[key];
    });
  }
}
