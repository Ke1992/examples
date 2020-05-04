// 库
import * as fs from 'fs';
import * as http from 'http';
// 自己的库
import WebSocketTool from '../shared/WebSocketTool';
// 定义
interface Item {
    url: string;
    file: string;
}
interface Options {
    storage: {
        setProperty: Function;
        getProperty: Function;
    };
}

export default function (server: http.Server, options: Options): void {
    // 监听request请求
    server.on('request', (req, res) => {
        const {
            originalReq: {
                url, // 请求的url
                ruleValue, // 配置的规则
            },
        } = req;

        // 不是内置规则，则直接返回
        if (ruleValue !== 'none') {
            req.passThrough();
            return;
        }

        // 遍历查找是否配置了对应规则
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
    });

    // 监听websocket请求
    WebSocketTool.handleWebSockeListening(server, options);
}
