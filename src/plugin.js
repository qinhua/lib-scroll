;(function(win, lib, undef) {
var doc = win.document;

var requestAnimationFrame = (function() {
    return  window.requestAnimationFrame || 
                window.webkitRequestAnimationFrame || 
            function(cb) {
                setTimeout(cb, 16);
            }
})();

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


lib.scroll.plugin('fixed', function(name, pluginOptions) {
    var scrollOptions = this.options;

    if (!getComputedStyle(this.viewport).position.match(/^relative|absolute$/)) {
        this.viewport.style.position = 'relative';
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
        topFixedElement.style.cssText = 'z-index:9; position: absolute; top: ' + topOffset + 'px; left: 0; width: 100%;';

        var bottomFixedElement = this.bottomFixedElement = doc.createElement('div');
        bottomFixedElement.className = 'bottom-fxied';
        bottomFixedElement.style.cssText = 'z-index:9; position: absolute; bottom: ' + bottomOffset + 'px; left: 0; width: 100%';

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
        leftFixedElement.style.cssText = 'z-index:9; position: absolute; top: 0; left: ' + leftOffset + 'px; height: 100%;';

        var rightFixedElement = this.rightFixedElement = doc.createElement('div');
        rightFixedElement.className = 'right-fxied';
        rightFixedElement.style.cssText = 'z-index:9; position: absolute; top: 0; right: ' + rightOffset + 'px; height: 100%;';

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

    this.checkLazyload = function(){
        var elements = Array.prototype.slice.call(this.element.querySelectorAll('.lazy'));

        elements.filter(function(el){
            return that.isInView(el);
        }).forEach(function(el){
            if (pluginOptions.onLazyLoad) {
                pluginOptions.onLazyLoad(el);
            } else {
                var img = el;
                if (img.tagName.toUpperCase() !== 'IMG') {
                    img = el.querySelector('img[data-src]');
                }

                if (img) {
                    var src = img.getAttribute('data-src');
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                }

                el.className = el.className.split(' ').map(function(c) {
                    return c !== 'lazy';
                }).join(' ');
            }
        });
    }

    if(pluginOptions.realTimeLoad) {
        this.addScrollingHandler(function(){
            that.checkLazyload();
        });
    } else {
        this.addScrollendHandler(function(){
            that.checkLazyload();
        });
    }

    this.element.addEventListener('refresh', function() {
        that.checkLazyload();
    });

    requestAnimationFrame(function(){
        that.checkLazyload();
    });
});

lib.scroll.plugin('sticky', function(name, pluginOptions) {
    var that = this;
    var scrollOptions = this.options;

    var top = (pluginOptions.offset || 0) + (scrollOptions.padding.top || 0);
    var stickyWrapElement = this.stickyWrapElement = doc.createElement('div');
    stickyWrapElement.className = 'stick-wrap';
    stickyWrapElement.style.cssText = 'z-index:9; position: absolute; top: ' + top + 'px; left: 0; width: 100%;';
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
        if(this.getRect(parentEl).top < 0 ) {
            this.stickyWrapElement.appendChild(childEl);
        } else if(this.getRect(parentEl).top > 0) {
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

    pluginOptions.height = pluginOptions.height || 0;
    pluginOptions.offset = (pluginOptions.offset || 0) + (scrollOptions.padding.top || 0);

    var refreshElement = this.refreshElement = doc.createElement('div');
    refreshElement.className = 'refresh';
    refreshElement.style.cssText = ['position: absolute',
        'top: ' + pluginOptions.offset + 'px',
        'left: 0',
        'width: 100%',
        'height: ' + pluginOptions.height + 'px',
        '-webkit-transform: translateY(-' + pluginOptions.height + 'px)'
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

            requestAnimationFrame(function() {
                refreshElement.style.webkitTransition = '-webkit-transform 0.4s ease 0';
                refreshElement.style.webkitTransform = 'translateY(0)';
                that.element.style.webkitTransition = '-webkit-transform 0.4s ease 0';
                that.element.style.webkitTransform = 'translateY(' + (that.minScrollOffset + pluginOptions.height) + 'px)';
            });

            setTimeout(function() {
                pluginOptions.onrefresh.call(that, function() {
                    requestAnimationFrame(function(){
                        refreshElement.style.webkitTransition = '-webkit-transform 0.4s ease 0';
                        refreshElement.style.webkitTransform = 'translateY(-' + pluginOptions.height + 'px)';
                        that.scrollTo(0, true);
                        setTimeout(function() {
                            refreshElement.style.webkitTransition = '';
                            refreshElement.style.webkitTransform = 'translateY(-' + pluginOptions.height + 'px)';
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
        refreshElement.style.webkitTransform = 'translateY(' + -(pluginOptions.height + top) + 'px)';
        if (top < 0 && pluginOptions.onpull) {
            pluginOptions.onpull.call(that, refreshElement, -top);
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

    pluginOptions.height = pluginOptions.height || 0;
    pluginOptions.offset = (scrollOptions.padding.bottom || 0) - (pluginOptions.offset || 0);

    var updateElement = this.updateElement = doc.createElement('div');
    updateElement.className = 'update';
    updateElement.style.cssText = ['position: absolute',
        'bottom: ' + (pluginOptions.offset) + 'px',
        'left: 0',
        'width: 100%',
        'height: ' + pluginOptions.height + 'px',
        '-webkit-transform: translateY(' + (that.getMaxScrollTop() + pluginOptions.height) + 'px)'
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
                    requestAnimationFrame(function(){
                        updateElement.style.webkitTransition = '';
                        that.refresh();
                        updateElement.style.webkitTransform = 'translateY(' + (that.getMaxScrollTop() + pluginOptions.height) + 'px)';
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
        updateElement.style.webkitTransform = 'translateY(' + (maxTop + pluginOptions.height - top) + 'px)';

        if (isUpdating) return;

        if ((top - maxTop) > pluginOptions.height * 0.2) {
            updateHandler();
        } else {
            if (pluginOptions.onpull) {
                pluginOptions.onpull.call(that, updateElement);
            }
        }
    });
});


})(window, window['lib']||(window['lib']={}));