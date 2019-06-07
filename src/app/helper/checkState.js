module.exports = function (current, states, options) {
  const arr = states.split(', ');
  return arr.some(state => state === current) ? options.fn(this) : options.inverse(this)
};
