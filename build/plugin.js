!function(a,b){function c(a){var b,c={x:0,y:0},d=getComputedStyle(a).webkitTransform;return"none"!==d&&(b=d.match(/^matrix3d\(\d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, ([-\d.]+), ([-\d.]+), [-\d.]+, \d+\)/)||d.match(/^matrix\(\d+, \d+, \d+, \d+, ([-\d.]+), ([-\d.]+)\)$/))&&(c.x=parseInt(b[1])||0,c.y=parseInt(b[2])||0),c}var d=a.document,e=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||function(a){setTimeout(a,16)}}();b.scroll.plugin("addFixedElement",function(a,b){this.options;getComputedStyle(this.viewport).position.match(/^relative|absolute$/)||(this.viewport.style.position="relative");var c=b.topOffset;c=null==c?this.element.getBoundingClientRect().top-this.viewport.getBoundingClientRect().top:0;var e=b.bottomOffset||0,f=d.createDocumentFragment();if("y"===this.axis){var g=this.topFixedElement=d.createElement("div");g.className="top-fixed",g.style.cssText="position: absolute; top: "+c+"px; left: 0; width: 100%;";var h=this.bottomFixedElement=d.createElement("div");h.className="bottom-fxied",h.style.cssText="position: absolute; bottom: "+e+"px; left: 0; width: 100%",f.appendChild(g),f.appendChild(h)}else{var i=this.leftFixedElement=d.createElement("div");i.className="left-fixed",i.style.cssText="position: absolute; top: 0; left: 0; height: 100%;";var j=this.rightFixedElement=d.createElement("div");j.className="right-fxied",j.style.cssText="position: absolute; top: 0; right: 0; height: 100%;",f.appendChild(i),f.appendChild(j)}this.viewport.appendChild(f)}),b.scroll.plugin("lazyload",function(a,b){{var c=this;this.options}this.checkLazyload=function(){var a=Array.prototype.slice.call(this.element.querySelectorAll(".lazy"));a.filter(function(a){return c.isInView(a)}).forEach(function(a){if(b.onLazyLoad)b.onLazyLoad(a);else{var c=a;if("IMG"!==c.tagName.toUpperCase()&&(c=a.querySelector("img[data-src]")),c){var d=c.getAttribute("data-src");d&&(c.src=d,c.removeAttribute("data-src"))}a.className=a.className.split(" ").map(function(a){return"lazy"!==a}).join(" ")}})},b.realTimeLoad?this.addScrollingHandler(function(){c.checkLazyload()}):this.addScrollendHandler(function(){c.checkLazyload()}),this.element.addEventListener("refresh",function(){c.checkLazyload()}),e(function(){c.checkLazyload()})}),b.scroll.plugin("sticky",function(){this.options;this.enablePlugin("addFixedElement"),this.makeSticky=function(a){var b=this;if(a){if(a.className.indexOf("sticky-able")>=0)return;a.style.position="absolute",a.className=a.className.split(/\s+/).filter(function(a){return"sticky"!=a}).join(" ")+" sticky-able";var c=a.parentNode;this.addScrollingHandler(function(){b.checkSticky(a,c)}),this.addScrollendHandler(function(){b.checkSticky(a,c)})}else Array.prototype.slice.call(this.element.querySelectorAll(".sticky")).forEach(function(a){b.makeSticky(a)})},this.checkSticky=function(a,b){this.getRect(b).top<0?this.topFixedElement.appendChild(a):this.getRect(b).top>0&&b.appendChild(a)},this.makeSticky()}),b.scroll.plugin("refresh",function(a,b){function f(){j||(j=!0,g.disable(),e(function(){i.style.webkitTransition="-webkit-transform 0.4s ease 0",i.style.webkitTransform="translateY(0)",g.element.style.webkitTransition="-webkit-transform 0.4s ease 0",g.element.style.webkitTransform="translateY("+(g.minScrollOffset+b.height)+"px)"}),setTimeout(function(){b.onrefresh.call(g,i,function(){e(function(){i.style.webkitTransition="-webkit-transform 0.4s ease 0",i.style.webkitTransform="translateY(-"+b.height+"px)",g.scrollTo(0,!0),setTimeout(function(){i.style.webkitTransition="",i.style.webkitTransform="translateY(-"+b.height+"px)",g.enable(),g.refresh(),j=!1},400)})})},400))}var g=this,h=this.options;getComputedStyle(this.viewport).position.match(/^relative|absolute$/)||(this.viewport.style.position="relative"),b.offset=b.offset||h.padding.top||0,b.height=b.height||Math.round(.05*this.viewport.getBoundingClientRect().height);var i=d.createElement("div");i.className="refresh",i.style.cssText=["position: absolute","top: "+b.offset+"px","left: 0","width: 100%","height: "+b.height+"px","-webkit-transform: translateY(-"+b.height+"px)"].join(";"),b.html||"string"==typeof b.element?i.innerHTML=b.html||b.element:b.element instanceof HTMLElement&&i.appendChild(b.element),this.viewport.appendChild(i);var j;this.addScrollingHandler(function(){if(!j){{var a=g.getScrollTop();c(i)}i.style.webkitTransform="translateY("+-(b.height+a)+"px)",0>a&&b.onpull&&b.onpull.call(g,i,-a)}}),this.element.addEventListener("pulldownend",function(){if(!j){var a=g.getBoundaryOffset();a>b.height&&f()}},!1)}),b.scroll.plugin("update",function(a,b){function c(){if(!i){if(i=!0,!b.onupdate)throw new Error('no "onupdate" Handler');b.onupdate.call(f,h,function(){e(function(){h.style.webkitTransition="",f.refresh(),h.style.webkitTransform="translateY("+(f.getMaxScrollTop()+b.height)+"px)",i=!1})})}}{var f=this,g=this.options;b.offset}getComputedStyle(this.viewport).position.match(/^relative|absolute$/)||(this.viewport.style.position="relative"),b.height=b.height||Math.round(.05*this.viewport.getBoundingClientRect().height),b.offset=b.offset||g.padding.bottom||0;var h=d.createElement("div");h.className="update",h.style.cssText=["position: absolute","bottom: "+b.offset+"px","left: 0","width: 100%","height: "+b.height+"px","-webkit-transform: translateY("+(f.getMaxScrollTop()+b.height)+"px)"].join(";"),"string"==typeof b.element?h.innerHTML=b.element:b.element instanceof HTMLElement&&h.appendChild(b.element),this.viewport.appendChild(h);var i;this.addScrollingHandler(function(){var a=f.getScrollTop(),d=f.getMaxScrollTop();h.style.webkitTransform="translateY("+(d+b.height-a)+"px)",i||(a-d>.5*b.height?c():b.onpull&&b.onpull.call(f,h))})})}(window,window.lib||(window.lib={}));