;(function(win, lib, undef) {
var doc = win.document;
var scrollObjs = {};
var plugins = {};

function debugLog() {
    if (lib.scroll.outputDebugLog) {
        console.debug.apply(console, arguments);
    }
}

function getBoundingClientRect(el) {
    var rect = el.getBoundingClientRect();
    if (!rect) {
        rect = {};
        rect.width = el.offsetWidth;
        rect.height = el.offsetHeight;

        rect.left = el.offsetLeft;
        rect.top = el.offsetTop;
        var parent = el.offsetParent;
        while (parent) {
            rect.left += parent.offsetLeft;
            rect.top += parent.offsetTop;
            parent = parent.offsetParent;
        }

        rect.right = rect.left + rect.width;
        rect.bottom = rect.top + rect.height;
    }
    return rect;
}

function getMinScrollOffset(scrollObj) {
    return 0 - scrollObj.options[scrollObj.axis + 'PaddingTop'];
}

function getMaxScrollOffset(scrollObj) {
    var rect = getBoundingClientRect(scrollObj.element);
    var pRect = getBoundingClientRect(scrollObj.viewport);
    var min = getMinScrollOffset(scrollObj);
    if (scrollObj.axis === 'y') {
        var max = 0 - rect.height + pRect.height;
    } else {
        var max = 0 - rect.width + pRect.width;
    }
    return Math.min(max + scrollObj.options[scrollObj.axis + 'PaddingBottom'], min);
}

function getBoundaryOffset(scrollObj, offset) {
    if(offset > scrollObj.minScrollOffset) {
        return offset - scrollObj.minScrollOffset;
    } else if (offset < scrollObj.maxScrollOffset){
        return offset - scrollObj.maxScrollOffset;
    }
}

function fireEvent(scrollObj, eventName, extra) {
    debugLog(scrollObj.element.scrollId, eventName, extra);

    var event = doc.createEvent('HTMLEvents');
    event.initEvent(eventName, false, true);
    event.scrollObj = scrollObj;
    if (extra) {
        for (var key in extra) {
            event[key] = extra[key];
        }
    }
    scrollObj.element.dispatchEvent(event);
    scrollObj.viewport.dispatchEvent(event);
}

function ScrollDowngrade(element, options){
    var that = this;

    options = options || {};
    options.noBounce = !!options.noBounce;
    options.padding = options.padding || {};

    if (options.isPrevent == null) {
        options.isPrevent = true;
    } else {
        options.isPrevent = !!options.isPrevent;
    }

    if (options.isFixScrollendClick == null) {
        options.isFixScrollendClick = true;
    } else {
        options.isFixScrollendClick = !!options.isFixScrollendClick;
    }

    if (options.padding) {
        options.yPaddingTop = -options.padding.top || 0;
        options.yPaddingBottom = -options.padding.bottom || 0;
        options.xPaddingTop = -options.padding.left || 0;
        options.xPaddingBottom = -options.padding.right || 0;
    } else {
        options.yPaddingTop = 0;
        options.yPaddingBottom = 0;
        options.xPaddingTop = 0;
        options.xPaddingBottom = 0;
    }

    options.direction = options.direction || 'y';
    options.inertia = options.inertia || 'normal';

    this.options = options;
    that.axis = options.direction;
    this.element = element;
    this.viewport = element.parentNode;
    this.plugins = {};

    this.element.scrollId = setTimeout(function(){
        scrollObjs[that.element.scrollId + ''] = that;
    }, 1);

    this.viewport.style.overflow = 'hidden';
    this.viewport.style['overflow' + this.axis.toUpperCase()] = 'scroll';
    this.viewport.style.webkitOverflowScrolling = 'touch';
    this.viewport.style.msOverflowScrolling = 'touch';
    this.viewport.style.overflowScrolling = 'touch';

    var isScrolling = false;
    var startScrollOffset = 0;
    this.viewport.addEventListener('scroll', function(e) {
        var scrollOffset = that.axis === 'y' ? that.getScrollTop() : that.getScrollLeft();
        var isScrolling = true;
        if (startScrollOffset === scrollOffset) {
            fireEvent(that, 'scrollstart');
        } else {
            fireEvent(that, 'scrolling');
        }

        setTimeout(function(){
            var endScrollOffset = that.axis === 'y' ? that.getScrollTop() : that.getScrollLeft();
            if (scrollOffset === endScrollOffset) {
                fireEvent(that, 'scrollend');
            }
        }, 50);
    });

    this.viewport.addEventListener('scrollstart', function(e){
        isScrolling = true;
    }, false);

    this.viewport.addEventListener('scrolling', function(e){
        isScrolling = true;
    }, false);

    this.viewport.addEventListener('scrollend', function(e){
        isScrolling = false;
        startScrollOffset = that.axis === 'y' ? that.getScrollTop() : that.getScrollLeft();
    }, false);

    this.viewport.addEventListener('click', function(e){
        var niceTapEvent = document.createEvent('HTMLEvents');
        niceTapEvent.initEvent('niceclick', true, true);
        e.target.dispatchEvent(niceTapEvent);
    }, false);

    var proto = {
        init: function() {
            this.enable();
            this.refresh();
            this.scrollTo(0);
            return this;
        },

        enable: function() {
            this.enabled = true;
            return this;
        },

        disable: function() {
            this.enabled = false;
            return this;
        },

        getScrollWidth: function() {
            return getBoundingClientRect(this.element).width;
        },

        getScrollHeight: function() {
            return getBoundingClientRect(this.element).height;
        },

        getScrollLeft: function() {
            return this.viewport.scrollLeft - this.options.xPaddingTop;
        },

        getScrollTop: function() {
            return this.viewport.scrollTop - this.options.yPaddingTop;
        },

        getMaxScrollLeft: function() {
            return -getMaxScrollOffset(this) - this.options.xPaddingTop;
        },

        getMaxScrollTop: function() {
            return -getMaxScrollOffset(this) - this.options.yPaddingTop;
        },

        getBoundaryOffset: function() {
            return Math.abs(getBoundaryOffset(this, this['getScroll' + (this.axis === 'y'?'Top':'Left')]) || 0);
        },

        refresh: function() {
            if (this.axis === 'y') {
                this.element.style.paddingTop = -this.options.yPaddingTop + 'px';
                this.element.style.paddingBottom = -this.options.yPaddingBottom + 'px';
            } else {
                this.element.style.paddingLeft = -this.options.xPaddingTop + 'px';
                this.element.style.paddingRight = -this.options.xPaddingBottom + 'px';
            }
            
            fireEvent(this, 'contentrefresh');
            return this;
        },


        offset: function(childEl) {
            var elRect = getBoundingClientRect(this.element);
            var childRect = getBoundingClientRect(childEl);
            if (this.axis === 'y') {
                var offsetRect = {
                        top: childRect.top - elRect.top - this.options.yPaddingTop,
                        left: childRect.left - elRect.left,
                        right: elRect.right - childRect.right,
                        width: childRect.width,
                        height: childRect.height
                    };

                offsetRect.bottom = offsetRect.top + offsetRect.height;
            } else {
                var offsetRect = {
                        top: childRect.top - elRect.top,
                        bottom: elRect.bottom - childRect.bottom,
                        left: childRect.left - elRect.left - this.options.xPaddingTop,
                        width: childRect.width,
                        height: childRect.height
                    };

                offsetRect.right = offsetRect.left + offsetRect.width;
            }
            return offsetRect;
        },

        getRect: function(childEl) {
            var viewRect = getBoundingClientRect(this.viewport);
            var childRect = getBoundingClientRect(childEl);
            if (this.axis === 'y') {
                var offsetRect = {
                        top: childRect.top - viewRect.top,
                        left: childRect.left - viewRect.left,
                        right: viewRect.right - childRect.right,
                        width: childRect.width,
                        height: childRect.height
                    };

                offsetRect.bottom = offsetRect.top + offsetRect.height;
            } else {
                var offsetRect = {
                        top: childRect.top - viewRect.top,
                        bottom: viewRect.bottom - childRect.bottom,
                        left: childRect.left - viewRect.left,
                        width: childRect.width,
                        height: childRect.height
                    };

                offsetRect.right = offsetRect.left + offsetRect.width;
            }
            return offsetRect;
        },

        isInView: function(childEl) {
            var viewRect = this.getRect(this.viewport);
            var childRect = this.getRect(childEl);
            if (this.axis === 'y') {
                return viewRect.top < childRect.bottom && viewRect.bottom > childRect.top;
            } else {
                return viewRect.left < childRect.right && viewRect.right > childRect.left;
            }
        },

        scrollTo: function(offset) {
            var that = this;
            var element = this.element;
            var type = this.axis === 'y'?'Top':'Left';

            isScrolling = true;
            this.viewport['scroll' + type] = offset;
            fireEvent(this, 'scrollend');
            return this;
        },

        scrollToElement: function(childEl, isSmooth) {
            var offset = this.offset(childEl);
            offset = offset[this.axis === 'y'?'top':'left'];
            return this.scrollTo(offset, isSmooth);
        },

        getViewWidth: function() {
            return getBoundingClientRect(this.viewport).width;
        },

        getViewHeight: function() {
            return getBoundingClientRect(this.viewport).height;
        },

        addPulldownHandler: function(handler) {
            return this;
        },

        addPullupHandler: function(handler) {
            return this;
        },

        addScrollstartHandler: function(handler) {
            var that = this;
            this.element.addEventListener('scrollstart', function(e){
                handler.call(that, e);
            }, false);

            return this;
        },

        addScrollingHandler: function(handler) {
            var that = this;
            this.element.addEventListener('scrolling', function(e){
                handler.call(that, e);
            }, false);

            return this;
        },

        addScrollendHandler: function(handler) {
            var that = this;
            this.element.addEventListener('scrollend', function(e){
                handler.call(that, e);
            }, false);

            return this;
        },

        addContentrenfreshHandler: function(handler) {
            var that = this;
            this.element.addEventListener('contentrefresh', function(e){
                handler.call(that, e);
            }, false);
        },

        addEventListener: function(name, handler, useCapture) {
            var that = this;
            this.element.addEventListener(name, function(e){
                handler.call(that, e);
            }, !!useCapture);
        },

        removeEventListener: function(name, handler) {
            var that = this;
            this.element.removeEventListener(name, function(e){
                handler.call(that, e);
            });
        }
    }

    for (var k in proto) {
        this[k] = proto[k];
    }
    delete proto;
}

if (!lib.scroll) {
    lib.scroll = function(el, options) {
        if (arguments.length === 1 && !(arguments[0] instanceof HTMLElement)) {
            options = arguments[0];
            if (options.scrollElement) {
                el = options.scrollElement;    
            } else if (options.scrollWrap) {
                el = options.scrollWrap.firstElementChild;
            } else {
                throw new Error('no scroll element');
            }
        }

        if (!el.parentNode) {
            throw new Error('wrong dom tree');
        }
        if (options && options.direction && ['x', 'y'].indexOf(options.direction) < 0) {
            throw new Error('wrong direction');
        }

        var scroll;
        if (el.scrollId) {
            scroll = scrollObjs[el.scrollId];
        } else {
            scroll = new ScrollDowngrade(el, options);
        }
        return scroll;
    }
} else {
    lib.scroll.downgrade = function(el, options) {
        var scroll;
        if (el.scrollId) {
            scroll = scrollObjs[el.scrollId];
        } else {
            scroll = new ScrollDowngrade(el, options);
        }
        return scroll;
    }    
}


})(window, window['lib']||(window['lib']={}));