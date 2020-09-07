module.exports = () => {
  console.log('preset 1 will be executed lastly');
  return {
    plugins: ['../plugins/babel-plugin-word-reverse']
  };
};
