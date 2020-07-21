# H5实现移动端复制文字功能
## 前言
移动端项目开发中，经常遇到需要复制文字的场景，今天咱们就来聊一下，移动端复制文字的那些事~
## 效果预览
[Demo](https://ke1992.github.io/examples/mobile-copy-text/index.html)
## 背景分析
业务需求很简单，将指定的文字(例如: 关键字、文案描述等)复制到手机的剪贴板上，方便用户直接进行粘贴
## 解决方案
### 相关API
* document.execCommand  
该方法允许运行命令来操纵可编辑内容区域的元素，其中执行 copy 命令，可以将当前选中的内容拷贝到剪贴板中。兼容性如下所示:  
![execCommand](https://raw.githubusercontent.com/Ke1992/examples/master/mobile-copy-text/assets/exec-command.png "execCommand")
* setSelectionRange  
该方法用于设定 input 或 textarea 元素中当前选中文本的起始和结束位置，接受两个参数：被选中的第一个字符的位置索引、被选中的最后一个字符的下一个位置索引。兼容性如下所示:
![setSelectionRange](https://raw.githubusercontent.com/Ke1992/examples/master/mobile-copy-text/assets/set-selection-range.png "setSelectionRange")
* select  
该方法和 setSelectionRange 类似，唯一区别是 select 是全选，而 setSelectionRange 是手动指定选中范围
### 实现思路
* DOM  
在某一个 DOM 元素中添加一个容器 DOM ，然后在容器 DOM 中追加 input 标签，并重置 input 的默认样式，同时将容器 DOM 的宽度位置为 1 ，透明度设置为 0
```
.input_wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 1px;
    opacity: 0;
    overflow: hidden;
    user-select: none;
}
.input_wrap input {
    width: 1px;
    resize: none;
    border: none;
    outline: none;
    user-select: none;
    color: transparent;
    background: transparent;
}
<div class="input_wrap">
    <input id="input" type="text" readonly="true">
</div>
```
* JS逻辑  
首先获取我们事先隐藏好的 input 元素，接着将 input 的 value 设置为待复制的文本，然后将焦点聚集在 input 上，再使用 setSelectionRange 方法选中待复制的文本，最后使用document.execCommand('copy')执行复制命令，即可将相关文本复制到客户端的剪贴板中
```
const input = document.getElementById('input');
input.value = '待复制的文本内容';
// 聚焦
input.focus();
// 选择需要复制的文本
if (input.setSelectionRange) {
    input.setSelectionRange(0, input.value.length);
} else {
    input.select();
}
try {
    const result = document.execCommand('copy');
    console.error(result ? '内容已复制' : '复制失败，请重试~');
} catch (e) {
    console.error('复制失败，请重试~');
}
```
## 体验优化
尽管我们已经实现了复制的能力，但是复制之后页面上会出现输入键盘，为了更好的用户体验，我们需要想办法屏蔽键盘
* blur  
我们为了选中待复制的文案，手动调用了 input 的 focus 方法进行聚焦，为了屏蔽键盘，我们可以在复制结束后手动调用 input.blur() ，让键盘自动隐藏
* activeElement  
尽管我们手动调用了 blur 释放焦点，但是部分机型上仍然会弹出输入键盘，这里想到的解决方案是使用 document.activeElement.blur() 来进行二次屏蔽，最终实践效果还不错，基本所有机型都不会弹出输入键盘，或者弹出键盘后立马回弹消失
## 小结
移动端实现复制能力，主要还是依赖HTML文档暴露的API来实现，最后花费时间最多的还是在进行体验优化上
## 参考资料
* [API - execCommand](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/execCommand)
* [API - setSelectionRange](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLInputElement/setSelectionRange)
## 源码地址
* [mobile-copy-text](https://github.com/Ke1992/examples/blob/master/mobile-copy-text/index.html)