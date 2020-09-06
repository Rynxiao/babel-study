## 1. 什么是babel

> Babel is a toolchain that is mainly used to convert ECMAScript 2015+ code into a backwards compatible version of JavaScript in current and older browsers or environments. 
>
> Babel是一个工具链，主要用于将ECMAScript 2015+代码转换为当前和较老的浏览器或环境中的向后兼容的JavaScript版本。

### 1.1 我们能用bebel做什么？

- 针对于新出的ECMAScript标准，部分浏览器还不能完全兼容，需要将这部分语法转换为浏览器能够识别的语法。比如有些浏览器不能正常解析es6中的箭头函数，那通过babel转换后，就能将箭头函数转换为浏览器能够“认懂”得语法。

- 针对于一些较老的浏览器，比如IE10或者更早之前。对一些最新的内置对象`Promise/Map/Set`，静态方法`Arrary.from/Object.assign`以及一些实例方法`Array.prototype.includes`，这些新的特性都不存在与这些老版本的浏览器中，那么就需要给这些浏览器中的原始方法中添加上这些特性，即所谓的`polyfill`。

- 可以做一些源码的转换，即可以直接使用babel中提供的API对代码进行一些分析处理，例如

    - ```javascript
        const filename = 'index.js'
        const { ast } = babel.transformSync(source, { filename, ast: true, code: false });
        const { code, map } = babel.transformFromAstSync(ast, source, {
            filename,
            presets: ["minify"],
            babelrc: false,
            configFile: false,
        });
        ```

## 2. 使用babel

下面讲到的几种转换方式，其实本质上都是一样的，都是调用babel-core中的API来进行直接转换

### 2.1 使用babel.transform直接转换

```javascript
const source = `
const someFun = () => {
    console.log('hello world');
}
`;

require("@babel/core").transform(source, {
  plugins: ["@babel/plugin-transform-arrow-functions", "@babel/plugin-transform-parameters"],
}, result => {
  console.log(result.code);
});
```

### 2.1 使用babel-cli

babel提供了cli的方式，可以直接让我们使用命令行的方式来使用babel，具体参照一下做法

```shell
## install
## 首先需要安装 @babel/core @babel/cli
## @babel/cli是提供的命令行工具，会内部调用@babel/core来进行代码转换
npm install @babel/core @babel/cli --save-dev

## usage
npx babel ./cli/index.js
```

本地安装完依赖后，就可以使用babel来进行代码转换了，`npx babel [options] files`，babel提供了一些常用的cli命令，可以使用`npx babel --help`来查看

```shell
> $ npx babel --help                                                                                                           ⬡ 12.13.0 [±master ●●●]
Usage: babel [options] <files ...>

Options:
  -f, --filename [filename]                   The filename to use when reading from stdin. This will be used in source-maps, errors etc.
  --presets [list]                            A comma-separated list of preset names.
  --plugins [list]                            A comma-separated list of plugin names.
  --config-file [path]                        Path to a .babelrc file to use.
  --env-name [name]                           The name of the 'env' to use when loading configs and plugins. 																							 Defaults to the value of BABEL_ENV, or else NODE_ENV, or else 
                                              'development'.
```

下面是一个简单的例子，比如有这么一段源代码，

```javascript
// cli/index.js

const arrayFn = (...args) => {
    return ['babel cli'].concat(args);
}

arrayFn('I', 'am', 'using');
```

执行以下命令：`npx babel ./cli/index.js --out-file ./cli/index.t.js`，结果如下图：

![image-20200906173500404](./screenshots/babel-cli-1.png)

代码和源代码竟然是一模一样的，为什么箭头函数没有进行转换呢？这里就会引入[plugins](https://babeljs.io/docs/en/plugins)以及[preset](https://babeljs.io/docs/en/presets)的概念，这里暂时不会具体讲解，只需要暂时知道，代码的转换需要使用plugin进行。

转换箭头函数，我们需要使用到`@babel/plugin-transform-arrow-functions/parameters`，首先安装完之后，在此执行转换

```shell
npm install @babel/plugin-transform-arrow-functions @babel/plugin-transform-parameters --save-dev
npx babel ./cli/index.js --out-file ./cli/index.t.js --plugins=@babel/plugin-transform-arrow-functions,@babel/plugin-transform-parameters
```

执行完之后，再看生成的文件

![image-20200906174958668](./screenshots/babel-cli-2.png)

### 2.3 使用webpack babel-loader来进行转换

创建webpack.config.js，编写如下配置

```javascript
// install
npm install webpack-cli --save-dev

// webpack/webpack.config.js
module.exports = {
  entry: './index.js',
  output: {
    filename: 'index.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ["@babel/plugin-transform-arrow-functions", "@babel/plugin-transform-parameters"]
          }
        }
      }
    ]
  }
};

// usage
cd webpack
npx webpack
```

可以得到转换之后的代码如下：

![image-20200906181714368](./screenshots/webpack-1.png)

可以对比查看babel-cli的转换之后的代码是一致的。

### 2.4 使用配置文件来进行转换

参看以上三种方式，都必须加载了plugins这个参数选项，尤其是在cli方式中，如果需要加载很多插件，是非常不便于书写的，同时，相同的配置也不好移植，比如需要在另外一个项目中同样使用相同的cli执行，那么显然插件越多，就会越容易出错。鉴于此，babel提供了config的方式，类似于webpack的cli方式以及config方式。

babel在7.0之后，引入了`babel.config.[extensions]`，在7.0之前，项目都是基于`.babelrc`来进行配置，这里暂时不会讲解它们之间的区别。下面就是一个比较基于上面例子的一个.babelrc文件。

```json
// .babelrc
{
  "plugins": ["@babel/plugin-transform-arrow-functions", "@babel/plugin-transform-parameters"]
}
```

我们将这个文件放置在根目录下，新建一个`config`的文件夹，从cli目录中将index.js文件copy到config目录下，然后执行`npx babel ./config/index.js --out-file ./config/index.t.js`，完成之后，会发现和cli执行的方式并没有什么差别。

## 3. babel.config.json vs .babelrc


