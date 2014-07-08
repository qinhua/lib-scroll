;(function(win, lib, undef) {
var doc = win.document;

var requestAnimationFrame = (function() {
    return  window.requestAnimationFrame || 
                window.webkitRequestAnimationFrame || 
            function(cb) {
                setTimeout(cb, 16);
            }
})();


lib.scroll.plugin('addFixedElement', function(name, pluginOptions) {
    var scrollOptions = this.options;

    if (!getComputedStyle(this.viewport).position.match(/^relative|absolute$/)) {
        this.viewport.style.position = 'relative';
    }

    var fragment = doc.createDocumentFragment();

    if (this.axis === 'y') {
        var topFixedElement = this.topFixedElement = doc.createElement('div');
        topFixedElement.className = 'top-fixed';
        topFixedElement.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%;';

        var bottomFixedElement = this.bottomFixedElement = doc.createElement('div');
        bottomFixedElement.className = 'bottom-fxied';
        bottomFixedElement.style.cssText = 'position: absolute; bottom: 0; left: 0; width: 100%';

        fragment.appendChild(topFixedElement);
        fragment.appendChild(bottomFixedElement);
    } else {
        var leftFixedElement = this.leftFixedElement = doc.createElement('div');
        leftFixedElement.className = 'left-fixed';
        leftFixedElement.style.cssText = 'position: absolute; top: 0; left: 0; height: 100%;';

        var rightFixedElement = this.rightFixedElement = doc.createElement('div');
        rightFixedElement.className = 'right-fxied';
        rightFixedElement.style.cssText = 'position: absolute; top: 0; right: 0; height: 100%;';

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

    this.enablePlugin('addFixedElement');

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
            this.topFixedElement.appendChild(childEl);
        } else if(this.getRect(parentEl).top > 0) {
            parentEl.appendChild(childEl);
        }
    }

    this.makeSticky();
});

lib.scroll.plugin('update', function(name, pluginOptions) {
    var that = this;
    var scrollOptions = this.options;
    var offset = pluginOptions.offset;


    var updateElement = doc.createElement('div');
    updateElement.className = 'update';
    updateElement.style.cssText = 'position: absolute; bottom: ' + (offset || 0) + 'px; left: 0; width: 100%;';

    pluginOptions.height = pluginOptions.height || this.viewport.getBoundingClientRect().height * 0.05;
    updateElement.style.webkitTransform = 'translateY(' + pluginOptions.height + 'px)';
    updateElement.style.height = pluginOptions.height;

    var isDefaultHTML = false;
    if (typeof pluginOptions.element === 'string') {
        updateElement.innerHTML = pluginOptions.element;
    } else if (pluginOptions.element instanceof HTMLElement) {
        updateElement.appendChild(pluginOptions.element);
    } else {
        var normalText = '上拉即可加载';
        var alterText = '加载中...';
        isDefaultHTML = true;
        updateElement.style.backgroundColor = '#FFF';
        updateElement.innerHTML = '<div style="height:' + pluginOptions.height + ';line-height:' + pluginOptions.height + ';text-align:center;"><span>' + normalText + '</span></div>';
    }

    this.viewport.appendChild(updateElement);

    var isUpdating;
    function updateHandler() {
        if (!isUpdating) {
            var height = updateElement.getBoundingClientRect().height;
            isUpdating = true;

            that.disable();

            if (isDefaultHTML) {
                updateElement.querySelector('span').innerHTML = alterText;
            }

            requestAnimationFrame(function() {
                updateElement.style.webkitTransition = '-webkit-transform 0.4s ease 0';
                updateElement.style.webkitTransform = 'translateY(0)';
                that.element.style.webkitTransition = '-webkit-transform 0.4s ease 0';
                that.element.style.webkitTransform = 'translateY(' + (that.maxScrollOffset - height) + 'px)';
            });

            setTimeout(function(){
                if (pluginOptions.onupdate) {
                    pluginOptions.onupdate.call(that, updateElement, function() {
                        requestAnimationFrame(function(){
                            updateElement.style.webkitTransition = '';
                            updateElement.style.webkitTransform = 'translateY(' + height + 'px)';
                            if (isDefaultHTML) {
                                updateElement.querySelector('span').innerHTML = normalText;
                            }
                            that.enable();
                            that.refresh();
                            isUpdating = false;
                        });
                    });
                } else {
                    throw new Error('no "onupdate" Handler');
                }
            }, 400);
        }
    }


    this.addScrollingHandler(function(e) {
        if (!e.afterFlick) return;
        if (isUpdating) return;

        var top = that.getScrollTop();
        if (top < 0) return;

        var offset = that.getBoundaryOffset();    
        var height = updateElement.getBoundingClientRect().height;
        updateElement.style.webkitTransform = 'translateY(' + (height - offset) + 'px)';

        if (offset > height * 0.5) {
            updateHandler();
        } else {
            if (pluginOptions.onpull) {
                pluginOptions.onpull.call(that, updateElement);
            }
        }
    });

    this.element.addEventListener('pullup', function(){
        if (isUpdating) return;

        var offset = that.getBoundaryOffset();
        var height = updateElement.getBoundingClientRect().height;
        updateElement.style.webkitTransform = 'translateY(' + (height - offset) + 'px)';
        if (pluginOptions.onpull) {
            pluginOptions.onpull.call(that, updateElement);
        }
    }, false);

    this.element.addEventListener('pullupend', function() {
        if (isUpdating) return;

        var offset = that.getBoundaryOffset();    
        var height = updateElement.getBoundingClientRect().height;
        
        if (offset > height) {
            updateHandler();
        } else {
            updateElement.style.webkitTransition = '-webkit-transform 0.4s ease 0';
            updateElement.style.webkitTransform = 'translateY(' + height + 'px)';
            setTimeout(function() {
                updateElement.style.webkitTransition = '';
                updateElement.style.webkitTransform = 'translateY(' + height + 'px)';
                if (isDefaultHTML) {
                    updateElement.querySelector('span').innerHTML = normalText;
                }
            }, 400);
        }
    }, false);
});

lib.scroll.plugin('refresh', function(name, pluginOptions) {
    var that = this;
    var scrollOptions = this.options;

    var offset = pluginOptions.offset;
    if (offset == null) {
        offset = this.element.getBoundingClientRect().top - this.viewport.getBoundingClientRect().top
    }

    var refreshElement = doc.createElement('div');
    refreshElement.className = 'refresh';
    refreshElement.style.cssText = 'position: absolute; top: ' + (offset || 0) + 'px; left: 0; width: 100%;';

    pluginOptions.height = pluginOptions.height || this.viewport.getBoundingClientRect().height * 0.05;
    refreshElement.style.webkitTransform = 'translateY(-' + pluginOptions.height + 'px)';
    refreshElement.style.height = pluginOptions.height;

    var isDefaultHTML = false;
    if (typeof pluginOptions.element === 'string') {
        refreshElement.innerHTML = pluginOptions.element;
    } else if (pluginOptions.element instanceof HTMLElement) {
        refreshElement.appendChild(pluginOptions.element);
    } else {
        var normalText = '下拉即可刷新';
        var alterText = '刷新中...';
        isDefaultHTML = true;
        refreshElement.style.backgroundColor = '#FFF';
        refreshElement.innerHTML = '<div style="height:' + pluginOptions.height + ';line-height:' + pluginOptions.height + ';text-align:center;"><span>' + normalText + '</span></div>';
    }

    this.viewport.appendChild(refreshElement);

    var isRefresh;


    function refreshHandler() {
        if (!isRefresh) {
            isRefresh = true;
            that.disable();
            var height = refreshElement.getBoundingClientRect().height;

            if (isDefaultHTML) {
                refreshElement.querySelector('span').innerHTML = alterText;
            }

            requestAnimationFrame(function() {
                refreshElement.style.webkitTransition = '-webkit-transform 0.4s ease 0';
                refreshElement.style.webkitTransform = 'translateY(0)';
                that.element.style.webkitTransition = '-webkit-transform 0.4s ease 0';
                that.element.style.webkitTransform = 'translateY(' + -(that.minScrollOffset - height) + 'px)';
            });

            setTimeout(function() {
                pluginOptions.onrefresh.call(that, refreshElement, function() {
                    requestAnimationFrame(function(){
                        refreshElement.style.webkitTransition = '-webkit-transform 0.4s ease 0';
                        refreshElement.style.webkitTransform = 'translateY(-' + height + 'px)';
                        that.scrollTo(0, true);
                        setTimeout(function() {
                            refreshElement.style.webkitTransition = '';
                            refreshElement.style.webkitTransform = 'translateY(-' + height + 'px)';
                            if (isDefaultHTML) {
                                refreshElement.querySelector('span').innerHTML = normalText;
                            }
                            that.enable();
                            that.refresh();
                            isRefresh = false;
                        }, 400);
                    });
                });
            }, 400);
        }
    }

    this.element.addEventListener('pulldown', function(e){
        if (isRefresh) return;

        var offset = that.getBoundaryOffset();
        var height = refreshElement.getBoundingClientRect().height;
        refreshElement.style.webkitTransform = 'translateY(' + -(height - offset) + 'px)';
        if (pluginOptions.onpull) {
            pluginOptions.onpull.call(that, refreshElement);
        }
    }, false);

    this.element.addEventListener('pulldownend', function(e) {
        if (isRefresh) return;

        var offset = that.getBoundaryOffset();
        var height = refreshElement.getBoundingClientRect().height;

        if (offset > height) {
            refreshHandler();
        } else {
            refreshElement.style.webkitTransition = '-webkit-transform 0.4s ease 0';
            refreshElement.style.webkitTransform = 'translateY(-' + height + 'px)';
            setTimeout(function() {
                refreshElement.style.webkitTransition = '';
                refreshElement.style.webkitTransform = 'translateY(-' + height + 'px)';
                if (isDefaultHTML) {
                    refreshElement.querySelector('span').innerHTML = normalText;
                }
            }, 400);
        }
    }, false);
});

})(window, window['lib']||(window['lib']={}));