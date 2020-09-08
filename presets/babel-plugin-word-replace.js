module.exports = function() {
  return {
    visitor: {
      Identifier(path) {
        console.log("word-replace plugin come in!!!");
        let name = path.node.name;
        path.node.name = name += '_replace';
      },
    },
  };
}
