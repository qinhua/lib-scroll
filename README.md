#lib.gesture

## 最新版本

**1.0.0**

## 安装依赖

运行 `npm install`，来安装所需的依赖模块。关于NPM的知识，请参见[nodejs](http://nodejs.org/);

## 用Grunt打包

运行 `grunt`，来对项目进行打包。关于Grunt的知识，请参见[gruntjs](http://gruntjs.com/);

## 如何使用

### Scroll.enable(el, options)

* @param {HTMLElement} a element
* @param {object} [options]

启用HTML元素内的滚动（Y轴）。options参数的字段包括：

	- bounceTop: 顶部回弹的高度
	- bounceBottom: 底部回弹的高度

### Scroll.disable(el)

* @param {HTMLElement} a element

停用HTML元素内的滚动。

### Scroll.getScrollHeight(el)

* @param {HTMLElement} a element
* @return {Number} height

获取HTML元素区域的滚动高度。

### Scroll.getScrollTop(el)

* @param {HTMLElement} a element
* @return {Number} height

获取HTML元素区域的滚动位置。

### Scroll.refresh(el)

* @param {HTMLElement} a element

刷新HTML元素区域。

### Scroll.offset(el, child)

* @param {HTMLElement} a element
* @param {HTMLElement} a child element
* @return {object} a rectangle object

返回HTML元素区域内某元素的矩阵数据，包括`top/bottom/width/height/left/right`。

### Scroll.scrollTo(el, y)

* @param {HTMLElement} a element
* @param {Number} y value

滚动到HTML元素区域中的某位置。

### Scroll.scrollToElement(el, child)

* @param {HTMLElement} a element
* @param {HTMLElement} a child element

滚动到HTML元素区域中的某元素。

### Scroll.getBoundaryOffset(el)

* @param {HTMLElement} a element
* @return {object} a offset object

获取HTML元素区域回弹时的偏移值。

### Scroll.getViewHeight(el)

* @param {HTMLElement} a element
* @return {Number} height

获得HTML元素区域的可见高度。

### Scroll.stopBounce(el)

* @param {HTMLElement} a element

出现回弹时，停止回弹。

### Scroll.resumeBounce(el)

* @param {HTMLElement} a element

恢复回弹。