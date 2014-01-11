;(function(win, lib, undef) {
var doc = win.document;
var docEl = doc.documentElement;
var styleEl = doc.createElement('style');
var motion = lib.motion;
var prevented = false;
var scrollObjs = {};

function getMinScrollTop(scrollObj) {
    return 0 - (scrollObj.options.bounceOffset.top || 0);
}

function getMaxScrollTop(scrollObj) {
    var rect = scrollObj.element.getBoundingClientRect();
    var pRect = scrollObj.element.parentNode.getBoundingClientRect();
    var minTop = getMinScrollTop(scrollObj);
    var maxTop = 0 - rect.height + pRect.height;
    return Math.min(maxTop + (scrollObj.options.bounceOffset.bottom || 0), minTop);
}

function getBoundaryOffset(scrollObj, y) {
    if(y > scrollObj.minScrollTop) {
        return y - scrollObj.minScrollTop;
    } else if (y < scrollObj.maxScrollTop){
        return y - scrollObj.maxScrollTop;
    }
}

function touchBoundary(scrollObj, y) {
    if (y > scrollObj.minScrollTop) {
        y = scrollObj.minScrollTop;
    } else if (y < scrollObj.maxScrollTop) {
        y = scrollObj.maxScrollTop;
    }
    return y;
}

function fireEvent(scrollObj, eventName, extra) {
    var event = doc.createEvent('HTMLEvents');
    event.initEvent(eventName, false, true);
    event.scrollObj = scrollObj;
    if (extra) {
        for (var key in extra) {
            event[key] = extra[key];
        }
    }
    scrollObj.element.dispatchEvent(event);
}

function getTransformOffset(scrollObj) {
    var offset = {x: 0, y: 0}; 
    var transform = getComputedStyle(scrollObj.element).webkitTransform;
    var matched;

    if (transform !== 'none') {
        if ((matched = transform.match(/^matrix3d\(\d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, ([-\d.]+), ([-\d.]+), [-\d.]+, \d+\)/) ||
                transform.match(/^matrix\(\d+, \d+, \d+, \d+, ([-\d.]+), ([-\d.]+)\)$/))) {
            offset.x = parseInt(matched[1]) || 0;
            offset.y = parseInt(matched[2]) || 0;
        }
    }

    return offset;
}

var has3d = 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix();
function getTranslate(x, y) {
    if (has3d) {
        return 'translate3d(' + x + 'px, ' + y + 'px, 0)';
    } else {
        return 'translate(' + x + 'px, ' + y + 'px)';
    }
}

function Scroll(element, options){
    var that = this;

    options = options || {};
    options.bounceOffset = options.bounceOffset || {top:0, bottom:0};

    this.options = options;
    this.element = element;
    this.viewport = element.parentNode;
    this.viewport.addEventListener('touchstart', touchstartHandler, false);
    this.viewport.addEventListener('touchend', touchendHandler, false);
    this.viewport.addEventListener('touchcancel', touchendHandler, false);
    this.viewport.addEventListener('panstart', panstartHandler, false);
    this.viewport.addEventListener('pan', panHandler, false);
    this.viewport.addEventListener('panend', panendHandler, false);
    this.viewport.addEventListener('flick', flickHandler, false);
    this.viewport.scrollId = setTimeout(function(){
        scrollObjs[that.viewport.scrollId + ''] = that;
    }, 0);


    var webkitTransitionEndHandler;
    element.addEventListener('webkitTransitionEnd', function(e) {
        if (webkitTransitionEndHandler) {
            var handler = webkitTransitionEndHandler;
            webkitTransitionEndHandler = null;
            handler(e); 
        }
    }, false);

    var webkitAnimationEndHandler;
    element.addEventListener('webkitAnimationEnd', function(e) {
        if (webkitAnimationEndHandler) {
            var handler = webkitAnimationEndHandler;
            webkitAnimationEndHandler = null;
            handler(e);
        }
    }, false);

    function touchstartHandler(e) {
        if (!that.enabled) {
            return;
        }

        that.transformOffset = getTransformOffset(that);
        element.style.webkitBackfaceVisibility = 'hidden';
        element.style.webkitTransformStyle = 'preserve-3d';
        element.style.webkitTransform = getComputedStyle(element).webkitTransform;
        element.style.webkitTransition = '';
        element.style.webkitAnimation = '';
        webkitTransitionEndHandler = null;
        webkitAnimationEndHandler = null;
    }

    function touchendHandler(e) {
        if (!that.enabled) {
            return;
        }

        var s0 = getTransformOffset(that).y;
        var boundaryffset = getBoundaryOffset(that, s0);
        var top = that.options.bounceOffset.top;
        var bottom = that.options.bounceOffset.bottom;
        if(element.style.webkitTransition === '' && element.style.webkitAnimation === '' && boundaryffset) {
            var s1;
            var endHandler;
            if (boundaryffset > 0 && top && boundaryffset > top / 2) {
                s1 = that.minScrollTop + top;
                webkitTransitionEndHandler = function() {
                    fireEvent(that, 'pulldownend');
                }
            } else if (boundaryffset < 0 && bottom && Math.abs(boundaryffset) > bottom / 2) {
                s1 = that.maxScrollTop - bottom;
                webkitTransitionEndHandler = function() {
                    fireEvent(that, 'pullupend');
                }
            } else {
                s1 = touchBoundary(that, s0);
                webkitTransitionEndHandler = scrollEnd;
            }
            // if (!styleEl.parentNode) {
            //     document.getElementsByTagName('head')[0].appendChild(styleEl);
            // }
            // var className = 'bounce-' + that.viewport.scrollId + '-' + Date.now();
            // styleEl.innerHTML = '@-webkit-keyframes ' + className + ' {' + 
            //         '0% {-webkit-transform:translateY(' + s0.toFixed(0) + 'px)}' + 
            //         '100% {-webkit-transform:translateY(' + s1.toFixed(0) + 'px);animation-timing-function:ease}' + 
            // '}';
            // element.style.webkitAnimation = className + ' 0.4s';
            element.style.webkitTransition = '-webkit-transform 0.4s ease 0';
            element.style.webkitTransform = 'translateY(' + s1.toFixed(0) + 'px)';
        } else {
            scrollEnd();
        }
    }

    function panstartHandler(e) {
        if (!that.enabled) {
            return;
        }

        e.stopPropagation();
        that.transformOffset = getTransformOffset(that);
        that.minScrollTop = getMinScrollTop(that);
        that.maxScrollTop = getMaxScrollTop(that);
        that.panFixRatio = 2.5;
        that.cancelScrollEnd = false;
        fireEvent(that, 'scrollstart');
    }

    function panHandler(e) {
        if (!that.enabled) {
            return;
        }

        e.stopPropagation();
        var y = that.transformOffset.y + e.displacementY;

        if(y > that.minScrollTop) {
            y = that.minScrollTop + (y - that.minScrollTop) / that.panFixRatio;
            that.panFixRatio *= 1.003;
        } else if(y < that.maxScrollTop) {
            y = that.maxScrollTop - (that.maxScrollTop - y) / that.panFixRatio;
            that.panFixRatio *= 1.003;
        }
        if (that.panFixRatio > 4) {
            that.panFixRatio = 4;
        }

        var boundaryOffset = getBoundaryOffset(that, y);
        if (boundaryOffset) {
            fireEvent(that, boundaryOffset > 0?'pulldown':'pullup', {
                boundaryOffset: Math.abs(boundaryOffset)
            });
        }

        element.style.webkitAnimation = '';
        element.style.webkitTransition = '';
        element.style.webkitTransform = getTranslate(that.transformOffset.x, y);
    }

    function panendHandler(e) {
        if (!that.enabled) {
            return;
        }

        e.stopPropagation();
    }

    function flickHandler(e) {
        if (!that.enabled) {
            return;
        }
        e.stopPropagation();
        that.cancelScrollEnd = true;
    
        var v0, a0, t0, s0, s;
        var v1, a1, t1, s1, sign;
        var v2, a2, t2, s2, ft;
        
        s0 = getTransformOffset(that).y;
        var bounceOffset0 = getBoundaryOffset(that, s0);
        if(!bounceOffset0) {
            //手指离开屏幕时，已经超出滚动范围
            //不作处理，让touchend handler处理
            //手指离开屏幕时，在滚动范围内，做一下惯性计算
            v0 = e.velocityY;
            if (v0 > 1.5) { 
                v0 = 1.5;
            }
            if (v0 < -1.5) {
                v0 = -1.5;
            }
            a0 = 0.0015 * ( v0 / Math.abs(v0));
            t0 = v0 / a0;

            s = s0 + t0 * v0 / 2;
            var bounceOffset1 = getBoundaryOffset(that, s);
            if (bounceOffset1) {
                //惯性运动足够滑出屏幕边缘
                v1 = v0;
                a1 = a0;
                if(bounceOffset1 > 0) {
                    s1 = that.minScrollTop;
                    sign = 1;
                } else {
                    s1 = that.maxScrollTop;
                    sign = -1;
                }
                t1 = (sign * v1 - Math.sqrt(-2 * a1 * Math.abs(s1 - s0) + v1 * v1)) / a1;

                v2 = v1 - a1 * t1;
                a2 = 0.008 * (v2 / Math.abs(v2));
                t2 = v2 / a2;
                s2 = s1 + v2 * t2 / 2;
                ft = t1 + t2 + 400;

                var timeFunction1 = motion({
                    v: v1,
                    a: -a1,
                    t: t1
                }).generateCubicBezier();
                var timeFunction2 = motion({
                    v: v2,
                    a: -a2,
                    t: t2
                }).generateCubicBezier();
                
                // if (!styleEl.parentNode) {
                //     document.getElementsByTagName('head')[0].appendChild(styleEl);
                // }
                // var className = 'bounce-' + that.viewport.scrollId + '-' + Date.now();
                // styleEl.innerHTML = '@-webkit-keyframes ' + className + ' {' + 
                //     '0% {-webkit-transform:translateY(' + s0.toFixed(0) +'px)}' + 
                //     //第1段：摩擦力作用下惯性运动
                //     (t1 / ft * 100).toFixed(1) + '% {-webkit-transform:translateY(' + s1.toFixed(0) + 'px);animation-timing-function:cubic-bezier(' + timeFunction1 + ')}' +    //quadratic2cubicBezier(-t1-v1/a1/2, -t2-v1/a1/2) 
                //     //第2段：弹力作用下继续惯性运动
                //     ((t1 + t2) / ft * 100).toFixed(1) + '% {-webkit-transform:translateY(' + s2.toFixed(0) + 'px);animation-timing-function:cubic-bezier(' + timeFunction2 + ')}' + //quadratic2cubicBezier(-t2-v2/a2/2, 0) 
                //     //第3段：弹回边缘
                //     '100% { -webkit-transform:translateY(' + s1.toFixed(0) + 'px);animation-timing-function:ease}' + 
                // '}';
                // element.style.webkitAnimation = className + ' ' + (ft / 1000).toFixed(2) + 's';
                // element.style.webkitTransform = 'translateY(' + s1.toFixed(0) + 'px)';
                // webkitAnimationEndHandler = scrollEnd;

                element.style.webkitTransition = '-webkit-transform ' + (t1 / 1000).toFixed(2) + 's cubic-bezier(' + timeFunction1 + ') 0';                
                element.style.webkitTransform = 'translateY(' + s1.toFixed(0) + 'px)';
                webkitTransitionEndHandler = function(e) {
                    element.style.webkitTransition = '-webkit-transform ' + (t2 / 1000).toFixed(2) + 's cubic-bezier(' + timeFunction2 + ') 0';
                    element.style.webkitTransform = 'translateY(' + s2.toFixed(0) + 'px)';

                    webkitTransitionEndHandler = function(e) {
                        element.style.webkitTransition = '-webkit-transform 0.4s ease 0';
                        element.style.webkitTransform = 'translateY(' + s1.toFixed(0) + 'px)';

                        webkitTransitionEndHandler = scrollEnd;
                    }
                }
            } else {
                var timeFunction = motion({
                    v: v0,
                    a: -a0,
                    t: t0
                }).generateCubicBezier();

                // if (!styleEl.parentNode) {
                //     document.getElementsByTagName('head')[0].appendChild(styleEl);
                // }
                // var className = 'bounce-' + that.viewport.scrollId + '-' + Date.now();

                // styleEl.innerHTML = '@-webkit-keyframes ' + className + ' {' + 
                //     '0% {-webkit-transform:translateY(' + s0.toFixed(0) + 'px)}' + 
                //     '100% {-webkit-transform:translateY(' + s.toFixed(0)+'px);animation-timing-function:cubic-bezier(' + timeFunction + ')}' + //quadratic2cubicBezier(-t0, 0)
                // '}';
                // element.style.webkitAnimation = className + ' ' + (t0 / 1000).toFixed(2) + 's';
                // element.style.webkitTransform = 'translateY(' + s.toFixed(0) + 'px)';

                element.style.webkitTransition = '-webkit-transform ' + (t0 / 1000).toFixed(2) + 's ease 0';
                element.style.webkitTransform = 'translateY(' + s.toFixed(0) + 'px)';
                webkitTransitionEndHandler = scrollEnd;
            }

        }
    }

    function scrollEnd(e) {
        if (!that.enabled) {
            return;
        }
        e && e.stopPropagation();
        that.cancelScrollEnd = false;

        setTimeout(function() {
            if (!that.cancelScrollEnd) {
                element.style.webkitBackfaceVisibility = '';
                element.style.webkitTransformStyle = '';
                element.style.webkitTransition = '';
                element.style.webkitAnimation = '';
                fireEvent(that, 'scrollend');
            }
        }, 10);
    }
}

var proto = {
    enable: function() {
        this.enabled = true;

        if (!prevented) {
            prevented = true;
            doc.addEventListener('touchmove', function(e) {
                e.preventDefault();
                return false;
            }, false);
        }
    },

    disable: function() {
        var el = this.element;
        this.enabled = false;

        setTimeout(function() {
            el.style.webkitTransform = getComputedStyle(el).webkitTransform;
            el.style.webkitAnimation = '';
        }, 50);
    },

    getScrollHeight: function() {
        return this.element.getBoundingClientRect().height - (this.options.bounceOffset.top||0) - (this.options.bounceOffset.bottom||0);
    },

    getScrollTop: function() {
        return -getTransformOffset(this).y - (this.options.bounceOffset.top || 0);
    },

    refresh: function() {
        var el = this.element;

        el.style.height = 'auto';
        el.style.height = el.offsetHeight + 'px';

        this.transformOffset = getTransformOffset(this);
        this.minScrollTop = getMinScrollTop(this);
        this.maxScrollTop = getMaxScrollTop(this);
        this.scrollTo(-this.transformOffset.y - (this.options.bounceOffset.top || 0));
    },

    offset: function(childEl) {
        var elRect = this.element.getBoundingClientRect();
        var childRect = childEl.getBoundingClientRect();
        var offsetRect = {
                top: childRect.top - ((this.options.bounceOffset.top || 0) + elRect.top),
                left: childRect.left - elRect.left,
                right: elRect.right - childRect.right,
                width: childRect.width,
                height: childRect.height
            };

        offsetRect.bottom = offsetRect.top + childRect.height;
        return offsetRect;
    },

    scrollTo: function(y, isSmooth) {
        var x = getTransformOffset(this).x;
        var element = this.element;

        y = -y - (this.options.bounceOffset.top || 0);
        y = touchBoundary(this, y);

        if (isSmooth === true) {
            element.style.webkitTransition = '-webkit-transform 0.4s ease 0';
            webkitTransitionEndHandler = function(){
                element.style.webkitTransition = '';
                element.style.webkitAnimation = '';
            }
        } else {
            element.style.webkitTransition = '';
            element.style.webkitAnimation = '';
        }
        element.style.webkitTransform = getTranslate(x, y);
    },

    scrollToElement: function(childEl, isSmooth) {
        var offset = this.offset(childEl);
        this.scrollTo(offset.top, isSmooth);
    },

    getViewHeight: function(el) {
        return this.viewport.getBoundingClientRect().height;
    }
}

for (var k in proto) {
    Scroll.prototype[k] = proto[k];
}

lib.scroll = function(el, options) {
    if (!el.parentNode) {
        throw new Error('wrong dom tree');
    }

    var scroll;
    if (el.parentNode.scrollId) {
        scroll = scrollObjs[el.parentNode.scrollId];
    } else {
        scroll = new Scroll(el, options);
    }
    
    scroll.enable();
    scroll.refresh();
    return scroll;
}

})(window, window['lib']||(window['lib']={}));