// 库
import * as Koa from 'koa';
import * as path from 'path';
import * as http from 'http';
import * as KoaStatic from 'koa-static';
import * as KoaBodyParser from 'koa-bodyparser';
// 全局常量
const app = new Koa();

export default function (server: http.Server, options: {storage: object}): void {
    // 静态资源
    app.use(KoaStatic(path.join(__dirname, '../public')));
    // 解析post数据
    app.use(KoaBodyParser({
        jsonLimit: '5MB',
    }));
    // 正常的路由
    app.use(async (ctx): Promise<void> => {
        // 获取必要参数
        const pathArr = ctx.path.split('/').slice(1);
        // 补全路径
        if (pathArr.length === 0) {
            pathArr.push('index');
        } else if (pathArr.length === 1) {
            pathArr.push('init');
        }
        const methodName = pathArr.slice(-1).toString();
        const modulePath = `${path.join(__dirname, '../router', pathArr.slice(0, -1).join('/'))}`;
        // 设置whistle的插件数据储存对象
        ctx.storage = options.storage;
        // 加载对应的模块实例
        const moduleInstance = await import(modulePath);
        // 执行对应方法
        ctx.body = await moduleInstance[methodName](ctx);
    });
    // 监听request请求
    server.on('request', app.callback());
}
