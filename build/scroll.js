!function(a,b){function c(a){return 0-(a.options[a.axis+"Padding1"]||0)}function d(a){var b=a.element.getBoundingClientRect(),d=a.element.parentNode.getBoundingClientRect(),e=c(a);if("y"===a.axis)var f=0-b.height+d.height;else var f=0-b.width+d.width;return Math.min(f+(a.options[a.axis+"Padding2"]||0),e)}function e(a,b){return b>a.minScrollOffset?b-a.minScrollOffset:b<a.maxScrollOffset?b-a.maxScrollOffset:void 0}function f(a,b){return b>a.minScrollOffset?b=a.minScrollOffset:b<a.maxScrollOffset&&(b=a.maxScrollOffset),b}function g(a,b,c){var d=k.createEvent("HTMLEvents");if(d.initEvent(b,!1,!0),d.scrollObj=a,c)for(var e in c)d[e]=c[e];a.element.dispatchEvent(d)}function h(a){var b,c={x:0,y:0},d=getComputedStyle(a.element).webkitTransform;return"none"!==d&&(b=d.match(/^matrix3d\(\d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, ([-\d.]+), ([-\d.]+), [-\d.]+, \d+\)/)||d.match(/^matrix\(\d+, \d+, \d+, \d+, ([-\d.]+), ([-\d.]+)\)$/))&&(c.x=parseInt(b[1])||0,c.y=parseInt(b[2])||0),c}function i(a,b){return n?"translate3d("+a+"px, "+b+"px, 0)":"translate("+a+"px, "+b+"px)"}function j(a,b){function j(){t.enabled&&(a.style.webkitBackfaceVisibility="hidden",a.style.webkitTransformStyle="preserve-3d",a.style.webkitTransform=getComputedStyle(a).webkitTransform,a.style.webkitTransition="",v=null,t.isScrolling=!1)}function k(){if(t.enabled){var c=h(t)[t.axis],d=!!b.bounceOffset,i=e(t,c),j=t.options[t.axis+"Padding1"],k=t.options[t.axis+"Padding2"];if(""===a.style.webkitTransition&&""===a.style.webkitAnimation&&i){var l;d&&i>0&&j&&i>j/2?(l=t.minScrollOffset+j,v=function(){g(t,"y"===t.axis?"pulldownend":"pullrightend")}):d&&0>i&&k&&Math.abs(i)>k/2?(l=t.maxScrollOffset-k,v=function(){g(t,"y"===t.axis?"pullupend":"pullleftend")}):(l=f(t,c),v=s),a.style.webkitTransition="-webkit-transform 0.4s ease 0",a.style.webkitTransform="translate"+t.axis.toUpperCase()+"("+l.toFixed(0)+"px)"}else t.isScrolling&&s()}}function n(a){t.enabled&&(a.stopPropagation(),t.transformOffset=h(t),t.minScrollOffset=c(t),t.maxScrollOffset=d(t),t.panFixRatio=2.5,w=!1,t.isScrolling=!0,g(t,"scrollstart"))}function p(c){if(t.enabled){c.stopPropagation();var d=t.transformOffset[t.axis]+c["displacement"+t.axis.toUpperCase()];d>t.minScrollOffset?(d=t.minScrollOffset+(d-t.minScrollOffset)/t.panFixRatio,t.panFixRatio*=1.003):d<t.maxScrollOffset&&(d=t.maxScrollOffset-(t.maxScrollOffset-d)/t.panFixRatio,t.panFixRatio*=1.003),t.panFixRatio>4&&(t.panFixRatio=4);var h=e(t,d);h&&(g(t,h>0?"y"===t.axis?"pulldown":"pullright":"y"===t.axis?"pullup":"pullleft",{boundaryOffset:Math.abs(h)}),t.options.noBounce&&(d=f(t,d))),b.fireScrollingEvent&&g(t,"scrolling"),a.style.webkitAnimation="",a.style.webkitTransition="",a.style.webkitTransform="y"===t.axis?i(t.transformOffset.x,d):i(d,t.transformOffset.y)}}function q(a){t.enabled&&a.stopPropagation()}function r(c){if(t.enabled){c.stopPropagation(),w=!0;var d,i,j,k,m,n,o,p,q,r,u,x,y,z,A,B,C;k=h(t)[t.axis];var D=e(t,k);if(!D){d=c["velocity"+t.axis.toUpperCase()],d>3&&(d=3),-3>d&&(d=-3),i=.001*(d/Math.abs(d)),n=l({v:d,a:-i}),j=n.t,m=k+n.s;var E=e(t,m);if(E)b.noBounce?(r=f(t,m),a.style.webkitTransition="-webkit-transform 0.4s ease-out 0",a.style.webkitTransform="translate"+t.axis.toUpperCase()+"("+r.toFixed(0)+"px)",v=s):(o=d,p=i,E>0?(r=t.minScrollOffset,x=1):(r=t.maxScrollOffset,x=-1),u=l({v:x*o,a:-x*p,s:Math.abs(r-k)}),q=u.t,y=o-p*q,z=.03*(y/Math.abs(y)),C=l({v:y,a:-z}),A=C.t,B=r+C.s,a.style.webkitTransition="-webkit-transform "+((q+A)/1e3).toFixed(2)+"s ease-out 0",a.style.webkitTransform="translate"+t.axis.toUpperCase()+"("+B.toFixed(0)+"px)",v=function(){a.style.webkitTransition="-webkit-transform 0.4s ease 0",a.style.webkitTransform="translate"+t.axis.toUpperCase()+"("+r.toFixed(0)+"px)",v=s});else{var F=n.generateCubicBezier();a.style.webkitTransition="-webkit-transform "+(j/1e3).toFixed(2)+"s cubic-bezier("+F+") 0",a.style.webkitTransform="translate"+t.axis.toUpperCase()+"("+m.toFixed(0)+"px)",v=s}b.fireScrollingEvent&&setTimeout(function(){t.isScrolling&&(g(t,"scrolling"),setTimeout(arguments.callee,10))},10)}}}function s(b){t.enabled&&(b&&b.stopPropagation(),w=!1,setTimeout(function(){w||(t.isScrolling=!1,a.style.webkitTransition="",a.style.webkitAnimation="",g(t,"scrollend"))},10))}var t=this;if(b=b||{},b.noBounce=!!b.noBounce,b.isPrevent=!!b.isPrevent,b.padding&&(b.yPadding1=-b.padding.top||0,b.yPadding2=-b.padding.bottom||0,b.xPadding1=-b.padding.left||0,b.xPadding2=-b.padding.right||0),b.bounceOffset&&(b.yPadding1=b.bounceOffset.top||0,b.yPadding2=b.bounceOffset.bottom||0,b.xPadding1=b.bounceOffset.left||0,b.xPadding2=b.bounceOffset.right||0),this.options=b,t.axis=b.direction||"y",this.element=a,this.viewport=a.parentNode,this.viewport.addEventListener("touchstart",j,!1),this.viewport.addEventListener("touchend",k,!1),this.viewport.addEventListener("touchcancel",k,!1),this.viewport.addEventListener("panstart",n,!1),this.viewport.addEventListener("pan",p,!1),this.viewport.addEventListener("panend",q,!1),this.viewport.addEventListener("flick",r,!1),this.viewport.scrollId=setTimeout(function(){m[t.viewport.scrollId+""]=t},0),b.isPrevent){var u="y"===this.axis?"vertical":"horizontal";this.viewport.addEventListener(u+"panstart",function(){o=!0},!1),t.viewport.addEventListener("panend",function(){o=!1},!1)}var v;a.addEventListener("webkitTransitionEnd",function(a){if(v){var b=v;v=null,b(a)}},!1);var w}var k=a.document,l=(k.documentElement,b.motion),m={},n="WebKitCSSMatrix"in window&&"m11"in new WebKitCSSMatrix,o=!1;document.addEventListener("touchmove",function(a){return o?(a.preventDefault(),!1):!0},!1);var p={init:function(){return this.enable(),this.refresh(),this.scrollTo(0),this},enable:function(){return this.enabled=!0,this},disable:function(){var a=this.element;return this.enabled=!1,setTimeout(function(){a.style.webkitTransform=getComputedStyle(a).webkitTransform,a.style.webkitAnimation=""},50),this},getScrollWidth:function(){return this.element.getBoundingClientRect().width-(this.options.xPadding1||0)-(this.options.xPadding2||0)},getScrollHeight:function(){return this.element.getBoundingClientRect().height-(this.options.yPadding1||0)-(this.options.yPadding2||0)},getScrollLeft:function(){return-h(this).x-(this.options.xPadding1||0)},getScrollTop:function(){return-h(this).y-(this.options.yPadding1||0)},refresh:function(){var a=this.element;return"y"===this.axis?(a.style.height="auto",a.style.height=(this.options.height||a.lastElementChild.getBoundingClientRect().bottom-a.firstElementChild.getBoundingClientRect().top)+"px"):(a.style.width="auto",a.style.width=(this.options.width||a.lastElementChild.getBoundingClientRect().right-a.firstElementChild.getBoundingClientRect().left)+"px"),this.transformOffset=h(this),this.minScrollOffset=c(this),this.maxScrollOffset=d(this),this.scrollTo(-this.transformOffset[this.axis]-(this.options[this.axis+"Padding1"]||0)),this},offset:function(a){var b=this.element.getBoundingClientRect(),c=a.getBoundingClientRect();if("y"===this.axis){var d={top:c.top-((this.options.yPadding1||0)+b.top),left:c.left-b.left,right:b.right-c.right,width:c.width,height:c.height};d.bottom=d.top+d.height}else{var d={top:c.top-b.top,bottom:b.bottom-c.bottom,left:c.left-((this.options.xPadding1||0)+b.left),width:c.width,height:c.height};d.right=d.left+d.width}return d},getRect:function(a){var b=this.viewport.getBoundingClientRect(),c=a.getBoundingClientRect();if("y"===this.axis){var d={top:c.top-((this.options.yPadding1||0)+b.top),left:c.left-b.left,right:b.right-c.right,width:c.width,height:c.height};d.bottom=d.top+d.height}else{var d={top:c.top-b.top,bottom:b.bottom-c.bottom,left:c.left-((this.options.xPadding1||0)+b.left),width:c.width,height:c.height};d.right=d.left+d.width}return d},isInView:function(a){var b=this.viewport.getBoundingClientRect(),c=a.getBoundingClientRect();return"y"===this.axis?b.top<c.bottom&&b.bottom>c.top:b.left<c.right&&b.right>c.left},scrollTo:function(a,b){var c=this.element;return a=-a-(this.options[this.axis+"Padding1"]||0),a=f(this,a),b===!0?(c.style.webkitTransition="-webkit-transform 0.4s ease 0",webkitTransitionEndHandler=function(){c.style.webkitTransition="",c.style.webkitAnimation=""}):(c.style.webkitTransition="",c.style.webkitAnimation=""),c.style.webkitTransform="y"===this.axis?i(h(this).x,a):i(a,h(this).y),this},scrollToElement:function(a,b){var c=this.offset(a);return this.scrollTo("y"===this.axis?c.top:c.left,b)},getViewWidth:function(){return this.viewport.getBoundingClientRect().width},getViewHeight:function(){return this.viewport.getBoundingClientRect().height},addPulldownHandler:function(a){var b=this,c=this.element;c.addEventListener("pulldownend",function(c){b.disable(),a(c,function(){b.enable()})},!1)},addPullupHandler:function(a){var b=this,c=this.element;c.addEventListener("pullupend",function(c){b.disable(),a(c,function(){b.enable()})},!1)}};for(var q in p)j.prototype[q]=p[q];b.scroll=function(a,b){if(!a.parentNode)throw new Error("wrong dom tree");if(b&&b.direction&&["x","y"].indexOf(b.direction)<0)throw new Error("wrong direction");var c;return c=a.parentNode.scrollId?m[a.parentNode.scrollId]:new j(a,b)}}(window,window.lib||(window.lib={}));