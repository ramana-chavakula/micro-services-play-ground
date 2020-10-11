const asyncHooks = require('async_hooks');
const store = new Map();
const asyncHook = asyncHooks.createHook({
  init: (asyncId, _, triggerAsyncId) => {
    if (store.has(triggerAsyncId)) {
      store.set(asyncId, store.get(triggerAsyncId))
    }
  },
  destroy: (asyncId) => {
    if (store.has(asyncId)) {
      store.delete(asyncId);
    }
  }
});



function register() {
  asyncHook.enable();
}

function setContext(data) {
  store.set(asyncHooks.executionAsyncId(), data)
}

function getContext() {
  return store.get(asyncHooks.executionAsyncId())
}

function updateContext(data) {
  const id = asyncHooks.executionAsyncId()
  const cxt = store.get(id)
  if (!cxt) {
    throw Error(`No context found for async executiond id - ${id}`)
  }
  store.set(id, { ...cxt, data })
}

module.exports = {
  register,
  setContext,
  getContext,
  updateContext
}