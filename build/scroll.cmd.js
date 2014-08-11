!function(a,b){function c(){b.scroll.outputDebugLog&&console.debug.apply(console,arguments)}function d(a){var b=a.getBoundingClientRect();if(!b){b={},b.width=a.offsetWidth,b.height=a.offsetHeight,b.left=a.offsetLeft,b.top=a.offsetTop;for(var c=a.offsetParent;c;)b.left+=c.offsetLeft,b.top+=c.offsetTop,c=c.offsetParent;b.right=b.left+b.width,b.bottom=b.top+b.height}return b}function e(a){return 0-a.options[a.axis+"Padding1"]}function f(a){var b=d(a.element),c=d(a.viewport),f=e(a);if("y"===a.axis)var g=0-b.height+c.height;else var g=0-b.width+c.width;return Math.min(g+a.options[a.axis+"Padding2"],f)}function g(a,b){return b>a.minScrollOffset?b-a.minScrollOffset:b<a.maxScrollOffset?b-a.maxScrollOffset:void 0}function h(a,b){return b>a.minScrollOffset?b=a.minScrollOffset:b<a.maxScrollOffset&&(b=a.maxScrollOffset),b}function i(a,b,d){c(a.element.scrollId,b,d);var e=m.createEvent("HTMLEvents");if(e.initEvent(b,!1,!0),e.scrollObj=a,d)for(var f in d)e[f]=d[f];a.element.dispatchEvent(e)}function j(a){var b,c={x:0,y:0},d=getComputedStyle(a.element).webkitTransform;return"none"!==d&&(b=d.match(/^matrix3d\(\d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, ([-\d.]+), ([-\d.]+), [-\d.]+, \d+\)/)||d.match(/^matrix\(\d+, \d+, \d+, \d+, ([-\d.]+), ([-\d.]+)\)$/))&&(c.x=parseInt(b[1])||0,c.y=parseInt(b[2])||0),c}function k(a,b){return r?"translate3d("+a+"px, "+b+"px, 0)":"translate("+a+"px, "+b+"px)"}function l(a,b){function l(a){return a.preventScrollendClick=D,D?(a.preventDefault(),a.stopPropagation(),!1):!0}function r(a,b){E=null,clearTimeout(F),F=setTimeout(function(){E&&(E=null,s(a))},b||400),E=a}function u(){B.enabled&&(B.isScrolling&&A(),a.style.webkitBackfaceVisibility="hidden",a.style.webkitTransformStyle="preserve-3d",a.style.webkitTransform=getComputedStyle(a).webkitTransform,a.style.webkitTransition="",E=null,clearTimeout(F))}function v(){if(B.enabled){var b=j(B)[B.axis],c=g(B,b);if(""===a.style.webkitTransition&&c){var d=h(B,b);c>0?i(B,"y"===B.axis?"pulldownend":"pullrightend"):0>c&&i(B,"y"===B.axis?"pullupend":"pullleftend"),a.style.webkitTransition="-webkit-transform 0.4s ease 0",a.style.webkitTransform="translate"+B.axis.toUpperCase()+"("+d.toFixed(0)+"px)",r(A,400),B.fireScrollingEvent&&s(function(){B.isScrolling&&B.enabled&&(i(B,"scrolling"),s(arguments.callee))})}else B.isScrolling&&A()}}function w(a){B.enabled&&("y"!==B.axis&&a.isVertical||"x"===B.axis&&a.isVertical||(B.transformOffset=j(B),B.minScrollOffset=e(B),B.maxScrollOffset=f(B),B.panFixRatio=2.5,G=!0,B.isScrolling=!0,i(B,"scrollstart"),H=a["displacement"+B.axis.toUpperCase()]))}function x(b){if(B.enabled&&("y"===B.axis&&b.isVertical||"x"===B.axis&&!b.isVertical)){b.stopPropagation();var c=b["displacement"+B.axis.toUpperCase()];if(Math.abs(c-H)<5)return b.stopPropagation(),void 0;H=c;var d=B.transformOffset[B.axis]+c;d>B.minScrollOffset?(d=B.minScrollOffset+(d-B.minScrollOffset)/B.panFixRatio,B.panFixRatio*=1.003):d<B.maxScrollOffset&&(d=B.maxScrollOffset-(B.maxScrollOffset-d)/B.panFixRatio,B.panFixRatio*=1.003),B.panFixRatio>4&&(B.panFixRatio=4);var e=g(B,d);e&&(i(B,e>0?"y"===B.axis?"pulldown":"pullright":"y"===B.axis?"pullup":"pullleft",{boundaryOffset:Math.abs(e)}),B.options.noBounce&&(d=h(B,d))),a.style.webkitTransition="",a.style.webkitTransform="y"===B.axis?k(B.transformOffset.x,d):k(d,B.transformOffset.y),B.fireScrollingEvent&&i(B,"scrolling")}}function y(a){B.enabled&&("y"!==B.axis&&a.isVertical||"x"===B.axis&&a.isVertical)}function z(d){if(B.enabled&&("y"===B.axis&&d.isVertical||"x"===B.axis&&!d.isVertical)){d.stopPropagation(),G=!0;var e,f,k,l,m,o,p,t,u,v,w,x,y,z,C,D,E;l=j(B)[B.axis];var F=g(B,l);if(!F){e=d["velocity"+B.axis.toUpperCase()];var H=2,I=.0015;b.inertia&&q[b.inertia]&&(H=q[b.inertia][0],I=q[b.inertia][1]),e>H&&(e=H),-H>e&&(e=-H),f=I*(e/Math.abs(e)),o=n({v:e,a:-f}),k=o.t,m=l+o.s;var J=g(B,m);if(J)c("惯性计算超出了边缘",J),b.noBounce?(c("没有回弹效果"),v=h(B,m),l!==v?(a.style.webkitTransition="-webkit-transform 0.4s ease-out 0",a.style.webkitTransform="translate"+B.axis.toUpperCase()+"("+v.toFixed(0)+"px)",r(A,400)):A()):(p=e,t=f,J>0?(v=B.minScrollOffset,x=1):(v=B.maxScrollOffset,x=-1),w=n({v:x*p,a:-x*t,s:Math.abs(v-l)}),u=w.t,y=p-t*u,z=.03*(y/Math.abs(y)),E=n({v:y,a:-z}),C=E.t,D=v+E.s,c("惯性滚动","s="+D.toFixed(0),"t="+((u+C)/1e3).toFixed(2)),l!==D?(a.style.webkitTransition="-webkit-transform "+((u+C)/1e3).toFixed(2)+"s ease-out 0",a.style.webkitTransform="translate"+B.axis.toUpperCase()+"("+D.toFixed(0)+"px)",r(function(){B.enabled&&(c("惯性回弹","s="+v.toFixed(0),"t=400"),D!==v?(a.style.webkitTransition="-webkit-transform 0.4s ease 0",a.style.webkitTransform="translate"+B.axis.toUpperCase()+"("+v.toFixed(0)+"px)",r(A,400)):A())},1e3*((u+C)/1e3).toFixed(2))):A());else{c("惯性计算没有超出了边缘");var K=o.generateCubicBezier();a.style.webkitTransition="-webkit-transform "+(k/1e3).toFixed(2)+"s cubic-bezier("+K+") 0",a.style.webkitTransform="translate"+B.axis.toUpperCase()+"("+m.toFixed(0)+"px)",r(A,1e3*(k/1e3).toFixed(2))}B.fireScrollingEvent&&s(function(){B.isScrolling&&B.enabled&&(i(B,"scrolling",{afterFlick:!0}),s(arguments.callee))})}}}function A(){B.enabled&&(G=!1,setTimeout(function(){!G&&B.enabled&&(B.isScrolling=!1,a.style.webkitTransition="",i(B,"scrollend"))},50))}var B=this;if(b=b||{},b.noBounce=!!b.noBounce,b.padding=b.padding||{},b.isPrevent=null==b.isPrevent?!0:!!b.isPrevent,b.isFixScrollendClick=null==b.isFixScrollendClick?!0:!!b.isFixScrollendClick,b.padding?(b.yPadding1=-b.padding.top||0,b.yPadding2=-b.padding.bottom||0,b.xPadding1=-b.padding.left||0,b.xPadding2=-b.padding.right||0):(b.yPadding1=0,b.yPadding2=0,b.xPadding1=0,b.xPadding2=0),b.margin?(b.yMargin1=-b.margin.top||0,b.yMargin2=-b.margin.bottom||0,b.xMargin1=-b.margin.left||0,b.xMargin2=-b.margin.right||0):(b.yMargin1=0,b.yMargin2=0,b.xMargin1=0,b.xMargin2=0),b.direction=b.direction||"y",b.inertia=b.inertia||"normal",this.options=b,B.axis=b.direction,this.element=a,this.viewport=a.parentNode,this.plugins={},this.viewport.addEventListener("touchstart",u,!1),this.viewport.addEventListener("touchend",v,!1),this.viewport.addEventListener("touchcancel",v,!1),this.viewport.addEventListener("panstart",w,!1),this.viewport.addEventListener("pan",x,!1),this.viewport.addEventListener("panend",y,!1),this.viewport.addEventListener("flick",z,!1),this.element.scrollId=setTimeout(function(){o[B.element.scrollId+""]=B},1),b.isPrevent){var C="y"===this.axis?"vertical":"horizontal";this.viewport.addEventListener(C+"panstart",function(){t=!0},!1),B.viewport.addEventListener("panend",function(){t=!1},!1)}if(b.isFixScrollendClick){var D;this.viewport.addEventListener("touchstart",function(){B.isScrolling&&(D=!0)},!1),this.viewport.addEventListener("scrollend",function(){setTimeout(function(){D=!1},400)},!1),this.viewport.addEventListener("click",l,!1),this.viewport.addEventListener("tap",l,!1)}var E,F=0;a.addEventListener("webkitTransitionEnd",function(a){if(E){var b=E;E=null,clearTimeout(F),s(function(){b(a)})}},!1);var G,H,I={init:function(){return this.enable(),this.refresh(),this.scrollTo(0),this},enable:function(){return this.enabled=!0,this},disable:function(){var a=this.element;return this.enabled=!1,B.isScrolling=!1,s(function(){a.style.webkitTransform=getComputedStyle(a).webkitTransform}),this},getScrollWidth:function(){return d(this.element).width},getScrollHeight:function(){return d(this.element).height},getScrollLeft:function(){return-j(this).x-this.options.xPadding1},getScrollTop:function(){return-j(this).y-this.options.yPadding1},getMaxScrollLeft:function(){return-B.maxScrollOffset-this.options.xPadding1},getMaxScrollTop:function(){return-B.maxScrollOffset-this.options.yPadding1},getBoundaryOffset:function(){return Math.abs(g(this,j(this)[this.axis])||0)},refresh:function(){var a=this.element,b="y"===this.axis,c=b?"height":"width";if(null!=this.options[c])a.style[c]=this.options[c]+"px";else if(a.childElementCount>0){var g,h,k=a.firstElementChild,l=a.lastElementChild;if(document.createRange&&(g=document.createRange(),g.selectNodeContents(a),h=d(g)),h)a.style[c]=h[c]+"px";else if(k&&l){for(;k&&0===d(k)[c]&&k.nextElementSibling;)k=k.nextElementSibling;for(;l&&l!==k&&0===d(l)[c]&&l.previousElementSibling;)l=l.previousElementSibling;a.style[c]=d(l)[b?"bottom":"right"]-d(k)[b?"top":"left"]+"px"}else a.style[c]="0"}else a.style[c]="auto",a.style[c]=d(a)[c]+"px";return this.transformOffset=j(this),this.minScrollOffset=e(this),this.maxScrollOffset=f(this),this.scrollTo(-this.transformOffset[this.axis]-this.options[this.axis+"Padding1"]),i(this,"contentchange"),this},offset:function(a){var b=d(this.element),c=d(a);if("y"===this.axis){var e={top:c.top-this.options.yPadding1-b.top,left:c.left-b.left,right:b.right-c.right,width:c.width,height:c.height};e.bottom=e.top+e.height}else{var e={top:c.top-b.top,bottom:b.bottom-c.bottom,left:c.left-this.options.xPadding1-b.left,width:c.width,height:c.height};e.right=e.left+e.width}return e},getRect:function(a){var b=d(this.viewport),c=d(a);if("y"===this.axis){var e={top:c.top-b.top,left:c.left-b.left,right:b.right-c.right,width:c.width,height:c.height};e.bottom=e.top+e.height}else{var e={top:c.top-b.top,bottom:b.bottom-c.bottom,left:c.left-b.left,width:c.width,height:c.height};e.right=e.left+e.width}return e},isInView:function(a){var b=d(this.viewport),c=this.getRect(a);return"y"===this.axis?b.top<c.bottom&&b.bottom>c.top:b.left<c.right&&b.right>c.left},scrollTo:function(a,b){var c=this.element;return a=-a-this.options[this.axis+"Padding1"],a=h(this,a),b===!0?(c.style.webkitTransition="-webkit-transform 0.4s ease 0",r(A,400)):(c.style.webkitTransition="",r(A,1)),c.style.webkitTransform="y"===this.axis?k(j(this).x,a):k(a,j(this).y),this},scrollToElement:function(a,b){var c=this.offset(a);return c=c["y"===this.axis?"top":"left"],this.scrollTo(c,b)},getViewWidth:function(){return d(this.viewport).width},getViewHeight:function(){return d(this.viewport).height},addPulldownHandler:function(a){var b=this;return this.element.addEventListener("pulldownend",function(c){b.disable(),a(c,function(){b.scrollTo(0,!0),b.enable()})},!1),this},addPullupHandler:function(a){var b=this;return this.element.addEventListener("pullupend",function(c){b.disable(),a(c,function(){b.scrollTo(b.getScrollHeight(),!0),b.enable()})},!1),this},addScrollstartHandler:function(a){return this.element.addEventListener("scrollstart",function(b){a(b)},!1),this},addScrollingHandler:function(a){if(!this.fireScrollingEvent){this.fireScrollingEvent=!0;var b=m.createElement("div");b.className="force-refresh",b.style.cssText="position: absolute; top: 0; left: 0; width: 0; height: 0; font-size: 0; opacity: 1;",this.viewport.appendChild(b),this.element.addEventListener("scrolling",function(){b.style.opacity=Math.abs(parseInt(b.style.opacity)-1)+""},!1)}return this.element.addEventListener("scrolling",function(b){a(b)},!1),this},addScrollendHandler:function(a){return this.element.addEventListener("scrollend",function(b){a(b)},!1),this},addEventListener:function(){this.element.addEventListener.apply(this.element,arguments)},removeEventListener:function(){this.element.removeEventListener.apply(this.element,arguments)},enablePlugin:function(a,b){var c=p[a];return c&&!this.plugins[a]&&(this.plugins[a]=!0,b=b||{},c.call(this,a,b)),this}};for(var J in I)this[J]=I[J];delete I}var m=a.document,n=b.motion,o={},p={},q={normal:[2,.0015],slow:[1.5,.003],veryslow:[1.5,.005]},r="WebKitCSSMatrix"in window&&"m11"in new WebKitCSSMatrix,s=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||function(a){setTimeout(a,16)}}(),t=!1;m.addEventListener("touchmove",function(a){return t?(a.preventDefault(),!1):!0},!1),b.scroll=function(a,b){if(1===arguments.length&&!(arguments[0]instanceof HTMLElement))if(b=arguments[0],b.scrollElement)a=b.scrollElement;else{if(!b.scrollWrap)throw new Error("no scroll element");a=b.scrollWrap.firstElementChild}if(!a.parentNode)throw new Error("wrong dom tree");if(b&&b.direction&&["x","y"].indexOf(b.direction)<0)throw new Error("wrong direction");var c;return c=a.scrollId?o[a.scrollId]:new l(a,b)},b.scroll.plugin=function(a,b){return b?(a=a.split(","),a.forEach(function(a){p[a]=b}),void 0):p[a]}}(window,window.lib||(window.lib={}));
if (window.KISSY) {KISSY.add('mtb/lib-scroll/2.3.1/scroll.cmd', window.lib.scroll);} else if ('undefined' !== typeof define) {define('mtb/lib-scroll/2.3.1/scroll.cmd', [], window.lib.scroll);}