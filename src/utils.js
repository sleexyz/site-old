module.exports = {
  apply(component, ...modifiers) {
    let c = component;
    for (let i = 0; i < modifiers.length; i++) {
      c = modifiers[i](c);
    }
    return c;
  }
};
