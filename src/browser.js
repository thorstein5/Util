// Util
// Copyright (c) %%year%% Code Computerlove and other contributors
// Licensed under the MIT license
// version: %%version%%

// browser.js
(function(window, Util) {
	
	Util.Browser = {
	
		ua: null,
		version: null,
		safari: null,
		webkit: null,
		opera: null,
		msie: null,
		iemobile: null,
		chrome: null,
		firefox: null,
		fennec: null,
		mozilla: null,
		
		android: null,
		blackberry: null,
		iPad: null,
		iPhone: null,
		iPod: null,
		iOS: null,
		iOSversion: null,
		
		mac: null,
		OSX: null,
		
		is3dSupported: null,
		isCSSTransformSupported: null,
		isCSSTransitionSupported: null,
		isMouseSupported: null,
		isTouchSupported: null,
		isGestureSupported: null,
		isTouchGestureSupported: null,
		isPointerSupported: null,
		isMSPointerSupported: null,
		isMSGestureSupported: null,
		
		
		_detect: function(){
			
			this.ua = window.navigator.userAgent;
			this.version = parseFloat((this.ua.toLowerCase().match( /.+(?:rv|ie|me|on|it|ra)[\/: ]([\d.]+)/ ) || [0,'0'])[1]);
			this.safari = (/Safari/gi).test(window.navigator.appVersion);
			this.webkit = /webkit/i.test(this.ua);
			this.opera = /opera/i.test(this.ua);
			this.msie = (/msie/i.test(this.ua) || ((/trident/i.test(this.ua)) && this.version > 10)) && !this.opera;
			this.iemobile =  /iemobile/i.test(this.ua);
			this.chrome = /Chrome/i.test(this.ua) || /CriOS/i.test(this.ua);
			this.firefox = /Firefox/i.test(this.ua);
			this.fennec = /Fennec/i.test(this.ua);
			this.mozilla = /mozilla/i.test(this.ua) && !/(compatible|webkit)/.test(this.ua);
			this.android = /android/i.test(this.ua);
			this.blackberry = /blackberry/i.test(this.ua);
			this.iOS = (/iphone|ipod|ipad/gi).test(window.navigator.platform);
			this.iOSversion = this.iOS ? parseFloat((this.ua.toLowerCase().match( /.+version[\/: ]([\d.]+)/ ) || [0,'0'])[1]) : 0;
			this.iPad = (/ipad/gi).test(window.navigator.platform);
			this.iPhone = (/iphone/gi).test(window.navigator.platform);
			this.iPod = (/ipod/gi).test(window.navigator.platform);
			
			this.mac = (/MacIntel/gi).test(window.navigator.platform);
			this.OSX = (/Mac OS X/gi).test(this.ua) && !(/like Mac OS X/gi).test(this.ua);
			
			var testEl = document.createElement('div');
			this.is3dSupported = !Util.isNothing(testEl.style.WebkitPerspective);
			this.isCSSTransformSupported = ( !Util.isNothing(testEl.style.webkitTransform) || !Util.isNothing(testEl.style.MozTransform) || !Util.isNothing(testEl.style.msTransform) || !Util.isNothing(testEl.style.OTransform) || !Util.isNothing(testEl.style.transform) );
			this.isCSSTransitionSupported = ( !Util.isNothing(testEl.style.webkitTransition) || !Util.isNothing(testEl.style.MozTransition) || !Util.isNothing(testEl.style.OTransition) || !Util.isNothing(testEl.style.transition) );
			this.isPointerSupported = !Util.isNothing(window.navigator.pointerEnabled) && this.msie;
			this.isMSPointerSupported = !Util.isNothing(window.navigator.msPointerEnabled) && !this.isPointerSupported;
			this.isTouchSupported = this.isEventSupported('touchstart') && !this.isPointerSupported && !this.isMSPointerSupported;
			this.isMouseSupported = !this.isPointerSupported && !this.isMSPointerSupported;
			this.isGestureSupported = this.isEventSupported('gesturestart') || this.iOS;
			this.isMSGestureSupported = (!Util.isNothing(window.navigator.msMaxTouchPoints) && window.navigator.msMaxTouchPoints > 1);
			this.isTouchGestureSupported = this.isTouchSupported && !this.isGestureSupported && !this.isMSGestureSupported;
			
		},
		
			
		_eventTagNames: {
			'select':'input',
			'change':'input',
			'submit':'form',
			'reset':'form',
			'error':'img',
			'load':'img',
			'abort':'img'
		},
				
				
		/*
		 * Function: isEventSupported
		 * http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
		 */
		isEventSupported: function(eventName) {
			var
				el = document.createElement(this._eventTagNames[eventName] || 'div'),
				isSupported;
			eventName = 'on' + eventName;
			isSupported = Util.objectHasProperty(el, eventName);
			if (!isSupported) {
				el.setAttribute(eventName, 'return;');
				isSupported = typeof el[eventName] === 'function';
			}
			el = null;
			return isSupported;
		},
		
		
		isLandscape: function(){
			return (Util.DOM.windowWidth() > Util.DOM.windowHeight());
		},
		
		
		detect3d: function(){
			var
				t,
				el = document.createElement('div'),
				has3d,
				transforms = {
					'webkitTransform' : '-webkit-transform',
					'OTransform' : '-o-transform',
					'msTransform' : '-ms-transform',
					'MozTransform' : '-moz-transform',
					'transform' : 'transform'
				};

			// Add it to the body to get the computed style
			Util.DOM.insertBefore(el, null, document.body);

			for (t in transforms) {
				if (el.style[t] !== undefined) {
					el.style[t] = "translate3d(1px,1px,1px)";
					has3d = Util.DOM.getStyle(el, transforms[t]);
				}
			}

			Util.DOM.removeChild(el);

			this.is3dSupported = (has3d !== undefined && has3d.length > 0 && has3d !== "none");

		}
	};
	
	Util.Browser._detect();
	
}
(
	window,
	window.Code.Util
));
