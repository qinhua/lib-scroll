!function(a){function b(a,b){for(var c=a;c;){if(c.contains(b)||c==b)return c;c=c.parentNode}return null}function c(a,b,c){var d=i.createEvent("HTMLEvents");if(d.initEvent(b,!0,!0),"object"==typeof c)for(var e in c)d[e]=c[e];a.dispatchEvent(d)}function d(a,b,c,d,e,f,g,h){var i=Math.atan2(h-f,g-e)-Math.atan2(d-b,c-a),j=Math.sqrt((Math.pow(h-f,2)+Math.pow(g-e,2))/(Math.pow(d-b,2)+Math.pow(c-a,2))),k=[e-j*a*Math.cos(i)+j*b*Math.sin(i),f-j*b*Math.cos(i)-j*a*Math.sin(i)];return{rotate:i,scale:j,translate:k,matrix:[[j*Math.cos(i),-j*Math.sin(i),k[0]],[j*Math.sin(i),j*Math.cos(i),k[1]],[0,0,1]]}}function e(a){0===Object.keys(l).length&&(j.addEventListener("touchmove",f,!1),j.addEventListener("touchend",g,!1),j.addEventListener("touchcancel",h,!1));for(var d=0;d<a.changedTouches.length;d++){var e=a.changedTouches[d],i={};for(var m in e)i[m]=e[m];var n={startTouch:i,startTime:Date.now(),status:"tapping",element:a.srcElement,pressingHandler:setTimeout(function(b){return function(){"tapping"===n.status&&(n.status="pressing",c(b,"press",{touchEvent:a})),clearTimeout(n.pressingHandler),n.pressingHandler=null}}(a.srcElement),500)};l[e.identifier]=n}if(2==Object.keys(l).length){var o=[];for(var m in l)o.push(l[m].element);c(b(o[0],o[1]),"dualtouchstart",{touches:k.call(a.touches),touchEvent:a})}}function f(a){for(var e=0;e<a.changedTouches.length;e++){var f=a.changedTouches[e],g=l[f.identifier];if(!g)return;g.lastTouch||(g.lastTouch=g.startTouch),g.lastTime||(g.lastTime=g.startTime),g.velocityX||(g.velocityX=0),g.velocityY||(g.velocityY=0),g.duration||(g.duration=0);var h=Date.now()-g.lastTime,i=(f.clientX-g.lastTouch.clientX)/h,j=(f.clientY-g.lastTouch.clientY)/h,k=70;h>k&&(h=k),g.duration+h>k&&(g.duration=k-h),g.velocityX=(g.velocityX*g.duration+i*h)/(g.duration+h),g.velocityY=(g.velocityY*g.duration+j*h)/(g.duration+h),g.duration+=h,g.lastTouch={};for(var m in f)g.lastTouch[m]=f[m];g.lastTime=Date.now();var n=f.clientX-g.startTouch.clientX,o=f.clientY-g.startTouch.clientY,p=Math.sqrt(Math.pow(n,2)+Math.pow(o,2));"tapping"===g.status&&p>10&&(g.status="panning",c(g.element,"panstart",{touch:f,touchEvent:a}),Math.abs(n)>Math.abs(o)?(c(g.element,"horizontalpanstart",{touch:f,touchEvent:a}),g.isVertical=!1):(c(g.element,"verticalpanstart",{touch:f,touchEvent:a}),g.isVertical=!0)),"panning"===g.status&&(g.panTime=Date.now(),c(g.element,"pan",{displacementX:n,displacementY:o,touch:f,touchEvent:a}),g.isVertical?c(g.element,"verticalpan",{displacementY:o,touch:f,touchEvent:a}):c(g.element,"horizontalpan",{displacementX:n,touch:f,touchEvent:a}))}if(2==Object.keys(l).length){for(var q,r=[],s=[],t=[],e=0;e<a.touches.length;e++){var f=a.touches[e],g=l[f.identifier];r.push([g.startTouch.clientX,g.startTouch.clientY]),s.push([f.clientX,f.clientY])}for(var m in l)t.push(l[m].element);q=d(r[0][0],r[0][1],r[1][0],r[1][1],s[0][0],s[0][1],s[1][0],s[1][1]),c(b(t[0],t[1]),"dualtouch",{transform:q,touches:a.touches,touchEvent:a})}}function g(a){if(2==Object.keys(l).length){var d=[];for(var e in l)d.push(l[e].element);c(b(d[0],d[1]),"dualtouchend",{touches:k.call(a.touches),touchEvent:a})}for(var i=0;i<a.changedTouches.length;i++){var n=a.changedTouches[i],o=n.identifier,p=l[o];if(p){if(p.pressingHandler&&(clearTimeout(p.pressingHandler),p.pressingHandler=null),"tapping"===p.status&&(p.timestamp=Date.now(),c(p.element,"tap",{touch:n,touchEvent:a}),m&&p.timestamp-m.timestamp<300&&c(p.element,"doubletap",{touch:n,touchEvent:a}),this.lastTap=p),"panning"===p.status){var q=Date.now()-p.startTime,r=((n.clientX-p.startTouch.clientX)/q,(n.clientY-p.startTouch.clientY)/q,n.clientX-p.startTouch.clientX),s=n.clientY-p.startTouch.clientY,t=Math.sqrt(p.velocityY*p.velocityY+p.velocityX*p.velocityX);c(p.element,"panend",{isflick:t>.5,touch:n,touchEvent:a}),t>.5&&(c(p.element,"flick",{duration:q,velocityX:p.velocityX,velocityY:p.velocityY,displacementX:r,displacementY:s,touch:n,touchEvent:a}),p.isVertical?c(p.element,"verticalflick",{duration:q,velocityY:p.velocityY,displacementY:s,touch:n,touchEvent:a}):c(p.element,"horizontalflick",{duration:q,velocityX:p.velocityX,displacementX:r,touch:n,touchEvent:a}))}"pressing"===p.status&&c(p.element,"pressend",{touch:n,touchEvent:a}),delete l[o]}}0===Object.keys(l).length&&(j.removeEventListener("touchmove",f,!1),j.removeEventListener("touchend",g,!1),j.removeEventListener("touchcancel",h,!1))}function h(a){if(2==Object.keys(l).length){var d=[];for(var e in l)d.push(l[e].element);c(b(d[0],d[1]),"dualtouchend",{touches:k.call(a.touches),touchEvent:a})}for(var i=0;i<a.changedTouches.length;i++){var m=a.changedTouches[i],n=m.identifier,o=l[n];o&&(o.pressingHandler&&(clearTimeout(o.pressingHandler),o.pressingHandler=null),"panning"===o.status&&c(o.element,"panend",{touch:m,touchEvent:a}),"pressing"===o.status&&c(o.element,"pressend",{touch:m,touchEvent:a}),delete l[n])}0===Object.keys(l).length&&(j.removeEventListener("touchmove",f,!1),j.removeEventListener("touchend",g,!1),j.removeEventListener("touchcancel",h,!1))}var i=a.document,j=i.documentElement,k=Array.prototype.slice,l={},m=null;j.addEventListener("touchstart",e,!1)}(window,window.lib||(window.lib={}));!function(a,b){function c(a){if(this.v=a.v||0,this.a=a.a||0,"undefined"!=typeof a.t&&(this.t=a.t),"undefined"!=typeof a.s&&(this.s=a.s),"undefined"==typeof this.t)if("undefined"==typeof this.s)this.t=-this.v/this.a;else{var b=(Math.sqrt(this.v*this.v+2*this.a*this.s)-this.v)/this.a,c=(-Math.sqrt(this.v*this.v+2*this.a*this.s)-this.v)/this.a;this.t=Math.min(b,c)}"undefined"==typeof this.s&&(this.s=this.a*this.t*this.t/2+this.v*this.t),this.generateCubicBezier=function(){function a(a,b){return[[(a/3+(a+b)/3-a)/(b-a),(a*a/3+a*b*2/3-a*a)/(b*b-a*a)],[(b/3+(a+b)/3-a)/(b-a),(b*b/3+a*b*2/3-a*a)/(b*b-a*a)]]}return a(this.v/this.a,this.t+this.v/this.a)}}b.motion=function(a){return new c(a)}}(window,window.lib||(window.lib={}));!function(a,b){function c(a){return 0-(a.options.bounceOffset.top||0)}function d(a){var b=a.element.getBoundingClientRect(),d=a.element.parentNode.getBoundingClientRect(),e=c(a),f=0-b.height+d.height;return Math.min(f+(a.options.bounceOffset.bottom||0),e)}function e(a,b){return b>a.minScrollTop?b-a.minScrollTop:b<a.maxScrollTop?b-a.maxScrollTop:void 0}function f(a,b){return b>a.minScrollTop?b=a.minScrollTop:b<a.maxScrollTop&&(b=a.maxScrollTop),b}function g(a,b,c){var d=k.createEvent("HTMLEvents");if(d.initEvent(b,!1,!0),d.scrollObj=a,c)for(var e in c)d[e]=c[e];a.element.dispatchEvent(d)}function h(a){var b,c={x:0,y:0},d=getComputedStyle(a.element).webkitTransform;return"none"!==d&&(b=d.match(/^matrix3d\(\d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, ([-\d.]+), ([-\d.]+), [-\d.]+, \d+\)/)||d.match(/^matrix\(\d+, \d+, \d+, \d+, ([-\d.]+), ([-\d.]+)\)$/))&&(c.x=parseInt(b[1])||0,c.y=parseInt(b[2])||0),c}function i(a,b){return o?"translate3d("+a+"px, "+b+"px, 0)":"translate("+a+"px, "+b+"px)"}function j(a,b){function j(){s.enabled&&(a.style.webkitBackfaceVisibility="hidden",a.style.webkitTransformStyle="preserve-3d",a.style.webkitTransform=getComputedStyle(a).webkitTransform,a.style.webkitTransition="",a.style.webkitAnimation="",t=null,u=null)}function k(){if(s.enabled){var b=h(s).y,c=e(s,b),d=s.options.bounceOffset.top,i=s.options.bounceOffset.bottom;if(""===a.style.webkitTransition&&""===a.style.webkitAnimation&&c){var j;c>0&&d&&c>d/2?(j=s.minScrollTop+d,t=function(){g(s,"pulldownend")}):0>c&&i&&Math.abs(c)>i/2?(j=s.maxScrollTop-i,t=function(){g(s,"pullupend")}):(j=f(s,b),t=r),a.style.webkitTransition="-webkit-transform 0.4s ease 0",a.style.webkitTransform="translateY("+j.toFixed(0)+"px)"}else r()}}function m(a){s.enabled&&(a.stopPropagation(),s.transformOffset=h(s),s.minScrollTop=c(s),s.maxScrollTop=d(s),s.panFixRatio=2.5,s.cancelScrollEnd=!1,g(s,"scrollstart"))}function o(b){if(s.enabled){b.stopPropagation();var c=s.transformOffset.y+b.displacementY;c>s.minScrollTop?(c=s.minScrollTop+(c-s.minScrollTop)/s.panFixRatio,s.panFixRatio*=1.003):c<s.maxScrollTop&&(c=s.maxScrollTop-(s.maxScrollTop-c)/s.panFixRatio,s.panFixRatio*=1.003),s.panFixRatio>4&&(s.panFixRatio=4);var d=e(s,c);d&&g(s,d>0?"pulldown":"pullup",{boundaryOffset:Math.abs(d)}),a.style.webkitAnimation="",a.style.webkitTransition="",a.style.webkitTransform=i(s.transformOffset.x,c)}}function p(a){s.enabled&&a.stopPropagation()}function q(b){if(s.enabled){b.stopPropagation(),s.cancelScrollEnd=!0;var c,d,f,g,i,j,k,m,n,o,p,q,u,v,w,x,y;g=h(s).y;var z=e(s,g);if(!z){c=b.velocityY,c>2&&(c=2),-2>c&&(c=-2),d=.0015*(c/Math.abs(c)),j=l({v:c,a:-d}),f=j.t,i=g+j.s;var A=e(s,i);if(A)k=c,m=d,A>0?(o=s.minScrollTop,q=1):(o=s.maxScrollTop,q=-1),p=l({v:q*k,a:-q*m,s:Math.abs(o-g)}),n=p.t,u=k-m*n,v=.01*(u/Math.abs(u)),y=l({v:u,a:-v}),w=y.t,x=o+y.s,a.style.webkitTransition="-webkit-transform "+((n+w)/1e3).toFixed(2)+"s ease-out 0",a.style.webkitTransform="translateY("+x.toFixed(0)+"px)",t=function(){a.style.webkitTransition="-webkit-transform 0.4s ease 0",a.style.webkitTransform="translateY("+o.toFixed(0)+"px)",t=r};else{var B=j.generateCubicBezier();a.style.webkitTransition="-webkit-transform "+(f/1e3).toFixed(2)+"s cubic-bezier("+B+") 0",a.style.webkitTransform="translateY("+i.toFixed(0)+"px)",t=r}}}}function r(b){s.enabled&&(b&&b.stopPropagation(),s.cancelScrollEnd=!1,setTimeout(function(){s.cancelScrollEnd||(a.style.webkitTransition="",a.style.webkitAnimation="",g(s,"scrollend"))},10))}var s=this;b=b||{},b.bounceOffset=b.bounceOffset||{top:0,bottom:0},this.options=b,this.element=a,this.viewport=a.parentNode,this.viewport.addEventListener("touchstart",j,!1),this.viewport.addEventListener("touchend",k,!1),this.viewport.addEventListener("touchcancel",k,!1),this.viewport.addEventListener("panstart",m,!1),this.viewport.addEventListener("pan",o,!1),this.viewport.addEventListener("panend",p,!1),this.viewport.addEventListener("flick",q,!1),this.viewport.scrollId=setTimeout(function(){n[s.viewport.scrollId+""]=s},0);var t;a.addEventListener("webkitTransitionEnd",function(a){if(t){var b=t;t=null,b(a)}},!1);var u;a.addEventListener("webkitAnimationEnd",function(a){if(u){var b=u;u=null,b(a)}},!1)}var k=a.document,l=(k.documentElement,b.motion),m=!1,n={},o="WebKitCSSMatrix"in window&&"m11"in new WebKitCSSMatrix,p={enable:function(){this.enabled=!0,m||(m=!0,k.addEventListener("touchmove",function(a){return a.preventDefault(),!1},!1))},disable:function(){var a=this.element;this.enabled=!1,setTimeout(function(){a.style.webkitTransform=getComputedStyle(a).webkitTransform,a.style.webkitAnimation=""},50)},getScrollHeight:function(){return this.element.getBoundingClientRect().height-(this.options.bounceOffset.top||0)-(this.options.bounceOffset.bottom||0)},getScrollTop:function(){return-h(this).y-(this.options.bounceOffset.top||0)},refresh:function(){var a=this.element;a.style.height="auto",a.style.height=a.offsetHeight+"px",this.transformOffset=h(this),this.minScrollTop=c(this),this.maxScrollTop=d(this),this.scrollTo(-this.transformOffset.y-(this.options.bounceOffset.top||0))},offset:function(a){var b=this.element.getBoundingClientRect(),c=a.getBoundingClientRect(),d={top:c.top-((this.options.bounceOffset.top||0)+b.top),left:c.left-b.left,right:b.right-c.right,width:c.width,height:c.height};return d.bottom=d.top+c.height,d},scrollTo:function(a,b){var c=h(this).x,d=this.element;a=-a-(this.options.bounceOffset.top||0),a=f(this,a),b===!0?(d.style.webkitTransition="-webkit-transform 0.4s ease 0",webkitTransitionEndHandler=function(){d.style.webkitTransition="",d.style.webkitAnimation=""}):(d.style.webkitTransition="",d.style.webkitAnimation=""),d.style.webkitTransform=i(c,a)},scrollToElement:function(a,b){var c=this.offset(a);this.scrollTo(c.top,b)},getViewHeight:function(){return this.viewport.getBoundingClientRect().height}};for(var q in p)j.prototype[q]=p[q];b.scroll=function(a,b){if(!a.parentNode)throw new Error("wrong dom tree");var c;return c=a.parentNode.scrollId?n[a.parentNode.scrollId]:new j(a,b),c.enable(),c.refresh(),c}}(window,window.lib||(window.lib={}));