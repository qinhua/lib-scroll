!function(a,b){function c(){b.scroll.outputDebugLog&&console.debug.apply(console,arguments)}function d(a){var b=a.getBoundingClientRect();if(!b){b={},b.width=a.offsetWidth,b.height=a.offsetHeight,b.left=a.offsetLeft,b.top=a.offsetTop;for(var c=a.offsetParent;c;)b.left+=c.offsetLeft,b.top+=c.offsetTop,c=c.offsetParent;b.right=b.left+b.width,b.bottom=b.top+b.height}return b}function e(a){return 0-a.options[a.axis+"PaddingTop"]}function f(a){var b=d(a.element),c=d(a.viewport),f=e(a);if("y"===a.axis)var g=0-b.height+c.height;else var g=0-b.width+c.width;return Math.min(g+a.options[a.axis+"PaddingBottom"],f)}function g(a,b){return b>a.minScrollOffset?b-a.minScrollOffset:b<a.maxScrollOffset?b-a.maxScrollOffset:void 0}function h(a,b){return b>a.minScrollOffset?b=a.minScrollOffset:b<a.maxScrollOffset&&(b=a.maxScrollOffset),b}function i(a,b,d){c(a.element.scrollId,b,d);var e=o.createEvent("HTMLEvents");if(e.initEvent(b,!1,!0),e.scrollObj=a,d)for(var f in d)e[f]=d[f];a.element.dispatchEvent(e),a.viewport.dispatchEvent(e)}function j(a){var b,c={x:0,y:0},d=getComputedStyle(a.element)[x+"Transform"];return"none"!==d&&(b=d.match(/^matrix3d\((?:[-\d.]+,\s*){12}([-\d.]+),\s*([-\d.]+)(?:,\s*[-\d.]+){2}\)/)||d.match(/^matrix\((?:[-\d.]+,\s*){4}([-\d.]+),\s*([-\d.]+)\)$/))&&(c.x=parseFloat(b[1])||0,c.y=parseFloat(b[2])||0),c}function k(a,b){return a=parseFloat(a),b=parseFloat(b),0!=a&&(a+="px"),0!=b&&(b+="px"),z?"translate3d("+a+", "+b+", 0)":"translate("+a+", "+b+")"}function l(a,b,c){a.element.style[x+"Transition"]=""===b&&""===c?"":w+"transform "+b+" "+c+" 0s"}function m(a,b){var c=0,d=0;"object"==typeof b?(c=b.x,d=b.y):"y"===a.axis?d=b:c=b,a.element.style[x+"Transform"]=k(c,d)}function n(a,k){function n(a){return F||L?(a.preventDefault(),a.stopPropagation(),!1):!0}function o(a){F||L||setTimeout(function(){var b=document.createEvent("HTMLEvents");b.initEvent("niceclick",!0,!0),a.target.dispatchEvent(b)},300)}function p(a,c){I=null,clearTimeout(J),J=setTimeout(function(){I&&(I=null,b.animation.requestFrame(a))},c||400),I=a}function s(a){if(!E.enabled)return!1;if("undefined"!=typeof a.isVertical){if(!("y"===E.axis&&a.isVertical||"x"===E.axis&&!a.isVertical))return!1;a.stopPropagation()}return!0}function v(a){if(s(a))if(L&&D(),k.useFrameAnimation)H&&H.stop(),H=null;else{var b=j(E);m(E,b),l(E,"",""),I=null,clearTimeout(J)}}function w(a){if(s(a)){var c=j(E)[E.axis],d=g(E,c);if(d){var e=h(E,c);if(k.useFrameAnimation){var f=e-c;H=new b.animation(400,b.cubicbezier.ease,0,function(a,b){var d=(c+f*b).toFixed(2);m(E,d),i(E,"scrolling")}),H.onend(D),H.play()}else{var n=e.toFixed(0);l(E,"0.4s","ease"),m(E,n),p(D,400),b.animation.requestFrame(function(){L&&E.enabled&&(i(E,"scrolling"),b.animation.requestFrame(arguments.callee))})}d>0?i(E,"y"===E.axis?"pulldownend":"pullrightend"):0>d&&i(E,"y"===E.axis?"pullupend":"pullleftend")}else L&&D()}}function y(a){s(a)&&(E.transformOffset=j(E),E.minScrollOffset=e(E),E.maxScrollOffset=f(E),K=2.5,N=!0,L=!0,M=!1,i(E,"scrollstart"),O=a["displacement"+E.axis.toUpperCase()])}function z(a){if(s(a)){var b=a["displacement"+E.axis.toUpperCase()];if(Math.abs(b-O)<5)return a.stopPropagation(),void 0;O=b;var c=E.transformOffset[E.axis]+b;c>E.minScrollOffset?(c=E.minScrollOffset+(c-E.minScrollOffset)/K,K*=1.003):c<E.maxScrollOffset&&(c=E.maxScrollOffset-(E.maxScrollOffset-c)/K,K*=1.003),K>4&&(K=4);var d=g(E,c);d&&(i(E,d>0?"y"===E.axis?"pulldown":"pullright":"y"===E.axis?"pullup":"pullleft",{boundaryOffset:Math.abs(d)}),E.options.noBounce&&(c=h(E,c))),m(E,c.toFixed(2)),i(E,"scrolling")}}function B(a){s(a)&&a.isflick&&C(a)}function C(a){N=!0;var d,e,f,h,n,o,q,r,s,u,v,w,x,y,z,A,B;h=j(E)[E.axis];var C=g(E,h);if(!C){d=a["velocity"+E.axis.toUpperCase()];var F=2,G=.0015;k.inertia&&t[k.inertia]&&(F=t[k.inertia][0],G=t[k.inertia][1]),d>F&&(d=F),-F>d&&(d=-F),e=G*(d/Math.abs(d)),o=new b.motion({v:d,a:-e}),f=o.t,n=h+o.s;var I=g(E,n);if(I){c("惯性计算超出了边缘",I),q=d,r=e,I>0?(u=E.minScrollOffset,w=1):(u=E.maxScrollOffset,w=-1),v=new b.motion({v:w*q,a:-w*r,s:Math.abs(u-h)}),s=v.t;var J=v.generateCubicBezier();x=q-r*s,y=.03*(x/Math.abs(x)),B=new b.motion({v:x,a:-y}),z=B.t,A=u+B.s;{B.generateCubicBezier()}if(k.noBounce)if(c("没有回弹效果"),h!==u)if(k.useFrameAnimation){var K=u-h,O=b.cubicbezier(J[0][0],J[0][1],J[1][0],J[1][1]);H=new b.animation(s.toFixed(0),O,0,function(a,b){var c=h+K*b;j(E,c.toFixed(2)),i(E,"scrolling",{afterFlick:!0})}),H.onend(D),H.play()}else{var P=u.toFixed(0);l(E,(s/1e3).toFixed(2)+"s","cubic-bezier("+J+")"),m(E,P),p(D,1e3*(s/1e3).toFixed(2))}else D();else if(h!==A)if(c("惯性滚动","s="+A.toFixed(0),"t="+((s+z)/1e3).toFixed(2)),k.useFrameAnimation){var K=A-h,O=b.cubicbezier.easeOut;H=new b.animation((s+z).toFixed(0),O,0,function(a,b){var c=h+K*b;m(E,c.toFixed(2)),i(E,"scrolling",{afterFlick:!0})}),H.onend(function(){if(E.enabled){var a=u-A,c=b.cubicbezier.ease;H=new b.animation(400,c,0,function(b,c){var d=A+a*c;m(E,d.toFixed(2)),i(E,"scrolling",{afterFlick:!0})}),H.onend(D),H.play()}}),H.play()}else{var P=A.toFixed(0);l(E,((s+z)/1e3).toFixed(2)+"s","ease-out"),m(E,P),p(function(){if(E.enabled)if(c("惯性回弹","s="+u.toFixed(0),"t=400"),A!==u){var a=u.toFixed(0);l(E,"0.4s","ease"),m(E,a),p(D,400)}else D()},1e3*((s+z)/1e3).toFixed(2))}else D()}else{c("惯性计算没有超出边缘");var Q=o.generateCubicBezier();if(k.useFrameAnimation){var K=n-h,O=b.cubicbezier(Q[0][0],Q[0][1],Q[1][0],Q[1][1]);H=new b.animation(f.toFixed(0),O,0,function(a,b){var c=(h+K*b).toFixed(2);m(E,c),i(E,"scrolling",{afterFlick:!0})}),H.onend(D),H.play()}else{var P=n.toFixed(0);l(E,(f/1e3).toFixed(2)+"s","cubic-bezier("+Q+")"),m(E,P),p(D,1e3*(f/1e3).toFixed(2))}}M=!0,k.useFrameAnimation||b.animation.requestFrame(function(){L&&M&&E.enabled&&(i(E,"scrolling",{afterFlick:!0}),b.animation.requestFrame(arguments.callee))})}}function D(){E.enabled&&(N=!1,setTimeout(function(){!N&&L&&(L=!1,M=!1,k.useFrameAnimation?(H&&H.stop(),H=null):l(E,"",""),i(E,"scrollend"))},50))}var E=this;if(k=k||{},k.noBounce=!!k.noBounce,k.padding=k.padding||{},k.isPrevent=null==k.isPrevent?!0:!!k.isPrevent,k.isFixScrollendClick=null==k.isFixScrollendClick?!0:!!k.isFixScrollendClick,k.padding?(k.yPaddingTop=-k.padding.top||0,k.yPaddingBottom=-k.padding.bottom||0,k.xPaddingTop=-k.padding.left||0,k.xPaddingBottom=-k.padding.right||0):(k.yPaddingTop=0,k.yPaddingBottom=0,k.xPaddingTop=0,k.xPaddingBottom=0),k.direction=k.direction||"y",k.inertia=k.inertia||"normal",this.options=k,E.axis=k.direction,this.element=a,this.viewport=a.parentNode,this.plugins={},this.element.scrollId=setTimeout(function(){q[E.element.scrollId+""]=E},1),this.viewport.addEventListener("touchstart",v,!1),this.viewport.addEventListener("touchend",w,!1),this.viewport.addEventListener("touchcancel",w,!1),this.viewport.addEventListener("panstart",y,!1),this.viewport.addEventListener("pan",z,!1),this.viewport.addEventListener("panend",B,!1),k.isPrevent&&(this.viewport.addEventListener("touchstart",function(){A=!0},!1),E.viewport.addEventListener("touchend",function(){A=!1},!1)),k.isFixScrollendClick){var F,G;this.viewport.addEventListener("scrolling",function(){F=!0,G&&clearTimeout(G),G=setTimeout(function(){F=!1},400)},!1),this.viewport.addEventListener("click",n,!1),this.viewport.addEventListener("tap",o,!1)}if(k.useFrameAnimation){var H;Object.defineProperty(this,"animation",{get:function(){return H}})}else{var I,J=0;a.addEventListener(u?"transitionend":x+"TransitionEnd",function(a){if(I){var c=I;I=null,clearTimeout(J),b.animation.requestFrame(function(){c(a)})}},!1)}var K,L,M,N;Object.defineProperty(this,"isScrolling",{get:function(){return!!L}});var O,P={init:function(){return this.enable(),this.refresh(),this.scrollTo(0),this},enable:function(){return this.enabled=!0,this},disable:function(){var a=this.element;return this.enabled=!1,this.options.useFrameAnimation?H&&H.stop():b.animation.requestFrame(function(){a.style[x+"Transform"]=getComputedStyle(a)[x+"Transform"]}),this},getScrollWidth:function(){return d(this.element).width},getScrollHeight:function(){return d(this.element).height},getScrollLeft:function(){return-j(this).x-this.options.xPaddingTop},getScrollTop:function(){return-j(this).y-this.options.yPaddingTop},getMaxScrollLeft:function(){return-E.maxScrollOffset-this.options.xPaddingTop},getMaxScrollTop:function(){return-E.maxScrollOffset-this.options.yPaddingTop},getBoundaryOffset:function(){return Math.abs(g(this,j(this)[this.axis])||0)},refresh:function(){var a=this.element,b="y"===this.axis,c=b?"height":"width";if(null!=this.options[c])a.style[c]=this.options[c]+"px";else if(this.options.useElementRect)a.style[c]="auto",a.style[c]=d(a)[c]+"px";else if(a.childElementCount>0){var g,h,k=a.firstElementChild,l=a.lastElementChild;if(document.createRange&&!this.options.ignoreOverflow&&(g=document.createRange(),g.selectNodeContents(a),h=d(g)),h)a.style[c]=h[c]+"px";else{for(;k&&0===d(k)[c]&&k.nextElementSibling;)k=k.nextElementSibling;for(;l&&l!==k&&0===d(l)[c]&&l.previousElementSibling;)l=l.previousElementSibling;a.style[c]=d(l)[b?"bottom":"right"]-d(k)[b?"top":"left"]+"px"}}return this.transformOffset=j(this),this.minScrollOffset=e(this),this.maxScrollOffset=f(this),this.scrollTo(-this.transformOffset[this.axis]-this.options[this.axis+"PaddingTop"]),i(this,"contentrefresh"),this},offset:function(a){var b=d(this.element),c=d(a);if("y"===this.axis){var e={top:c.top-b.top-this.options.yPaddingTop,left:c.left-b.left,right:b.right-c.right,width:c.width,height:c.height};e.bottom=e.top+e.height}else{var e={top:c.top-b.top,bottom:b.bottom-c.bottom,left:c.left-b.left-this.options.xPaddingTop,width:c.width,height:c.height};e.right=e.left+e.width}return e},getRect:function(a){var b=d(this.viewport),c=d(a);if("y"===this.axis){var e={top:c.top-b.top,left:c.left-b.left,right:b.right-c.right,width:c.width,height:c.height};e.bottom=e.top+e.height}else{var e={top:c.top-b.top,bottom:b.bottom-c.bottom,left:c.left-b.left,width:c.width,height:c.height};e.right=e.left+e.width}return e},isInView:function(a){var b=this.getRect(this.viewport),c=this.getRect(a);return"y"===this.axis?b.top<c.bottom&&b.bottom>c.top:b.left<c.right&&b.right>c.left},scrollTo:function(a,c){{var d=this;this.element}if(a=-a-this.options[this.axis+"PaddingTop"],a=h(this,a),L=!0,c===!0)if(this.options.useFrameAnimation){var e=j(d)[this.axis],f=a-e;H=new b.animation(400,b.cubicbezier.ease,0,function(a,b){var c=(e+f*b).toFixed(2);m(d,c),i(d,"scrolling")}),H.onend(D),H.play()}else l(d,"0.4s","ease"),m(d,a),p(D,400),b.animation.requestFrame(function(){L&&d.enabled&&(i(d,"scrolling"),b.animation.requestFrame(arguments.callee))});else this.options.useFrameAnimation||l(d,"",""),m(d,a),D();return this},scrollToElement:function(a,b){var c=this.offset(a);return c=c["y"===this.axis?"top":"left"],this.scrollTo(c,b)},getViewWidth:function(){return d(this.viewport).width},getViewHeight:function(){return d(this.viewport).height},addPulldownHandler:function(a){var b=this;return this.element.addEventListener("pulldownend",function(c){b.disable(),a.call(b,c,function(){b.scrollTo(0,!0),b.refresh(),b.enable()})},!1),this},addPullupHandler:function(a){var b=this;return this.element.addEventListener("pullupend",function(c){b.disable(),a.call(b,c,function(){b.scrollTo(b.getScrollHeight(),!0),b.refresh(),b.enable()})},!1),this},addScrollstartHandler:function(a){var b=this;return this.element.addEventListener("scrollstart",function(c){a.call(b,c)},!1),this},addScrollingHandler:function(a){var b=this;return this.element.addEventListener("scrolling",function(c){a.call(b,c)},!1),this},addScrollendHandler:function(a){var b=this;return this.element.addEventListener("scrollend",function(c){a.call(b,c)},!1),this},addContentrenfreshHandler:function(a){var b=this;this.element.addEventListener("contentrefresh",function(c){a.call(b,c)},!1)},addEventListener:function(a,b,c){var d=this;this.element.addEventListener(a,function(a){b.call(d,a)},!!c)},removeEventListener:function(a,b){var c=this;this.element.removeEventListener(a,function(a){b.call(c,a)})},enablePlugin:function(a,b){var c=r[a];return c&&!this.plugins[a]&&(this.plugins[a]=!0,b=b||{},c.call(this,a,b)),this}};for(var Q in P)this[Q]=P[Q];delete P}var o=a.document,p=a.navigator.userAgent,q={},r={},s=a.dpr||(a.navigator.userAgent.match(/iPhone|iPad|iPod/)?document.documentElement.clientWidth/a.screen.availWidth:1),t={normal:[2*s,.0015*s],slow:[1.5*s,.003*s],veryslow:[1.5*s,.005*s]},u=!!p.match(/Firefox/i),v=!!p.match(/IEMobile/i),w=u?"-moz-":v?"-ms-":"-webkit-",x=u?"Moz":v?"ms":"webkit",y=v?"MSCSSMatrix":"WebKitCSSMatrix",z=!!u||y in a&&"m11"in new a[y],A=!1;o.addEventListener("touchmove",function(a){return A?(a.preventDefault(),!1):!0},!1),b.scroll=function(a,c){if(1===arguments.length&&!(arguments[0]instanceof HTMLElement))if(c=arguments[0],c.scrollElement)a=c.scrollElement;else{if(!c.scrollWrap)throw new Error("no scroll element");a=c.scrollWrap.firstElementChild}if(!a.parentNode)throw new Error("wrong dom tree");if(c&&c.direction&&["x","y"].indexOf(c.direction)<0)throw new Error("wrong direction");var d;return d=c.downgrade===!0&&b.scroll.downgrade?b.scroll.downgrade(a,c):a.scrollId?q[a.scrollId]:new n(a,c)},b.scroll.plugin=function(a,b){return b?(a=a.split(","),a.forEach(function(a){r[a]=b}),void 0):r[a]}}(window,window.lib||(window.lib={}));