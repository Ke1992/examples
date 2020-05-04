// 库
import {
    Server,
} from 'ws';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as http from 'http';
// WebSocket库
import WebSocket = require('ws');

// whistle提供的Websocket对象
type WhistleWebSocket = WebSocket;

// whistle提供的Request对象
interface WhistleRequest extends http.IncomingMessage {
    originalReq: {
        url: string;
        headers: {
            [key: string]: string;
        };
    };
    curSendState: string;
    curReceiveState: string;
    wsReceiveClient: WhistleWebSocket;
}

// whistle提供的Options对象
interface Options {
    storage: {
        setProperty: Function;
        getProperty: Function;
    };
}

// websocket单条配置对象
interface WebSocketItem {
    rule: string;
    file: string;
    type: 'server' | 'client';
}

/**
 * WebSocket工具类
 */
export default class WebSocketTool {
    /**
     * 监听websocket请求
     * @param server []
     */
    static handleWebSockeListening(server: http.Server, options: Options): void {
        const wss = new Server({
            server,
            verifyClient: WebSocketTool.verifyClient,
        });
        wss.on('connection', (ws: WhistleWebSocket, req: WhistleRequest) => {
            const {
                wsReceiveClient,
            } = req;

            // 监听服务端发送到客户端的数据
            wsReceiveClient.on('message', (data) => {
                const isIgnore = req.curReceiveState === 'ignore';
                // 触发一下
                req.emit('serverFrame', `Server: ${data}`, isIgnore);
                // 转发请求，确保ws请求返回到真实的客户端
                if (!isIgnore) {
                    // 这里进行数据修改
                    const result = WebSocketTool.getProxyDataFromType(data, 'client', options);
                    ws.send(result);
                }
            });

            // 监听客户端发送到服务端的数据
            ws.on('message', (data) => {
                const isIgnore = req.curSendState === 'ignore';
                // 触发一下
                req.emit('clientFrame', `Client: ${data}`, isIgnore);
                // 转发请求，方便代码生成的客户端进行捕获
                if (!isIgnore) {
                    // 这里进行数据修改
                    const result = WebSocketTool.getProxyDataFromType(data, 'server', options);
                    wsReceiveClient.send(result);
                }
            });
        });
    }

    /**
     * 利用ws库生成Server中需要的参数
     * @param info     [信息对象，req为whistle提供的Request对象]
     * @param callback [回调函数]
     */
    private static verifyClient(info: {req: http.IncomingMessage}, callback: Function): void {
        const req = info.req as WhistleRequest;
        const {
            url,
            headers,
        } = req.originalReq;

        const protocols = [headers['sec-websocket-protocol'] || ''];
        delete headers['sec-websocket-key'];

        const client = new WebSocket(url, protocols, {
            headers,
            rejectUnauthorized: false,
        });

        let isDone = false;
        const checkContinue = (error: Error): void => {
            if (isDone) {
                return;
            }
            isDone = true;
            if (error) {
                callback(false, 502, error.message);
            } else {
                callback(true);
            }
        };

        client.on('error', checkContinue);
        client.on('open', () => {
            req.wsReceiveClient = client as WhistleWebSocket;
            checkContinue(null);
        });
    }

    /**
     * 根据不同类型获取代理数据
     * @param data [websocket传输的数据]
     * @param type [类型: client(服务器返回给客户端的数据)、server(客户端发送给服务器的数据)]
     * @param options []
     */
    private static getProxyDataFromType(data: WebSocket.Data, type: 'client' | 'server', options: Options): WebSocket.Data {
        let filePath = '';
        const content = data.toString();
        const list: WebSocketItem[] = options.storage.getProperty('list') || [];

        // 过滤对应类型的配置数据
        list.filter((item) => item.type === type).some((item) => {
            const reg = new RegExp(item.rule);

            if (reg.test(content)) {
                filePath = item.file;
                return true;
            }
            return false;
        });

        // 没有匹配的映射规则，则直接返回
        if (_.isEmpty(filePath)) {
            return data;
        }

        // 如果对应文件不存在在，则直接返回
        if (!fs.existsSync(filePath)) {
            return data;
        }

        // 读取对应文件，并返回
        return fs.readFileSync(filePath).toString();
    }
}
