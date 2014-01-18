#lib.scroll

## 最新版本

**2.0.2**

## 安装依赖

运行 `npm install`，来安装所需的依赖模块。关于NPM的知识，请参见[nodejs](http://nodejs.org/);

## 用Grunt打包

运行 `grunt`，来对项目进行打包。关于Grunt的知识，请参见[gruntjs](http://gruntjs.com/);

## 如何使用

	var scroll = lib.scroll(el, options);

- el - 需要滚动的元素
- options - 选项
	- bonceOffset - {top:0, bottom:0} 上下回弹区域的高度


### scroll.enable()

启用滚动（Y轴）。

### scroll.disable()

停用滚动（Y轴）。

### scroll.getScrollHeight()

* @return {number} height

获取HTML元素区域的滚动高度。

### scroll.getScrollTop()

* @return {number} top

获取滚动位置。

### scroll.refresh()

刷新区域。

### scroll.offset(childEl)

* @param {HTMLElement} childEl 滚动区域内的元素
* @return {object} a rectangle object

返回区域内某元素的矩阵数据，包括`top/bottom/width/height/left/right`。

### scroll.scrollTo(y, isSmooth)

* @param {Number} y 滚动到的位置
* @param {Boolean} isSmooth 是否平滑滚动

滚动到区域中的某位置。

### scroll.scrollToElement(childEl, isSmooth)

* @param {HTMLElement} childEl 滚动到的元素
* @param {Boolean} isSmooth 是否平滑滚动

滚动到区域中的某元素。

### scroll.getViewHeight()

* @return {Number} height

获得区域的可见高度。

### 事件

在滚动的元素上，可以监听如下这些事件：

- scrollstart - 滚动开始
- scrollend - 滚动结束
- pulldown - 下拉
- pulldownend - 下拉结束
- pullup -上拉
- pullupend - 上拉结束