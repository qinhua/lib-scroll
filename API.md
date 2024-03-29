# APIs

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

### scroll.addScrollstartHandler(handler)

增加处理滚动开始的处理函数。

### scroll.addScrollingHandler(handler)

增加处理滚动中的处理函数。

### scroll.addScrollendHandler(handler)

增加处理滚动结束的处理函数。

### scroll.addEventListener(name, handler, useCapture)

增加事件监听

### scroll.removeEventListener(name, handler)

移除事件监听

## 事件

- scrollstart - 滚动开始
- scrolling - 滚动中（建议使用addScrollingHandler来处理）
- scrollend - 滚动结束（建议使用addScrollendHandler来处理）
- pullleft - 往左拉（方向为x时有效）
- pullleftend - 往左拉结束（方向为x时有效）
- pullright - 往右拉（方向为x时有效）
- pullrightend - 往右拉结束（方向为x时有效）
- pulldown - 往下拉（方向为y时有效）
- pulldownend - 往下拉结束（方向为y时有效）
- pullup - 往上拉（方向为y时有效）
- pullupend - 往上拉结束（方向为y时有效）
- niceclick - 经过优化后的click事件（建议用来代替click事件）