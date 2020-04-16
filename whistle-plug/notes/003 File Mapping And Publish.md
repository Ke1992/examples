# 文件映射和发布
## 一、Server
### 1、内置规则
在项目目录下新增rules.txt文件，并添加以下规则:
```
/./ plug-example://none
```
其中whistle.plug-example:// 和 plug-example://的区别: whistle.plug-example://请求默认不会走到插件里面的server服务
### 2、监听server
在src/lib文件夹下新增server.ts文件，并添加以下代码:
```
// 库
import * as http from 'http';

export default function (server: http.Server): void {
    // 监听request请求
    server.on('request', (req, res) => {
        const {
            originalReq: {
                ruleValue, // 配置的规则
            },
        } = req;

        // 不是内置规则，则直接返回
        if (ruleValue !== 'none') {
            req.passThrough();
            return;
        }

        // 直接修改响应返回
        res.end('Hello World');
    });
}
```
修改src/index.ts文件为以下代码:
```
// 插件库
import server from './lib/server';
import uiServer from './lib/ui-server';

export {
    server,
    uiServer,
};
```
### 3、预览结果
![Server](https://raw.githubusercontent.com/Ke1992/examples/master/whistle-plug/docs/assets/server.png "Server")
## 二、文件映射
1、向src/lib/server.ts文件中添加fs模块的引用:
```
import * as fs from 'fs';
```
2、添加whistle提供的options对象和存储数据的定义:
```
interface Item {
    url: string;
    file: string;
}
interface Options {
    storage: {
        getProperty: Function;
    };
}
```
3、删除测试用的res.end('Hello World');代码，添加以下代码:
```
let filePath = '';
const list = options.storage.getProperty('list') || [];
list.some((item: Item) => {
    const reg = new RegExp(item.url);
    if (reg.test(url)) {
        filePath = item.file;
        return true;
    }
    return false;
});
// 如果没有配置规则，则直接返回
if (!filePath) {
    req.passThrough();
    return;
}
// 对应文件不存在，则直接返回
if (!fs.existsSync(filePath)) {
    req.passThrough();
    return;
}
// 获取url参数
const param = new URL(url).searchParams;
const callback = param.get('callback') || param.get('cb');
try {
    // 获取文件内容（同时移除前后空格）
    let content = (fs.readFileSync(filePath).toString()).trim();
    // callback参数不为空
    if (callback) {
        // 严格校验
        if (content[0] === '{' && content.slice(-1) === '}') {
            content = `${callback}(${content})`;
        } else {
            // 进行callback字符串替换
            content = content.replace('callback', callback);
        }
    }
    // 修改状态码
    res.statusCode = 200;
    // 返回本地的文本内容
    res.end(content);
} catch (e) {
    // 进行容错处理，直接转发
    req.passThrough();
}
```
## 三、验证测试
访问任意链接，并在链接后追加callback或者cb参数，则会自动替换或者主动添加本地文件中的callback字符串
![文件映射](https://raw.githubusercontent.com/Ke1992/examples/master/whistle-plug/docs/assets/file-mapping.png "文件映射")
## 四、发布
1、项目目录下打开命令行，执行npm login进行登录
2、命令行中执行npm publish，发布成功后执行npm install -g whistle.plug-example进行安装
3、打开whistle，选中Plugins选项卡，如下所示则代表安装成功
![发布](https://raw.githubusercontent.com/Ke1992/examples/master/whistle-plug/docs/assets/publish.png "发布")