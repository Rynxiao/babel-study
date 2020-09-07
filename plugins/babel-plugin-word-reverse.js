module.exports = function() {
  console.log("word-reverse plugin will be executed firstly");
  return {
    visitor: {
      Identifier(path) {
        const name = path.node.name;
        path.node.name = name
        .split("")
        .reverse()
        .join("");
      },
    },
  };
}
