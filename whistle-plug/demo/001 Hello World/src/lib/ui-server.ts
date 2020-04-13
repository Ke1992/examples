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
