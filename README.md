#lib.scroll

## 最新版本

**2.2.1**

## 依赖库

- [lib.motion](http://gitlab.alibaba-inc.com/mtb/lib-motion/tree/master)
- [lib.gesture](http://gitlab.alibaba-inc.com/mtb/lib-gesture/tree/master)

完整引用举例：

    <script src="http://g.tbcdn.cn/mtb/lib-scroll/{{version}}/??combo.js,scroll.js"></script>

## 用Grunt打包

运行 `npm install`，来安装所需的依赖模块。关于NPM的知识，请参见[nodejs](http://nodejs.org/);

运行 `grunt`，来对项目进行打包。关于Grunt的知识，请参见[gruntjs](http://gruntjs.com/);

## 如何使用

    var scroller = lib.scroll(element, {
        scrollElement: document.getElementById('search-list')
    });
    scrller.init();

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

### 图示

![Scroll图示](http://gtms04.alicdn.com/tps/i4/TB1rRumFVXXXXX_XVXXzVfsGpXX-700-654.jpg)

## 使用插件

需额外引入一个js：

    <script src="http://g.tbcdn.cn/mtb/lib-scroll/{{version}}/plugin.js"></script>

### 贴边固定元素

![图示](http://gtms01.alicdn.com/tps/i1/TB17UCqFVXXXXcbXFXXRNQOKpXX-1036-254.png)

贴边固定元素可位于顶部/底部（只适用于Y轴滚动），左边/右边（只适用于X轴滚动）

	scroller.enablePlugin('fixed', {
		topOffset: 0, //默认为0，可省略
		topElement: '<h2>标题xxxxx</h2>'  // 顶部的元素，可以是HTML片段也可以是HTML元素
	});

除了topOffset/topElement的参数，另外还有bottomOffset/bottomElement，leftOffset/leftElement，rightOffset/rightElement。

启用这个插件后，scroller会增加如下方法/属性：

**topFixedElement** 

topElement的父元素

**bottomFixedElement** 

bottomElement的父元素

**leftFixedElement** 

leftElement的父元素

**rightFixedElement** 

rightElement的父元素

### 懒加载

懒加载的触发条件是元素有`lazy`的类名，并且该元素是img标签或其子元素有img标签，且img标签的图片用`data-src`属性标识。

	scroller.enablePlugin('lazyload', {
	    realTimeLoad: false // 是否在滚动时进行懒加载，默认为false
	});

启用这个插件后，scroller会增加如下方法/属性：

**checkLazyload()**

执行懒加载

### 元素吸顶

![图示](http://gtms02.alicdn.com/tps/i2/TB1MHSqFVXXXXXXXVXX0vNdTFXX-1057-289.png)

吸顶的触发条件是元素有`sticky`的类名，并且该元素的父元素是个固定高度的元素（也就是原始位置需要有个占位符）。
	
	scroller.enablePlugin('sticky'， {
		offset: 0, //元素距离顶部的偏移，默认为0，可为负数
	});

启用这个插件后，scroller会增加如下方法/属性：

**checkSticky()**

执行元素吸顶。

**makeSticky(element)**

让某个元素拥有吸顶功能。

### 下拉刷新

![图示](http://gtms03.alicdn.com/tps/i3/TB1wQ9rFVXXXXbAXFXX25K14XXX-1079-229.png)

	scroller.enablePlugin('refresh', {
		element: '<div>下拉刷新</div>' //可以是HTML片段也可以是HTML元素
		height: 20, // 元素的高度，默认为0
		offset: 0,  // 元素距离顶部的偏移，默认为0，可为负数
		onrefresh： function(done) {
			// 上下文是当前的scroller对象
			// 触发刷新动作时的回调
			// 自行做刷新的渲染
			// 完成后运行done方法
			done();
        }
	});

启用这个插件后，scroller会增加如下方法/属性：

**refreshElement**

element的父元素

### 上拉加载更多

	scroller.enablePlugin('refresh', {
		element: '<div>加载更多</div>' //可以是HTML片段也可以是HTML元素
		height: 20, // 元素的高度，默认为0
		offset: 0,  // 元素距离顶部的偏移，默认为0，可为负数
		onupdate： function(done) {
			// 上下文是当前的scroller对象
			// 触发加载动作时的回调
			// 自行做加载的渲染
			// 完成后运行done方法
			done();
        }
	});

启用这个插件后，scroller会增加如下方法/属性：

**updateElement**

element的父元素

