!function(a,b){function c(a){return 0-(a.options[a.axis+"Padding1"]||0)}function d(a){var b=a.element.getBoundingClientRect(),d=a.element.parentNode.getBoundingClientRect(),e=c(a);if("y"===a.axis)var f=0-b.height+d.height;else var f=0-b.width+d.width;return Math.min(f+(a.options[a.axis+"Padding2"]||0),e)}function e(a,b){return b>a.minScrollOffset?b-a.minScrollOffset:b<a.maxScrollOffset?b-a.maxScrollOffset:void 0}function f(a,b){return b>a.minScrollOffset?b=a.minScrollOffset:b<a.maxScrollOffset&&(b=a.maxScrollOffset),b}function g(a,b,c){var d=k.createEvent("HTMLEvents");if(d.initEvent(b,!1,!0),d.scrollObj=a,c)for(var e in c)d[e]=c[e];a.element.dispatchEvent(d)}function h(a){var b,c={x:0,y:0},d=getComputedStyle(a.element).webkitTransform;return"none"!==d&&(b=d.match(/^matrix3d\(\d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, ([-\d.]+), ([-\d.]+), [-\d.]+, \d+\)/)||d.match(/^matrix\(\d+, \d+, \d+, \d+, ([-\d.]+), ([-\d.]+)\)$/))&&(c.x=parseInt(b[1])||0,c.y=parseInt(b[2])||0),c}function i(a,b){return n?"translate3d("+a+"px, "+b+"px, 0)":"translate("+a+"px, "+b+"px)"}function j(a,b){function j(){t.enabled&&(a.style.webkitBackfaceVisibility="hidden",a.style.webkitTransformStyle="preserve-3d",a.style.webkitTransform=getComputedStyle(a).webkitTransform,a.style.webkitTransition="",v=null,t.isScrolling=!1)}function k(){if(t.enabled){var c=h(t)[t.axis],d=!!b.bounceOffset,i=e(t,c),j=t.options[t.axis+"Padding1"],k=t.options[t.axis+"Padding2"];if(""===a.style.webkitTransition&&""===a.style.webkitAnimation&&i){var l;d&&i>0&&j&&i>j/2?(l=t.minScrollOffset+j,v=function(){g(t,"y"===t.axis?"pulldownend":"pullrightend")}):d&&0>i&&k&&Math.abs(i)>k/2?(l=t.maxScrollOffset-k,v=function(){g(t,"y"===t.axis?"pullupend":"pullleftend")}):(l=f(t,c),v=s),a.style.webkitTransition="-webkit-transform 0.4s ease 0",a.style.webkitTransform="translate"+t.axis.toUpperCase()+"("+l.toFixed(0)+"px)"}else t.isScrolling&&s()}}function n(a){t.enabled&&(("y"===t.axis&&a.isVertical||"x"===t.axis&&!a.isVertical)&&a.stopPropagation(),t.transformOffset=h(t),t.minScrollOffset=c(t),t.maxScrollOffset=d(t),t.panFixRatio=2.5,w=!1,t.isScrolling=!0,g(t,"scrollstart"))}function p(b){if(t.enabled&&("y"===t.axis&&b.isVertical||"x"===t.axis&&!b.isVertical)){b.stopPropagation();var c=t.transformOffset[t.axis]+b["displacement"+t.axis.toUpperCase()];c>t.minScrollOffset?(c=t.minScrollOffset+(c-t.minScrollOffset)/t.panFixRatio,t.panFixRatio*=1.003):c<t.maxScrollOffset&&(c=t.maxScrollOffset-(t.maxScrollOffset-c)/t.panFixRatio,t.panFixRatio*=1.003),t.panFixRatio>4&&(t.panFixRatio=4);var d=e(t,c);d&&(g(t,d>0?"y"===t.axis?"pulldown":"pullright":"y"===t.axis?"pullup":"pullleft",{boundaryOffset:Math.abs(d)}),t.options.noBounce&&(c=f(t,c))),a.style.webkitAnimation="",a.style.webkitTransition="",a.style.webkitTransform="y"===t.axis?i(t.transformOffset.x,c):i(c,t.transformOffset.y)}}function q(a){t.enabled&&("y"===t.axis&&a.isVertical||"x"===t.axis&&!a.isVertical)&&a.stopPropagation()}function r(c){if(t.enabled&&("y"===t.axis&&c.isVertical||"x"===t.axis&&!c.isVertical)){c.stopPropagation(),w=!0;var d,g,i,j,k,m,n,o,p,q,r,u,x,y,z,A,B;j=h(t)[t.axis];var C=e(t,j);if(!C){d=c["velocity"+t.axis.toUpperCase()],d>2&&(d=2),-2>d&&(d=-2),g=.0015*(d/Math.abs(d)),m=l({v:d,a:-g}),i=m.t,k=j+m.s;var D=e(t,k);if(D)b.noBounce?(q=f(t,k),a.style.webkitTransition="-webkit-transform 0.4s ease-out 0",a.style.webkitTransform="translate"+t.axis.toUpperCase()+"("+q.toFixed(0)+"px)",v=s):(n=d,o=g,D>0?(q=t.minScrollOffset,u=1):(q=t.maxScrollOffset,u=-1),r=l({v:u*n,a:-u*o,s:Math.abs(q-j)}),p=r.t,x=n-o*p,y=.03*(x/Math.abs(x)),B=l({v:x,a:-y}),z=B.t,A=q+B.s,a.style.webkitTransition="-webkit-transform "+((p+z)/1e3).toFixed(2)+"s ease-out 0",a.style.webkitTransform="translate"+t.axis.toUpperCase()+"("+A.toFixed(0)+"px)",v=function(){a.style.webkitTransition="-webkit-transform 0.4s ease 0",a.style.webkitTransform="translate"+t.axis.toUpperCase()+"("+q.toFixed(0)+"px)",v=s});else{var E=m.generateCubicBezier();a.style.webkitTransition="-webkit-transform "+(i/1e3).toFixed(2)+"s cubic-bezier("+E+") 0",a.style.webkitTransform="translate"+t.axis.toUpperCase()+"("+k.toFixed(0)+"px)",v=s}}}}function s(b){t.enabled&&(("y"===t.axis&&b&&b.isVertical||"x"===t.axis&&b&&!b.isVertical)&&b.stopPropagation(),w=!1,setTimeout(function(){w||(t.isScrolling=!1,a.style.webkitTransition="",a.style.webkitAnimation="",g(t,"scrollend"))},10))}var t=this;if(b=b||{},b.noBounce=!!b.noBounce,b.isPrevent=null==b.isPrevent?!0:!!b.isPrevent,b.padding&&(b.yPadding1=-b.padding.top||0,b.yPadding2=-b.padding.bottom||0,b.xPadding1=-b.padding.left||0,b.xPadding2=-b.padding.right||0),b.bounceOffset&&(b.yPadding1=b.bounceOffset.top||0,b.yPadding2=b.bounceOffset.bottom||0,b.xPadding1=b.bounceOffset.left||0,b.xPadding2=b.bounceOffset.right||0),this.options=b,t.axis=b.direction||"y",this.element=a,this.viewport=a.parentNode,this.viewport.addEventListener("touchstart",j,!1),this.viewport.addEventListener("touchend",k,!1),this.viewport.addEventListener("touchcancel",k,!1),this.viewport.addEventListener("panstart",n,!1),this.viewport.addEventListener("pan",p,!1),this.viewport.addEventListener("panend",q,!1),this.viewport.addEventListener("flick",r,!1),this.viewport.scrollId=setTimeout(function(){m[t.viewport.scrollId+""]=t},0),b.useLazyload&&(b.realtimeLazyload?t.addScrollingHandler(function(){t.checkLazyload()}):t.addScrollendHandler(function(){t.checkLazyload()})),b.isPrevent){var u="y"===this.axis?"vertical":"horizontal";this.viewport.addEventListener(u+"panstart",function(){o=!0},!1),t.viewport.addEventListener("panend",function(){o=!1},!1)}var v;a.addEventListener("webkitTransitionEnd",function(a){if(v){var b=v;v=null,b(a)}},!1);var w}var k=a.document,l=(k.documentElement,b.motion),m={},n="WebKitCSSMatrix"in window&&"m11"in new WebKitCSSMatrix,o=!1;document.addEventListener("touchmove",function(a){return o?(a.preventDefault(),!1):!0},!1);var p={init:function(){return this.enable(),this.refresh(),this.scrollTo(0),this},enable:function(){return this.enabled=!0,this},disable:function(){var a=this.element;return this.enabled=!1,setTimeout(function(){a.style.webkitTransform=getComputedStyle(a).webkitTransform,a.style.webkitAnimation=""},50),this},getScrollWidth:function(){return this.element.getBoundingClientRect().width-(this.options.xPadding1||0)-(this.options.xPadding2||0)},getScrollHeight:function(){return this.element.getBoundingClientRect().height-(this.options.yPadding1||0)-(this.options.yPadding2||0)},getScrollLeft:function(){return-h(this).x-(this.options.xPadding1||0)},getScrollTop:function(){return-h(this).y-(this.options.yPadding1||0)},refresh:function(){var a=this.element;if("y"===this.axis){a.style.height="auto";for(var b=a.firstElementChild;b&&!b.getBoundingClientRect().height;)b=b.nextElementSibling;for(var e=a.lastElementChild;e&&!e.getBoundingClientRect().height;)e=e.previousElementSibling;a.style.height=(this.options.height||(e&&e.getBoundingClientRect().bottom||0)-(b&&b.getBoundingClientRect().top||0))+"px"}else{a.style.width="auto";for(var b=a.firstElementChild;b&&!b.getBoundingClientRect().width;)b=b.nextElementSibling;for(var e=a.lastElementChild;e&&!e.getBoundingClientRect().width;)e=e.previousElementSibling;a.style.width=(this.options.width||(e&&e.getBoundingClientRect().right||0)-(b&&b.getBoundingClientRect().left||0))+"px"}return this.transformOffset=h(this),this.minScrollOffset=c(this),this.maxScrollOffset=d(this),this.scrollTo(-this.transformOffset[this.axis]-(this.options[this.axis+"Padding1"]||0)),this},offset:function(a){var b=this.element.getBoundingClientRect(),c=a.getBoundingClientRect();if("y"===this.axis){var d={top:c.top-((this.options.yPadding1||0)+b.top),left:c.left-b.left,right:b.right-c.right,width:c.width,height:c.height};d.bottom=d.top+d.height}else{var d={top:c.top-b.top,bottom:b.bottom-c.bottom,left:c.left-((this.options.xPadding1||0)+b.left),width:c.width,height:c.height};d.right=d.left+d.width}return d},getRect:function(a){var b=this.viewport.getBoundingClientRect(),c=a.getBoundingClientRect();if("y"===this.axis){var d={top:c.top-((this.options.yPadding1||0)+b.top),left:c.left-b.left,right:b.right-c.right,width:c.width,height:c.height};d.bottom=d.top+d.height}else{var d={top:c.top-b.top,bottom:b.bottom-c.bottom,left:c.left-((this.options.xPadding1||0)+b.left),width:c.width,height:c.height};d.right=d.left+d.width}return d},isInView:function(a){var b=this.viewport.getBoundingClientRect(),c=a.getBoundingClientRect();return"y"===this.axis?b.top<c.bottom&&b.bottom>c.top:b.left<c.right&&b.right>c.left},scrollTo:function(a,b){var c=this.element;return a=-a-(this.options[this.axis+"Padding1"]||0),a=f(this,a),b===!0?(c.style.webkitTransition="-webkit-transform 0.4s ease 0",webkitTransitionEndHandler=function(){c.style.webkitTransition="",c.style.webkitAnimation=""}):(c.style.webkitTransition="",c.style.webkitAnimation=""),c.style.webkitTransform="y"===this.axis?i(h(this).x,a):i(a,h(this).y),this},scrollToElement:function(a,b){var c=this.offset(a);return this.scrollTo("y"===this.axis?c.top:c.left,b)},getViewWidth:function(){return this.viewport.getBoundingClientRect().width},getViewHeight:function(){return this.viewport.getBoundingClientRect().height},addPulldownHandler:function(a){var b=this,c=this.element;c.addEventListener("pulldownend",function(c){b.disable(),a(c,function(){b.enable()})},!1)},addPullupHandler:function(a){var b=this,c=this.element;c.addEventListener("pullupend",function(c){b.disable(),a(c,function(){b.enable()})},!1)},addScrollingHandler:function(a){var b=this;b.scrollingHandlers=b.scrollingHandlers||[],b.scrollingHandlers.push(a),b.fireScrollingEvent||(b.firstScrollingEvent=!0,b.element.addEventListener("scrollstart",function(){setTimeout(function(){b.isScrolling&&(b.scrollingHandlers.forEach(function(a){setTimeout(a,1)}),setTimeout(arguments.callee,16))},16)},!1))},addScrollendHandler:function(a){var b=this;b.scrollendHandlers=b.scrollendHandlers||[],b.scrollendHandlers.push(a),b.fireScrollendEvent||(b.fireScrollendEvent=!0,b.element.addEventListener("scrollstart",function(){var a=0;setTimeout(function(){a!==b.getScrollTop()?(a=b.getScrollTop(),setTimeout(arguments.callee,150)):(a=0,b.scrollendHandlers.forEach(function(a){setTimeout(a,1)}))},150)},!1))},checkLazyload:function(){{var a=this;Array.prototype.slice.call(this.element.querySelectorAll("img.lazy")).filter(function(b){return a.isInView(b)}).forEach(function(a){a.src=a.getAttribute("dataimg"),a.className=a.className.split(" ").filter(function(a){return"lazy"!=a}).join(" ")})}},makeSticky:function(a){var b=a.parentNode,c=this;c.addScrollingHandler(function(){b==a.parentNode&&c.getRect(b).top<0&&(c.element.parentNode.appendChild(a),a.style.position="absolute",a.style.top="0"),b!=a.parentNode&&c.getRect(b).top>0&&(b.appendChild(a),a.style.position="",a.style.top="")})}};for(var q in p)j.prototype[q]=p[q];b.scroll=function(a,b){if(!a.parentNode)throw new Error("wrong dom tree");if(b&&b.direction&&["x","y"].indexOf(b.direction)<0)throw new Error("wrong direction");var c;return c=a.parentNode.scrollId?m[a.parentNode.scrollId]:new j(a,b)}}(window,window.lib||(window.lib={}));