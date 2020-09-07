module.exports = () => {
  console.log('preset 2 will be executed firstly');
  return {
    presets: ["@babel/preset-react"],
    plugins: ['./babel-plugin-word-replace', '@babel/plugin-transform-modules-commonjs'],
  };
};
