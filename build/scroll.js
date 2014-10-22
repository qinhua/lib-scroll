!function(a,b){function c(){b.scroll.outputDebugLog&&console.debug.apply(console,arguments)}function d(a){var b=a.getBoundingClientRect();if(!b){b={},b.width=a.offsetWidth,b.height=a.offsetHeight,b.left=a.offsetLeft,b.top=a.offsetTop;for(var c=a.offsetParent;c;)b.left+=c.offsetLeft,b.top+=c.offsetTop,c=c.offsetParent;b.right=b.left+b.width,b.bottom=b.top+b.height}return b}function e(a){return 0-a.options[a.axis+"Padding1"]}function f(a){var b=d(a.element),c=d(a.viewport),f=e(a);if("y"===a.axis)var g=0-b.height+c.height;else var g=0-b.width+c.width;return Math.min(g+a.options[a.axis+"Padding2"],f)}function g(a,b){return b>a.minScrollOffset?b-a.minScrollOffset:b<a.maxScrollOffset?b-a.maxScrollOffset:void 0}function h(a,b){return b>a.minScrollOffset?b=a.minScrollOffset:b<a.maxScrollOffset&&(b=a.maxScrollOffset),b}function i(a,b,d){c(a.element.scrollId,b,d);var e=m.createEvent("HTMLEvents");if(e.initEvent(b,!1,!0),e.scrollObj=a,d)for(var f in d)e[f]=d[f];a.element.dispatchEvent(e),a.viewport.dispatchEvent(e)}function j(a){var b,c={x:0,y:0},d=getComputedStyle(a.element).webkitTransform;return"none"!==d&&(b=d.match(/^matrix3d\((?:[-\d.]+,\s*){12}([-\d.]+),\s*([-\d.]+)(?:,\s*[-\d.]+){2}\)/)||d.match(/^matrix\((?:[-\d.]+,\s*){4}([-\d.]+),\s*([-\d.]+)\)$/))&&(c.x=parseFloat(b[1])||0,c.y=parseFloat(b[2])||0),c}function k(a,b){return a=parseFloat(a),b=parseFloat(b),0!=a&&(a+="px"),0!=b&&(b+="px"),q?"translate3d("+a+", "+b+", 0)":"translate("+a+", "+b+")"}function l(a,l){function m(a){return B||H?(a.preventDefault(),a.stopPropagation(),!1):!0}function q(a){B||H||setTimeout(function(){var b=document.createEvent("HTMLEvents");b.initEvent("niceclick",!0,!0),a.target.dispatchEvent(b)},300)}function s(a,c){E=null,clearTimeout(F),F=setTimeout(function(){E&&(E=null,b.animation.requestFrame(a))},c||400),E=a}function t(){if(A.enabled)if(H&&z(),l.useFrameAnimation)D&&D.stop(),D=null;else{var b=j(A);a.style.webkitTransform=k(b.x,b.y),a.style.webkitTransition="",E=null,clearTimeout(F)}}function u(){if(A.enabled){var c=j(A)[A.axis],d=g(A,c);if(d){var e=h(A,c);if(d>0?i(A,"y"===A.axis?"pulldownend":"pullrightend"):0>d&&i(A,"y"===A.axis?"pullupend":"pullleftend"),l.useFrameAnimation){var f=e-c;D=new b.animation(400,b.cubicbezier.ease,0,function(b,d){var e=(c+f*d).toFixed(2);a.style.webkitTransform="y"===A.axis?k(0,e):k(e,0),i(A,"scrolling")}),D.onend(z),D.play()}else{a.style.webkitTransition="-webkit-transform 0.4s ease 0";var m=e.toFixed(0);a.style.webkitTransform="y"===A.axis?k(0,m):k(m,0),s(z,400),b.animation.requestFrame(function(){H&&A.enabled&&(i(A,"scrolling"),b.animation.requestFrame(arguments.callee))})}}else H&&z()}}function v(a){A.enabled&&("y"!==A.axis&&a.isVertical||"x"===A.axis&&a.isVertical||(A.transformOffset=j(A),A.minScrollOffset=e(A),A.maxScrollOffset=f(A),G=2.5,J=!0,H=!0,I=!1,i(A,"scrollstart"),K=a["displacement"+A.axis.toUpperCase()]))}function w(b){if(A.enabled&&("y"===A.axis&&b.isVertical||"x"===A.axis&&!b.isVertical)){b.stopPropagation();var c=b["displacement"+A.axis.toUpperCase()];if(Math.abs(c-K)<5)return b.stopPropagation(),void 0;K=c;var d=A.transformOffset[A.axis]+c;d>A.minScrollOffset?(d=A.minScrollOffset+(d-A.minScrollOffset)/G,G*=1.003):d<A.maxScrollOffset&&(d=A.maxScrollOffset-(A.maxScrollOffset-d)/G,G*=1.003),G>4&&(G=4);var e=g(A,d);e&&(i(A,e>0?"y"===A.axis?"pulldown":"pullright":"y"===A.axis?"pullup":"pullleft",{boundaryOffset:Math.abs(e)}),A.options.noBounce&&(d=h(A,d))),a.style.webkitTransform="y"===A.axis?k(0,d.toFixed(2)):k(d.toFixed(2),0),i(A,"scrolling")}}function x(a){A.enabled&&("y"===A.axis&&a.isVertical||"x"===A.axis&&!a.isVertical)&&(a.stopPropagation(),a.isflick&&y(a))}function y(d){J=!0;var e,f,h,m,n,o,q,r,t,u,v,w,x,y,B,C,E;m=j(A)[A.axis];var F=g(A,m);if(!F){e=d["velocity"+A.axis.toUpperCase()];var G=2,K=.0015;l.inertia&&p[l.inertia]&&(G=p[l.inertia][0],K=p[l.inertia][1]),e>G&&(e=G),-G>e&&(e=-G),f=K*(e/Math.abs(e)),o=new b.motion({v:e,a:-f}),h=o.t,n=m+o.s;var L=g(A,n);if(L){c("惯性计算超出了边缘",L),q=e,r=f,L>0?(u=A.minScrollOffset,w=1):(u=A.maxScrollOffset,w=-1),v=new b.motion({v:w*q,a:-w*r,s:Math.abs(u-m)}),t=v.t;var M=v.generateCubicBezier();x=q-r*t,y=.03*(x/Math.abs(x)),E=new b.motion({v:x,a:-y}),B=E.t,C=u+E.s;{E.generateCubicBezier()}if(l.noBounce)if(c("没有回弹效果"),m!==u)if(l.useFrameAnimation){var N=u-m,O=b.cubicbezier(M[0][0],M[0][1],M[1][0],M[1][1]);D=new b.animation(t.toFixed(0),O,0,function(b,c){i(A,"scrolling",{afterFlick:!0});var d=m+N*c;a.style.webkitTransform="y"===A.axis?k(0,d.toFixed(2)):k(d.toFixed(2),0)}),D.onend(z),D.play()}else{a.style.webkitTransition="-webkit-transform "+(t/1e3).toFixed(2)+"s cubic-bezier("+M+") 0";var P=u.toFixed(0);a.style.webkitTransform="y"===A.axis?k(0,P):k(P,0),s(z,1e3*(t/1e3).toFixed(2))}else z();else if(m!==C)if(c("惯性滚动","s="+C.toFixed(0),"t="+((t+B)/1e3).toFixed(2)),l.useFrameAnimation){var N=C-m,O=b.cubicbezier.easeOut;D=new b.animation((t+B).toFixed(0),O,0,function(b,c){i(A,"scrolling",{afterFlick:!0});var d=m+N*c;a.style.webkitTransform="y"===A.axis?k(0,d.toFixed(2)):k(d.toFixed(2),0)}),D.onend(function(){if(A.enabled){var c=u-C,d=b.cubicbezier.ease;D=new b.animation(400,d,0,function(b,d){i(A,"scrolling",{afterFlick:!0});var e=C+c*d;a.style.webkitTransform="y"===A.axis?k(0,e.toFixed(2)):k(e.toFixed(2),0)}),D.onend(z),D.play()}}),D.play()}else{a.style.webkitTransition="-webkit-transform "+((t+B)/1e3).toFixed(2)+"s ease-out 0";var P=C.toFixed(0);a.style.webkitTransform="y"===A.axis?k(0,P):k(P,0),s(function(){if(A.enabled)if(c("惯性回弹","s="+u.toFixed(0),"t=400"),C!==u){a.style.webkitTransition="-webkit-transform 0.4s ease 0";var b=u.toFixed(0);a.style.webkitTransform="y"===A.axis?k(0,b):k(b,0),s(z,400)}else z()},1e3*((t+B)/1e3).toFixed(2))}else z()}else{c("惯性计算没有超出边缘");var Q=o.generateCubicBezier();if(l.useFrameAnimation){var N=n-m,O=b.cubicbezier(Q[0][0],Q[0][1],Q[1][0],Q[1][1]);D=new b.animation(h.toFixed(0),O,0,function(b,c){i(A,"scrolling",{afterFlick:!0});var d=(m+N*c).toFixed(2);a.style.webkitTransform="y"===A.axis?k(0,d):k(d,0)}),D.onend(z),D.play()}else{a.style.webkitTransition="-webkit-transform "+(h/1e3).toFixed(2)+"s cubic-bezier("+Q+") 0";var P=n.toFixed(0);a.style.webkitTransform="y"===A.axis?k(0,P):k(P,0),s(z,1e3*(h/1e3).toFixed(2))}}I=!0,l.useFrameAnimation||b.animation.requestFrame(function(){H&&I&&A.enabled&&(i(A,"scrolling",{afterFlick:!0}),b.animation.requestFrame(arguments.callee))})}}function z(){A.enabled&&(J=!1,setTimeout(function(){!J&&H&&(H=!1,I=!1,l.useFrameAnimation?(D&&D.stop(),D=null):a.style.webkitTransition="",i(A,"scrollend"))},50))}var A=this;if(l=l||{},l.noBounce=!!l.noBounce,l.padding=l.padding||{},l.isPrevent=null==l.isPrevent?!0:!!l.isPrevent,l.isFixScrollendClick=null==l.isFixScrollendClick?!0:!!l.isFixScrollendClick,l.padding?(l.yPadding1=-l.padding.top||0,l.yPadding2=-l.padding.bottom||0,l.xPadding1=-l.padding.left||0,l.xPadding2=-l.padding.right||0):(l.yPadding1=0,l.yPadding2=0,l.xPadding1=0,l.xPadding2=0),l.margin?(l.yMargin1=-l.margin.top||0,l.yMargin2=-l.margin.bottom||0,l.xMargin1=-l.margin.left||0,l.xMargin2=-l.margin.right||0):(l.yMargin1=0,l.yMargin2=0,l.xMargin1=0,l.xMargin2=0),l.direction=l.direction||"y",l.inertia=l.inertia||"normal",this.options=l,A.axis=l.direction,this.element=a,this.viewport=a.parentNode,this.plugins={},this.viewport.addEventListener("touchstart",t,!1),this.viewport.addEventListener("touchend",u,!1),this.viewport.addEventListener("touchcancel",u,!1),this.viewport.addEventListener("panstart",v,!1),this.viewport.addEventListener("pan",w,!1),this.viewport.addEventListener("panend",x,!1),this.element.scrollId=setTimeout(function(){n[A.element.scrollId+""]=A},1),l.isPrevent&&(this.viewport.addEventListener("touchstart",function(){r=!0},!1),A.viewport.addEventListener("touchend",function(){r=!1},!1)),l.isFixScrollendClick){var B,C;this.viewport.addEventListener("scrolling",function(){B=!0,C&&clearTimeout(C),C=setTimeout(function(){B=!1},400)},!1),this.viewport.addEventListener("click",m,!1),this.viewport.addEventListener("tap",q,!1)}if(l.useFrameAnimation){var D;Object.defineProperty(this,"animation",{get:function(){return D}})}else{var E,F=0;a.addEventListener("webkitTransitionEnd",function(a){if(E){var c=E;E=null,clearTimeout(F),b.animation.requestFrame(function(){c(a)})}},!1)}var G,H,I,J;Object.defineProperty(this,"isScrolling",{get:function(){return!!H}});var K,L={init:function(){return this.enable(),this.refresh(),this.scrollTo(0),this},enable:function(){return this.enabled=!0,this},disable:function(){var a=this.element;return this.enabled=!1,this.options.useFrameAnimation?this.animation&&this.animation.stop():b.animation.requestFrame(function(){a.style.webkitTransform=getComputedStyle(a).webkitTransform}),this},getScrollWidth:function(){return d(this.element).width},getScrollHeight:function(){return d(this.element).height},getScrollLeft:function(){return-j(this).x-this.options.xPadding1},getScrollTop:function(){return-j(this).y-this.options.yPadding1},getMaxScrollLeft:function(){return-A.maxScrollOffset-this.options.xPadding1},getMaxScrollTop:function(){return-A.maxScrollOffset-this.options.yPadding1},getBoundaryOffset:function(){return Math.abs(g(this,j(this)[this.axis])||0)},refresh:function(){var a=this.element,b="y"===this.axis,c=b?"height":"width";if(null!=this.options[c])a.style[c]=this.options[c]+"px";else if(a.childElementCount>0){var g,h,k=a.firstElementChild,l=a.lastElementChild;if(document.createRange&&(g=document.createRange(),g.selectNodeContents(a),h=d(g)),h)a.style[c]=h[c]+"px";else if(k&&l){for(;k&&0===d(k)[c]&&k.nextElementSibling;)k=k.nextElementSibling;for(;l&&l!==k&&0===d(l)[c]&&l.previousElementSibling;)l=l.previousElementSibling;a.style[c]=d(l)[b?"bottom":"right"]-d(k)[b?"top":"left"]+"px"}else a.style[c]="0"}else a.style[c]="auto",a.style[c]=d(a)[c]+"px";return this.transformOffset=j(this),this.minScrollOffset=e(this),this.maxScrollOffset=f(this),this.scrollTo(-this.transformOffset[this.axis]-this.options[this.axis+"Padding1"]),i(this,"contentrefresh"),this},offset:function(a){var b=d(this.element),c=d(a);if("y"===this.axis){var e={top:c.top-b.top-this.options.yPadding1,left:c.left-b.left,right:b.right-c.right,width:c.width,height:c.height};e.bottom=e.top+e.height}else{var e={top:c.top-b.top,bottom:b.bottom-c.bottom,left:c.left-b.left-this.options.xPadding1,width:c.width,height:c.height};e.right=e.left+e.width}return e},getRect:function(a){var b=d(this.viewport),c=d(a);if("y"===this.axis){var e={top:c.top-b.top,left:c.left-b.left,right:b.right-c.right,width:c.width,height:c.height};e.bottom=e.top+e.height}else{var e={top:c.top-b.top,bottom:b.bottom-c.bottom,left:c.left-b.left,width:c.width,height:c.height};e.right=e.left+e.width}return e},isInView:function(a){var b=d(this.viewport),c=this.getRect(a);return"y"===this.axis?b.top<c.bottom&&b.bottom>c.top:b.left<c.right&&b.right>c.left},scrollTo:function(a,c){var d=this,e=this.element;return a=-a-this.options[this.axis+"Padding1"],a=h(this,a),H=!0,c===!0?(e.style.webkitTransition="-webkit-transform 0.4s ease 0",s(z,400),b.animation.requestFrame(function(){H&&d.enabled&&(i(d,"scrolling"),b.animation.requestFrame(arguments.callee))})):(e.style.webkitTransition="",s(z,1)),e.style.webkitTransform="y"===this.axis?k(j(this).x,a):k(a,j(this).y),this},scrollToElement:function(a,b){var c=this.offset(a);return c=c["y"===this.axis?"top":"left"],this.scrollTo(c,b)},getViewWidth:function(){return d(this.viewport).width},getViewHeight:function(){return d(this.viewport).height},addPulldownHandler:function(a){var b=this;return this.element.addEventListener("pulldownend",function(c){b.disable(),a(c,function(){b.scrollTo(0,!0),b.enable()})},!1),this},addPullupHandler:function(a){var b=this;return this.element.addEventListener("pullupend",function(c){b.disable(),a(c,function(){b.scrollTo(b.getScrollHeight(),!0),b.enable()})},!1),this},addScrollstartHandler:function(a){return this.element.addEventListener("scrollstart",function(b){a(b)},!1),this},addScrollingHandler:function(a){return this.element.addEventListener("scrolling",function(b){a(b)},!1),this},addScrollendHandler:function(a){return this.element.addEventListener("scrollend",function(b){a(b)},!1),this},addEventListener:function(){this.element.addEventListener.apply(this.element,arguments)},removeEventListener:function(){this.element.removeEventListener.apply(this.element,arguments)},enablePlugin:function(a,b){var c=o[a];return c&&!this.plugins[a]&&(this.plugins[a]=!0,b=b||{},c.call(this,a,b)),this}};for(var M in L)this[M]=L[M];delete L}var m=a.document,n={},o={},p={normal:[2,.0015],slow:[1.5,.003],veryslow:[1.5,.005]},q="WebKitCSSMatrix"in window&&"m11"in new WebKitCSSMatrix,r=!1;m.addEventListener("touchmove",function(a){return r?(a.preventDefault(),!1):!0},!1),b.scroll=function(a,b){if(1===arguments.length&&!(arguments[0]instanceof HTMLElement))if(b=arguments[0],b.scrollElement)a=b.scrollElement;else{if(!b.scrollWrap)throw new Error("no scroll element");a=b.scrollWrap.firstElementChild}if(!a.parentNode)throw new Error("wrong dom tree");if(b&&b.direction&&["x","y"].indexOf(b.direction)<0)throw new Error("wrong direction");var c;return c=a.scrollId?n[a.scrollId]:new l(a,b)},b.scroll.plugin=function(a,b){return b?(a=a.split(","),a.forEach(function(a){o[a]=b}),void 0):o[a]}}(window,window.lib||(window.lib={}));