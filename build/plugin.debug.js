;(function(win, lib, undef) {
var doc = win.document;


lib.scroll.plugin('addFixedElement', function() {
    var options = this.options;

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

lib.scroll.plugin('lazyload', function() {
    var that = this;
    var options = this.options;

    this.checkLazyload = function(){
        var elements = Array.prototype.slice.call(this.element.querySelectorAll('.lazy'));

        elements.filter(function(el){
            return that.isInView(el);
        }).forEach(function(el){
            if (options.onLazyLoad) {
                options.onLazyLoad(el);
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

    if(options.onScrollingLoad) {
        this.addScrollingHandler(function(){
            that.checkLazyload();
        });
    } else {
        this.addScrollendHandler(function(){
            that.checkLazyload();
        });
    }

    setTimeout(function(){
        that.checkLazyload();
    }, 50);
});

lib.scroll.plugin('sticky', function() {
    var that = this;
    var options = this.options;

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

lib.scroll.plugin('refresh', function() {
    var options = this.options;
});

})(window, window['lib']||(window['lib']={}));