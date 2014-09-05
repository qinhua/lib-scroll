!function(a,b){function c(){b.scroll.outputDebugLog&&console.debug.apply(console,arguments)}function d(a){var b=a.getBoundingClientRect();if(!b){b={},b.width=a.offsetWidth,b.height=a.offsetHeight,b.left=a.offsetLeft,b.top=a.offsetTop;for(var c=a.offsetParent;c;)b.left+=c.offsetLeft,b.top+=c.offsetTop,c=c.offsetParent;b.right=b.left+b.width,b.bottom=b.top+b.height}return b}function e(a){return 0-a.options[a.axis+"Padding1"]}function f(a){var b=d(a.element),c=d(a.viewport),f=e(a);if("y"===a.axis)var g=0-b.height+c.height;else var g=0-b.width+c.width;return Math.min(g+a.options[a.axis+"Padding2"],f)}function g(a,b){return b>a.minScrollOffset?b-a.minScrollOffset:b<a.maxScrollOffset?b-a.maxScrollOffset:void 0}function h(a,b){return b>a.minScrollOffset?b=a.minScrollOffset:b<a.maxScrollOffset&&(b=a.maxScrollOffset),b}function i(a,b,d){c(a.element.scrollId,b,d);var e=m.createEvent("HTMLEvents");if(e.initEvent(b,!1,!0),e.scrollObj=a,d)for(var f in d)e[f]=d[f];a.element.dispatchEvent(e),a.viewport.dispatchEvent(e)}function j(a){var b,c={x:0,y:0},d=getComputedStyle(a.element).webkitTransform;return"none"!==d&&(b=d.match(/^matrix3d\((?:[-\d.]+,\s*){12}([-\d.]+),\s*([-\d.]+)(?:,\s*[-\d.]+){2}\)/)||d.match(/^matrix\((?:[-\d.]+,\s*){4}([-\d.]+),\s*([-\d.]+)\)$/))&&(c.x=parseFloat(b[1])||0,c.y=parseFloat(b[2])||0),c}function k(a,b){return q?"translate3d("+a+"px, "+b+"px, 0)":"translate("+a+"px, "+b+"px)"}function l(a,l){function m(a){return C||H?(a.preventDefault(),a.stopPropagation(),!1):!0}function q(a){C||H||setTimeout(function(){var b=document.createEvent("HTMLEvents");b.initEvent("niceclick",!0,!0),a.target.dispatchEvent(b)},300)}function t(a,b){E=null,clearTimeout(F),F=setTimeout(function(){E&&(E=null,r(a))},b||400),E=a}function u(){if(B.enabled){H&&A(),a.style.webkitBackfaceVisibility="hidden",a.style.webkitTransformStyle="preserve-3d";var b=j(B);a.style.webkitTransform=k(b.x,b.y),a.style.webkitTransition="",E=null,clearTimeout(F)}}function v(){if(B.enabled){var b=j(B)[B.axis],c=g(B,b);if(""===a.style.webkitTransition&&c){var d=h(B,b);c>0?i(B,"y"===B.axis?"pulldownend":"pullrightend"):0>c&&i(B,"y"===B.axis?"pullupend":"pullleftend"),a.style.webkitTransition="-webkit-transform 0.4s ease 0",a.style.webkitTransform="translate"+B.axis.toUpperCase()+"("+d.toFixed(0)+"px)",t(A,400),r(function(){H&&B.enabled&&(i(B,"scrolling"),r(arguments.callee))})}else H&&A()}}function w(a){B.enabled&&("y"!==B.axis&&a.isVertical||"x"===B.axis&&a.isVertical||(B.transformOffset=j(B),B.minScrollOffset=e(B),B.maxScrollOffset=f(B),G=2.5,J=!0,H=!0,I=!1,i(B,"scrollstart"),K=a["displacement"+B.axis.toUpperCase()]))}function x(b){if(B.enabled&&("y"===B.axis&&b.isVertical||"x"===B.axis&&!b.isVertical)){b.stopPropagation();var c=b["displacement"+B.axis.toUpperCase()];if(Math.abs(c-K)<5)return b.stopPropagation(),void 0;K=c;var d=B.transformOffset[B.axis]+c;d>B.minScrollOffset?(d=B.minScrollOffset+(d-B.minScrollOffset)/G,G*=1.003):d<B.maxScrollOffset&&(d=B.maxScrollOffset-(B.maxScrollOffset-d)/G,G*=1.003),G>4&&(G=4);var e=g(B,d);e&&(i(B,e>0?"y"===B.axis?"pulldown":"pullright":"y"===B.axis?"pullup":"pullleft",{boundaryOffset:Math.abs(e)}),B.options.noBounce&&(d=h(B,d))),a.style.webkitTransition="",a.style.webkitTransform="y"===B.axis?k(B.transformOffset.x,d):k(d,B.transformOffset.y),i(B,"scrolling")}}function y(a){B.enabled&&("y"!==B.axis&&a.isVertical||"x"===B.axis&&a.isVertical)}function z(d){if(B.enabled&&("y"===B.axis&&d.isVertical||"x"===B.axis&&!d.isVertical)){d.stopPropagation(),J=!0;var e,f,h,k,m,n,o,q,s,u,v,w,x,y,z,C,D;k=j(B)[B.axis];var E=g(B,k);if(!E){e=d["velocity"+B.axis.toUpperCase()];var F=2,G=.0015;l.inertia&&p[l.inertia]&&(F=p[l.inertia][0],G=p[l.inertia][1]),e>F&&(e=F),-F>e&&(e=-F),f=G*(e/Math.abs(e)),n=new b.motion({v:e,a:-f}),h=n.t,m=k+n.s;var K=g(B,m);if(K){c("惯性计算超出了边缘",K),o=e,q=f,K>0?(u=B.minScrollOffset,w=1):(u=B.maxScrollOffset,w=-1),v=new b.motion({v:w*o,a:-w*q,s:Math.abs(u-k)}),s=v.t;var L=v.generateCubicBezier();x=o-q*s,y=.03*(x/Math.abs(x)),D=new b.motion({v:x,a:-y}),z=D.t,C=u+D.s;{D.generateCubicBezier()}l.noBounce?(c("没有回弹效果"),k!==u?(a.style.webkitTransition="-webkit-transform "+(s/1e3).toFixed(2)+"s cubic-bezier("+L+") 0",a.style.webkitTransform="translate"+B.axis.toUpperCase()+"("+u.toFixed(0)+"px)",t(A,1e3*(s/1e3).toFixed(2))):A()):k!==C?(c("惯性滚动","s="+C.toFixed(0),"t="+((s+z)/1e3).toFixed(2)),a.style.webkitTransition="-webkit-transform "+((s+z)/1e3).toFixed(2)+"s ease-out 0",a.style.webkitTransform="translate"+B.axis.toUpperCase()+"("+C.toFixed(0)+"px)",t(function(){B.enabled&&(c("惯性回弹","s="+u.toFixed(0),"t=400"),C!==u?(a.style.webkitTransition="-webkit-transform 0.4s ease 0",a.style.webkitTransform="translate"+B.axis.toUpperCase()+"("+u.toFixed(0)+"px)",t(A,400)):A())},1e3*((s+z)/1e3).toFixed(2))):A()}else{c("惯性计算没有超出边缘");var M=n.generateCubicBezier();a.style.webkitTransition="-webkit-transform "+(h/1e3).toFixed(2)+"s cubic-bezier("+M+") 0",a.style.webkitTransform="translate"+B.axis.toUpperCase()+"("+m.toFixed(0)+"px)",t(A,1e3*(h/1e3).toFixed(2))}I=!0,r(function(){H&&I&&B.enabled&&(i(B,"scrolling",{afterFlick:!0}),r(arguments.callee))})}}}function A(){B.enabled&&(J=!1,setTimeout(function(){!J&&H&&(H=!1,I=!1,a.style.webkitTransition="",i(B,"scrollend"))},50))}var B=this;if(l=l||{},l.noBounce=!!l.noBounce,l.padding=l.padding||{},l.isPrevent=null==l.isPrevent?!0:!!l.isPrevent,l.isFixScrollendClick=null==l.isFixScrollendClick?!0:!!l.isFixScrollendClick,l.padding?(l.yPadding1=-l.padding.top||0,l.yPadding2=-l.padding.bottom||0,l.xPadding1=-l.padding.left||0,l.xPadding2=-l.padding.right||0):(l.yPadding1=0,l.yPadding2=0,l.xPadding1=0,l.xPadding2=0),l.margin?(l.yMargin1=-l.margin.top||0,l.yMargin2=-l.margin.bottom||0,l.xMargin1=-l.margin.left||0,l.xMargin2=-l.margin.right||0):(l.yMargin1=0,l.yMargin2=0,l.xMargin1=0,l.xMargin2=0),l.direction=l.direction||"y",l.inertia=l.inertia||"normal",this.options=l,B.axis=l.direction,this.element=a,this.viewport=a.parentNode,this.plugins={},this.viewport.addEventListener("touchstart",u,!1),this.viewport.addEventListener("touchend",v,!1),this.viewport.addEventListener("touchcancel",v,!1),this.viewport.addEventListener("panstart",w,!1),this.viewport.addEventListener("pan",x,!1),this.viewport.addEventListener("panend",y,!1),this.viewport.addEventListener("flick",z,!1),this.element.style.webkitBackfaceVisibility="hidden",this.element.style.webkitTransformStyle="preserve-3d",this.element.scrollId=setTimeout(function(){n[B.element.scrollId+""]=B},1),l.isPrevent&&(this.viewport.addEventListener("touchstart",function(){s=!0},!1),B.viewport.addEventListener("touchend",function(){s=!1},!1)),l.isFixScrollendClick){var C,D;this.viewport.addEventListener("scrolling",function(){C=!0,D&&clearTimeout(D),D=setTimeout(function(){C=!1},400)},!1),this.viewport.addEventListener("click",m,!1),this.viewport.addEventListener("tap",q,!1)}var E,F=0;a.addEventListener("webkitTransitionEnd",function(a){if(E){var b=E;E=null,clearTimeout(F),r(function(){b(a)})}},!1);var G,H,I,J;Object.defineProperty(this,"isScrolling",{get:function(){return!!H}});var K,L={init:function(){return this.enable(),this.refresh(),this.scrollTo(0),this},enable:function(){return this.enabled=!0,this},disable:function(){var a=this.element;return this.enabled=!1,r(function(){a.style.webkitTransform=getComputedStyle(a).webkitTransform}),this},getScrollWidth:function(){return d(this.element).width},getScrollHeight:function(){return d(this.element).height},getScrollLeft:function(){return-j(this).x-this.options.xPadding1},getScrollTop:function(){return-j(this).y-this.options.yPadding1},getMaxScrollLeft:function(){return-B.maxScrollOffset-this.options.xPadding1},getMaxScrollTop:function(){return-B.maxScrollOffset-this.options.yPadding1},getBoundaryOffset:function(){return Math.abs(g(this,j(this)[this.axis])||0)},refresh:function(){var a=this.element,b="y"===this.axis,c=b?"height":"width";if(null!=this.options[c])a.style[c]=this.options[c]+"px";else if(a.childElementCount>0){var g,h,k=a.firstElementChild,l=a.lastElementChild;if(document.createRange&&(g=document.createRange(),g.selectNodeContents(a),h=d(g)),h)a.style[c]=h[c]+"px";else if(k&&l){for(;k&&0===d(k)[c]&&k.nextElementSibling;)k=k.nextElementSibling;for(;l&&l!==k&&0===d(l)[c]&&l.previousElementSibling;)l=l.previousElementSibling;a.style[c]=d(l)[b?"bottom":"right"]-d(k)[b?"top":"left"]+"px"}else a.style[c]="0"}else a.style[c]="auto",a.style[c]=d(a)[c]+"px";return this.transformOffset=j(this),this.minScrollOffset=e(this),this.maxScrollOffset=f(this),this.scrollTo(-this.transformOffset[this.axis]-this.options[this.axis+"Padding1"]),i(this,"contentchange"),this},offset:function(a){var b=d(this.element),c=d(a);if("y"===this.axis){var e={top:c.top-b.top-this.options.yPadding1,left:c.left-b.left,right:b.right-c.right,width:c.width,height:c.height};e.bottom=e.top+e.height}else{var e={top:c.top-b.top,bottom:b.bottom-c.bottom,left:c.left-b.left-this.options.xPadding1,width:c.width,height:c.height};e.right=e.left+e.width}return e},getRect:function(a){var b=d(this.viewport),c=d(a);if("y"===this.axis){var e={top:c.top-b.top,left:c.left-b.left,right:b.right-c.right,width:c.width,height:c.height};e.bottom=e.top+e.height}else{var e={top:c.top-b.top,bottom:b.bottom-c.bottom,left:c.left-b.left,width:c.width,height:c.height};e.right=e.left+e.width}return e},isInView:function(a){var b=d(this.viewport),c=this.getRect(a);return"y"===this.axis?b.top<c.bottom&&b.bottom>c.top:b.left<c.right&&b.right>c.left},scrollTo:function(a,b){var c=this.element;return a=-a-this.options[this.axis+"Padding1"],a=h(this,a),b===!0?(c.style.webkitTransition="-webkit-transform 0.4s ease 0",t(A,400)):(c.style.webkitTransition="",t(A,1)),c.style.webkitTransform="y"===this.axis?k(j(this).x,a):k(a,j(this).y),this},scrollToElement:function(a,b){var c=this.offset(a);return c=c["y"===this.axis?"top":"left"],this.scrollTo(c,b)},getViewWidth:function(){return d(this.viewport).width},getViewHeight:function(){return d(this.viewport).height},addPulldownHandler:function(a){var b=this;return this.element.addEventListener("pulldownend",function(c){b.disable(),a(c,function(){b.scrollTo(0,!0),b.enable()})},!1),this},addPullupHandler:function(a){var b=this;return this.element.addEventListener("pullupend",function(c){b.disable(),a(c,function(){b.scrollTo(b.getScrollHeight(),!0),b.enable()})},!1),this},addScrollstartHandler:function(a){return this.element.addEventListener("scrollstart",function(b){a(b)},!1),this},addScrollingHandler:function(a){return this.element.addEventListener("scrolling",function(b){a(b)},!1),this},addScrollendHandler:function(a){return this.element.addEventListener("scrollend",function(b){a(b)},!1),this},addEventListener:function(){this.element.addEventListener.apply(this.element,arguments)},removeEventListener:function(){this.element.removeEventListener.apply(this.element,arguments)},enablePlugin:function(a,b){var c=o[a];return c&&!this.plugins[a]&&(this.plugins[a]=!0,b=b||{},c.call(this,a,b)),this}};for(var M in L)this[M]=L[M];delete L}var m=a.document,n={},o={},p={normal:[2,.0015],slow:[1.5,.003],veryslow:[1.5,.005]},q="WebKitCSSMatrix"in window&&"m11"in new WebKitCSSMatrix,r=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||function(a){setTimeout(a,16)}}(),s=!1;m.addEventListener("touchmove",function(a){return s?(a.preventDefault(),!1):!0},!1),b.scroll=function(a,b){if(1===arguments.length&&!(arguments[0]instanceof HTMLElement))if(b=arguments[0],b.scrollElement)a=b.scrollElement;else{if(!b.scrollWrap)throw new Error("no scroll element");a=b.scrollWrap.firstElementChild}if(!a.parentNode)throw new Error("wrong dom tree");if(b&&b.direction&&["x","y"].indexOf(b.direction)<0)throw new Error("wrong direction");var c;return c=a.scrollId?n[a.scrollId]:new l(a,b)},b.scroll.plugin=function(a,b){return b?(a=a.split(","),a.forEach(function(a){o[a]=b}),void 0):o[a]}}(window,window.lib||(window.lib={}));