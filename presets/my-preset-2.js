module.exports = () => {
  console.log('preset 2 is executed!!!');
  return {
    presets: ["@babel/preset-react"],
    plugins: ['./babel-plugin-word-replace', '@babel/plugin-transform-modules-commonjs'],
  };
};
