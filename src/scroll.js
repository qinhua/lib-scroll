;(function(win, lib, undef) {
var doc = win.document;
var docEl = doc.documentElement;
var styleEl = doc.createElement('style');
var motion = lib.motion;
var panFixRatio = 2;
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
        return scrollObj.maxScrollTop - y;
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
    event.initEvent(eventName, true, true);
    event.scrollObj = scrollObj;
    for (var p in extra) {
        event[p] = extra[p];
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

function Scroll(element, options){
    var that = this;

    options = options || {};
    options.bounceOffset = options.bounceOffset || {top:0, bottom:0};

    this.options = options;
    this.element = element;
    this.viewport = element.parentNode;
    this.viewport.addEventListener('touchstart', touchstartHandler, false);
    this.viewport.addEventListener('touchend', touchendHandler, false);
    this.viewport.addEventListener('panstart', panstartHandler, false);
    this.viewport.addEventListener('pan', panHandler, false);
    this.viewport.addEventListener('panend', panendHandler, false);
    this.viewport.addEventListener('flick', flickHandler, false);
    this.viewport.scrollId = setTimeout(function(){
        scrollObjs[that.viewport.scrollId + ''] = that;
    }, 0);


    function touchstartHandler(e) {
        if (!that.enabled || !!that.isStopBounce) {
            return;
        }

        that.offset = getTransformOffset(that);
        element.style.webkitBackfaceVisibility = 'hidden';
        element.style.webkitTransformStyle = 'preserve-3d';
        element.style.webkitTransform = getComputedStyle(element).webkitTransform;
        element.style.webkitAnimation = '';
        element.removeEventListener('webkitAnimationEnd', scrollEnd, false);
    }

    function touchendHandler(e) {
        if (!that.enabled || !!that.isStopBounce) {
            return;
        }

        var s0 = getTransformOffset(that).y;
        var bounceOffset = getBoundaryOffset(that, s0);
        if(element.style.webkitAnimation === '' && bounceOffset) {
            var s1 = touchBoundary(that, s0);
            if (!styleEl.parentNode) {
                document.getElementsByTagName('head')[0].appendChild(styleEl);
            }
            var className = 'bounce-' + that.viewport.scrollId + '-' + Date.now();
            styleEl.innerHTML = '@-webkit-keyframes ' + className + ' {' + 
                    '0% {-webkit-transform:translateY(' + s0.toFixed(0) + 'px)}' + 
                    '100% {-webkit-transform:translateY(' + s1.toFixed(0) + 'px);animation-timing-function:ease}' + 
            '}';
            element.style.webkitAnimation = className + ' 0.4s';
            element.style.webkitTransform = 'translateY(' + s1.toFixed(0) + 'px)';
            element.addEventListener('webkitAnimationEnd', scrollEnd, false);
        }
    }

    function panstartHandler(e) {
        if (!that.enabled || !!that.isStopBounce) {
            return;
        }

        that.transformOffset = getTransformOffset(that);
        that.minScrollTop = getMinScrollTop(that);
        that.maxScrollTop = getMaxScrollTop(that);
        that.panFixRatio = 2.5;
        that.isStopBounce = false;
        that.cancelScrollEnd = false;
        fireEvent(that, 'scrollstart');
    }

    function panHandler(e) {
        if (!that.enabled || !!that.isStopBounce) {
            return;
        }

        var y = that.transformOffset.y + e.displacementY;
        console.log(y, that.minScrollTop, that.maxScrollTop);
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


        var boundaryEventName;
        var bounceOffset = getBoundaryOffset(that, y);
        if (bounceOffset) {
            boundaryEventName = bounceOffset > 0?'pulldown':'pullup';
            that.bounceOffset = Math.abs(bounceOffset);
            fireEvent(that, boundaryEventName);
        } else {
            that.bounceOffset = 0;
        }

        element.style.webkitAnimation = '';
        element.style.webkitTransform = 'translate3d(' + [that.transformOffset.x + 'px', y + 'px', 0] + ')';
    }

    function panendHandler(e) {
        if (!that.enabled || !!that.isStopBounce) {
            return;
        }
    }

    function flickHandler(e) {
        if (!that.enabled || !!that.isStopBounce) {
            return;
        }
        that.cancelScrollEnd = true;
    
        var v0, a0, t0, s0;
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

            s1 = s0 + t0 * v0 / 2;
            var bounceOffset1 = getBoundaryOffset(that, s1);
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

                function quadratic2cubicBezier(a, b) {
                    return [[(a / 3 + (a + b) / 3 - a) / (b - a), (a * a / 3 + a * b * 2 / 3 - a * a) / (b * b - a * a)],
                        [(b / 3 + (a + b) / 3 - a) / (b - a), (b * b / 3 + a * b * 2 / 3 - a * a) / (b * b - a * a)]];
                }            

                if (!styleEl.parentNode) {
                    document.getElementsByTagName('head')[0].appendChild(styleEl);
                }
                var className = 'bounce-' + that.viewport.scrollId + '-' + Date.now();
            
                styleEl.innerHTML = '@-webkit-keyframes ' + className + ' {' + 
                    '0% {-webkit-transform:translateY(' + s0 +'px)}' + 
                    //第1段：摩擦力作用下惯性运动
                    (t1 / ft * 100).toFixed(1) + '% {-webkit-transform:translateY(' + s1.toFixed(0) + 'px);animation-timing-function:cubic-bezier(' + quadratic2cubicBezier(-t1-v1/a0/2, -t2-v1/a0/2) + ')}' + 
                    //第2段：弹力作用下继续惯性运动
                    ((t1 + t2) / ft * 100).toFixed(1) + '% {-webkit-transform:translateY(' + s2.toFixed(0) + 'px);animation-timing-function:cubic-bezier(' + quadratic2cubicBezier(-t2-v2/a2/2, 0) + ')}' + 
                    //第3段：弹回边缘
                    '100% { -webkit-transform:translateY(' + s1.toFixed(0) + 'px);animation-timing-function:ease}' + 
                '}';

                element.style.webkitAnimation = className + ' ' + (ft / 1000).toFixed(2) + 's';
                element.style.webkitTransform = 'translateY(' + s1.toFixed(0) + 'px)';
                element.addEventListener('webkitAnimationEnd', scrollEnd, false);
            } else {
                if (!styleEl.parentNode) {
                    document.getElementsByTagName('head')[0].appendChild(styleEl);
                }
                var className = 'bounce-' + that.viewport.scrollId + '-' + Date.now();

                styleEl.innerHTML = '@-webkit-keyframes ' + className + ' {' + 
                    '0% {-webkit-transform:translateY(' + s0.toFixed(0) + 'px)}' + 
                    '100% {-webkit-transform:translateY(' + s1.toFixed(0)+'px);animation-timing-function:cubic-bezier(' + quadratic2cubicBezier(-t0, 0) + ')}' + 
                '}';

                element.style.webkitAnimation = className + ' ' + (t0 / 1000).toFixed(2) + 's';
                element.style.webkitTransform = 'translateY(' + s1.toFixed(0) + 'px)';
                element.addEventListener('webkitAnimationEnd', scrollEnd, false);
            }

        }
    }

    function scrollEnd() {
        if (!that.enabled || !!that.isStopBounce) {
            return;
        }

        that.cancelScrollEnd = false;

        setTimeout(function() {
            if (!that.cancelScrollEnd) {
                element.style.webkitBackfaceVisibility = 'initial';
                element.style.webkitTransformStyle = 'flat';
                element.style.webkitTransition = '';
                fireEvent(that, 'scrollend');
            }
        }, 10);
    }
}

var proto = {
    enable: function() {
        this.enabled = true;

        if (prevented) {
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

    getScrollHeight: function(el) {
        return el.getBoundingClientRect().height - (el.bounceTop||0) - (el.bounceBottom||0);
    },

    getScrollTop: function(el) {
        var offset = getTransformOffset(el);
        return -(offset.y + (el.bounceTop||0));
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

    offset: function(el, child) {
        var elRect = el.getBoundingClientRect(),
            childRect = child.getBoundingClientRect(),
            offsetRect = {
                top: childRect.top - ((el.bounceTop || 0) + elRect.top),
                left: childRect.left - elRect.left,
                right: elRect.right - childRect.right,
                width: childRect.width,
                height: childRect.height
            };

        offsetRect.bottom = offsetRect.top + childRect.height;
        return offsetRect;
    },

    scrollTo: function(y) {
        var el = this.element;
        var x = getTransformOffset(this).x;
        y = -y - (this.options.bounceOffset.top || 0);

        y = touchBoundary(this, y);
        el.style.webkitAnimation = '';
        el.style.webkitTransform = 'translate3d(' + [x + 'px', y + 'px', 0] + ')';
    },

    scrollToElement: function(el, child) {
        var offset = this.offset(el, child);
        this.scrollTo(el, offset.top);
    },

    getViewHeight: function(el) {
        return el.parentNode.getBoundingClientRect().height;
    },

    getBoundaryOffset: function(el) {
        var y = getTransformOffset(el).y;
        return getBoundaryOffset(el, y);
    },

    stopBounce: function(el) {
        isStopBounce = true;

        var offset = getTransformOffset(el),
            minScrollTop = getMinScrollTop(el),
            maxScrollTop = getMaxScrollTop(el),
            y = null
            ;

        if (offset.y > minScrollTop + (el.bounceTop||0)) {
            y = minScrollTop + (el.bounceTop||0);
        } else if (offset.y < maxScrollTop - (el.bounceBottom||0)) {
            y = maxScrollTop - (el.bounceBottom||0);
        }

        if (y != null) {
            //anim.translate(el,
            //  '0.4s', 'ease-in-out', '0s',
            //  offset.x, y);
        }
    },

    resumeBounce: function(el) {
        isStopBounce = false;

        var offset = anim.getTransformOffset(el),
            minScrollTop = getMinScrollTop(el),
            maxScrollTop = getMaxScrollTop(el),
            y
            ;

        if (offset.y > minScrollTop) {
            y = minScrollTop;
        } else if (offset < maxScrollTop){
            y = maxScrollTop;
        }

        if (y != null) {
            //anim.translate(el,
            //  '0.4s', 'ease-in-out', '0s',
            //  offset.x, y);
        }
    }
}

for (var k in proto) {
    Scroll.prototype[k] = proto[k];
}

lib.scroll = function(el, options) {
    if (!el.parentElement) {
        throw new Error('wrong dom tree');
    }

    var scroll;
    if (el.parentElement.scrollId) {
        scroll = scrollObjs[el.parentElement.scrollId];
    } else {
        scroll = new Scroll(el, options);
    }
    
    scroll.enable();
    scroll.refresh();
    return scroll;
}

})(window, window['lib']||(window['lib']={}));