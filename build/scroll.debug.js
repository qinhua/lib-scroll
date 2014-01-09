;(function(win, lib, undef) {
var style = null;
var doc = win.document,
	docEl = doc.documentElement,
	anim = lib.animation,
	element, panFixRatio = 2,
	cancelScrollEnd = false,
	lockTouched = 0;
	stopBounce = false,
	prevented = false
	;

function getMinScrollTop(el) {
	return 0 - (el.bounceTop || 0);
}

function getMaxScrollTop(el) {
    var rect = el.getBoundingClientRect(),
    	pRect = el.parentNode.getBoundingClientRect(),
    	minTop = getMinScrollTop(el),
    	maxTop = 0 - rect.height + pRect.height
    	;

    return Math.min(maxTop + (el.bounceBottom || 0), minTop);
}

function getBoundaryOffset(el, y) {
	if(y > el.minScrollTop) {
        return y - el.minScrollTop;
    } else if (y < el.maxScrollTop){
        return el.maxScrollTop - y;
    }
}

function touchBoundary(el, y) {
	if (y > el.minScrollTop) {
		y = el.minScrollTop;
	} else if (y < el.maxScrollTop) {
		y = el.maxScrollTop;
	}
	return y;
}

function fireEvent(el, eventName, extra) {
	var event = doc.createEvent('HTMLEvents');
	event.initEvent(eventName, true, true);
	for (var p in extra) {
		event[p] = extra[p];
	}
    el.dispatchEvent(event);
}
function getTransformOffset(el) {
    var MATRIX3D_REG = /^matrix3d\(\d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, ([-\d.]+), ([-\d.]+), [-\d.]+, \d+\)/;
	var MATRIX_REG = /^matrix\(\d+, \d+, \d+, \d+, ([-\d.]+), ([-\d.]+)\)$/;
    var offset = {
            x: 0,
            y: 0
        }, 
        transform = getComputedStyle(el).webkitTransform, 
        matchs, reg;

    if (transform !== 'none') {
        reg = transform.indexOf('matrix3d') > -1 ? MATRIX3D_REG : MATRIX_REG;
        if((matchs = transform.match(reg))) {
            offset.x = parseInt(matchs[1]) || 0;
            offset.y = parseInt(matchs[2]) || 0;
        }
    }

    return offset;
}
function ScrollController(element){
    var viewportElement = element.parentElement;
    viewportElement.boundScrollEvent = true;
    viewportElement.addEventListener('touchstart', touchstartHandler, false);
    viewportElement.addEventListener('touchend', touchendHandler, false);
    viewportElement.addEventListener('panstart', panstartHandler, false);
    viewportElement.addEventListener('pan', panHandler, false);
    viewportElement.addEventListener('panend', panendHandler, false);
    viewportElement.addEventListener('flick', flickHandler, false);

    function touchstartHandler(e) {

        var offset = getTransformOffset(element);

        element.style.webkitBackfaceVisibility = 'hidden';
        element.style.webkitTransformStyle = 'preserve-3d';

        element.style.webkitTransform = getComputedStyle(element).webkitTransform;
        element.style.webkitAnimation = "";
        element.removeEventListener("animationend", scrollEnd, false);
    }

    function touchmoveHandler(e) {	
        e.preventDefault();
        return false;
    }

    function touchendHandler(e) {
        

        var s0 = getTransformOffset(element).y;
        if(element.style.webkitAnimation === "" && (s0 > element.minScrollTop || s0 < element.maxScrollTop)) {
            if(s0 > element.minScrollTop) {
                var s1 = element.minScrollTop;
                var sign = 1;
            } else {
                var s1 = element.maxScrollTop ;
                var sign = -1;
            }
            if(style) {
                style.parentNode.removeChild(style);
            }
            style = document.createElement("style");
        
            style.innerHTML = ("@-webkit-keyframes bounce {  0% {-webkit-transform:translateY("+s0+"px)}\n"
                +"100%{ -webkit-transform:translateY("+s1.toFixed(0)+"px);animation-timing-function:ease  } }");
            document.getElementsByTagName("head")[0].appendChild(style);
            element.style.webkitAnimation = "bounce 0.4s";
            element.style.webkitTransform = "translateY("+s1+"px)";
            element.addEventListener("animationend", scrollEnd, false);
        }
    }

    function panstartHandler(e) {
        if (stopBounce || !element) return;

        element.transformOffset = getTransformOffset(element);
        element.minScrollTop = getMinScrollTop(element);
        element.maxScrollTop = getMaxScrollTop(element);
        panFixRatio = 2.5;
        stopBounce = false;
        cancelScrollEnd = false;
        fireEvent(element, 'scrollstart');
    }

    function panHandler(e) {
        if (stopBounce || !element) return;

        var y = element.transformOffset.y + e.displacementY
            ;

        if(y > element.minScrollTop) {
            y = element.minScrollTop + (y - element.minScrollTop) / panFixRatio;
            panFixRatio *= 1.003;
            if (panFixRatio > 4) panFixRatio = 4;
        } else if(y < element.maxScrollTop) {
            y = element.maxScrollTop - (element.maxScrollTop - y) / panFixRatio;
            panFixRatio *= 1.003;
            if (panFixRatio > 4) panFixRatio = 4;
        }

        if ((getBoundaryOffset(element, y))) {
            if (y > element.minScrollTop) {
                var name = 'pulldown',
                    offset = Math.abs(y - element.minScrollTop);

            } else if (y < element.maxScrollTop) {
                var name = 'pullup',
                    offset = Math.abs(element.maxScrollTop - y);
            }
            element.bounceOffset = offset;
            fireEvent(element, name);
        }

        element.style.webkitTransition = '';
        element.style.webkitTransform = "translate3d("+[element.transformOffset.x, y, 0]+")";

    }

    function panendHandler(e) {
        if (stopBounce || !element) return;
    }

    function flickHandler(e) {
        if (stopBounce || !element) return;
    
        var s0 = getTransformOffset(element).y,
            v, a, t, s,
            _v, _s, _t
            ;

        cancelScrollEnd = true;
    

    
    
        if(s0 > element.minScrollTop || s0 < element.maxScrollTop) {
            //手指离开屏幕时，已经超出滚动范围
        
            //不作处理，让touchend handler处理
        
        
        } else {
            //手指离开屏幕时，在滚动范围内
            v = e.velocityY;
            if (v > 1.5) v = 1.5;
            if (v < -1.5) v = -1.5;
            a = 0.0015 * ( v / Math.abs(v));
            t = v / a;
            s = s0 + t * v / 2;

            if (s > element.minScrollTop || s < element.maxScrollTop) {
            
        
                //运动足够滑出屏幕边缘
            

                var v1 = v;
                if(s > element.minScrollTop) {
                    var s1 = element.minScrollTop;
                    var sign = 1;
                } else {
                    var s1 = element.maxScrollTop ;
                    var sign = -1;
                }
                var t1 = (sign*v1 - Math.sqrt(-2 * a *Math.abs(s1-s0) + v1 * v1)) / a;


                var v2 = v1 - a * t1;
                var a2 = 0.008 * ( v2 / Math.abs(v2))
                var t2 = v2/a2;
                var s2 = s1 + v2*t2/2;
            
                var ft = t1 + t2 + 400;
            



                function quadratic2cubicBezier(a, b) {
                    return [[(a / 3 + (a + b) / 3 - a) / (b - a), (a * a / 3 + a * b * 2 / 3 - a * a) / (b * b - a * a)],
                        [(b / 3 + (a + b) / 3 - a) / (b - a), (b * b / 3 + a * b * 2 / 3 - a * a) / (b * b - a * a)]];
                }

            
                var x = 0,y = 0;
                function drawBezier(ctx,cp,cx,cy) {
                
                    ctx.bezierCurveTo(x+cp[0][0]*(cx-x),y+cp[0][1]*(cy-y)+300,x+cp[1][0]*(cx-x),y+cp[1][1]*(cy-y)+300,cx,cy+300);
                    x = cx; y = cy;
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(x,y+300);
                }
                var canvas = document.querySelector("canvas");
                var ctx = canvas.getContext("2d");
                ctx.clearRect(0,0,800,800);
                ctx.strokeStyle= "black";
            
                ctx.beginPath();

                ctx.moveTo(0,300);
                console.log({
                    t1:t1,
                    t2:t2
                })
                ctx.strokeStyle = "blue"
                drawBezier(ctx,quadratic2cubicBezier(-t1-v1/a/2, -t2-v1/a/2), t1/ft *300+2, s1-s0 );

                ctx.strokeStyle = "red"
                drawBezier(ctx,quadratic2cubicBezier(-t2-v2/a2/2, 0),(t1 +t2)/ft*300, s2-s0);

                //drawBezier(ctx,quadratic2cubicBezier(-t1, -t2), t1/ft *300, s1-s0 );
                //drawBezier(ctx,quadratic2cubicBezier(-t2, 0),(t1 +t2)/ft*300, s2-s0);
            

                if(style) {
                    style.parentNode.removeChild(style);
                }
                style = document.createElement("style");
            
                style.innerHTML = ("@-webkit-keyframes bounce {  0% {-webkit-transform:translateY("+s0+"px)}\n"
                    //第1段：摩擦力作用下惯性运动
                    +(t1/ft*100).toFixed(1)+"% {-webkit-transform:translateY("+s1.toFixed(0)+"px);animation-timing-function:cubic-bezier("+quadratic2cubicBezier(-t1-v1/a/2, -t2-v1/a/2)+")}\n"
                    //第2段：弹力作用下继续惯性运动
                    +((t1+t2)/ft*100).toFixed(1)+"% {-webkit-transform:translateY("+s2.toFixed(0)+"px);animation-timing-function:cubic-bezier("+quadratic2cubicBezier(-t2-v2/a2/2, 0)+")}\n"
                    //第3段：弹回边缘
                    +"100%{ -webkit-transform:translateY("+s1.toFixed(0)+"px);animation-timing-function:ease  } }");
                document.getElementsByTagName("head")[0].appendChild(style);
                element.style.webkitAnimation = "bounce "+(ft/1000).toFixed(2)+"s";
                element.style.webkitTransform = "translateY("+s1+"px)";
                element.addEventListener("animationend", scrollEnd, false);
            } else {
                if(style) {
                    style.parentNode.removeChild(style);
                }
                style = document.createElement("style");
                style.innerHTML = ("@-webkit-keyframes bounce {  0% {-webkit-transform:translateY("+s0+"px)}\n"
                    +"100% {-webkit-transform:translateY("+ s.toFixed(0)+"px);animation-timing-function:cubic-bezier("+quadratic2cubicBezier(-t, 0)+")}\n"
                    +" }");
                document.getElementsByTagName("head")[0].appendChild(style);
                element.style.webkitAnimation = "bounce "+(t/1000).toFixed(2)+"s";
                element.style.webkitTransform = "translateY("+s+"px)";
                element.addEventListener("animationend", scrollEnd, false);

            }

        }
    }

    function scrollEnd() {
        if (stopBounce || !element) return;
    
        cancelScrollEnd = false;

        setTimeout(function() {
            if (!cancelScrollEnd && element) {
                element.style.webkitBackfaceVisibility = 'initial';
                element.style.webkitTransformStyle = 'flat';
                element.style.webkitTransition = '';
                fireEvent(element, 'scrollend');
            }
        }, 10);
    }

}

var Scroll = {
	enable: function(el, options) {

        new ScrollController(el);

	},

	disable: function(el) {
		var parentElement = el.parentNode || el.offsetParent, offset;

		if (parentElement.boundScrollElement === el) {
			offset = getTransformOffset(el);
			element = parentElement.boundScrollElement = null;
			setTimeout(function() {
				el.style.webkitTransition = '';
				el.style.webkitTransform = "translate3d("+[offset.x, offset.y]+",0)";
			}, 50);
		}
	},

	getScrollHeight: function(el) {
		return el.getBoundingClientRect().height - (el.bounceTop||0) - (el.bounceBottom||0);
	},

    getScrollTop: function(el) {
    	var offset = getTransformOffset(el);
		return -(offset.y + (el.bounceTop||0));
	},

    refresh: function(el) {
        el.style.height = 'auto';
        el.style.height = el.offsetHeight + 'px';
        //el.offset = getTransformOffset(el);
        el.minScrollTop = getMinScrollTop(el);
        el.maxScrollTop = getMaxScrollTop(el);
        //this.scrollTo(el, -el.offset.y - el.bounceTop);
    },

    offset: function(el, child) {
    	var elRect = el.getBoundingClientRect(),
    		childRect = child.getBoundingClientRect(),
    		offsetRect = {
	        	top: childRect.top - ((el.bounceTop || 0) + elRect.top),
	        	left: childRect.left - elRect.left,
	        	right: elRect.right - childRect.right,
	        	width: childRect.width,
	        	height: childRect.height
	        };

	    offsetRect.bottom = offsetRect.top + childRect.height;
	    return offsetRect;
    },

    scrollTo: function(el, y) {
    	/*var x = anim.getTransformOffset(el).x,
    		y = -y - (el.bounceTop || 0);

    	y = touchBoundary(el, y);
		el.style.webkitTransition = '';
        el.style.webkitTransform = anim.makeTranslateString(x, y);
        */
    },

    scrollToElement: function(el, child) {
    	var offset = this.offset(el, child);
    	this.scrollTo(el, offset.top);
    },

    getViewHeight: function(el) {
    	return el.parentNode.getBoundingClientRect().height;
    },

    getBoundaryOffset: function(el) {
	    var y = getTransformOffset(el).y;
	    return getBoundaryOffset(el, y);
    },

    stopBounce: function(el) {
    	stopBounce = true;

    	var offset = getTransformOffset(el),
    		minScrollTop = getMinScrollTop(el),
    		maxScrollTop = getMaxScrollTop(el),
    		y = null
    		;

    	if (offset.y > minScrollTop + (el.bounceTop||0)) {
    		y = minScrollTop + (el.bounceTop||0);
    	} else if (offset.y < maxScrollTop - (el.bounceBottom||0)) {
    		y = maxScrollTop - (el.bounceBottom||0);
    	}

    	if (y != null) {
    		//anim.translate(el,
    		//	'0.4s', 'ease-in-out', '0s',
    		//	offset.x, y);
    	}
    },

    resumeBounce: function(el) {
    	stopBounce = false;

    	var offset = anim.getTransformOffset(el),
    		minScrollTop = getMinScrollTop(el),
    		maxScrollTop = getMaxScrollTop(el),
    		y
    		;

    	if (offset.y > minScrollTop) {
    		y = minScrollTop;
    	} else if (offset < maxScrollTop){
    		y = maxScrollTop;
    	}

    	if (y != null) {
    		//anim.translate(el,
    		//	'0.4s', 'ease-in-out', '0s',
    		//	offset.x, y);
    	}
    }
}

lib.scroll = Scroll;

})(window, window['lib']||(window['lib']={}))