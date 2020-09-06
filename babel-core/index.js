const babel = require('@babel/core')

const source = `
const someFun = () => {
    console.log('hello world');
}
`;

const filename = 'index.ts.js'
const { ast } = babel.transformSync(source, { filename, ast: true, code: false });
const { code, map } = babel.transformFromAstSync(ast, source, {
    filename,
    presets: ["minify"],
    babelrc: false,
    configFile: false,
});

console.log(code);


