!function(a,b){function c(){b.scroll.outputDebugLog&&console.debug.apply(console,arguments)}function d(a){var b=a.getBoundingClientRect();if(!b){b={},b.width=a.offsetWidth,b.height=a.offsetHeight,b.left=a.offsetLeft,b.top=a.offsetTop;for(var c=a.offsetParent;c;)b.left+=c.offsetLeft,b.top+=c.offsetTop,c=c.offsetParent;b.right=b.left+b.width,b.bottom=b.top+b.height}return b}function e(a){return 0-a.options[a.axis+"Padding1"]}function f(a){var b=d(a.element),c=d(a.viewport),f=e(a);if("y"===a.axis)var g=0-b.height+c.height;else var g=0-b.width+c.width;return Math.min(g+a.options[a.axis+"Padding2"],f)}function g(a,b){return b>a.minScrollOffset?b-a.minScrollOffset:b<a.maxScrollOffset?b-a.maxScrollOffset:void 0}function h(a,b){return b>a.minScrollOffset?b=a.minScrollOffset:b<a.maxScrollOffset&&(b=a.maxScrollOffset),b}function i(a,b,d){c(a.element.scrollId,b,d);var e=m.createEvent("HTMLEvents");if(e.initEvent(b,!1,!0),e.scrollObj=a,d)for(var f in d)e[f]=d[f];a.element.dispatchEvent(e),a.viewport.dispatchEvent(e)}function j(a){var b,c={x:0,y:0},d=getComputedStyle(a.element).webkitTransform;return"none"!==d&&(b=d.match(/^matrix3d\(\d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, ([-\d.]+), ([-\d.]+), [-\d.]+, \d+\)/)||d.match(/^matrix\(\d+, \d+, \d+, \d+, ([-\d.]+), ([-\d.]+)\)$/))&&(c.x=parseInt(b[1])||0,c.y=parseInt(b[2])||0),c}function k(a,b){return q?"translate3d("+a+"px, "+b+"px, 0)":"translate("+a+"px, "+b+"px)"}function l(a,l){function q(a){return a.preventScrollendClick=C,C?(a.preventDefault(),a.stopPropagation(),!1):!0}function t(a,b){D=null,clearTimeout(E),E=setTimeout(function(){D&&(D=null,r(a))},b||400),D=a}function u(){B.enabled&&(G&&A(),a.style.webkitBackfaceVisibility="hidden",a.style.webkitTransformStyle="preserve-3d",a.style.webkitTransform=getComputedStyle(a).webkitTransform,a.style.webkitTransition="",D=null,clearTimeout(E))}function v(){if(B.enabled){var b=j(B)[B.axis],c=g(B,b);if(""===a.style.webkitTransition&&c){var d=h(B,b);c>0?i(B,"y"===B.axis?"pulldownend":"pullrightend"):0>c&&i(B,"y"===B.axis?"pullupend":"pullleftend"),a.style.webkitTransition="-webkit-transform 0.4s ease 0",a.style.webkitTransform="translate"+B.axis.toUpperCase()+"("+d.toFixed(0)+"px)",t(A,400),B.fireScrollingEvent&&r(function(){G&&B.enabled&&(i(B,"scrolling"),r(arguments.callee))})}else G&&A()}}function w(a){B.enabled&&("y"!==B.axis&&a.isVertical||"x"===B.axis&&a.isVertical||(B.transformOffset=j(B),B.minScrollOffset=e(B),B.maxScrollOffset=f(B),F=2.5,I=!0,G=!0,H=!1,i(B,"scrollstart"),J=a["displacement"+B.axis.toUpperCase()]))}function x(b){if(B.enabled&&("y"===B.axis&&b.isVertical||"x"===B.axis&&!b.isVertical)){b.stopPropagation();var c=b["displacement"+B.axis.toUpperCase()];if(Math.abs(c-J)<5)return b.stopPropagation(),void 0;J=c;var d=B.transformOffset[B.axis]+c;d>B.minScrollOffset?(d=B.minScrollOffset+(d-B.minScrollOffset)/F,F*=1.003):d<B.maxScrollOffset&&(d=B.maxScrollOffset-(B.maxScrollOffset-d)/F,F*=1.003),F>4&&(F=4);var e=g(B,d);e&&(i(B,e>0?"y"===B.axis?"pulldown":"pullright":"y"===B.axis?"pullup":"pullleft",{boundaryOffset:Math.abs(e)}),B.options.noBounce&&(d=h(B,d))),a.style.webkitTransition="",a.style.webkitTransform="y"===B.axis?k(B.transformOffset.x,d):k(d,B.transformOffset.y),B.fireScrollingEvent&&i(B,"scrolling")}}function y(a){B.enabled&&("y"!==B.axis&&a.isVertical||"x"===B.axis&&a.isVertical)}function z(d){if(B.enabled&&("y"===B.axis&&d.isVertical||"x"===B.axis&&!d.isVertical)){d.stopPropagation(),I=!0;var e,f,k,m,n,o,q,s,u,v,w,x,y,z,C,D,E;m=j(B)[B.axis];var F=g(B,m);if(!F){e=d["velocity"+B.axis.toUpperCase()];var J=2,K=.0015;l.inertia&&p[l.inertia]&&(J=p[l.inertia][0],K=p[l.inertia][1]),e>J&&(e=J),-J>e&&(e=-J),f=K*(e/Math.abs(e)),o=new b.motion({v:e,a:-f}),k=o.t,n=m+o.s;var L=g(B,n);if(L)c("惯性计算超出了边缘",L),l.noBounce?(c("没有回弹效果"),v=h(B,n),m!==v?(a.style.webkitTransition="-webkit-transform 0.4s ease-out 0",a.style.webkitTransform="translate"+B.axis.toUpperCase()+"("+v.toFixed(0)+"px)",t(A,400)):A()):(q=e,s=f,L>0?(v=B.minScrollOffset,x=1):(v=B.maxScrollOffset,x=-1),w=new b.motion({v:x*q,a:-x*s,s:Math.abs(v-m)}),u=w.t,y=q-s*u,z=.03*(y/Math.abs(y)),E=new b.motion({v:y,a:-z}),C=E.t,D=v+E.s,c("惯性滚动","s="+D.toFixed(0),"t="+((u+C)/1e3).toFixed(2)),m!==D?(a.style.webkitTransition="-webkit-transform "+((u+C)/1e3).toFixed(2)+"s ease-out 0",a.style.webkitTransform="translate"+B.axis.toUpperCase()+"("+D.toFixed(0)+"px)",t(function(){B.enabled&&(c("惯性回弹","s="+v.toFixed(0),"t=400"),D!==v?(a.style.webkitTransition="-webkit-transform 0.4s ease 0",a.style.webkitTransform="translate"+B.axis.toUpperCase()+"("+v.toFixed(0)+"px)",t(A,400)):A())},1e3*((u+C)/1e3).toFixed(2))):A());else{c("惯性计算没有超出了边缘");var M=o.generateCubicBezier();a.style.webkitTransition="-webkit-transform "+(k/1e3).toFixed(2)+"s cubic-bezier("+M+") 0",a.style.webkitTransform="translate"+B.axis.toUpperCase()+"("+n.toFixed(0)+"px)",t(A,1e3*(k/1e3).toFixed(2))}B.fireScrollingEvent&&(H=!0,r(function(){G&&H&&B.enabled&&(i(B,"scrolling",{afterFlick:!0}),r(arguments.callee))}))}}}function A(){B.enabled&&(I=!1,setTimeout(function(){!I&&G&&(G=!1,H=!1,a.style.webkitTransition="",i(B,"scrollend"))},50))}var B=this;if(l=l||{},l.noBounce=!!l.noBounce,l.padding=l.padding||{},l.isPrevent=null==l.isPrevent?!0:!!l.isPrevent,l.isFixScrollendClick=null==l.isFixScrollendClick?!0:!!l.isFixScrollendClick,l.padding?(l.yPadding1=-l.padding.top||0,l.yPadding2=-l.padding.bottom||0,l.xPadding1=-l.padding.left||0,l.xPadding2=-l.padding.right||0):(l.yPadding1=0,l.yPadding2=0,l.xPadding1=0,l.xPadding2=0),l.margin?(l.yMargin1=-l.margin.top||0,l.yMargin2=-l.margin.bottom||0,l.xMargin1=-l.margin.left||0,l.xMargin2=-l.margin.right||0):(l.yMargin1=0,l.yMargin2=0,l.xMargin1=0,l.xMargin2=0),l.direction=l.direction||"y",l.inertia=l.inertia||"normal",this.options=l,B.axis=l.direction,this.element=a,this.viewport=a.parentNode,this.plugins={},this.viewport.addEventListener("touchstart",u,!1),this.viewport.addEventListener("touchend",v,!1),this.viewport.addEventListener("touchcancel",v,!1),this.viewport.addEventListener("panstart",w,!1),this.viewport.addEventListener("pan",x,!1),this.viewport.addEventListener("panend",y,!1),this.viewport.addEventListener("flick",z,!1),this.element.scrollId=setTimeout(function(){n[B.element.scrollId+""]=B},1),l.isPrevent&&(this.viewport.addEventListener("touchstart",function(){s=!0},!1),B.viewport.addEventListener("touchend",function(){s=!1},!1)),l.isFixScrollendClick){var C;this.viewport.addEventListener("touchstart",function(){G&&(C=!0)},!1),this.viewport.addEventListener("scrollend",function(){setTimeout(function(){C=!1},400)},!1),this.viewport.addEventListener("click",q,!1),this.viewport.addEventListener("tap",q,!1)}var D,E=0;a.addEventListener("webkitTransitionEnd",function(a){if(D){var b=D;D=null,clearTimeout(E),r(function(){b(a)})}},!1);var F,G,H,I,J,K={init:function(){return this.enable(),this.refresh(),this.scrollTo(0),this},enable:function(){return this.enabled=!0,this},disable:function(){var a=this.element;return this.enabled=!1,r(function(){a.style.webkitTransform=getComputedStyle(a).webkitTransform}),this},getScrollWidth:function(){return d(this.element).width},getScrollHeight:function(){return d(this.element).height},getScrollLeft:function(){return-j(this).x-this.options.xPadding1},getScrollTop:function(){return-j(this).y-this.options.yPadding1},getMaxScrollLeft:function(){return-B.maxScrollOffset-this.options.xPadding1},getMaxScrollTop:function(){return-B.maxScrollOffset-this.options.yPadding1},getBoundaryOffset:function(){return Math.abs(g(this,j(this)[this.axis])||0)},refresh:function(){var a=this.element,b="y"===this.axis,c=b?"height":"width";if(null!=this.options[c])a.style[c]=this.options[c]+"px";else if(a.childElementCount>0){var g,h,k=a.firstElementChild,l=a.lastElementChild;if(document.createRange&&(g=document.createRange(),g.selectNodeContents(a),h=d(g)),h)a.style[c]=h[c]+"px";else if(k&&l){for(;k&&0===d(k)[c]&&k.nextElementSibling;)k=k.nextElementSibling;for(;l&&l!==k&&0===d(l)[c]&&l.previousElementSibling;)l=l.previousElementSibling;a.style[c]=d(l)[b?"bottom":"right"]-d(k)[b?"top":"left"]+"px"}else a.style[c]="0"}else a.style[c]="auto",a.style[c]=d(a)[c]+"px";return this.transformOffset=j(this),this.minScrollOffset=e(this),this.maxScrollOffset=f(this),this.scrollTo(-this.transformOffset[this.axis]-this.options[this.axis+"Padding1"]),i(this,"contentchange"),this},offset:function(a){var b=d(this.element),c=d(a);if("y"===this.axis){var e={top:c.top-b.top-this.options.yPadding1,left:c.left-b.left,right:b.right-c.right,width:c.width,height:c.height};e.bottom=e.top+e.height}else{var e={top:c.top-b.top,bottom:b.bottom-c.bottom,left:c.left-b.left-this.options.xPadding1,width:c.width,height:c.height};e.right=e.left+e.width}return e},getRect:function(a){var b=d(this.viewport),c=d(a);if("y"===this.axis){var e={top:c.top-b.top,left:c.left-b.left,right:b.right-c.right,width:c.width,height:c.height};e.bottom=e.top+e.height}else{var e={top:c.top-b.top,bottom:b.bottom-c.bottom,left:c.left-b.left,width:c.width,height:c.height};e.right=e.left+e.width}return e},isInView:function(a){var b=d(this.viewport),c=this.getRect(a);return"y"===this.axis?b.top<c.bottom&&b.bottom>c.top:b.left<c.right&&b.right>c.left},scrollTo:function(a,b){var c=this.element;return a=-a-this.options[this.axis+"Padding1"],a=h(this,a),b===!0?(c.style.webkitTransition="-webkit-transform 0.4s ease 0",t(A,400)):(c.style.webkitTransition="",t(A,1)),c.style.webkitTransform="y"===this.axis?k(j(this).x,a):k(a,j(this).y),this},scrollToElement:function(a,b){var c=this.offset(a);return c=c["y"===this.axis?"top":"left"],this.scrollTo(c,b)},getViewWidth:function(){return d(this.viewport).width},getViewHeight:function(){return d(this.viewport).height},addPulldownHandler:function(a){var b=this;return this.element.addEventListener("pulldownend",function(c){b.disable(),a(c,function(){b.scrollTo(0,!0),b.enable()})},!1),this},addPullupHandler:function(a){var b=this;return this.element.addEventListener("pullupend",function(c){b.disable(),a(c,function(){b.scrollTo(b.getScrollHeight(),!0),b.enable()})},!1),this},addScrollstartHandler:function(a){return this.element.addEventListener("scrollstart",function(b){a(b)},!1),this},addScrollingHandler:function(a){if(!this.fireScrollingEvent){this.fireScrollingEvent=!0;var b=m.createElement("div");b.className="force-refresh",b.style.cssText="position: absolute; top: 0; left: 0; width: 0; height: 0; font-size: 0; opacity: 1;",this.viewport.appendChild(b),this.element.addEventListener("scrolling",function(){b.style.opacity=Math.abs(parseInt(b.style.opacity)-1)+""},!1)}return this.element.addEventListener("scrolling",function(b){a(b)},!1),this},addScrollendHandler:function(a){return this.element.addEventListener("scrollend",function(b){a(b)},!1),this},addEventListener:function(){this.element.addEventListener.apply(this.element,arguments)},removeEventListener:function(){this.element.removeEventListener.apply(this.element,arguments)},enablePlugin:function(a,b){var c=o[a];return c&&!this.plugins[a]&&(this.plugins[a]=!0,b=b||{},c.call(this,a,b)),this}};for(var L in K)this[L]=K[L];delete K}var m=a.document,n={},o={},p={normal:[2,.0015],slow:[1.5,.003],veryslow:[1.5,.005]},q="WebKitCSSMatrix"in window&&"m11"in new WebKitCSSMatrix,r=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||function(a){setTimeout(a,16)}}(),s=!1;m.addEventListener("touchmove",function(a){return s?(a.preventDefault(),!1):!0},!1),b.scroll=function(a,b){if(1===arguments.length&&!(arguments[0]instanceof HTMLElement))if(b=arguments[0],b.scrollElement)a=b.scrollElement;else{if(!b.scrollWrap)throw new Error("no scroll element");a=b.scrollWrap.firstElementChild}if(!a.parentNode)throw new Error("wrong dom tree");if(b&&b.direction&&["x","y"].indexOf(b.direction)<0)throw new Error("wrong direction");var c;return c=a.scrollId?n[a.scrollId]:new l(a,b)},b.scroll.plugin=function(a,b){return b?(a=a.split(","),a.forEach(function(a){o[a]=b}),void 0):o[a]}}(window,window.lib||(window.lib={}));
if (window.KISSY) {KISSY.add('mtb/lib-scroll/2.3.3/scroll.cmd', window.lib.scroll);} else if ('undefined' !== typeof define) {define('mtb/lib-scroll/2.3.3/scroll.cmd', [], window.lib.scroll);}