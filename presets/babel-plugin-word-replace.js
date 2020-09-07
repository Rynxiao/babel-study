module.exports = function() {
  console.log("word-replace plugin will be executed firstly");
  return {
    visitor: {
      Identifier(path) {
        let name = path.node.name;
        path.node.name = name += '_replace';
      },
    },
  };
}
