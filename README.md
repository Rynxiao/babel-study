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

babel.config.js是在babel第7版引入的，主要是为了解决babel6中的一些问题，参看[https://babeljs.io/docs/en/config-files#6x-vs-7x-babelrc-loading](https://babeljs.io/docs/en/config-files#6x-vs-7x-babelrc-loading)

- .babelrc会在一些情况下，莫名地应用在node_modules中
- .babelrc的配置不能应用在使用符号链接引用进来的文件
- 在node_modules中的.babelrc会被检测到，即使它们中的插件和预设通常没有安装，也可能在Babel编译文件的版本中无效

另外如果只使用.babelrc，在monorepo项目中会遇到一些问题，这得从.babelrc加载的两条规则有关

- 在向上搜索配置的过程中，一旦在文件夹中找到了package.json，就会停止搜寻其它配置（babel用package.json文件来划定package的范围）
- 这种搜索行为找到的配置，如`.babelrc`文件，必须位于babel运行的root目录下，或者是包含在`babelrcRoots`这个option配置的目录下，否则找到的配置会直接被忽略

下面我们在之前的例子上进行改造，文件结构如下：

![babelrc-1](./screenshots/babelrc-1.png)

在mod1文件夹中创建一个package.json文件，内容为`{}`。现在执行以下代码：

```shell
npx babel ./config/mod1/index.js -o ./config/mod1/index.t.js
```

可以发现，index.js没有编译，因为在向上查找的时候，找到了mod1中的package.json，但是在此目录中并没有找到`.babelrc`文件，因此不会编译。

下面，我们将`.babelrc`文件移至mod1中，然后再执行上面的命令，这次会编译成功么？

![babelrc-2](./screenshots/babelrc-2.png)

答案依旧是不会，因为当前的执行目录是在src下面，所以在`mod1`目录中的配置文件将会被忽略掉。

这里有两种方法来解决这个问题：

- 进入到mod1目录中直接执行 `cd ./config/mod1 & npx babel index.js -o index.t.js`

- 在执行的root目录下，添加一个`babel.config.json`文件，在其中添加`babelrcRoots`将这个目录添加进去

  ![babelrc-3](./screenshots/babelrc-3.png)

  然后再执行`npx babel ./config/mod1/index.js -o ./config/mod1/index.t.js`就可以正常编译了。

  正是基于上述的一些问题，babel在7.0.0之后，引入了`babel.config.[json/js/mjs/cjs]`，基于babel.config.json的配置会灵活得多。

  

## 参考链接

- [babel详解（七）-配置文件](https://blog.liuyunzhuge.com/2019/09/09/babel详解（七）-配置文件/)
- [Babel快速上手使用指南](https://juejin.im/post/6844903858632654856)
