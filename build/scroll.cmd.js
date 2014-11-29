!function(a,b){function c(){b.scroll.outputDebugLog&&console.debug.apply(console,arguments)}function d(a){var b=a.getBoundingClientRect();if(!b){b={},b.width=a.offsetWidth,b.height=a.offsetHeight,b.left=a.offsetLeft,b.top=a.offsetTop;for(var c=a.offsetParent;c;)b.left+=c.offsetLeft,b.top+=c.offsetTop,c=c.offsetParent;b.right=b.left+b.width,b.bottom=b.top+b.height}return b}function e(a){return 0-a.options[a.axis+"Padding1"]}function f(a){var b=d(a.element),c=d(a.viewport),f=e(a);if("y"===a.axis)var g=0-b.height+c.height;else var g=0-b.width+c.width;return Math.min(g+a.options[a.axis+"Padding2"],f)}function g(a,b){return b>a.minScrollOffset?b-a.minScrollOffset:b<a.maxScrollOffset?b-a.maxScrollOffset:void 0}function h(a,b){return b>a.minScrollOffset?b=a.minScrollOffset:b<a.maxScrollOffset&&(b=a.maxScrollOffset),b}function i(a,b,d){c(a.element.scrollId,b,d);var e=m.createEvent("HTMLEvents");if(e.initEvent(b,!1,!0),e.scrollObj=a,d)for(var f in d)e[f]=d[f];a.element.dispatchEvent(e),a.viewport.dispatchEvent(e)}function j(a){var b,c={x:0,y:0},d=getComputedStyle(a.element).webkitTransform;return"none"!==d&&(b=d.match(/^matrix3d\((?:[-\d.]+,\s*){12}([-\d.]+),\s*([-\d.]+)(?:,\s*[-\d.]+){2}\)/)||d.match(/^matrix\((?:[-\d.]+,\s*){4}([-\d.]+),\s*([-\d.]+)\)$/))&&(c.x=parseFloat(b[1])||0,c.y=parseFloat(b[2])||0),c}function k(a,b){return a=parseFloat(a),b=parseFloat(b),0!=a&&(a+="px"),0!=b&&(b+="px"),q?"translate3d("+a+", "+b+", 0)":"translate("+a+", "+b+")"}function l(a,l){function m(a){return C||I?(a.preventDefault(),a.stopPropagation(),!1):!0}function q(a){C||I||setTimeout(function(){var b=document.createEvent("HTMLEvents");b.initEvent("niceclick",!0,!0),a.target.dispatchEvent(b)},300)}function s(a,c){F=null,clearTimeout(G),G=setTimeout(function(){F&&(F=null,b.animation.requestFrame(a))},c||400),F=a}function t(a){for(var b=a.target;!b.scrollId&&b!==B.viewport&&b.parentNode;)b=b.parentNode;return b.scrollId===B.element.scrollId?!0:!1}function u(b){if(B.enabled&&t(b))if(I&&A(),l.useFrameAnimation)E&&E.stop(),E=null;else{var c=j(B);a.style.webkitTransform=k(c.x,c.y),a.style.webkitTransition="",F=null,clearTimeout(G)}}function v(c){if(B.enabled&&t(c)){var d=j(B)[B.axis],e=g(B,d);if(e){var f=h(B,d);if(e>0?i(B,"y"===B.axis?"pulldownend":"pullrightend"):0>e&&i(B,"y"===B.axis?"pullupend":"pullleftend"),l.useFrameAnimation){var m=f-d;E=new b.animation(400,b.cubicbezier.ease,0,function(b,c){var e=(d+m*c).toFixed(2);a.style.webkitTransform="y"===B.axis?k(0,e):k(e,0),i(B,"scrolling")}),E.onend(A),E.play()}else{a.style.webkitTransition="-webkit-transform 0.4s ease 0";var n=f.toFixed(0);a.style.webkitTransform="y"===B.axis?k(0,n):k(n,0),s(A,400),b.animation.requestFrame(function(){I&&B.enabled&&(i(B,"scrolling"),b.animation.requestFrame(arguments.callee))})}}else I&&A()}}function w(a){B.enabled&&t(a)&&("y"!==B.axis&&a.isVertical||"x"===B.axis&&a.isVertical||(B.transformOffset=j(B),B.minScrollOffset=e(B),B.maxScrollOffset=f(B),H=2.5,K=!0,I=!0,J=!1,i(B,"scrollstart"),L=a["displacement"+B.axis.toUpperCase()]))}function x(b){if(B.enabled&&t(b)&&("y"===B.axis&&b.isVertical||"x"===B.axis&&!b.isVertical)){b.stopPropagation();var c=b["displacement"+B.axis.toUpperCase()];if(Math.abs(c-L)<5)return b.stopPropagation(),void 0;L=c;var d=B.transformOffset[B.axis]+c;d>B.minScrollOffset?(d=B.minScrollOffset+(d-B.minScrollOffset)/H,H*=1.003):d<B.maxScrollOffset&&(d=B.maxScrollOffset-(B.maxScrollOffset-d)/H,H*=1.003),H>4&&(H=4);var e=g(B,d);e&&(i(B,e>0?"y"===B.axis?"pulldown":"pullright":"y"===B.axis?"pullup":"pullleft",{boundaryOffset:Math.abs(e)}),B.options.noBounce&&(d=h(B,d))),a.style.webkitTransform="y"===B.axis?k(0,d.toFixed(2)):k(d.toFixed(2),0),i(B,"scrolling")}}function y(a){B.enabled&&t(a)&&("y"===B.axis&&a.isVertical||"x"===B.axis&&!a.isVertical)&&(a.stopPropagation(),a.isflick&&z(a))}function z(d){K=!0;var e,f,h,m,n,o,q,r,t,u,v,w,x,y,z,C,D;m=j(B)[B.axis];var F=g(B,m);if(!F){e=d["velocity"+B.axis.toUpperCase()];var G=2,H=.0015;l.inertia&&p[l.inertia]&&(G=p[l.inertia][0],H=p[l.inertia][1]),e>G&&(e=G),-G>e&&(e=-G),f=H*(e/Math.abs(e)),o=new b.motion({v:e,a:-f}),h=o.t,n=m+o.s;var L=g(B,n);if(L){c("惯性计算超出了边缘",L),q=e,r=f,L>0?(u=B.minScrollOffset,w=1):(u=B.maxScrollOffset,w=-1),v=new b.motion({v:w*q,a:-w*r,s:Math.abs(u-m)}),t=v.t;var M=v.generateCubicBezier();x=q-r*t,y=.03*(x/Math.abs(x)),D=new b.motion({v:x,a:-y}),z=D.t,C=u+D.s;{D.generateCubicBezier()}if(l.noBounce)if(c("没有回弹效果"),m!==u)if(l.useFrameAnimation){var N=u-m,O=b.cubicbezier(M[0][0],M[0][1],M[1][0],M[1][1]);E=new b.animation(t.toFixed(0),O,0,function(b,c){i(B,"scrolling",{afterFlick:!0});var d=m+N*c;a.style.webkitTransform="y"===B.axis?k(0,d.toFixed(2)):k(d.toFixed(2),0)}),E.onend(A),E.play()}else{a.style.webkitTransition="-webkit-transform "+(t/1e3).toFixed(2)+"s cubic-bezier("+M+") 0";var P=u.toFixed(0);a.style.webkitTransform="y"===B.axis?k(0,P):k(P,0),s(A,1e3*(t/1e3).toFixed(2))}else A();else if(m!==C)if(c("惯性滚动","s="+C.toFixed(0),"t="+((t+z)/1e3).toFixed(2)),l.useFrameAnimation){var N=C-m,O=b.cubicbezier.easeOut;E=new b.animation((t+z).toFixed(0),O,0,function(b,c){i(B,"scrolling",{afterFlick:!0});var d=m+N*c;a.style.webkitTransform="y"===B.axis?k(0,d.toFixed(2)):k(d.toFixed(2),0)}),E.onend(function(){if(B.enabled){var c=u-C,d=b.cubicbezier.ease;E=new b.animation(400,d,0,function(b,d){i(B,"scrolling",{afterFlick:!0});var e=C+c*d;a.style.webkitTransform="y"===B.axis?k(0,e.toFixed(2)):k(e.toFixed(2),0)}),E.onend(A),E.play()}}),E.play()}else{a.style.webkitTransition="-webkit-transform "+((t+z)/1e3).toFixed(2)+"s ease-out 0";var P=C.toFixed(0);a.style.webkitTransform="y"===B.axis?k(0,P):k(P,0),s(function(){if(B.enabled)if(c("惯性回弹","s="+u.toFixed(0),"t=400"),C!==u){a.style.webkitTransition="-webkit-transform 0.4s ease 0";var b=u.toFixed(0);a.style.webkitTransform="y"===B.axis?k(0,b):k(b,0),s(A,400)}else A()},1e3*((t+z)/1e3).toFixed(2))}else A()}else{c("惯性计算没有超出边缘");var Q=o.generateCubicBezier();if(l.useFrameAnimation){var N=n-m,O=b.cubicbezier(Q[0][0],Q[0][1],Q[1][0],Q[1][1]);E=new b.animation(h.toFixed(0),O,0,function(b,c){i(B,"scrolling",{afterFlick:!0});var d=(m+N*c).toFixed(2);a.style.webkitTransform="y"===B.axis?k(0,d):k(d,0)}),E.onend(A),E.play()}else{a.style.webkitTransition="-webkit-transform "+(h/1e3).toFixed(2)+"s cubic-bezier("+Q+") 0";var P=n.toFixed(0);a.style.webkitTransform="y"===B.axis?k(0,P):k(P,0),s(A,1e3*(h/1e3).toFixed(2))}}J=!0,l.useFrameAnimation||b.animation.requestFrame(function(){I&&J&&B.enabled&&(i(B,"scrolling",{afterFlick:!0}),b.animation.requestFrame(arguments.callee))})}}function A(){B.enabled&&(K=!1,setTimeout(function(){!K&&I&&(I=!1,J=!1,l.useFrameAnimation?(E&&E.stop(),E=null):a.style.webkitTransition="",i(B,"scrollend"))},50))}var B=this;if(l=l||{},l.noBounce=!!l.noBounce,l.padding=l.padding||{},l.isPrevent=null==l.isPrevent?!0:!!l.isPrevent,l.isFixScrollendClick=null==l.isFixScrollendClick?!0:!!l.isFixScrollendClick,l.padding?(l.yPadding1=-l.padding.top||0,l.yPadding2=-l.padding.bottom||0,l.xPadding1=-l.padding.left||0,l.xPadding2=-l.padding.right||0):(l.yPadding1=0,l.yPadding2=0,l.xPadding1=0,l.xPadding2=0),l.margin?(l.yMargin1=-l.margin.top||0,l.yMargin2=-l.margin.bottom||0,l.xMargin1=-l.margin.left||0,l.xMargin2=-l.margin.right||0):(l.yMargin1=0,l.yMargin2=0,l.xMargin1=0,l.xMargin2=0),l.direction=l.direction||"y",l.inertia=l.inertia||"normal",this.options=l,B.axis=l.direction,this.element=a,this.viewport=a.parentNode,this.plugins={},this.viewport.addEventListener("touchstart",u,!1),this.viewport.addEventListener("touchend",v,!1),this.viewport.addEventListener("touchcancel",v,!1),this.viewport.addEventListener("panstart",w,!1),this.viewport.addEventListener("pan",x,!1),this.viewport.addEventListener("panend",y,!1),this.element.scrollId=setTimeout(function(){n[B.element.scrollId+""]=B},1),l.isPrevent&&(this.viewport.addEventListener("touchstart",function(){r=!0},!1),B.viewport.addEventListener("touchend",function(){r=!1},!1)),l.isFixScrollendClick){var C,D;this.viewport.addEventListener("scrolling",function(){C=!0,D&&clearTimeout(D),D=setTimeout(function(){C=!1},400)},!1),this.viewport.addEventListener("click",m,!1),this.viewport.addEventListener("tap",q,!1)}if(l.useFrameAnimation){var E;Object.defineProperty(this,"animation",{get:function(){return E}})}else{var F,G=0;a.addEventListener("webkitTransitionEnd",function(a){if(F){var c=F;F=null,clearTimeout(G),b.animation.requestFrame(function(){c(a)})}},!1)}var H,I,J,K;Object.defineProperty(this,"isScrolling",{get:function(){return!!I}});var L,M={init:function(){return this.enable(),this.refresh(),this.scrollTo(0),this},enable:function(){return this.enabled=!0,this},disable:function(){var a=this.element;return this.enabled=!1,this.options.useFrameAnimation?this.animation&&this.animation.stop():b.animation.requestFrame(function(){a.style.webkitTransform=getComputedStyle(a).webkitTransform}),this},getScrollWidth:function(){return d(this.element).width},getScrollHeight:function(){return d(this.element).height},getScrollLeft:function(){return-j(this).x-this.options.xPadding1},getScrollTop:function(){return-j(this).y-this.options.yPadding1},getMaxScrollLeft:function(){return-B.maxScrollOffset-this.options.xPadding1},getMaxScrollTop:function(){return-B.maxScrollOffset-this.options.yPadding1},getBoundaryOffset:function(){return Math.abs(g(this,j(this)[this.axis])||0)},refresh:function(){var a=this.element,b="y"===this.axis,c=b?"height":"width";if(null!=this.options[c])a.style[c]=this.options[c]+"px";else if(a.childElementCount>0){var g,h,k=a.firstElementChild,l=a.lastElementChild;if(document.createRange&&(g=document.createRange(),g.selectNodeContents(a),h=d(g)),h)a.style[c]=h[c]+"px";else if(k&&l){for(;k&&0===d(k)[c]&&k.nextElementSibling;)k=k.nextElementSibling;for(;l&&l!==k&&0===d(l)[c]&&l.previousElementSibling;)l=l.previousElementSibling;a.style[c]=d(l)[b?"bottom":"right"]-d(k)[b?"top":"left"]+"px"}else a.style[c]="0"}else a.style[c]="auto",a.style[c]=d(a)[c]+"px";return this.transformOffset=j(this),this.minScrollOffset=e(this),this.maxScrollOffset=f(this),this.scrollTo(-this.transformOffset[this.axis]-this.options[this.axis+"Padding1"]),i(this,"contentrefresh"),this},offset:function(a){var b=d(this.element),c=d(a);if("y"===this.axis){var e={top:c.top-b.top-this.options.yPadding1,left:c.left-b.left,right:b.right-c.right,width:c.width,height:c.height};e.bottom=e.top+e.height}else{var e={top:c.top-b.top,bottom:b.bottom-c.bottom,left:c.left-b.left-this.options.xPadding1,width:c.width,height:c.height};e.right=e.left+e.width}return e},getRect:function(a){var b=d(this.viewport),c=d(a);if("y"===this.axis){var e={top:c.top-b.top,left:c.left-b.left,right:b.right-c.right,width:c.width,height:c.height};e.bottom=e.top+e.height}else{var e={top:c.top-b.top,bottom:b.bottom-c.bottom,left:c.left-b.left,width:c.width,height:c.height};e.right=e.left+e.width}return e},isInView:function(a){var b=d(this.viewport),c=this.getRect(a);return"y"===this.axis?b.top<c.bottom&&b.bottom>c.top:b.left<c.right&&b.right>c.left},scrollTo:function(a,c){var d=this,e=this.element;return a=-a-this.options[this.axis+"Padding1"],a=h(this,a),I=!0,c===!0?(e.style.webkitTransition="-webkit-transform 0.4s ease 0",s(A,400),b.animation.requestFrame(function(){I&&d.enabled&&(i(d,"scrolling"),b.animation.requestFrame(arguments.callee))})):(e.style.webkitTransition="",s(A,1)),e.style.webkitTransform="y"===this.axis?k(j(this).x,a):k(a,j(this).y),this},scrollToElement:function(a,b){var c=this.offset(a);return c=c["y"===this.axis?"top":"left"],this.scrollTo(c,b)},getViewWidth:function(){return d(this.viewport).width},getViewHeight:function(){return d(this.viewport).height},addPulldownHandler:function(a){var b=this;return this.element.addEventListener("pulldownend",function(c){b.disable(),a.call(b,c,function(){b.scrollTo(0,!0),b.enable()})},!1),this},addPullupHandler:function(a){var b=this;return this.element.addEventListener("pullupend",function(c){b.disable(),a.call(b,c,function(){b.scrollTo(b.getScrollHeight(),!0),b.enable()})},!1),this},addScrollstartHandler:function(a){var b=this;return this.element.addEventListener("scrollstart",function(c){a.call(b,c)},!1),this},addScrollingHandler:function(a){var b=this;return this.element.addEventListener("scrolling",function(c){a.call(b,c)},!1),this},addScrollendHandler:function(a){var b=this;return this.element.addEventListener("scrollend",function(c){a.call(b,c)},!1),this},addEventListener:function(a,b,c){var d=this;this.element.addEventListener(a,function(a){b.call(d,a)},!!c)},removeEventListener:function(a,b){var c=this;this.element.removeEventListener(a,function(a){b.call(c,a)})},enablePlugin:function(a,b){var c=o[a];return c&&!this.plugins[a]&&(this.plugins[a]=!0,b=b||{},c.call(this,a,b)),this}};for(var N in M)this[N]=M[N];delete M}var m=a.document,n={},o={},p={normal:[2,.0015],slow:[1.5,.003],veryslow:[1.5,.005]},q="WebKitCSSMatrix"in window&&"m11"in new WebKitCSSMatrix,r=!1;m.addEventListener("touchmove",function(a){return r?(a.preventDefault(),!1):!0},!1),b.scroll=function(a,b){if(1===arguments.length&&!(arguments[0]instanceof HTMLElement))if(b=arguments[0],b.scrollElement)a=b.scrollElement;else{if(!b.scrollWrap)throw new Error("no scroll element");a=b.scrollWrap.firstElementChild}if(!a.parentNode)throw new Error("wrong dom tree");if(b&&b.direction&&["x","y"].indexOf(b.direction)<0)throw new Error("wrong direction");var c;return c=a.scrollId?n[a.scrollId]:new l(a,b)},b.scroll.plugin=function(a,b){return b?(a=a.split(","),a.forEach(function(a){o[a]=b}),void 0):o[a]}}(window,window.lib||(window.lib={}));
if (window.KISSY) {KISSY.add('mtb/lib-scroll/2.4.6/scroll.cmd',function() {return window.lib.scroll;},{requries:['mtb/lib-motion','mtb/lib-gesture','mtb/lib-cubicbezier','mtb/lib-animation']});} else if ('undefined' !== typeof define) {define('mtb/lib-scroll/2.4.6/scroll.cmd', [], function(require){require('mtb/lib-motion');require('mtb/lib-gesture');require('mtb/lib-cubicbezier');require('mtb/lib-animation');return window.lib.scroll;});}