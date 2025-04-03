rsbuild是基于rspack的构建工具，rsbuild插件风格是class（vite插件是hook），

vite插件是通过函数返回一个对象，声明生命周期hook；rsbuild插件通过setup()函数注册hook，类似webpack插件机制（基于compiler hooks)

| 生命周期阶段 | Vite 插件（部分钩子） | RSBuild 插件（部分钩子） |
| --- | --- | --- |
| 初始化前 | config, configResolved | setup(api) |
| 模块解析 | resolveId | modifyWebpackConfig / modifyWebpackChain |
| 模块加载 | load | modifyWebpackChain / Webpack loader 插件 |
| 源码转换 | transform | 使用 Webpack loader，或通过 loader 插件处理 |
| 开发服务器扩展 | configureServer | modifyDevServerConfig |
| 构建开始 | buildStart | onBeforeBuild |
| 构建结束 | buildEnd | onAfterBuild |

### 开发rsbuild-plugin-tailwindcss-sort

1. 初始化

```jsx
pnpm init
// ...安装依赖
npx tsc --init // 初始化ts配置
// 推荐的tsconfig：
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Node",
    "esModuleInterop": true,
    "strict": true,
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src", "test"]
}
```

1. 编写babel转换逻辑
2. 编写rsbuild插件入口 src/index.ts

```jsx
type RsbuildPlugin = {
  name: string;
  setup: (api: RsbuildPluginAPI) => MaybePromise<void>;
  pre?: string[];
  post?: string[];
  remove?: string[];
}
```

- `name`：插件的名称，唯一标识符。
- `setup`：插件逻辑的主入口函数，可以是一个异步函数。该函数仅会在初始化插件时执行一次。插件 API 对象上挂载了提供给插件使用的上下文数据、工具函数和注册生命周期钩子的函数，关于生命周期钩子的完整介绍，请阅读 [**Plugin Hooks**](https://rsbuild.dev/zh/plugins/dev/hooks) 章节。
- `pre`：声明前置插件的名称，这些插件会在当前插件之前执行。
- `post`：声明后置插件的名称，这些插件会在当前插件之后执行。
- `remove`：声明需要移除的插件，可以传入插件 name 的数组。

## **api.transform[#](https://rsbuild.dev/zh/plugins/dev/core#apitransform)**

用于转换模块的代码。

- **类型：**

`function Transform(
  descriptor: TransformDescriptor,
  handler: TransformHandler,
): void;`

`api.transform` 接受两个参数：

- `descriptor`：一个对象，用于描述模块的匹配条件。
- `handler`：一个转换函数，接收模块当前的代码，并返回转换后的代码。

### **示例[#](https://rsbuild.dev/zh/plugins/dev/core#%E7%A4%BA%E4%BE%8B)**

比如匹配以 `.pug` 为后缀的模块，并转换为 JavaScript 代码：

```jsx
import pug from "pug";

const pluginPug = () => ({
  name: "my-pug-plugin",
  setup(api) {
    api.transform({ test: /\.pug$/ }, ({ code }) => {
      const templateCode = pug.compileClient(code, {});
      return `${templateCode}; module.exports = template;`;
    });
  },
});
```