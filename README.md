#lib.scroll

## 最新版本

**2.6.0**

## 依赖库

- [lib.motion](http://gitlab.alibaba-inc.com/mtb/lib-motion/tree/master)
- [lib.gesture](http://gitlab.alibaba-inc.com/mtb/lib-gesture/tree/master)
- [lib.cubicbezier](http://gitlab.alibaba-inc.com/mtb/lib-cubicbezier/tree/master)
- [lib.animation](http://gitlab.alibaba-inc.com/mtb/lib-animation/tree/master)

完整引用举例：

    <script src="http://g.tbcdn.cn/mtb/lib-scroll/{{version}}/??combo.js,scroll.js"></script>

## 用Grunt打包

运行 `npm install`，来安装所需的依赖模块。关于NPM的知识，请参见[nodejs](http://nodejs.org/);

运行 `grunt`，来对项目进行打包。关于Grunt的知识，请参见[gruntjs](http://gruntjs.com/);

## 初始化

	var Scroll = lib.scroll;
    var scroller = new Scroll(options);
    scroller.init();

### 参数

**scrollWrap**

滚动元素的父级，如果设置这个属性，那么`scrollElement`会自动设置为其第一个子元素

**scrollElement**

滚动的元素，在同时设置`scrollElement`和`scrollWrap`时，以`scrollElement`为准。

**direction**

方向`x（水平方向）`/`y（垂直方向）`，可省略，默认为`y`。

**padding**

可以设置内边距，传递一个对象给这个属性，对象的key分别为top/bottom/left/right，可省略，默认都为0。

**noBounce**

是否取消边缘回弹效果，可省略，默认为false

**isPrevent**

阻止默认滑动，可省略，默认为true

**inertia**

惯性的类型，取值为normal/slow/veryslow，可省略，默认为normal

**isFixScrollendClick**

点停滚动时，触发点击事件的问题，可省略，默认为true

**useFrameAnimation**

用帧动画实现滚动

### 图示

![Scroll图示](http://gtms04.alicdn.com/tps/i4/TB1rRumFVXXXXX_XVXXzVfsGpXX-700-654.jpg)

### 代码示例

    <!DOCTYPE html>
    <html>
    <head>
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
    <style>
        html,body {
            padding: 0;
            margin: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
        }

        #scroll-wrap {
            width:100%;
            height:100%;
            overflow:hidden;
            background-color:#CCC;
        }

        #scroll-content {
            width:100%;
            background: -webkit-linear-gradient(top, red, orange, yellow, green, cyan, blue, purple);
        }

        #scroll-content > div {
            height: 2000px;
        }
    </style>
    </head>
    <body>
    <div id="scroll-wrap">
        <div id="scroll-content">
            <div></div>
        </div>
    </div>

    <script src="http://g.tbcdn.cn/mtb/lib-scroll/{{version}}/??combo.js,scroll.js"></script>
    <script>
        var scroll = lib.scroll({
            scrollWrap: document.getElementById('scroll-wrap')
        });
        scroll.init();
    </script>
    </body>

## 使用插件

**注意：从2.6.0版本开始，lib.scroll不再提供插件机制，如需使用原来插件的功能可选择[ctrl.scrollview](http://gitlab.alibaba-inc.com/mtb/ctrl-scrollview/tree/master)**

## 降级

用原生的滚动。并保留部分API的行为。

引入`http://g.tbcdn.cn/mtb/lib-scroll/{{version}}/downgrade.js`。并在初始化时增加`downgrade`参数。

    <script src="http://g.tbcdn.cn/mtb/lib-scroll/{{version}}/??combo.js,scroll.js,downgrade.js"></script>
    <script>
        var scroll = lib.scroll({
			downgrade: true,
            scrollWrap: document.getElementById('scroll-wrap')
        });
        scroll.init();
    </script

## API使用

请参见[API.md](http://gitlab.alibaba-inc.com/mtb/lib-scroll/blob/master/API.md)

## 扩充阅读

- [代码片段](http://gitlab.alibaba-inc.com/mtb/lib-scroll/snippets)

