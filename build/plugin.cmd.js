!function(a,b){function c(a){var b,c={x:0,y:0},d=getComputedStyle(a).webkitTransform;return"none"!==d&&(b=d.match(/^matrix3d\(\d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, ([-\d.]+), ([-\d.]+), [-\d.]+, \d+\)/)||d.match(/^matrix\(\d+, \d+, \d+, \d+, ([-\d.]+), ([-\d.]+)\)$/))&&(c.x=parseInt(b[1])||0,c.y=parseInt(b[2])||0),c}var d=a.document,e=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||function(a){setTimeout(a,16)}}();b.scroll.plugin("fixed",function(a,b){function c(a,b){"string"==typeof a?b.innerHTML=a:a instanceof HTMLElement&&b.appendChild(a)}this.options;getComputedStyle(this.viewport).position.match(/^relative|absolute$/)||(this.viewport.style.position="relative");var e=d.createDocumentFragment();if("y"===this.axis){var f=b.topOffset||0,g=b.bottomOffset||0,h=this.topFixedElement=d.createElement("div");h.className="top-fixed",h.style.cssText="z-index:9; position: absolute; top: "+f+"px; left: 0; width: 100%;";var i=this.bottomFixedElement=d.createElement("div");i.className="bottom-fxied",i.style.cssText="z-index:9; position: absolute; bottom: "+g+"px; left: 0; width: 100%",b.topElement&&c(b.topElement,h),b.bottomElement&&c(b.bottomElement,i),e.appendChild(h),e.appendChild(i)}else{var j=b.leftOffset||0,k=b.rightOffset||0,l=this.leftFixedElement=d.createElement("div");l.className="left-fixed",l.style.cssText="z-index:9; position: absolute; top: 0; left: "+j+"px; height: 100%;";var m=this.rightFixedElement=d.createElement("div");m.className="right-fxied",m.style.cssText="z-index:9; position: absolute; top: 0; right: "+k+"px; height: 100%;",b.leftElement&&c(b.leftElement,l),b.rightElement&&c(b.rightElement,m),e.appendChild(l),e.appendChild(m)}this.viewport.appendChild(e)}),b.scroll.plugin("lazyload",function(a,b){{var c=this;this.options}this.checkLazyload=function(){var a=Array.prototype.slice.call(this.element.querySelectorAll(".lazy"));a.filter(function(a){return c.isInView(a)}).forEach(function(a){if(b.onlazyload)b.onlazyload(a);else{var c=a;if("IMG"!==c.tagName.toUpperCase()&&(c=a.querySelector("img[data-src]")),c){var d=c.getAttribute("data-src");d&&(c.src=d,c.removeAttribute("data-src"))}else{var e=a.getAttribute("data-image");e&&(a.style.backgroundImage="url("+e+")",a.removeAttribute("data-image"))}}a.className=a.className.split(" ").filter(function(a){return"lazy"!==a}).join(" ")})},b.realTimeLoad?this.addScrollingHandler(function(){c.checkLazyload()}):this.addScrollendHandler(function(){c.checkLazyload()}),this.element.addEventListener("contentchange",function(){c.checkLazyload()}),e(function(){c.checkLazyload()})}),b.scroll.plugin("sticky",function(a,b){var c=this.options,e=(b.offset||0)+(c.padding.top||0),f=this.stickyWrapElement=d.createElement("div");f.className="stick-wrap",f.style.cssText="z-index:9; position: absolute; top: "+e+"px; left: 0; width: 100%;",this.viewport.appendChild(f),this.makeSticky=function(a){var b=this;if(a){if(a.className.indexOf("sticky-able")>=0)return;a.style.position="absolute",a.className=a.className.split(/\s+/).filter(function(a){return"sticky"!=a}).join(" ")+" sticky-able";var c=a.parentNode;this.addScrollingHandler(function(){b.checkSticky(a,c)}),this.addScrollendHandler(function(){b.checkSticky(a,c)})}else Array.prototype.slice.call(this.element.querySelectorAll(".sticky")).forEach(function(a){b.makeSticky(a)})},this.checkSticky=function(a,b){this.getRect(b).top<0?this.stickyWrapElement.appendChild(a):this.getRect(b).top>0&&b.appendChild(a)},this.makeSticky()}),b.scroll.plugin("refresh",function(a,b){function f(){j||(j=!0,g.disable(),e(function(){i.style.webkitTransition="-webkit-transform 0.4s ease 0",i.style.webkitTransform="translateY(0)",g.element.style.webkitTransition="-webkit-transform 0.4s ease 0",g.element.style.webkitTransform="translateY("+(g.minScrollOffset+b.height)+"px)"}),setTimeout(function(){b.onrefresh.call(g,function(){e(function(){i.style.webkitTransition="-webkit-transform 0.4s ease 0",i.style.webkitTransform="translateY(-"+b.height+"px)",g.scrollTo(0,!0),setTimeout(function(){i.style.webkitTransition="",i.style.webkitTransform="translateY(-"+b.height+"px)",g.enable(),g.refresh(),j=!1},400)})})},400))}var g=this,h=this.options;getComputedStyle(this.viewport).position.match(/^relative|absolute$/)||(this.viewport.style.position="relative"),b.height=b.height||0,b.offset=(b.offset||0)+(h.padding.top||0);var i=this.refreshElement=d.createElement("div");i.className="refresh",i.style.cssText=["position: absolute","top: "+b.offset+"px","left: 0","width: 100%","height: "+b.height+"px","-webkit-transform: translateY(-"+b.height+"px)"].join(";"),b.html||"string"==typeof b.element?i.innerHTML=b.html||b.element:b.element instanceof HTMLElement&&i.appendChild(b.element),this.viewport.appendChild(i);var j;this.addScrollingHandler(function(){if(!j){{var a=g.getScrollTop();c(i)}i.style.webkitTransform="translateY("+-(b.height+a)+"px)",0>a&&b.onpull&&b.onpull.call(g,-a)}}),this.element.addEventListener("pulldownend",function(){if(!j){var a=g.getBoundaryOffset();a>b.height&&f()}},!1)}),b.scroll.plugin("update",function(a,b){function c(){if(!i){if(i=!0,!b.onupdate)throw new Error('no "onupdate" Handler');b.onupdate.call(f,function(){e(function(){h.style.webkitTransition="",f.refresh(),h.style.webkitTransform="translateY("+(f.getMaxScrollTop()+b.height)+"px)",i=!1})})}}{var f=this,g=this.options;b.offset}getComputedStyle(this.viewport).position.match(/^relative|absolute$/)||(this.viewport.style.position="relative"),b.height=b.height||0,b.offset=(g.padding.bottom||0)-(b.offset||0);var h=this.updateElement=d.createElement("div");h.className="update",h.style.cssText=["position: absolute","bottom: "+b.offset+"px","left: 0","width: 100%","height: "+b.height+"px","-webkit-transform: translateY("+(f.getMaxScrollTop()+b.height)+"px)"].join(";"),"string"==typeof b.element?h.innerHTML=b.element:b.element instanceof HTMLElement&&h.appendChild(b.element),this.viewport.appendChild(h);var i;this.addScrollingHandler(function(){var a=f.getScrollTop(),d=f.getMaxScrollTop();h.style.webkitTransform="translateY("+(d+b.height-a)+"px)",i||(d-a<.2*b.height?c():b.onpull&&b.onpull.call(f))})})}(window,window.lib||(window.lib={}));
if (window.KISSY) {KISSY.add('mtb/lib-scroll/2.3.4/build/plugin.cmd',function() {return window.lib.scroll;},{requries:['mtb/lib-motion','mtb/lib-gesture']);} else if ('undefined' !== typeof define) {define('mtb/lib-scroll/2.3.4/build/plugin.cmd', [], function(){require('mtb/lib-motion');require('mtb/lib-gesture');return window.lib.scroll;});}