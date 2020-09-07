module.exports = function({ types: t }) {
  console.log("replace-return plugin will be executed lastly");
  return {
    visitor: {
      ReturnStatement(path) {
        path.replaceWithMultiple([
         t.expressionStatement(t.stringLiteral('Is this the real life?')),
         t.expressionStatement(t.stringLiteral('Is this just fantasy?')),
         t.expressionStatement(t.stringLiteral('(Enjoy singing the rest of the song in your head)')),
       ]);
      },
    },
  };
}
