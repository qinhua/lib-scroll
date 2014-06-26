#lib.scroll

## 最新版本

**2.2.0**

## 安装依赖

运行 `npm install`，来安装所需的依赖模块。关于NPM的知识，请参见[nodejs](http://nodejs.org/);

## 用Grunt打包

运行 `grunt`，来对项目进行打包。关于Grunt的知识，请参见[gruntjs](http://gruntjs.com/);

## 如何使用

	var scroll = lib.scroll(el, options);
	scrll.init();

- el - 需要滚动的元素
- options - 选项
	- direction - 方向x/y
	- padding[top/bottom/left/right] - 边缘空白（和bounceOffset互斥）
	- bounceOffset[top/bottom/left/right] - 边缘回弹距离（和bounceOffset互斥）
	- noBounce - 是否取消边缘回弹效果
	- isPrevent - 阻止默认滑动，默认为true
	- inertia - 惯性的类型，可取值normal/slow/veryslow，默认为normal
	- useLazyload - 是否检查懒加载图片
	- realtimeLazyload - 在useLazyload为true的前提下，是否实时检查懒加载（会比较吃性能）
	- useSticky - 是否对拥有sticky类名的子元素采用吸顶功能

## 如何使用懒加载

* options中，设置useLazyload为true。
* 需要懒加载的元素拥有lazy类名，且有dataimg属性配置图片地址。
* 需要懒加载的元素必须有初始高度，不要让图片加载后来撑开。
* 在第一次dom加载完后，需要手动调用checkLazyLoad来显示当前屏的图片。


## 如何使用吸顶功能

### 单独使用吸顶

* 调用makeSticky，传入需要被吸顶的元素，必须保证被吸顶的元素，拥有作为占位符的父元素且定高。

### 初始化吸顶

* 在options中，设置useSticky为true
* 需要吸顶的元素拥有sticky类名

## 实例方法

### scroll.enable()

启用滚动。

### scroll.disable()

停用滚动。

### scroll.getScrollWidth()

* @return {number} width

获取HTML元素区域的滚动宽度（方向为x时有效）。

### scroll.getScrollHeight()

* @return {number} height

获取HTML元素区域的滚动高度（方向为y时有效）。

### scroll.getScrollLeft()

* @return {number} left

获取滚动位置（方向为x时有效）。

### scroll.getScrollTop()

* @return {number} top

获取滚动位置（方向为y时有效）。

### scroll.refresh()

刷新区域。

### scroll.offset(childEl)

* @param {HTMLElement} childEl 滚动区域内的元素
* @return {object} a rectangle object

返回某元素相对滚动区域的偏移，包括`top/bottom/left/right/width/height`。

### scroll.getRect(childEl)

* @param {HTMLElement} childEl 滚动区域内的元素
* @return {object} a rectangle object

返回某元素相对视觉区域的矩阵数据，包括`top/bottom/left/right/width/height`。

### scroll.isInView(childEl)

* @param {HTMLElement} childEl 滚动区域内的元素
* @return {Boolean} 是否在视觉区域内

判断滚动区域内的元素是否在视觉区域内

### scroll.scrollTo(s, isSmooth)

* @param {Number} s 滚动到的位置
* @param {Boolean} isSmooth 是否平滑滚动

滚动到区域中的某位置。

### scroll.scrollToElement(childEl, isSmooth)

* @param {HTMLElement} childEl 滚动到的元素
* @param {Boolean} isSmooth 是否平滑滚动

滚动到区域中的某元素。

### scroll.getViewWidth()

* @return {Number} width

获得区域的可见宽度（方向为x时有效）。

### scroll.getViewHeight()

* @return {Number} height

获得区域的可见高度（方向为y时有效）。

### scroll.addPulldownHandler(handler)

增加处理下拉的处理函数，第二个参数为完成后的回调。

### scroll.addPullupHandler(handler)

增加处理上拉的处理函数，第二个参数为完成后的回调。

### scroll.addScrollingHandler(handler)

增加处理滚动中的处理函数。

### scroll.addScrollendHandler(handler)

增加处理滚动结束的处理函数。

### scroll.checkLazyload()

检查当前可见区域内是否有需要懒加载的图片，如有则触发加载。

### scroll.makeSticky(stickyElement)

使得scroll区域内一个元素stickyElement变成sticky的：即当元素位置在滚动区域上方时，元素会吸附于滚动区域顶部。

**一般来说stickyElement的父元素应该指定固定高度，避免元素sticky行为触发时页面重排版。**

## 事件

在滚动的元素上，可以监听如下这些事件：

- scrollstart - 滚动开始
- scrollend - 滚动结束（建议使用addScrollendHandler来处理）
- pullleft - 往左拉（方向为x时有效）
- pullleftend - 往左拉结束（方向为x时有效）
- pullright - 往右拉（方向为x时有效）
- pullrightend - 往右拉结束（方向为x时有效）
- pulldown - 往下拉（方向为y时有效）
- pulldownend - 往下拉结束（方向为y时有效）
- pullup - 往上拉（方向为y时有效）
- pullupend - 往上拉结束（方向为y时有效）