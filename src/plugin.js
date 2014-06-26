;(function(win, lib, undef) {
var doc = win.document;


lib.scroll.plugin('addFixedlement', function(scroller) {
    var options = scroller.options;
    var isAdded = false;

    scroller.addFixedElement = function() {
        if (isAdded) return;
        isAdded = true;

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
    }

    if (options.addFixedlement) {
        scroller.addFixedElement();
    }
});

lib.scroll.plugin('lazyload', function(scroller) {
    var options = scroller.options;

    scroller.checkLazyload = function(){
        var that = this;
        var elements = Array.prototype.slice.call(this.element.querySelectorAll('img[data-img]'))
                            .concat(Array.prototype.slice.call(this.element.querySelectorAll('img[dataimg]')));

        elements.filter(function(img){
            return that.isInView(img);
        }).forEach(function(img){
            img.src = img.getAttribute('data-img') || img.getAttribute('dataimg');
            img.removeAttribute('data-img');
            img.removeAttribute('dataimg');
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

        setTimeout(function(){
            scroller.checkLazyload();
        }, 50);
    }
});

lib.scroll.plugin('sticky', function(scroller) {
    var options = scroller.options;

    scroller.makeSticky = function(childEl){
        var that = this;
        if (!childEl) {
            Array.prototype.slice.call(this.element.querySelectorAll('.sticky')).forEach(function(el) {
                scroller.makeSticky(el);
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

    scroller.checkSticky = function(childEl, parentEl) {
        if(this.getRect(parentEl).top < 0 ) {
            this.topFixedElement.appendChild(childEl);
        } else if(this.getRect(parentEl).top > 0) {
            parentEl.appendChild(childEl);
        }
    }

    if (options.useSticky) {
        scroller.addFixedElement();
        scroller.makeSticky();
    }
});

})(window, window['lib']||(window['lib']={}));