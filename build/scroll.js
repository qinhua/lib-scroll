!function(a,b){function c(a){return 0-(a.options[a.axis+"Padding1"]||0)}function d(a){var b=a.element.getBoundingClientRect(),d=a.element.parentNode.getBoundingClientRect(),e=c(a);if("y"===a.axis)var f=0-b.height+d.height;else var f=0-b.width+d.width;return Math.min(f+(a.options[a.axis+"Padding2"]||0),e)}function e(a,b){return b>a.minScrollOffset?b-a.minScrollOffset:b<a.maxScrollOffset?b-a.maxScrollOffset:void 0}function f(a,b){return b>a.minScrollOffset?b=a.minScrollOffset:b<a.maxScrollOffset&&(b=a.maxScrollOffset),b}function g(a,b,c){var d=k.createEvent("HTMLEvents");if(d.initEvent(b,!1,!0),d.scrollObj=a,c)for(var e in c)d[e]=c[e];a.element.dispatchEvent(d)}function h(a){var b,c={x:0,y:0},d=getComputedStyle(a.element).webkitTransform;return"none"!==d&&(b=d.match(/^matrix3d\(\d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, ([-\d.]+), ([-\d.]+), [-\d.]+, \d+\)/)||d.match(/^matrix\(\d+, \d+, \d+, \d+, ([-\d.]+), ([-\d.]+)\)$/))&&(c.x=parseInt(b[1])||0,c.y=parseInt(b[2])||0),c}function i(a,b){return n?"translate3d("+a+"px, "+b+"px, 0)":"translate("+a+"px, "+b+"px)"}function j(a,b){function j(){s.enabled&&(a.style.webkitBackfaceVisibility="hidden",a.style.webkitTransformStyle="preserve-3d",a.style.webkitTransform=getComputedStyle(a).webkitTransform,a.style.webkitTransition="",t=null)}function k(){if(s.enabled){var b=h(s)[s.axis],c=e(s,b),d=s.options.isBounce,i=s.options[s.axis+"Padding1"],j=s.options[s.axis+"Padding1"];if(""===a.style.webkitTransition&&""===a.style.webkitAnimation&&c){var k;d&&c>0&&i&&c>i/2?(k=s.minScrollOffset+i,t=function(){g(s,"pulldownend")}):d&&0>c&&j&&Math.abs(c)>j/2?(k=s.maxScrollOffset-j,t=function(){g(s,"pullupend")}):(k=f(s,b),t=r),a.style.webkitTransition="-webkit-transform 0.4s ease 0",a.style.webkitTransform="translate"+s.axis.toUpperCase()+"("+k.toFixed(0)+"px)"}else r()}}function n(a){s.enabled&&(a.stopPropagation(),s.transformOffset=h(s),s.minScrollOffset=c(s),s.maxScrollOffset=d(s),s.panFixRatio=2.5,s.cancelScrollEnd=!1,g(s,"scrollstart"))}function o(b){if(s.enabled){b.stopPropagation();var c=s.transformOffset[s.axis]+b["displacement"+s.axis.toUpperCase()];c>s.minScrollOffset?(c=s.minScrollOffset+(c-s.minScrollOffset)/s.panFixRatio,s.panFixRatio*=1.003):c<s.maxScrollOffset&&(c=s.maxScrollOffset-(s.maxScrollOffset-c)/s.panFixRatio,s.panFixRatio*=1.003),s.panFixRatio>4&&(s.panFixRatio=4);var d=e(s,c);d&&g(s,d>0?"pulldown":"pullup",{boundaryOffset:Math.abs(d)}),a.style.webkitAnimation="",a.style.webkitTransition="",a.style.webkitTransform="y"===s.axis?i(s.transformOffset.x,c):i(c,s.transformOffset.y)}}function p(a){s.enabled&&a.stopPropagation()}function q(b){if(s.enabled){b.stopPropagation(),s.cancelScrollEnd=!0;var c,d,f,g,i,j,k,m,n,o,p,q,u,v,w,x,y;g=h(s)[s.axis];var z=e(s,g);if(!z){c=b["velocity"+s.axis.toUpperCase()],c>2&&(c=2),-2>c&&(c=-2),d=.0015*(c/Math.abs(c)),j=l({v:c,a:-d}),f=j.t,i=g+j.s;var A=e(s,i);if(A)k=c,m=d,A>0?(o=s.minScrollOffset,q=1):(o=s.maxScrollOffset,q=-1),p=l({v:q*k,a:-q*m,s:Math.abs(o-g)}),n=p.t,u=k-m*n,v=.01*(u/Math.abs(u)),y=l({v:u,a:-v}),w=y.t,x=o+y.s,a.style.webkitTransition="-webkit-transform "+((n+w)/1e3).toFixed(2)+"s ease-out 0",a.style.webkitTransform="translate"+s.axis.toUpperCase()+"("+x.toFixed(0)+"px)",t=function(){a.style.webkitTransition="-webkit-transform 0.4s ease 0",a.style.webkitTransform="translate"+s.axis.toUpperCase()+"("+o.toFixed(0)+"px)",t=r};else{var B=j.generateCubicBezier();a.style.webkitTransition="-webkit-transform "+(f/1e3).toFixed(2)+"s cubic-bezier("+B+") 0",a.style.webkitTransform="translate"+s.axis.toUpperCase()+"("+i.toFixed(0)+"px)",t=r}}}}function r(b){s.enabled&&(b&&b.stopPropagation(),s.cancelScrollEnd=!1,setTimeout(function(){s.cancelScrollEnd||(a.style.webkitTransition="",a.style.webkitAnimation="",g(s,"scrollend"))},10))}var s=this;b=b||{},b.isBounce=!!b.isBounce,b.padding&&(b.yPadding1=b.padding.top||0,b.yPadding2=b.padding.bottom||0,b.xPadding1=b.padding.left||0,b.xPadding2=b.padding.right||0,delete b.padding),b.bounceOffset&&(b.isBounce=!0,b.yPadding1=b.bounceOffset.top||0,b.yPadding2=b.bounceOffset.bottom||0,b.xPadding1=b.bounceOffset.left||0,b.xPadding2=b.bounceOffset.right||0,delete b.bounceOffset),b.isBounce||(b.yPadding1=-b.yPadding1,b.yPadding2=-b.yPadding2,b.xPadding1=-b.xPadding1,b.xPadding2=-b.xPadding2),this.options=b,s.axis=b.direction||"y",this.element=a,this.viewport=a.parentNode,this.viewport.addEventListener("touchstart",j,!1),this.viewport.addEventListener("touchend",k,!1),this.viewport.addEventListener("touchcancel",k,!1),this.viewport.addEventListener("panstart",n,!1),this.viewport.addEventListener("pan",o,!1),this.viewport.addEventListener("panend",p,!1),this.viewport.addEventListener("flick",q,!1),this.viewport.scrollId=setTimeout(function(){m[s.viewport.scrollId+""]=s},0);var t;a.addEventListener("webkitTransitionEnd",function(a){if(t){var b=t;t=null,b(a)}},!1)}var k=a.document,l=(k.documentElement,b.motion),m={},n="WebKitCSSMatrix"in window&&"m11"in new WebKitCSSMatrix,o={init:function(){return this.enable(),this.refresh(),this.scrollTo(0),this},enable:function(){return this.enabled=!0,this},disable:function(){var a=this.element;return this.enabled=!1,setTimeout(function(){a.style.webkitTransform=getComputedStyle(a).webkitTransform,a.style.webkitAnimation=""},50),this},getScrollWidth:function(){return this.element.getBoundingClientRect().width-(this.options.xPadding1||0)-(this.options.xPadding2||0)},getScrollHeight:function(){return this.element.getBoundingClientRect().height-(this.options.yPadding1||0)-(this.options.yPadding2||0)},getScrollLeft:function(){return-h(this).x-(this.options.xPadding1||0)},getScrollTop:function(){return-h(this).y-(this.options.yPadding1||0)},refresh:function(){var a=this.element;return"y"===this.axis?(a.style.height="auto",a.style.height=(this.options.height||a.lastElementChild.getBoundingClientRect().bottom-a.firstElementChild.getBoundingClientRect().top)+"px"):(a.style.width="auto",a.style.width=(this.options.width||a.lastElementChild.getBoundingClientRect().right-a.firstElementChild.getBoundingClientRect().left)+"px"),this.transformOffset=h(this),this.minScrollOffset=c(this),this.maxScrollOffset=d(this),this.scrollTo(-this.transformOffset[this.axis]-(this.options[this.axis+"Padding1"]||0)),this},offset:function(a){var b=this.element.getBoundingClientRect(),c=a.getBoundingClientRect();if("y"===this.axis){var d={top:c.top-((this.options.yPadding1||0)+b.top),left:c.left-b.left,right:b.right-c.right,width:c.width,height:c.height};d.bottom=d.top+d.height}else{var d={top:c.top-b.top,bottom:b.bottom-c.bottom,left:c.left-((this.options.xPadding1||0)+b.left),width:c.width,height:c.height};d.right=d.left+d.width}return d},scrollTo:function(a,b){var c=this.element;return a=-a-(this.options[this.axis+"Padding1"]||0),a=f(this,a),b===!0?(c.style.webkitTransition="-webkit-transform 0.4s ease 0",webkitTransitionEndHandler=function(){c.style.webkitTransition="",c.style.webkitAnimation=""}):(c.style.webkitTransition="",c.style.webkitAnimation=""),c.style.webkitTransform="y"===this.axis?i(h(this).x,a):i(a,h(this).y),this},scrollToElement:function(a,b){var c=this.offset(a);return this.scrollTo("y"===this.axis?c.top:c.left,b)},getViewWidth:function(){return this.viewport.getBoundingClientRect().width},getViewHeight:function(){return this.viewport.getBoundingClientRect().height}};for(var p in o)j.prototype[p]=o[p];b.scroll=function(a,b){if(!a.parentNode)throw new Error("wrong dom tree");if(b&&b.direction&&["x","y"].indexOf(b.direction)<0)throw new Error("wrong direction");var c;return c=a.parentNode.scrollId?m[a.parentNode.scrollId]:new j(a,b)}}(window,window.lib||(window.lib={}));