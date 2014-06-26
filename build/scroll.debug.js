;(function(win, lib, undef) {
var doc = win.document;
var motion = lib.motion;
var scrollObjs = {};
var plugins = {};
var inertiaCoefficient = {
    'normal': [2, 0.0015],
    'slow': [1.5, 0.003],
    'veryslow': [1.5, 0.005]
}

function debugLog() {
    if (lib.scroll.outputDebugLog) {
        console.debug.apply(console, arguments);
    }
}

function getMinScrollOffset(scrollObj) {
    return 0 - (scrollObj.options[scrollObj.axis + 'Padding1'] || 0);
}

function getMaxScrollOffset(scrollObj) {
    var rect = scrollObj.element.getBoundingClientRect();
    var pRect = scrollObj.viewport.getBoundingClientRect();
    var min = getMinScrollOffset(scrollObj);
    if (scrollObj.axis === 'y') {
        var max = 0 - rect.height + pRect.height;
    } else {
        var max = 0 - rect.width + pRect.width;
    }
    return Math.min(max + (scrollObj.options[scrollObj.axis + 'Padding2'] || 0), min);
}

function getBoundaryOffset(scrollObj, offset) {
    if(offset > scrollObj.minScrollOffset) {
        return offset - scrollObj.minScrollOffset;
    } else if (offset < scrollObj.maxScrollOffset){
        return offset - scrollObj.maxScrollOffset;
    }
}

function touchBoundary(scrollObj, offset) {
    if (offset > scrollObj.minScrollOffset) {
        offset = scrollObj.minScrollOffset;
    } else if (offset < scrollObj.maxScrollOffset) {
        offset = scrollObj.maxScrollOffset;
    }
    return offset;
}

function fireEvent(scrollObj, eventName, extra) {
    debugLog(eventName, extra);

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

var requestAnimationFrame = (function() {
    return  window.requestAnimationFrame || 
                window.webkitRequestAnimationFrame || 
            function(cb) {
                setTimeout(cb, 16);
            }
})();

var panning = false;
doc.addEventListener('touchmove', function(e){
    if (panning) {
        e.preventDefault();
        return false;
    }
    return true;
}, false);

function Scroll(element, options){
    var that = this;

    options = options || {};
    options.noBounce = !!options.noBounce;

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
        options.yPadding1 = -options.padding.top || 0;
        options.yPadding2 = -options.padding.bottom || 0;
        options.xPadding1 = -options.padding.left || 0;
        options.xPadding2 = -options.padding.right || 0;
    }

    options.direction = options.direction || 'y';
    options.inertia = options.inertia || 'normal';


    this.options = options;
    that.axis = options.direction;
    this.element = element;
    this.viewport = element.parentNode;
    this.plugins = {};

    this.viewport.addEventListener('touchstart', touchstartHandler, false);
    this.viewport.addEventListener('touchend', touchendHandler, false);
    this.viewport.addEventListener('touchcancel', touchendHandler, false);
    this.viewport.addEventListener('panstart', panstartHandler, false);
    this.viewport.addEventListener('pan', panHandler, false);
    this.viewport.addEventListener('panend', panendHandler, false);
    this.viewport.addEventListener('flick', flickHandler, false);

    this.element.scrollId = setTimeout(function(){
        scrollObjs[that.element.scrollId + ''] = that;
    }, 1);

    if (options.isPrevent) {
        var d = this.axis === 'y'?'vertical':'horizontal';
        this.viewport.addEventListener(d + 'panstart', function(e) {
            panning = true;
        }, false);
        that.viewport.addEventListener('panend', function(e){  
            panning = false;
        }, false);
    }

    if (options.isFixScrollendClick) {
        var preventScrollendClick;
        this.viewport.addEventListener('touchstart', function() {
            if (that.isScrolling) {
                preventScrollendClick = true;
            }
        }, false);

        this.viewport.addEventListener('scrollend', function() {
            setTimeout(function(e){
                preventScrollendClick = false;
            }, 400);
        }, false);

        function preventScrollendClickHandler(e) {
            e.preventScrollendClick = preventScrollendClick;
            if (preventScrollendClick) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            } else {
                return true;
            }
        }

        this.viewport.addEventListener('click', preventScrollendClickHandler, false);
        this.viewport.addEventListener('tap', preventScrollendClickHandler, false);
    }

    var webkitTransitionEndHandler;
    var transitionEndTimeoutId = 0;
    function setTransitionEndHandler(h, t) {
        webkitTransitionEndHandler = null;
        clearTimeout(transitionEndTimeoutId);
        
        transitionEndTimeoutId = setTimeout(function() {
            if (webkitTransitionEndHandler) {
                webkitTransitionEndHandler = null;
                requestAnimationFrame(h);
            }
        }, (t || 400));

        webkitTransitionEndHandler = h;   
    }

    element.addEventListener('webkitTransitionEnd', function(e) {
        if (webkitTransitionEndHandler) {
            var handler = webkitTransitionEndHandler;

            webkitTransitionEndHandler = null;
            clearTimeout(transitionEndTimeoutId);

            requestAnimationFrame(function(){
                handler(e);
            });
        }
    }, false);

    var cancelScrollEnd;
    function touchstartHandler(e) {
        if (!that.enabled) {
            return;
        }

        if (that.isScrolling) {
            scrollEnd();
        }

        element.style.webkitBackfaceVisibility = 'hidden';
        element.style.webkitTransformStyle = 'preserve-3d';
        element.style.webkitTransform = getComputedStyle(element).webkitTransform;
        element.style.webkitTransition = '';
        webkitTransitionEndHandler = null;
        clearTimeout(transitionEndTimeoutId);
    }

    function touchendHandler(e) {
        if (!that.enabled) {
            return;
        }

        var s0 = getTransformOffset(that)[that.axis];
        var boundaryOffset = getBoundaryOffset(that, s0);
        if (element.style.webkitTransition === '' && boundaryOffset) {
            var s1 = touchBoundary(that, s0);
            if (boundaryOffset > 0) {
                fireEvent(that, that.axis === 'y'?'pulldownend':'pullrightend');
            } else if (boundaryOffset < 0) {
                fireEvent(that, that.axis === 'y'?'pullupend':'pullleftend');
            }
            element.style.webkitTransition = '-webkit-transform 0.4s ease 0';
            element.style.webkitTransform = 'translate' + that.axis.toUpperCase() + '(' + s1.toFixed(0) + 'px)';
            setTransitionEndHandler(scrollEnd, 400);
        } else if (that.isScrolling) {
            scrollEnd();
        }
    }

    var lastDisplacement;
    function panstartHandler(e) {
        if (!that.enabled) {
            return;
        }

        if (that.axis === 'y' && e.isVertical || that.axis === 'x' && !e.isVertical) {
            e.stopPropagation();    
        }
        
        that.transformOffset = getTransformOffset(that);
        that.minScrollOffset = getMinScrollOffset(that);
        that.maxScrollOffset = getMaxScrollOffset(that);
        that.panFixRatio = 2.5;
        cancelScrollEnd = true;
        that.isScrolling = true;
        fireEvent(that, 'scrollstart');

        lastDisplacement = e['displacement' + that.axis.toUpperCase()];
    }


    function panHandler(e) {
        if (!that.enabled) {
            return;
        }

        var displacement = e['displacement' + that.axis.toUpperCase()];

        if (Math.abs(displacement - lastDisplacement) < 5) return;
        lastDisplacement = displacement;

        if (that.axis === 'y' && e.isVertical || that.axis === 'x' && !e.isVertical) {
            e.stopPropagation();    
        } else {
            return;
        }

        var offset = that.transformOffset[that.axis] + displacement;

        if(offset > that.minScrollOffset) {
            offset = that.minScrollOffset + (offset - that.minScrollOffset) / that.panFixRatio;
            that.panFixRatio *= 1.003;
        } else if(offset < that.maxScrollOffset) {
            offset = that.maxScrollOffset - (that.maxScrollOffset - offset) / that.panFixRatio;
            that.panFixRatio *= 1.003;
        }
        if (that.panFixRatio > 4) {
            that.panFixRatio = 4;
        }

        var boundaryOffset = getBoundaryOffset(that, offset);
        if (boundaryOffset) {
            fireEvent(that, boundaryOffset > 0?(that.axis === 'y'?'pulldown':'pullright'):(that.axis === 'y'?'pullup':'pullleft'), {
                boundaryOffset: Math.abs(boundaryOffset)
            });
            if (that.options.noBounce) {
                offset = touchBoundary(that, offset);
            }
        }

        element.style.webkitTransition = '';
        if (that.axis === 'y') {
            element.style.webkitTransform = getTranslate(that.transformOffset.x, offset);  
        } else {
            element.style.webkitTransform = getTranslate(offset, that.transformOffset.y);
        }

        if (that.fireScrollingEvent) {
            fireEvent(that, 'scrolling');
        }
    }

    function panendHandler(e) {
        if (!that.enabled) {
            return;
        }

        if (that.axis === 'y' && e.isVertical || that.axis === 'x' && !e.isVertical) {
            e.stopPropagation();    
        }
    }

    function flickHandler(e) {
        if (!that.enabled) {
            return;
        }

        if (that.axis === 'y' && e.isVertical || that.axis === 'x' && !e.isVertical) {
            e.stopPropagation();    
        } else {
            return;
        }

        cancelScrollEnd = true;
    
        var v0, a0, t0, s0, s, motion0;
        var v1, a1, t1, s1, motion1,sign;
        var v2, a2, t2, s2, motion2, ft;
        
        s0 = getTransformOffset(that)[that.axis];
        var boundaryOffset0 = getBoundaryOffset(that, s0);
        if(!boundaryOffset0) {
            //手指离开屏幕时，已经超出滚动范围，不作处理，让touchend handler处理
            //手指离开屏幕时，在滚动范围内，做一下惯性计算
            v0 = e['velocity' + that.axis.toUpperCase()];

            var maxV = 2;
            var friction = 0.0015;
            if (options.inertia && inertiaCoefficient[options.inertia]) {
                maxV = inertiaCoefficient[options.inertia][0];
                friction = inertiaCoefficient[options.inertia][1];
            }

            if (v0 > maxV) {
                v0 = maxV;
            }
            if (v0 < -maxV) {
                v0 = -maxV;
            }
            a0 = friction * ( v0 / Math.abs(v0));
            motion0 = motion({
                v: v0,
                a: -a0
            });
            t0 = motion0.t;
            s = s0 + motion0.s;

            var boundaryOffset1 = getBoundaryOffset(that, s);
            if (boundaryOffset1) {
                debugLog('惯性计算超出了边缘', boundaryOffset1);

                if (options.noBounce) {
                    // 没有边缘回弹效果，直接平顺滑到边缘
                    debugLog('没有回弹效果');

                    s1 = touchBoundary(that, s);
                    element.style.webkitTransition = '-webkit-transform 0.4s ease-out 0';
                    element.style.webkitTransform = 'translate' + that.axis.toUpperCase() + '(' + s1.toFixed(0) + 'px)';
                    setTransitionEndHandler(scrollEnd, 400);
                } else {
                    //惯性运动足够滑出屏幕边缘
                    v1 = v0;
                    a1 = a0;
                    if(boundaryOffset1 > 0) {
                        s1 = that.minScrollOffset;
                        sign = 1;
                    } else {
                        s1 = that.maxScrollOffset;
                        sign = -1;
                    }
                    motion1 = motion({
                        v: sign * v1, 
                        a: - sign * a1, 
                        s: Math.abs(s1 - s0)
                    });
                    t1 = motion1.t;

                    v2 = v1 - a1 * t1;
                    a2 = 0.03 * (v2 / Math.abs(v2));
                    motion2 = motion({
                        v: v2,
                        a: -a2
                    });
                    t2 = motion2.t;
                    s2 = s1 + motion2.s;

                    element.style.webkitTransition = '-webkit-transform ' + ((t1 + t2) / 1000).toFixed(2) + 's ease-out 0';                
                    element.style.webkitTransform = 'translate' + that.axis.toUpperCase() + '(' + s2.toFixed(0) + 'px)';

                    debugLog('惯性滚动', 's=' + s2.toFixed(0), 't=' + ((t1 + t2) / 1000).toFixed(2));

                    setTransitionEndHandler(function(e) {
                        if (!that.enabled) {
                            return;
                        }

                        element.style.webkitTransition = '-webkit-transform 0.4s ease 0';
                        element.style.webkitTransform = 'translate' + that.axis.toUpperCase() + '(' + s1.toFixed(0) + 'px)';

                        debugLog('惯性回弹', 's=' + s1.toFixed(0), 't=400');
                        setTransitionEndHandler(scrollEnd, 400);
                    }, ((t1 + t2) / 1000).toFixed(2) * 1000);
                }
            } else {
                debugLog('惯性计算没有超出了边缘');

                var timeFunction = motion0.generateCubicBezier();
                element.style.webkitTransition = '-webkit-transform ' + (t0 / 1000).toFixed(2) + 's cubic-bezier(' + timeFunction + ') 0';
                element.style.webkitTransform = 'translate' + that.axis.toUpperCase() + '(' + s.toFixed(0) + 'px)';
                setTransitionEndHandler(scrollEnd, (t0 / 1000).toFixed(2) * 1000);
            }


            if (that.fireScrollingEvent) {
                requestAnimationFrame(function() {
                    if (that.isScrolling && that.enabled) {
                        fireEvent(that, 'scrolling', {
                            afterFlick: true
                        });
                        requestAnimationFrame(arguments.callee);
                    }
                });
            }
        }
    }

    function scrollEnd(e) {
        if (!that.enabled) {
            return;
        }

        cancelScrollEnd = false;

        setTimeout(function() {
            if (!cancelScrollEnd && that.enabled) {
                that.isScrolling = false;
                element.style.webkitTransition = '';
                fireEvent(that, 'scrollend');
            }
        }, 50);
    }


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
            var el = this.element;
            this.enabled = false;
            that.isScrolling = false;

            requestAnimationFrame(function() {
                el.style.webkitTransform = getComputedStyle(el).webkitTransform;
            });

            return this;
        },

        getScrollWidth: function() {
            return this.element.getBoundingClientRect().width - (this.options.xPadding1||0) - (this.options.xPadding2||0);
        },

        getScrollHeight: function() {
            return this.element.getBoundingClientRect().height - (this.options.yPadding1||0) - (this.options.yPadding2||0);
        },

        getScrollLeft: function() {
            return -getTransformOffset(this).x - (this.options.xPadding1 || 0);
        },

        getScrollTop: function() {
            return -getTransformOffset(this).y - (this.options.yPadding1 || 0);
        },

        getBoundaryOffset: function() {
            return Math.abs(getBoundaryOffset(this, getTransformOffset(this)[this.axis]) || 0);
        },

        refresh: function() {
            var el = this.element;

            if (this.axis === 'y') {
                var firstEl = el.firstElementChild;
                if (firstEl) {
                    el.style.height = 'auto';
                    while (firstEl && !firstEl.getBoundingClientRect().height) {
                        firstEl = firstEl.nextElementSibling;
                    }
                    var lastEl = el.lastElementChild;
                    while (lastEl && !lastEl.getBoundingClientRect().height) {
                        lastEl = lastEl.previousElementSibling;
                    }
                    el.style.height = (this.options.height ||
                        ((lastEl && lastEl.getBoundingClientRect().bottom || 0) -
                            (firstEl && firstEl.getBoundingClientRect().top || 0))) + 'px';
                } else {
                    el.style.height = el.getBoundingClientRect().height;
                }

            } else {
                var firstEl = el.firstElementChild;
                if (firstEl) {
                    el.style.width = 'auto';
                    while (firstEl && !firstEl.getBoundingClientRect().width) {
                        firstEl = firstEl.nextElementSibling;
                    }
                    var lastEl = el.lastElementChild;
                    while (lastEl && !lastEl.getBoundingClientRect().width) {
                        lastEl = lastEl.previousElementSibling;
                    }
                    el.style.width = (this.options.width ||
                        ((lastEl && lastEl.getBoundingClientRect().right || 0) -
                            (firstEl && firstEl.getBoundingClientRect().left || 0))) + 'px';
                } else {
                    el.style.width = el.getBoundingClientRect().width;
                }
            }

            this.transformOffset = getTransformOffset(this);
            this.minScrollOffset = getMinScrollOffset(this);
            this.maxScrollOffset = getMaxScrollOffset(this);
            this.scrollTo(-this.transformOffset[this.axis] - (this.options[this.axis + 'Padding1'] || 0));

            fireEvent(this, 'refresh');

            return this;
        },

        offset: function(childEl) {
            var elRect = this.element.getBoundingClientRect();
            var childRect = childEl.getBoundingClientRect();
            if (this.axis === 'y') {
                var offsetRect = {
                        top: childRect.top - ((this.options.yPadding1 || 0) + elRect.top),
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
                        left: childRect.left - ((this.options.xPadding1 || 0) + elRect.left),
                        width: childRect.width,
                        height: childRect.height
                    };

                offsetRect.right = offsetRect.left + offsetRect.width;
            }
            return offsetRect;
        },

        getRect: function(childEl) {
            var viewRect = this.viewport.getBoundingClientRect();
            var childRect = childEl.getBoundingClientRect();
            if (this.axis === 'y') {
                var offsetRect = {
                        top: childRect.top - ((this.options.yPadding1 || 0) + viewRect.top),
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
                        left: childRect.left - ((this.options.xPadding1 || 0) + viewRect.left),
                        width: childRect.width,
                        height: childRect.height
                    };

                offsetRect.right = offsetRect.left + offsetRect.width;
            }
            return offsetRect;
        },

        isInView: function(childEl) {
            var viewRect = this.viewport.getBoundingClientRect();
            var childRect = this.getRect(childEl);
            if (this.axis === 'y') {
                return viewRect.top < childRect.bottom && viewRect.bottom > childRect.top;
            } else {
                return viewRect.left < childRect.right && viewRect.right > childRect.left;
            }
        },

        scrollTo: function(offset, isSmooth) {
            var that = this;
            var element = this.element;

            offset = -offset - (this.options[this.axis + 'Padding1'] || 0);
            offset = touchBoundary(this, offset);

            if (isSmooth === true) {
                element.style.webkitTransition = '-webkit-transform 0.4s ease 0';
                setTransitionEndHandler(scrollEnd, 400);
            } else {
                element.style.webkitTransition = '';
            }
            if (this.axis === 'y') {
                element.style.webkitTransform = getTranslate(getTransformOffset(this).x, offset);
            } else {
                element.style.webkitTransform = getTranslate(offset, getTransformOffset(this).y);
            }

            return this;
        },

        scrollToElement: function(childEl, isSmooth) {
            var offset = this.offset(childEl);
            return this.scrollTo(this.axis === 'y'?offset.top:offset.left, isSmooth);
        },

        getViewWidth: function() {
            return this.viewport.getBoundingClientRect().width;
        },

        getViewHeight: function() {
            return this.viewport.getBoundingClientRect().height;
        },

        addPulldownHandler: function(handler) {
            var that = this;
            this.element.addEventListener('pulldownend', function(e) {
                that.disable();
                handler(e, function() {
                    that.scrollTo(0, true);
                    that.enable();
                });
            }, false);

            return this;
        },

        addPullupHandler: function(handler) {
            var that = this;

            this.element.addEventListener('pullupend', function(e) {
                that.disable();
                handler(e, function() {
                    that.scrollTo(that.getScrollHeight(), true);
                    that.enable();
                });
            }, false);

            return this;
        },

        addScrollstartHandler: function(handler) {
            this.element.addEventListener('scrollstart', function(e){
                handler(e);
            }, false);

            return this;
        },

        addScrollingHandler: function(handler) {
            if (!this.fireScrollingEvent) {
                this.fireScrollingEvent = true;
                var forceRefreshEl = doc.createElement('div');
                forceRefreshEl.className = 'force-refresh';
                forceRefreshEl.style.cssText = 'position: absolute; top: 0; left: 0; width: 0; height: 0; font-size: 0; opacity: 1;';
                this.viewport.appendChild(forceRefreshEl);

                this.element.addEventListener('scrolling', function(e) {
                    forceRefreshEl.style.opacity = Math.abs(parseInt(forceRefreshEl.style.opacity) - 1) + '';
                }, false);
            }
            
            this.element.addEventListener('scrolling', function(e){
                handler(e);
            }, false);

            return this;
        },

        addScrollendHandler: function(handler) {
            this.element.addEventListener('scrollend', function(e){
                handler(e);
            }, false);

            return this;
        },

        enablePlugin: function(name, options) {
            var plugin = plugins[name];
            if (plugin && !this.plugins[name]) {
                options = options || {};
                this.plugins[name] = plugin.apply(this, [name, options]);
            }
            return this;
        }
    }

    for (var k in proto) {
        this[k] = proto[k];
    }
    delete proto;
}

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
        scroll = new Scroll(el, options);
    }
    return scroll;
}

lib.scroll.plugin = function(name, constructor) {
    if (constructor) {
        name = name.split(',');
        name.forEach(function(n) {
            plugins[n] = constructor;
        });
    } else {
        return plugins[name];
    }
}

})(window, window['lib']||(window['lib']={}));