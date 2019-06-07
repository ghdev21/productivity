module.exports = function (quant, options) {
  return quant.length < 10 ? options.fn(this) : options.inverse(this);
};
