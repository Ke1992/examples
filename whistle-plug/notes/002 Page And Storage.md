# 页面和存储
## 一、静态样式
在public文件夹下新增index.css，并添加以下样式:
```
body {
    margin: 0;
    padding: 0;
    font-size: 14px;
    color: #6c6c6c;
}
.main {
    margin: auto;
    width: 1002px;
    padding-top: 24px;
}
.btn {
    width: 70px;
    height: 30px;
    color: #fff;
    padding: 0 10px;
    cursor: pointer;
    font-size: 12px;
    font-weight: bold;
    line-height: 30px;
    text-align: center;
    margin-bottom: 20px;
    background: #ec8e72;
}
.btn.cancel {
    margin-left: 20px;
    color: #6c6c6c;
    background: transparent;
}
.btn.cancel:hover {
    color: #ec8e72;
}
table {
    width: 100%;
    text-align: center;
}
table thead th {
    line-height: 46px;
    border-bottom: 2px solid #ec8e72;
}
table tbody td {
    height: 20px;
    padding: 13px 0;
    line-height: 20px;
}
table tbody tr:nth-child(2n+1) {
    background-color: #e7e8ed;
}
table tbody a {
    padding: 0 5px;
    color: #6c6c6c;
    text-decoration: none;
}
table tbody a:hover {
    color: #ec8e72;
}
table tbody tr.none {
    height: 140px;
    line-height: 140px;
    background-color: transparent;
}
.dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.35);
}
.dialog .content {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 440px;
    padding: 0 50px;
    background-color: #fff;
    transform: translate(-50%, -50%);
}
.dialog .title {
    font-size: 18px;
    color: #ec8e72;
    font-weight: bold;
    text-align: center;
    padding: 30px 0 10px;
}
.dialog .row {
    height: 40px;
    display: flex;
    line-height: 40px;
    margin-bottom: 20px;
}
.dialog .row span {
    width: 80px;
    display: block;
    text-align: right;
    padding-right: 20px;
}
.dialog .row input {
    width: 400px;
    border: none;
    outline: none;
    display: block;
    color: #6c6c6c;
    border-bottom: 1px solid #6c6c6c;
}
.dialog .btn {
    float: right;
    margin-top: 10px;
    margin-bottom: 30px;
}
.hide {
    display: none;
}
```
## 二、静态页面
向public/index.html的head部分添加以下代码:
```
<link rel="stylesheet" type="text/css" href="./index.css" />
```
向public/index.html的body部分添加以下代码:
```
<section id="main" class="main">
    <div class="btn">新增规则</div>
    <table cellpadding="0" cellspacing="0">
        <thead>
            <tr>
                <th style="width: 300px;">URL</th>
                <th style="width: 560px;">文件路径</th>
                <th style="width: 140px;">操作</th>
            </tr>
        </thead>
        <tbody>
            <tr class="none hide">
                <td colspan="3">当前暂无配置的规则</td>
            </tr>
        </tbody>
    </table>
</section>
<div id="dialog" class="dialog hide">
    <div class="content">
        <div class="title">文件映射</div>
        <div class="row">
            <span>URL: </span>
            <input type="text">
        </div>
        <div class="row">
            <span>文件路径: </span>
            <input type="text">
        </div>
        <div class="btn cancel" data-type="cancel">取消</div>
        <div class="btn" data-type="confirm">确定</div>
    </div>
</div>
<template id="item">
    <tr>
        <td>{url}</td>
        <td>{file}</td>
        <td>
            <a href="javascript: ;" data-type="modify">修改</a>
            <a href="javascript: ;" data-type="delete">删除</a>
        </td>
    </tr>
</template>
```
## 三、添加交互
1、在项目目录下新增.eslintignore文件，并添加以下规则
```
/public/jquery.min.js
```
2、在public文件夹下新增jquery.min.js，并添加最新的jQuery源码  
3、向.eslintrc.js的env字段追加jquery  
4、在public文件夹下新增index.js，并添加以下代码:
```
const list = [];

class Page {
    static init() {
        Page.bindEvent();
    }

    // 绑定事件
    static bindEvent() {
        // 新增按钮事件
        $('#main .btn').on('click', () => {
            Page.showDialog(-1);
        });
        // 操作按钮事件
        $('tbody').on('click', 'a', function operateEvent() {
            const index = $(this).parents('tr').index() - 1;
            if ($(this).data('type') === 'modify') {
                Page.showDialog(index);
            } else {
                list.splice(index, 1);
                Page.render();
            }
        });
        // 弹框确定按钮事件
        $('#dialog .btn').on('click', function btnEvent() {
            const index = $(this).data('index') * 1.0;
            const result = {
                url: $($('#dialog input')[0]).val(),
                file: $($('#dialog input')[1]).val(),
            };
            if (!result.url.length || !result.file.length) {
                alert('请填写必要参数');
                return;
            }
            if (index === -1) {
                list.push(result);
            } else {
                list[index] = result;
            }
            Page.render();
            $('#dialog').addClass('hide');
        });
        // 弹框取消按钮事件
        $('#dialog .cancel').off().on('click', () => {
            $('#dialog').addClass('hide');
        });
    }

    static showDialog(index) {
        if (index >= 0) {
            $($('#dialog input')[0]).val(list[index].url);
            $($('#dialog input')[1]).val(list[index].file);
        } else {
            $('#dialog input').val('');
        }
        $('#dialog').removeClass('hide').find('.btn').data('index', index);
    }

    // 渲染列表
    static render() {
        const tpl = $('#item').html();

        $('tbody tr:gt(0)').remove();
        $('.none')[list.length === 0 ? 'removeClass' : 'addClass']('hide');
        list.forEach((item) => {
            $('tbody').append(tpl.replace('{url}', item.url).replace('{file}', item.file));
        });
    }
}

$(() => {
    Page.init();
});
```
5、向public/index.html的body部分添加以下代码:
```
<script src="./jquery.min.js"></script>
<script src="./index.js"></script>
```
## 四、数据存储
### 1、添加路由机制
项目目录下依次执行以下命令:
```
npm install --save koa-bodyparser
npm install --save-dev @types/koa-bodyparser
```
向src/lib/ui-server.ts添加以下代码:
```
import * as KoaBodyParser from 'koa-bodyparser';
// 解析post数据
app.use(KoaBodyParser({
    jsonLimit: '5MB',
}));
```
向src/lib/ui-server.ts添加whistle的options对象，并添加路由相关代码:
```
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
```
### 2、实现路由
修改package.json的clean命令为以下命令:
```
"clean": "npx rimraf -rf index.js lib router"
```
在src文件夹下新增router文件夹，同时新增index.ts文件，并添加以下代码:
```
// 库
import {
    Context,
} from 'koa';
// 定义
interface Result {
    code: number;
    data: string[];
    message: string;
}

/**
 * 更新接口
 * @param ctx [koa的Context对象]
 */
export async function update(ctx: Context): Promise<Result> {
    try {
        // 储存配置数据
        ctx.storage.setProperty('list', ctx.request.body.list || []);
        // 返回结果
        return {
            code: 0,
            data: [],
            message: '',
        };
    } catch (error) {
        // 存储异常
        return {
            code: -1,
            data: [],
            message: error.stack || error.toString(),
        };
    }
}

/**
 * 获取所有配置
 * @param ctx [koa的Context对象]
 */
export async function list(ctx: Context): Promise<Result> {
    const result = {
        code: 0,
        message: '',
        data: [] as string[],
    };
    try {
        result.data = ctx.storage.getProperty('list') || [];
    } catch (error) {
        // do nothing
    }
    return result;
}
```
### 3、存储数据
向public/index.js中Page类添加以下方法:
```
static list() {
    return window.fetch('/plugin.plug-example/index/list', {
        credentials: 'include',
    }).then((response) => {
        const result = response.json();
        return result;
    }).then((result) => result.data);
}

static update() {
    window.fetch('/plugin.plug-example/index/update', {
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
            list,
        }),
    });
}
```
修改public/index.js中Page类的init方法:
```
static init() {
    Page.list().then(((data) => {
        list.push(...data);
        Page.render(true);
        Page.bindEvent();
    }));
}
```
修改public/index.js中Page类的render方法，添加isInit参数，并添加以下代码:
```
!isInit && Page.update();
```
## 五、验证测试
![列表](https://raw.githubusercontent.com/Ke1992/examples/master/whistle-plug/docs/assets/list.png "列表")
![弹框](https://raw.githubusercontent.com/Ke1992/examples/master/whistle-plug/docs/assets/dialog.png "弹框")