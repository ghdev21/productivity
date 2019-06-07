module.exports = function (v1, v2, options) {
  let globalState = false;
  for (let key in v2 ){
    if (v2[key].length){
      globalState = true;
    }
  }
  return (v1.length || globalState ? options.fn(this): options.inverse(this))
};
