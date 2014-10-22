;(function(win, lib, undef) {
var doc = win.document;

function getTransformOffset(element) {
    var offset = {x: 0, y: 0}; 
    var transform = getComputedStyle(element).webkitTransform;
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

lib.scroll.plugin('force-repaint', function(name, pluginOptions) {
    var that = this;
    var scrollOptions = this.options;
    var forceRepaintElement = this.forceRepaintElement = doc.createElement('div');
    forceRepaintElement.className = 'force-repaint';
    forceRepaintElement.style.cssText = 'position: absolute; top: 0; left: 0; width: 0; height: 0; font-size: 0; opacity: 1; translateZ(0)';
    this.viewport.appendChild(forceRepaintElement);

    function forceRepaint() {
        forceRepaintElement.style.opacity = Math.abs(parseInt(forceRepaintElement.style.opacity) - 1) + '';
    }

    if (pluginOptions.whenScrolling) {
        this.addScrollingHandler(forceRepaint);
    } else if (typeof pluginOptions.timeout === 'number') {
        setTimeout(function() {
            if (that.isScrolling) {
                forceRepaint();
            }
            setTimeout(arguments.callee, pluginOptions.timeout);
        }, pluginOptions.timeout);
    } else {
        lib.animation.requestFrame(function(){
            if (that.isScrolling) {
                forceRepaint();
            }
            lib.animation.requestFrame(arguments.callee);
        });    
    }
    
});


lib.scroll.plugin('fixed', function(name, pluginOptions) {
    var scrollOptions = this.options;

    if (!getComputedStyle(this.viewport).position.match(/^relative|absolute$/)) {
        this.viewport.style.position = 'relative';
    }

    if (!getComputedStyle(this.element).position.match(/^relative|absolute$/)) {
        this.element.style.position = 'absolute';
    }

    var fragment = doc.createDocumentFragment();

    function setElement(fixedElement, wrapElement) {
        if (typeof fixedElement === 'string') {
            wrapElement.innerHTML = fixedElement;
        } else if (fixedElement instanceof HTMLElement){
            wrapElement.appendChild(fixedElement);
        }
    }

    if (this.axis === 'y') {
        var topOffset = pluginOptions.topOffset || 0;
        var bottomOffset = pluginOptions.bottomOffset || 0;

        var topFixedElement = this.topFixedElement = doc.createElement('div');
        topFixedElement.className = 'top-fixed';
        topFixedElement.style.cssText = 'z-index:9; position: absolute; top: ' + topOffset + 'px; left: 0; width: 100%; -webkit-transform: translateZ(9px);';

        var bottomFixedElement = this.bottomFixedElement = doc.createElement('div');
        bottomFixedElement.className = 'bottom-fxied';
        bottomFixedElement.style.cssText = 'z-index:9; position: absolute; bottom: ' + bottomOffset + 'px; left: 0; width: 100%; -webkit-transform: translateZ(9px);';

        if (pluginOptions.topElement) {
            setElement(pluginOptions.topElement, topFixedElement);
        }

        if (pluginOptions.bottomElement) {
            setElement(pluginOptions.bottomElement, bottomFixedElement);
        }

        fragment.appendChild(topFixedElement);
        fragment.appendChild(bottomFixedElement);
    } else {
        var leftOffset = pluginOptions.leftOffset || 0;
        var rightOffset = pluginOptions.rightOffset || 0;

        var leftFixedElement = this.leftFixedElement = doc.createElement('div');
        leftFixedElement.className = 'left-fixed';
        leftFixedElement.style.cssText = 'z-index:9; position: absolute; top: 0; left: ' + leftOffset + 'px; height: 100%; -webkit-transform: translateZ(9px);';

        var rightFixedElement = this.rightFixedElement = doc.createElement('div');
        rightFixedElement.className = 'right-fxied';
        rightFixedElement.style.cssText = 'z-index:9; position: absolute; top: 0; right: ' + rightOffset + 'px; height: 100%; -webkit-transform: translateZ(9px);';

        if (pluginOptions.leftElement) {
            setElement(pluginOptions.leftElement, leftFixedElement);
        }

        if (pluginOptions.rightElement) {
            setElement(pluginOptions.rightElement, rightFixedElement);
        }

        fragment.appendChild(leftFixedElement);
        fragment.appendChild(rightFixedElement);
    }

    this.viewport.appendChild(fragment);
});

lib.scroll.plugin('lazyload', function(name, pluginOptions) {
    var that = this;
    var scrollOptions = this.options;
    var limit = 4;
    var queue = [];
    var loading = {};
    var loaded = {};

    function load(url, callback) {
        if (loading[url]) {
            loading[url].push(callback);
        } else if (loaded[url]) {
            callback(url);
        } else {
            loading[url] = [callback];
            queue.push([url, callback]);
        }
    }

    lib.animation.requestFrame(function() {
        var len = Object.keys(loading).length;
        if (len <= limit && queue.length > 0) {
            var item = queue.shift();
            var url = item[0];
            var callback = item[1];
            var img = new Image();
            img.src = url;
            img.onload = img.onreadystatechange = function() {
                if (!loaded[url]) {
                    loaded[url] = true;
                    loading[url].forEach(function(cb) {
                        cb(url);
                    });
                    delete loading[url];
                }
            }
        }
        lib.animation.requestFrame(arguments.callee);
    });

    this.checkLazyload = function(){
        var elements = Array.prototype.slice.call(this.element.querySelectorAll('.lazy'));

        elements.filter(function(el){
            return that.isInView(el);
        }).forEach(function(el){
            var imglist;
            var bglist;

            if (el.tagName.toUpperCase() === 'IMG') {
                imglist = [el];
                bglist = [];
            } else {
                imglist = Array.prototype.slice.call(el.querySelectorAll('img[data-src]'));
                bglist = Array.prototype.slice.call(el.querySelectorAll('*[data-image]'));
                if (el.hasAttribute('data-image')) {
                    bglist.push(el);
                }
            }

            imglist.forEach(function(img) {
                var src = img.getAttribute('data-src');
                if (src) {
                    img.removeAttribute('data-src');
                    load(src, function() {
                        img.src = src;
                    });
                }
            });

            bglist.forEach(function(bg) {
                var image = bg.getAttribute('data-image');
                if (image) {
                    bg.removeAttribute('data-image');
                    load(image, function() {
                        bg.style.backgroundImage = 'url(' + image + ')';    
                    });
                }
            });

            pluginOptions.onlazyload && pluginOptions.onlazyload(el);

            el.className = el.className.split(' ').filter(function(c) {
                return c !== 'lazy';
            }).join(' ');
        });
    }

    if(pluginOptions.realTimeLoad) {
        this.enablePlugin('force-repaint');

        this.addScrollingHandler(function(){
            that.checkLazyload();
        });
    }

    this.addScrollendHandler(function(){
        that.checkLazyload();
    });

    this.element.addEventListener('contentrefresh', function() {
        that.checkLazyload();
    });

    lib.animation.requestFrame(function(){
        that.checkLazyload();
    });
});

lib.scroll.plugin('sticky', function(name, pluginOptions) {
    this.enablePlugin('force-repaint');
    
    var that = this;
    var scrollOptions = this.options;

    var top = (pluginOptions.offset || 0) + (scrollOptions.padding.top || 0);
    var stickyWrapElement = this.stickyWrapElement = doc.createElement('div');
    stickyWrapElement.className = 'stick-wrap';
    stickyWrapElement.style.cssText = 'z-index:9; position: absolute; top: ' + top + 'px; left: 0; width: 100%; -webkit-transform: translateZ(9px);';
    this.viewport.appendChild(stickyWrapElement)

    this.makeSticky = function(childEl){
        var that = this;
        if (!childEl) {
            Array.prototype.slice.call(this.element.querySelectorAll('.sticky')).forEach(function(el) {
                that.makeSticky(el);
            });
        } else {
            if (childEl.className.indexOf('sticky-able') >= 0) return;

            childEl.style.position = 'absolute';
            childEl.className = childEl.className.split(/\s+/).filter(function(c){ 
                return c != 'sticky';
            }).join(' ') + ' sticky-able';

            var parentEl = childEl.parentNode;

            this.addScrollingHandler(function(){
                that.checkSticky(childEl, parentEl);
            });

            this.addScrollendHandler(function() {
               that.checkSticky(childEl, parentEl); 
            });
        }
    }

    this.checkSticky = function(childEl, parentEl) {
        if(this.getRect(parentEl).top < top ) {
            this.stickyWrapElement.appendChild(childEl);
        } else if(this.getRect(parentEl).top > top) {
            parentEl.appendChild(childEl);
        }
    }

    this.makeSticky();
});

lib.scroll.plugin('refresh', function(name, pluginOptions) {
    var that = this;
    var scrollOptions = this.options;

    if (!getComputedStyle(this.viewport).position.match(/^relative|absolute$/)) {
        this.viewport.style.position = 'relative';
    }

    if (!getComputedStyle(this.element).position.match(/^relative|absolute$/)) {
        this.element.style.position = 'absolute';
    }

    pluginOptions.height = pluginOptions.height || 0;
    pluginOptions.offset = (pluginOptions.offset || 0) + (scrollOptions.padding.top || 0);

    var refreshElement = this.refreshElement = doc.createElement('div');
    refreshElement.className = 'refresh';
    refreshElement.style.cssText = ['position: absolute',
        'top: ' + pluginOptions.offset + 'px',
        'left: 0',
        'width: 100%',
        'height: ' + pluginOptions.height + 'px',
        '-webkit-transform: translateY(-' + pluginOptions.height + 'px) translateZ(9px)'
    ].join(';');
    
    if (pluginOptions.html || typeof pluginOptions.element === 'string') {
        refreshElement.innerHTML = pluginOptions.html || pluginOptions.element;
    } else if (pluginOptions.element instanceof HTMLElement) {
        refreshElement.appendChild(pluginOptions.element);
    }
    this.viewport.appendChild(refreshElement);

    var isRefresh;

    function refreshHandler() {
        if (!isRefresh) {
            isRefresh = true;
            that.disable();

            lib.animation.requestFrame(function() {
                refreshElement.style.webkitTransition = '-webkit-transform 0.4s ease 0';
                refreshElement.style.webkitTransform = 'translateY(0) translateZ(9px)';
                that.element.style.webkitTransition = '-webkit-transform 0.4s ease 0';
                that.element.style.webkitTransform = 'translateY(' + (that.minScrollOffset + pluginOptions.height) + 'px) translateZ(9px)';
            });

            setTimeout(function() {
                pluginOptions.onrefresh.call(that, function() {
                    lib.animation.requestFrame(function(){
                        refreshElement.style.webkitTransition = '-webkit-transform 0.4s ease 0';
                        refreshElement.style.webkitTransform = 'translateY(-' + pluginOptions.height + 'px) translateZ(9px)';
                        that.scrollTo(0, true);
                        setTimeout(function() {
                            refreshElement.style.webkitTransition = '';
                            refreshElement.style.webkitTransform = 'translateY(-' + pluginOptions.height + 'px) translateZ(9px)';
                            that.enable();
                            that.refresh();
                            isRefresh = false;
                        }, 400);
                    });
                });
            }, 400);
        }
    }

    this.addScrollingHandler(function(e) {
        if (isRefresh) return;

        var top = that.getScrollTop();
        var transformOffset = getTransformOffset(refreshElement);
        refreshElement.style.webkitTransform = 'translateY(' + -(pluginOptions.height + top) + 'px) translateZ(9px)';

        if (top < 0) {
            if (refreshElement.style.display === 'none') {
                refreshElement.style.display = '';
            }
            pluginOptions.onpull && pluginOptions.onpull.call(that, -top);
        } else {
            if (refreshElement.style.display === '') {
                refreshElement.style.display = 'none';
            }
        }
    });

    this.element.addEventListener('pulldownend', function(e) {
        if (isRefresh) return;

        var offset = that.getBoundaryOffset();
        if (offset > pluginOptions.height) {
            refreshHandler();
        }
    }, false);
});

lib.scroll.plugin('update', function(name, pluginOptions) {
    var that = this;
    var scrollOptions = this.options;
    var offset = pluginOptions.offset;

    if (!getComputedStyle(this.viewport).position.match(/^relative|absolute$/)) {
        this.viewport.style.position = 'relative';
    }

    if (!getComputedStyle(this.element).position.match(/^relative|absolute$/)) {
        this.element.style.position = 'absolute';
    }

    pluginOptions.height = pluginOptions.height || 0;
    pluginOptions.offset = (scrollOptions.padding.bottom || 0) - (pluginOptions.offset || 0);

    var updateElement = this.updateElement = doc.createElement('div');
    updateElement.className = 'update';
    updateElement.style.cssText = ['position: absolute',
        'bottom: ' + (pluginOptions.offset) + 'px',
        'left: 0',
        'width: 100%',
        'height: ' + pluginOptions.height + 'px',
        '-webkit-transform: translateY(' + (that.getMaxScrollTop() + pluginOptions.height) + 'px) translateZ(9px)'
    ].join(';');    

    if (typeof pluginOptions.element === 'string') {
        updateElement.innerHTML = pluginOptions.element;
    } else if (pluginOptions.element instanceof HTMLElement) {
        updateElement.appendChild(pluginOptions.element);
    }
    this.viewport.appendChild(updateElement);

    var isUpdating;
    function updateHandler() {
        if (!isUpdating) {
            isUpdating = true;

            if (pluginOptions.onupdate) {
                pluginOptions.onupdate.call(that, function() {
                    lib.animation.requestFrame(function(){
                        updateElement.style.webkitTransition = '';
                        that.refresh();
                        updateElement.style.webkitTransform = 'translateY(' + (that.getMaxScrollTop() + pluginOptions.height) + 'px) translateZ(9px)';
                        isUpdating = false;
                    });
                });
            } else {
                throw new Error('no "onupdate" Handler');
            }
        }
    }

    this.addScrollingHandler(function(e) {
        var top = that.getScrollTop();
        var maxTop = that.getMaxScrollTop();
        updateElement.style.webkitTransform = 'translateY(' + (maxTop + pluginOptions.height - top) + 'px) translateZ(9px)';

        if (isUpdating) return;

        if (top > maxTop) {
            if (updateElement.style.display === 'none') {
                updateElement.style.display = '';
            }
        } else {
            if (updateElement.style.display === '') {
                updateElement.style.display = 'none';
            }
        }

        if (maxTop - top < pluginOptions.height * 0.2) {
            updateHandler();
        } else {
            if (pluginOptions.onpull) {
                pluginOptions.onpull.call(that);
            }
        }
    });
});


})(window, window['lib']||(window['lib']={}));