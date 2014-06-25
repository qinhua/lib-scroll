;(function(win, lib, undef) {
var doc = win.document;
var docEl = doc.documentElement;
var motion = lib.motion;
var prevented = false;
var scrollObjs = {};
var plugins = {};

function getMinScrollOffset(scrollObj) {
    return 0 - (scrollObj.options[scrollObj.axis + 'Padding1'] || 0);
}

function getMaxScrollOffset(scrollObj) {
    var rect = scrollObj.element.getBoundingClientRect();
    var pRect = scrollObj.element.parentNode.getBoundingClientRect();
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

var panning = false;
document.addEventListener('touchmove', function(e){
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

    if (options.padding) {
        options.yPadding1 = -options.padding.top || 0;
        options.yPadding2 = -options.padding.bottom || 0;
        options.xPadding1 = -options.padding.left || 0;
        options.xPadding2 = -options.padding.right || 0;
    }
    if (options.bounceOffset) {
        options.yPadding1 = options.bounceOffset.top || 0;
        options.yPadding2 = options.bounceOffset.bottom || 0;
        options.xPadding1 = options.bounceOffset.left || 0;
        options.xPadding2 = options.bounceOffset.right || 0;
    }


    this.options = options;
    that.axis = options.direction || 'y';
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

    if (options.isPrevent) {
        var d = this.axis === 'y'?'vertical':'horizontal';
        this.viewport.addEventListener(d + 'panstart', function(e) {
            panning = true;
        }, false);
        that.viewport.addEventListener('panend', function(e){  
            panning = false;
        }, false);
    }

    for (var name in plugins) {
        plugins[name].init(this);
    }

    var webkitTransitionEndHandler;
    function setTransitionEndHandler(h, t) {
        webkitTransitionEndHandler = h;
        setTimeout(function() {
            if (webkitTransitionEndHandler) {
                webkitTransitionEndHandler = null;
                h();
            }
        }, t || 400);
    }

    element.addEventListener('webkitTransitionEnd', function(e) {
        if (webkitTransitionEndHandler) {
            var handler = webkitTransitionEndHandler;
            webkitTransitionEndHandler = null;
            handler(e); 
        }
    }, false);

    var cancelScrollEnd;
    function touchstartHandler(e) {
        if (!that.enabled) {
            return;
        }

        element.style.webkitBackfaceVisibility = 'hidden';
        element.style.webkitTransformStyle = 'preserve-3d';
        element.style.webkitTransform = getComputedStyle(element).webkitTransform;
        element.style.webkitTransition = '';
        webkitTransitionEndHandler = null;
        that.isScrolling = false;
    }

    function touchendHandler(e) {
        if (!that.enabled) {
            return;
        }

        var s0 = getTransformOffset(that)[that.axis];
        var isBounce = !!options.bounceOffset;
        var boundaryOffset = getBoundaryOffset(that, s0);
        var p1 = that.options[that.axis + 'Padding1'];
        var p2 = that.options[that.axis + 'Padding2'];
        if(element.style.webkitTransition === '' && element.style.webkitAnimation === '' && boundaryOffset) {
            var s1;
            if (isBounce && boundaryOffset > 0 && p1 && boundaryOffset > p1 / 2) {
                s1 = that.minScrollOffset + p1;
                setTransitionEndHandler(function() {
                    fireEvent(that, that.axis === 'y'?'pulldownend':'pullrightend');
                });
            } else if (isBounce && boundaryOffset < 0 && p2 && Math.abs(boundaryOffset) > p2 / 2) {
                s1 = that.maxScrollOffset - p2;
                setTransitionEndHandler(function() {
                    fireEvent(that, that.axis === 'y'?'pullupend':'pullleftend');
                });
            } else {
                s1 = touchBoundary(that, s0);
                setTransitionEndHandler(scrollEnd);
            }
            element.style.webkitTransition = '-webkit-transform 0.4s ease 0';
            element.style.webkitTransform = 'translate' + that.axis.toUpperCase() + '(' + s1.toFixed(0) + 'px)';
        } else if (that.isScrolling) {
            scrollEnd();
        }
    }

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
        cancelScrollEnd = false;
        that.isScrolling = true;
        fireEvent(that, 'scrollstart');
    }

    function panHandler(e) {
        if (!that.enabled) {
            return;
        }

        if (that.axis === 'y' && e.isVertical || that.axis === 'x' && !e.isVertical) {
            e.stopPropagation();    
        } else {
            return;
        }

        var offset = that.transformOffset[that.axis] + e['displacement' + that.axis.toUpperCase()];

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

        element.style.webkitAnimation = '';
        element.style.webkitTransition = '';
        if (that.axis === 'y') {
            element.style.webkitTransform = getTranslate(that.transformOffset.x, offset);  
        } else {
            element.style.webkitTransform = getTranslate(offset, that.transformOffset.y);
        }

        if (this.fireScrollingEvent) {
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
            //手指离开屏幕时，已经超出滚动范围
            //不作处理，让touchend handler处理
            //手指离开屏幕时，在滚动范围内，做一下惯性计算
            v0 = e['velocity' + that.axis.toUpperCase()];
            if (v0 > 2) {
                v0 = 2;
            }
            if (v0 < -2) {
                v0 = -2;
            }
            a0 = 0.0015 * ( v0 / Math.abs(v0));
            motion0 = motion({
                v: v0,
                a: -a0
            });
            t0 = motion0.t;
            s = s0 + motion0.s;

            var boundaryOffset1 = getBoundaryOffset(that, s);
            if (boundaryOffset1) {
                if (options.noBounce) {
                    // 没有边缘回弹效果，直接平顺滑到边缘
                    s1 = touchBoundary(that, s);
                    element.style.webkitTransition = '-webkit-transform 0.4s ease-out 0';
                    element.style.webkitTransform = 'translate' + that.axis.toUpperCase() + '(' + s1.toFixed(0) + 'px)';
                    setTransitionEndHandler(scrollEnd);
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
                    setTransitionEndHandler(function(e) {
                        element.style.webkitTransition = '-webkit-transform 0.4s ease 0';
                        element.style.webkitTransform = 'translate' + that.axis.toUpperCase() + '(' + s1.toFixed(0) + 'px)';
                        setTransitionEndHandler(scrollEnd);
                    });
                }
            } else {
                var timeFunction = motion0.generateCubicBezier();

                element.style.webkitTransition = '-webkit-transform ' + (t0 / 1000).toFixed(2) + 's cubic-bezier(' + timeFunction + ') 0';
                element.style.webkitTransform = 'translate' + that.axis.toUpperCase() + '(' + s.toFixed(0) + 'px)';
                setTransitionEndHandler(scrollEnd);
            }


            if (this.fireScrollingEvent) {
                setTimeout(function() {
                    if (that.isScrolling) {
                        fireEvent('scrolling');
                        setTimeout(arguments.callee, 25);
                    }
                }, 25);
            }
        }
    }

    function scrollEnd(e) {
        if (!that.enabled) {
            return;
        }

        if (that.axis === 'y' && e && e.isVertical || that.axis === 'x' && e && !e.isVertical) {
            e.stopPropagation();    
        }

        cancelScrollEnd = false;

        setTimeout(function() {
            if (!cancelScrollEnd) {
                that.isScrolling = false;
                element.style.webkitTransition = '';
                element.style.webkitAnimation = '';
                fireEvent(that, 'scrollend');
            }
        }, 10);
    }
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

        setTimeout(function() {
            el.style.webkitTransform = getComputedStyle(el).webkitTransform;
            el.style.webkitAnimation = '';
        }, 50);

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
        var childRect = childEl.getBoundingClientRect();
        if (this.axis === 'y') {
            return viewRect.top < childRect.bottom && viewRect.bottom > childRect.top;
        } else {
            return viewRect.left < childRect.right && viewRect.right > childRect.left;
        }
    },

    scrollTo: function(offset, isSmooth) {
        var element = this.element;

        offset = -offset - (this.options[this.axis + 'Padding1'] || 0);
        offset = touchBoundary(this, offset);

        if (isSmooth === true) {
            element.style.webkitTransition = '-webkit-transform 0.4s ease 0';
            setTransitionEndHandler(function(){
                element.style.webkitTransition = '';
                element.style.webkitAnimation = '';
            });
        } else {
            element.style.webkitTransition = '';
            element.style.webkitAnimation = '';
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
        var element = this.element;

        element.addEventListener('pulldownend', function(e) {
            that.disable();
            handler(e, function() {
                that.enable();
            });
        }, false);
    },

    addPullupHandler: function(handler) {
        var that = this;
        var element = this.element;

        element.addEventListener('pullupend', function(e) {
            that.disable();
            handler(e, function() {
                that.enable();
            });
        }, false);
    },

    addScrollingHandler: function(handler) {
        this.firstScrollingEvent = true;
        this.element.addEventListener('scrolling', function(e){
            handler(e);
        }, false);
    },

    addScrollendHandler: function(handler) {
        this.element.addEventListener('scrollend', function(e){
            handler(e);
        }, false);
    }
}

for (var k in proto) {
    Scroll.prototype[k] = proto[k];
}

lib.scroll = function(el, options) {
    if (!el.parentNode) {
        throw new Error('wrong dom tree');
    }
    if (options && options.direction && ['x', 'y'].indexOf(options.direction) < 0) {
        throw new Error('wrong direction');
    }

    var scroll;
    if (el.parentNode.scrollId) {
        scroll = scrollObjs[el.parentNode.scrollId];
    } else {
        scroll = new Scroll(el, options);
    }
    return scroll;
}

lib.scroll.plugin = function(name, plugin) {
    if (plugin) {
        if (typeof plugin === 'function') {
            plugin = {
                init: plugin
            }
        }
        plugins[name] = plugin;
    } else {
        return plugins[name];
    }
}

lib.scroll.plugin('lazyload', function(scroller) {
    var options = scroller.options;

    scroller.checkLazyload = function(){
        var that = this;

        Array.prototype.slice.call(this.element.querySelectorAll('img.lazy')).filter(function(img){
            return that.isInView(img);
        }).forEach(function(img){
            img.src = img.getAttribute('dataimg');
            img.removeAttribute('dataimg');
            img.className = img.className.split(/\s+/).filter(function(c){ 
                return c != 'lazy';
            }).join(' ');
        });
    }

    if (options.useLazyload) {
        if(options.realtimeLazyload) {
            scroller.addScrollingHandler(function(){
                scroller.checkLazyload();
            });
        } else {
            scroller.addScrollendHandler(function(){
                scroller.checkLazyload();
            });
        }
    }
});

lib.scroll.plugin('sticky', function(scroller) {
    var options = scroller.options;


    scroller.makeSticky =  function(childEl){
        var that = this;
        if (!childEl) {
            Array.prototype.slice.call(this.element.querySelectorAll('.sticky')).forEach(function(el) {
                scroller.makeSticky(el);
            });
        } else {
            if (childEl.className.indexOf('sticky-able') >= 0) return;
            childEl.className = childEl.className.split(/\s+/).filter(function(c){ 
                return c != 'sticky';
            }).join(' ') + ' sticky-able';

            var parentEl = childEl.parentNode;
            that.addScrollingHandler(function(){
                if((parentEl === childEl.parentNode) && that.getRect(parentEl).top < 0 ) {
                    that.element.parentNode.appendChild(childEl);
                    childEl.style.position = 'absolute';
                    childEl.style.top = '0';
                } else if((parentEl !== childEl.parentNode) && that.getRect(parentEl).top > 0) {
                    parentEl.appendChild(childEl);
                    childEl.style.position = '';
                    childEl.style.top = '';
                }
            });
        }
    }

    if (options.useSticky) {
        scroller.makeSticky();
    }
});



})(window, window['lib']||(window['lib']={}));