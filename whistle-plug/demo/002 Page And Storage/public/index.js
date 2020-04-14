const list = [];

class Page {
    static init() {
        Page.list().then(((data) => {
            list.push(...data);
            Page.render(true);
            Page.bindEvent();
        }));
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
    static render(isInit) {
        const tpl = $('#item').html();

        $('tbody tr:gt(0)').remove();
        $('.none')[list.length === 0 ? 'removeClass' : 'addClass']('hide');
        list.forEach((item) => {
            $('tbody').append(tpl.replace('{url}', item.url).replace('{file}', item.file));
        });
        // 更新配置
        !isInit && Page.update();
    }

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
}

$(() => {
    Page.init();
});
