# Hello World
## 一、环境准备
node v10.13.0、whistle
## 二、新建工程
### 1、创建项目
* 新建文件夹，并设置一个项目名称
* 执行npm init，其中name需要符合whistle.your-plugin-name规范
* 增加.gitignore，并添加忽略package-lock.json
### 2、增加TypeScript
项目目录下执行npm install --save-dev typescript
### 3、增加Eslint
项目目录下依次执行以下命令
```
npm install --save-dev eslint eslint-config-airbnb-base eslint-plugin-import
npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser
```
增加.eslintrc.js文件，并添加以下配置:  
```
module.exports = {
    env: {
        es6: true,
        node: true,
    },
    plugins: [
        '@typescript-eslint'
    ],
    parser: '@typescript-eslint/parser',
    extends: [
        'airbnb-base',
        // 启用typescript的规则
        'plugin:@typescript-eslint/recommended',
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
        ecmaVersion: 2018, // ES的版本
    },
    settings: {
        "import/resolver": {
            node: { // 限制node端的import
                extensions: [".js", ".ts"]
            },
        }
    },
    rules: {
        // 解决airbnb新版导致的问题
        'import/extensions': [
            'error',
            'ignorePackages',
            {
              'js': 'never',
              'ts': 'never'
            }
        ]
    },
};
```
## 三、Hello Word
1、新建src文件夹，并在src文件夹下新增lib文件夹  
2、项目目录下依次执行以下命令，安装koa相关库  
```
npm install --save koa koa-static
npm install --save-dev @types/koa @types/koa-static
```
3、在src/lib文件夹下新增ui-server.ts文件，并添加以下代码:  
```
// 库
import * as Koa from 'koa';
import * as path from 'path';
import * as http from 'http';
import * as KoaStatic from 'koa-static';
// 全局常量
const app = new Koa();

export default function (server: http.Server): void {
    // 静态资源
    app.use(KoaStatic(path.join(__dirname, '../public')));
    // 监听request请求
    server.on('request', app.callback());
}
```
4、在src文件夹下新增index.ts文件，并添加以下代码:  
```
// 插件库
import uiServer from './lib/ui-server';

export {
    uiServer,
};
```
5、在src文件夹下新增tsconfig.json文件，并添加以下配置:  
```
{
    "compilerOptions": {
        "module": "commonjs",
        "target": "es2017",
        "noImplicitAny": true,
        "outDir": "../",
    },
    "exclude": [
        "node_modules"
    ]
}
```
5、新建public文件夹，并新增index.html文件，添加以下代码:  
```
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Example</title>
    <body>
        <h1>Whistle Plug Example</h1>
    </body>
</html>
```
## 四、验证测试
1、在package.json的scripts字段中添加以下命令:  
```
"dev": "npm run build && w2 run",
"clean": "npx rimraf -rf index.js lib",
"build": "npm run clean && npx tsc --build ./src/tsconfig.json"
```
2、项目目录下执行npm link（如遇到权限问题，则执行sudo npm link）  
3、命令行中执行w2 stop，将whistle停止掉  
4、项目目录下执行npm run dev  
5、打开whistle，选中Plugins，打开plug-example页面，如下所示:  
![Hello World](https://raw.githubusercontent.com/Ke1992/examples/master/whistle-plug/docs/assets/001%20Hello%20World/Hello%20World.png "Hello World")