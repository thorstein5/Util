// Util
// Copyright (c) %%year%% Code Computerlove and other contributors
// Licensed under the MIT license
// version: %%version%%

/*global MSGesture: false */

// touchelement.class.js
(function(window, klass, Util){


	Util.registerNamespace('Code.Util.TouchElement');


	Util.TouchElement.TouchElementClass = klass({

		el: null,

		captureSettings: null,

		touchStartPoint: null,
		touchEndPoint: null,
		touchStartTime: null,
		touchEndTime: null,
		doubleTapTimeout: null,
		isGesture: null,

		touchStartHandler: null,
		touchMoveHandler: null,
		touchEndHandler: null,

		mouseDownHandler: null,
		mouseMoveHandler: null,
		mouseUpHandler: null,
		mouseOutHandler: null,

		pointerDownHandler: null,
		pointerMoveHandler: null,
		pointerUpHandler: null,
		pointerOutHandler: null,
		pointerDownEventName: null,
		pointerMoveEventName: null,
		pointerUpEventName: null,
		pointerOutEventName: null,

		gestureStartHandler: null,
		gestureChangeHandler: null,
		gestureEndHandler: null,

		touchGestureStartHandler: null,
		touchGestureChangeHandler: null,
		touchGestureEndHandler: null,

		pointerGestureStartHandler: null,
		pointerGestureChangeHandler: null,
		pointerGestureEndHandler: null,

		msGestureStartHandler: null,
		msGestureChangeHandler: null,
		msGestureEndHandler: null,
		msHoldVisualHandler: null,
		msInertiaStartHandler: null,
		msGesture: null,
		isMSGesture: null,

		lastGesturePinch: null,
		pointerDown: null,

		currentInputDeviceType: null,
		
		/*
		 * Function: dispose
		 */
		dispose: function(){

			var prop;

			this.removeEventHandlers();

			for (prop in this) {
				if (Util.objectHasProperty(this, prop)) {
					this[prop] = null;
				}
			}

		},



		/*
		 * Function: initialize
		 */
		initialize: function(el, captureSettings){

			this.el = el;

			this.captureSettings = {
				swipe: false,
				move: false,
				gesture: false,
				doubleTap: false,
				edgeSwipe: false,
				preventDefaultTouchEvents: true,
				swipeThreshold: 50,
				swipeTimeThreshold: 250,
				doubleTapSpeed: 250,
				edgeSwipePixelTolerance: 10,
				allowEdgeSwipeUp: true,
				allowEdgeSwipeDown: false,
				allowEdgeSwipeLeftRight: true,
				ghostEventTimeout: 1000,
				ghostEventPixelTolerance: 5,
				allowVerticalScroll: false
			};

			Util.extend(this.captureSettings, captureSettings);

			this.touchStartPoint = { x: 0, y: 0 };
			this.touchEndPoint = { x: 0, y: 0 };

			this.lastGesturePinch = 0;

			this.touchEndTime = new Date();
			this.pointerDown = {};
			this.isGesture = false;
			this.isMSGesture = false;

		},



		/*
		 * Function: addEventHandlers
		 */
		addEventHandlers: function(){

			if (Util.Browser.isMouseSupported){
				if (Util.isNothing(this.mouseDownHandler) ){
					this.mouseDownHandler = this.onMouseDown.bind(this);
					this.mouseMoveHandler = this.onMouseMove.bind(this);
					this.mouseUpHandler = this.onMouseUp.bind(this);
					this.mouseOutHandler = this.onMouseOut.bind(this);
				}

				Util.Events.add(this.el, 'mousedown', this.mouseDownHandler);
			}

			if (Util.Browser.isTouchSupported){
				if (Util.isNothing(this.touchStartHandler) ){
					this.touchStartHandler = this.onTouchStart.bind(this);
					this.touchMoveHandler = this.onTouchMove.bind(this);
					this.touchEndHandler = this.onTouchEnd.bind(this);
				}

				Util.Events.add(this.el, 'touchstart', this.touchStartHandler);
			}

			if (Util.Browser.isPointerSupported || Util.Browser.isMSPointerSupported){
				if (Util.isNothing(this.pointerDownHandler) ){
					this.pointerDownHandler = this.onPointerDown.bind(this);
					this.pointerMoveHandler = this.onPointerMove.bind(this);
					this.pointerUpHandler = this.onPointerUp.bind(this);
					this.pointerOutHandler = this.onPointerOut.bind(this);

					this.pointerDownEventName = Util.Browser.isMSPointerSupported ? 'MSPointerDown' : 'pointerdown';
					this.pointerMoveEventName = Util.Browser.isMSPointerSupported ? 'MSPointerMove' : 'pointermove';
					this.pointerUpEventName = Util.Browser.isMSPointerSupported ? 'MSPointerUp' : 'pointerup';
					this.pointerOutEventName = Util.Browser.isMSPointerSupported ? 'MSPointerOut' : 'pointerout';
				}

				Util.Events.add(this.el, this.pointerDownEventName, this.pointerDownHandler);
			}

			if (this.captureSettings.gesture){
				if (Util.Browser.isGestureSupported){
					if (Util.isNothing(this.gestureStartHandler) ){
						this.gestureStartHandler = this.onGestureStart.bind(this);
						this.gestureChangeHandler = this.onGestureChange.bind(this);
						this.gestureEndHandler = this.onGestureEnd.bind(this);
					}

					Util.Events.add(this.el, 'gesturestart', this.gestureStartHandler);
					Util.Events.add(this.el, 'gesturechange', this.gestureChangeHandler);
					Util.Events.add(this.el, 'gestureend', this.gestureEndHandler);
				}

				if (Util.Browser.isTouchGestureSupported){
					this.touchGestureStartHandler = this.onTouchGestureStart.bind(this);
					this.touchGestureChangeHandler = this.onTouchGestureChange.bind(this);
					this.touchGestureEndHandler = this.onTouchGestureEnd.bind(this);
				}

				if (Util.Browser.isMSGestureSupported){
					if (Util.isNothing(this.msGestureStartHandler)){
						this.msGestureStartHandler = this.onMSGestureStart.bind(this);
						this.msGestureChangeHandler = this.onMSGestureChange.bind(this);
						this.msGestureEndHandler = this.onMSGestureEnd.bind(this);
						this.msInertiaStartHandler = this.onMSInertiaStart.bind(this);
						this.msHoldVisualHandler = this.onMSHoldVisualHandler.bind(this);
					}

					Util.Events.add(this.el, "MSGestureStart", this.msGestureStartHandler);
					Util.Events.add(this.el, "MSInertiaStart", this.msInertiaStartHandler);
					Util.Events.add(this.el, "MSHoldVisual", this.msHoldVisualHandler);

					this.msGesture = new MSGesture();
					this.msGesture.target = this.el;
				}
			}

		},



		/*
		 * Function: removeEventHandlers
		 */
		removeEventHandlers: function(){

			if (Util.Browser.isMouseSupported){
				Util.Events.remove(this.el, 'mousedown', this.mouseDownHandler);
			}

			if (Util.Browser.isTouchSupported){
				Util.Events.remove(this.el, 'touchstart', this.touchStartHandler);
			}

			if (Util.Browser.isPointerSupported || Util.Browser.isMSPointerSupported) {
				Util.Events.remove(this.el, this.pointerDownEventName, this.pointerDownHandler);
			}

			if (this.captureSettings.gesture){
				if (Util.Browser.isGestureSupported){
					Util.Events.remove(this.el, 'gesturestart', this.gestureStartHandler);
					Util.Events.remove(this.el, 'gesturechange', this.gestureChangeHandler);
					Util.Events.remove(this.el, 'gestureend', this.gestureEndHandler);
				}

				if (Util.Browser.isMSGestureSupported){
					Util.Events.remove(this.el, "MSGestureStart", this.msGestureStartHandler);
					Util.Events.remove(this.el, "MSInertiaStart", this.msInertiaStartHandler);
					Util.Events.remove(this.el, "MSHoldVisual", this.msHoldVisualHandler);
				}
			}

		},



		/*
		 * Function: getTouchPoint
		 */
		getTouchPoint: function(touches){

			return {
				x: touches[0].pageX,
				y: touches[0].pageY
			};

		},



		/*
		 * Function: getPointerPoint
		 */
		getPointerPoint: function(pointerEvent){

			return {
				x: window.parseInt(pointerEvent.offsetX + pointerEvent.target.offsetLeft, 10),
				y: window.parseInt(pointerEvent.offsetY + pointerEvent.target.offsetTop, 10)
			};

		},



		/*
		 * Function: getTouchPinchScale
		 */
		getTouchPinchScale: function(touches){

			var
				distX, distY, dist, scale = 1;

			if (touches.length > 1){

				distX = touches[1].pageX - touches[0].pageX;
				distY = touches[1].pageY - touches[0].pageY;
				dist = Math.sqrt( (distX * distX) + (distY * distY) );

				if (this.lastGesturePinch !== 0){
					scale = dist / this.lastGesturePinch;
				}

				this.lastGesturePinch = dist;
			}

			return scale;

		},



		/*
		 * Function: atEdge
		 */
		onTheEdge: function(target, tolerance, point){
			var
				left = target.offsetLeft + tolerance,
				right = target.offsetLeft + Util.DOM.width(target) - tolerance,
				top = target.offsetTop + tolerance,
				bottom = target.offsetTop + Util.DOM.height(target) - tolerance;

			return {
				left: (point.x <= left),
				right: (point.x >= right),
				top: (point.y <= top),
				bottom: (point.y >= bottom)
			};

		},



		/*
		 * Function: preventGhostEvents
		 */
		preventGhostEvents: function(deviceType, point){

			var
				nowTime;

			if (!Util.isNothing(this.currentInputDeviceType)){
				if (this.currentInputDeviceType !== deviceType){
					nowTime = new Date();
					if (nowTime - this.touchEndTime < this.captureSettings.ghostEventTimeout) {
						if (Math.abs(point.x - this.touchEndPoint.x) < this.captureSettings.ghostEventPixelTolerance && Math.abs(point.y - this.touchEndPoint.y) < this.captureSettings.ghostEventPixelTolerance){
							return true;
						}
					}
					this.currentInputDeviceType = deviceType;
				}
			}
			else {
				this.currentInputDeviceType = deviceType;
			}
			return false;

		},



		/*
		 * Function: fireTouchEvent
		 */
		fireTouchEvent: function(e){

			var
				distX = 0,
				distY = 0,
				dist = 0,
				diffTime,
				onEdge;

			distX = this.touchEndPoint.x - this.touchStartPoint.x;
			distY = this.touchEndPoint.y - this.touchStartPoint.y;
			dist = Math.sqrt( (distX * distX) + (distY * distY) );
			diffTime = this.touchEndTime - this.touchStartTime;

			// See if there was an inside to outside edge swipe
			if (this.captureSettings.edgeSwipe){

				onEdge = this.onTheEdge(e.target, this.captureSettings.edgeSwipePixelTolerance, this.touchEndPoint);

				if (this.captureSettings.allowEdgeSwipeLeftRight && window.Math.abs(distX) >= this.captureSettings.swipeThreshold){
					if (onEdge.left || onEdge.right ){
						Util.Events.fire(this, {
							type: Util.TouchElement.EventTypes.onTouch,
							target: this,
							point: this.touchEndPoint,
							action: (onEdge.left) ? Util.TouchElement.ActionTypes.swipeEdgeLeft : Util.TouchElement.ActionTypes.swipeEdgeRight,
							targetEl: e.target,
							currentTargetEl: e.currentTarget
						});
						return;
					}
				}

				if (window.Math.abs(distY) >= this.captureSettings.swipeThreshold){
					if (this.captureSettings.allowEdgeSwipeUp && onEdge.top){
						Util.Events.fire(this, {
							type: Util.TouchElement.EventTypes.onTouch,
							target: this,
							point: this.touchEndPoint,
							action: Util.TouchElement.ActionTypes.swipeEdgeUp,
							targetEl: e.target,
							currentTargetEl: e.currentTarget
						});
						return;
					}

					if (this.captureSettings.allowEdgeSwipeDown && onEdge.bottom){
						Util.Events.fire(this, {
							type: Util.TouchElement.EventTypes.onTouch,
							target: this,
							point: this.touchEndPoint,
							action: Util.TouchElement.ActionTypes.swipeEdgeDown,
							targetEl: e.target,
							currentTargetEl: e.currentTarget
						});
						return;
					}
				}

			}

			if (this.captureSettings.swipe){

				// See if there was a swipe gesture
				if (diffTime <= this.captureSettings.swipeTimeThreshold){

					if (window.Math.abs(distX) >= this.captureSettings.swipeThreshold){

						Util.Events.fire(this, {
							type: Util.TouchElement.EventTypes.onTouch,
							target: this,
							point: this.touchEndPoint,
							action: (distX < 0) ? Util.TouchElement.ActionTypes.swipeLeft : Util.TouchElement.ActionTypes.swipeRight,
							targetEl: e.target,
							currentTargetEl: e.currentTarget
						});
						return;

					}


					if (window.Math.abs(distY) >= this.captureSettings.swipeThreshold){

						Util.Events.fire(this, {
							type: Util.TouchElement.EventTypes.onTouch,
							target: this,
							point: this.touchEndPoint,
							action: (distY < 0) ? Util.TouchElement.ActionTypes.swipeUp : Util.TouchElement.ActionTypes.swipeDown,
							targetEl: e.target,
							currentTargetEl: e.currentTarget
						});
						return;

					}

				}
			}

			if (!Util.isNothing(this.doubleTapTimeout)){
				if (dist > this.captureSettings.swipeThreshold){
			
					Util.Events.fire(this, {
						type: Util.TouchElement.EventTypes.onTouch,
						target: this,
						action: Util.TouchElement.ActionTypes.touchMoveEnd,
						point: this.touchEndPoint,
						targetEl: e.target,
						currentTargetEl: e.currentTarget
					});
					return;
				}

			}
			else if (dist > 1){

				Util.Events.fire(this, {
					type: Util.TouchElement.EventTypes.onTouch,
					target: this,
					action: Util.TouchElement.ActionTypes.touchMoveEnd,
					point: this.touchEndPoint,
					targetEl: e.target,
					currentTargetEl: e.currentTarget
				});
				return;
			}


			if (!this.captureSettings.doubleTap){

				Util.Events.fire(this, {
					type: Util.TouchElement.EventTypes.onTouch,
					target: this,
					point: this.touchEndPoint,
					action: Util.TouchElement.ActionTypes.tap,
					targetEl: e.target,
					currentTargetEl: e.currentTarget
				});
				return;

			}

			if (Util.isNothing(this.doubleTapTimeout)){

				this.doubleTapTimeout = window.setTimeout(function(){

					this.doubleTapTimeout = null;

					Util.Events.fire(this, {
						type: Util.TouchElement.EventTypes.onTouch,
						target: this,
						point: this.touchEndPoint,
						action: Util.TouchElement.ActionTypes.tap,
						targetEl: e.target,
						currentTargetEl: e.currentTarget
					});

				}.bind(this), this.captureSettings.doubleTapSpeed);

				return;

			}
			else{

				window.clearTimeout(this.doubleTapTimeout);
				this.doubleTapTimeout = null;

				Util.Events.fire(this, {
					type: Util.TouchElement.EventTypes.onTouch,
					target: this,
					point: this.touchEndPoint,
					action: Util.TouchElement.ActionTypes.doubleTap,
					targetEl: e.target,
					currentTargetEl: e.currentTarget
				});

			}

		},



		/*
		 * Function: onMouseDown
		 */
		onMouseDown: function(e){
			
			e.preventDefault();

			if (this.preventGhostEvents("mouse", Util.Events.getMousePosition(e))){
				return;
			}

			// Temporarily no longer need touch events
			if (Util.Browser.isTouchSupported){
				Util.Events.remove(this.el, 'touchstart', this.touchStartHandler);
			}

			// Add move/up/out
			if (this.captureSettings.move){
				Util.Events.add(this.el, 'mousemove', this.mouseMoveHandler);
			}
			Util.Events.add(this.el, 'mouseup', this.mouseUpHandler);
			Util.Events.add(this.el, 'mouseout', this.mouseOutHandler);

			this.touchStartTime = new Date();
			this.isGesture = false;
			this.touchStartPoint = Util.Events.getMousePosition(e);

			Util.Events.fire(this, {
				type: Util.TouchElement.EventTypes.onTouch,
				target: this,
				action: Util.TouchElement.ActionTypes.touchStart,
				point: this.touchStartPoint,
				targetEl: e.target,
				currentTargetEl: e.currentTarget
			});

		},



		/*
		 * Function: onMouseMove
		 */
		onMouseMove: function(e){

			e.preventDefault();

			Util.Events.fire(this, {
				type: Util.TouchElement.EventTypes.onTouch,
				target: this,
				action: Util.TouchElement.ActionTypes.touchMove,
				point: Util.Events.getMousePosition(e),
				targetEl: e.target,
				currentTargetEl: e.currentTarget
			});

		},



		/*
		 * Function: onMouseUp
		 */
		onMouseUp: function(e){

			e.preventDefault();

			if (this.captureSettings.move){
				Util.Events.remove(this.el, 'mousemove', this.mouseMoveHandler);
			}
			Util.Events.remove(this.el, 'mouseup', this.mouseUpHandler);
			Util.Events.remove(this.el, 'mouseout', this.mouseOutHandler);

			if (Util.Browser.isTouchSupported){
				Util.Events.add(this.el, 'touchstart', this.touchStartHandler);
			}

			this.touchEndPoint = Util.Events.getMousePosition(e);
			this.touchEndTime = new Date();

			Util.Events.fire(this, {
				type: Util.TouchElement.EventTypes.onTouch,
				target: this,
				action: Util.TouchElement.ActionTypes.touchEnd,
				point: this.touchEndPoint,
				targetEl: e.target,
				currentTargetEl: e.currentTarget
			});

			this.fireTouchEvent(e);

		},



		/*
		 * Function: onMouseOut
		 */
		onMouseOut: function(e){

			/*
			 * http://blog.stchur.com/2007/03/15/mouseenter-and-mouseleave-events-for-firefox-and-other-non-ie-browsers/
			 */
			var relTarget = e.relatedTarget;
			if (this.el === relTarget || Util.DOM.isChildOf(relTarget, this.el)){
				return;
			}

			e.preventDefault();

			if (this.captureSettings.move){
				Util.Events.remove(this.el, 'mousemove', this.mouseMoveHandler);
			}
			Util.Events.remove(this.el, 'mouseup', this.mouseUpHandler);
			Util.Events.remove(this.el, 'mouseout', this.mouseOutHandler);

			if (Util.Browser.isTouchSupported){
				Util.Events.add(this.el, 'touchstart', this.touchStartHandler);
			}

			this.touchEndTime = new Date();
			this.touchEndPoint = Util.Events.getMousePosition(e);

			Util.Events.fire(this, {
				type: Util.TouchElement.EventTypes.onTouch,
				target: this,
				action: Util.TouchElement.ActionTypes.touchEnd,
				point: this.touchEndPoint,
				targetEl: e.target,
				currentTargetEl: e.currentTarget
			});

			this.fireTouchEvent(e);

		},



		/*
		 * Function: onTouchStart
		 */
		onTouchStart: function(e){

			if (this.captureSettings.preventDefaultTouchEvents && !this.captureSettings.allowVerticalScroll){
				e.preventDefault();
			}

			var
				touchEvent = Util.Events.getTouchEvent(e),
				touches = touchEvent.touches;

			if (this.preventGhostEvents('touch', this.getTouchPoint(touches))){
				return;
			}

			if (touches.length > 1 && this.captureSettings.gesture){
				if (Util.Browser.isTouchGestureSupported){
					this.onTouchGestureStart(e);
				}
				this.isGesture = true;
				return;
			}

			// Temporarily no longer need mouse events
			if (Util.Browser.isMouseSupported){
				Util.Events.remove(this.el, 'mousedown', this.mouseDownHandler);
			}

			// Add move/end
			if (this.captureSettings.move){
				Util.Events.add(this.el, 'touchmove', this.touchMoveHandler);
			}
			Util.Events.add(this.el, 'touchend', this.touchEndHandler);

			this.touchStartTime = new Date();
			this.isGesture = false;
			this.touchStartPoint = this.getTouchPoint(touches);

			Util.Events.fire(this, {
				type: Util.TouchElement.EventTypes.onTouch,
				target: this,
				action: Util.TouchElement.ActionTypes.touchStart,
				point: this.touchStartPoint,
				targetEl: e.target,
				currentTargetEl: e.currentTarget
			});


		},



		/*
		 * Function: onTouchMove
		 */
		onTouchMove: function(e){

			if (this.isGesture && this.captureSettings.gesture){
				return;
			}

			var
				touchEvent = Util.Events.getTouchEvent(e),
				touches = touchEvent.touches,
				point = this.getTouchPoint(touches);

			if (this.captureSettings.allowVerticalScroll && Math.abs(this.touchStartPoint.x - point.x) < Math.abs(this.touchStartPoint.y - point.y)){
				return;
			}

			if (this.captureSettings.preventDefaultTouchEvents){
				e.preventDefault();
			}

			Util.Events.fire(this, {
				type: Util.TouchElement.EventTypes.onTouch,
				target: this,
				action: Util.TouchElement.ActionTypes.touchMove,
				point: point,
				targetEl: e.target,
				currentTargetEl: e.currentTarget
			});

		},



		/*
		 * Function: onTouchEnd
		 */
		onTouchEnd: function(e){

			if (this.isGesture && this.captureSettings.gesture){
				return;
			}

			// http://backtothecode.blogspot.com/2009/10/javascript-touch-and-gesture-events.html
			// iOS removed the current touch from e.touches on "touchend"
			// Need to look into e.changedTouches

			var
				touchEvent = Util.Events.getTouchEvent(e),
				touches = (!Util.isNothing(touchEvent.changedTouches)) ? touchEvent.changedTouches : touchEvent.touches;

			if (this.captureSettings.move){
				Util.Events.remove(this.el, 'touchmove', this.touchMoveHandler);
			}
			Util.Events.remove(this.el, 'touchend', this.touchEndHandler);

			if (Util.Browser.isMouseSupported){
				Util.Events.add(this.el, 'mousedown', this.mouseDownHandler);
			}

			this.touchEndTime = new Date();
			this.touchEndPoint = this.getTouchPoint(touches);

			if (this.captureSettings.allowVerticalScroll && Math.abs(this.touchStartPoint.x - this.touchEndPoint.x) < Math.abs(this.touchStartPoint.y - this.touchEndPoint.y)){
				return;
			}

			if (this.captureSettings.preventDefaultTouchEvents){
				e.preventDefault();
			}

			Util.Events.fire(this, {
				type: Util.TouchElement.EventTypes.onTouch,
				target: this,
				action: Util.TouchElement.ActionTypes.touchEnd,
				point: this.touchEndPoint,
				targetEl: e.target,
				currentTargetEl: e.currentTarget
			});

			this.fireTouchEvent(e);

		},



		/*
		 * Function: onPointerDown
		 */
		onPointerDown: function(e){

			if (this.captureSettings.preventDefaultTouchEvents && !this.captureSettings.allowVerticalScroll){
				e.preventDefault();
			}

			var
				touchEvent = Util.Events.getTouchEvent(e);

			if (Util.isNothing(this.currentInputDeviceType)){
				this.currentInputDeviceType = 'ptr' + touchEvent.pointerType;
			} else if ('ptr' + touchEvent.pointerType !== this.currentInputDeviceType){
				return;
			}

			// Add pointer to gesture object
			if (!Util.isNothing(this.msGesture) && this.captureSettings.gesture){
				if (this.isMSGesture){
					this.isGesture = true;
				}
				this.msGesture.addPointer(touchEvent.pointerId);
			}

			if (!touchEvent.isPrimary){
				return;
			}

			this.pointerDown[touchEvent.pointerId] = true;

			// Add move/up/out
			if (this.captureSettings.move){
				Util.Events.add(this.el, this.pointerMoveEventName, this.pointerMoveHandler);
			}
			Util.Events.add(this.el, this.pointerUpEventName, this.pointerUpHandler);
			Util.Events.add(this.el, this.pointerOutEventName, this.pointerOutHandler);

			this.touchStartTime = new Date();
			this.isGesture = false;
			this.touchStartPoint = this.getPointerPoint(touchEvent);

			Util.Events.fire(this, {
				type: Util.TouchElement.EventTypes.onTouch,
				target: this,
				action: Util.TouchElement.ActionTypes.touchStart,
				point: this.touchStartPoint,
				targetEl: e.target,
				currentTargetEl: e.currentTarget
			});

		},



		/*
		 * Function: onPointerMove
		 */
		onPointerMove: function(e){

			var
				touchEvent = Util.Events.getTouchEvent(e),
				point;

			if (!this.pointerDown[touchEvent.pointerId]) {
				return;
			}

			point = this.getPointerPoint(touchEvent);

			if (this.captureSettings.allowVerticalScroll && Math.abs(this.touchStartPoint.x - point.x) < Math.abs(this.touchStartPoint.y - point.y)){
				return;
			}

			if (this.captureSettings.preventDefaultTouchEvents){
				e.preventDefault();
			}

			Util.Events.fire(this, {
				type: Util.TouchElement.EventTypes.onTouch,
				target: this,
				action: Util.TouchElement.ActionTypes.touchMove,
				point: point,
				targetEl: e.target,
				currentTargetEl: e.currentTarget
			});

		},



		/*
		 * Function: onPointerUp
		 */
		onPointerUp: function(e){

			var
				touchEvent = Util.Events.getTouchEvent(e);

			if (!this.pointerDown[touchEvent.pointerId]) {
				return;
			}

			if (this.captureSettings.move){
				Util.Events.remove(this.el, this.pointerMoveEventName, this.pointerMoveHandler);
			}
			Util.Events.remove(this.el, this.pointerUpEventName, this.pointerUpHandler);
			Util.Events.remove(this.el, this.pointerOutEventName, this.pointerOutHandler);

			this.pointerDown[touchEvent.pointerId] = false;
			this.currentInputDeviceType = null;

			this.touchEndTime = new Date();
			this.touchEndPoint =  this.getPointerPoint(touchEvent);

			if (this.captureSettings.allowVerticalScroll && Math.abs(this.touchStartPoint.x - this.touchEndPoint.x) < Math.abs(this.touchStartPoint.y - this.touchEndPoint.y)){
				return;
			}

			if (this.captureSettings.preventDefaultTouchEvents){
				e.preventDefault();
			}

			Util.Events.fire(this, {
				type: Util.TouchElement.EventTypes.onTouch,
				target: this,
				action: Util.TouchElement.ActionTypes.touchEnd,
				point: this.touchEndPoint,
				targetEl: e.target,
				currentTargetEl: e.currentTarget
			});

			this.fireTouchEvent(e);

		},



		/*
		 * Function: onPointerOut
		 */
		onPointerOut: function(e){

			if (this.isMSGesture && this.captureSettings.gesture){
				if (!this.isGesture && !Util.isNothing(this.msGesture)){
					this.msGesture.stop();
				}
				return;
			}

			var
				touchEvent = Util.Events.getTouchEvent(e);

			if (!this.pointerDown[touchEvent.pointerId]) {
				return;
			}

			if (this.captureSettings.move){
				Util.Events.remove(this.el, this.pointerMoveEventName, this.pointerMoveHandler);
			}
			Util.Events.remove(this.el, this.pointerUpEventName, this.pointerUpHandler);
			Util.Events.remove(this.el, this.pointerOutEventName, this.pointerOutHandler);

			this.pointerDown[touchEvent.pointerId] = false;
			this.currentInputDeviceType = null;

			this.touchEndTime = new Date();
			this.touchEndPoint =  this.getPointerPoint(touchEvent);

			if (this.captureSettings.allowVerticalScroll && Math.abs(this.touchStartPoint.x - this.touchEndPoint.x) < Math.abs(this.touchStartPoint.y - this.touchEndPoint.y)){
				return;
			}

			if (this.captureSettings.preventDefaultTouchEvents){
				e.preventDefault();
			}

			Util.Events.fire(this, {
				type: Util.TouchElement.EventTypes.onTouch,
				target: this,
				action: Util.TouchElement.ActionTypes.touchEnd,
				point: this.touchEndPoint,
				targetEl: e.target,
				currentTargetEl: e.currentTarget
			});

			this.fireTouchEvent(e);

		},



		/*
		 * Function: onTouchGestureStart
		 */
		onTouchGestureStart: function(e){

			e.preventDefault();

			this.lastGesturePinch = 0;

			var 
				touchEvent = Util.Events.getTouchEvent(e),
				touches = touchEvent.touches,
				scale = this.getTouchPinchScale(touches);

			if (!this.isGesture){
				Util.Events.add(this.el, 'touchstart', this.touchGestureStartHandler);
				Util.Events.add(this.el, 'touchmove', this.touchGestureChangeHandler);
				Util.Events.add(this.el, 'touchend', this.touchGestureEndHandler);
			}
			this.isGesture = true;

			// Temporarily no longer need touch events
			Util.Events.remove(this.el, 'touchstart', this.touchStartHandler);
			if (this.captureSettings.move){
				Util.Events.remove(this.el, 'touchmove', this.touchMoveHandler);
			}
			Util.Events.remove(this.el, 'touchend', this.touchEndHandler);

			Util.Events.fire(this, {
				type: Util.TouchElement.EventTypes.onTouch,
				target: this,
				action: Util.TouchElement.ActionTypes.gestureStart,
				scale: scale,
				rotation: 0,
				targetEl: e.target,
				currentTargetEl: e.currentTarget
			});

		},



		/*
		 * Function: onTouchGestureChange
		 */
		onTouchGestureChange: function(e){

			e.preventDefault();

			var 
				touchEvent = Util.Events.getTouchEvent(e),
				touches = touchEvent.touches,
				scale;

			if (touches.length <= 1){
				return;
			}

			scale = this.getTouchPinchScale(touches);

			Util.Events.fire(this, {
				type: Util.TouchElement.EventTypes.onTouch,
				target: this,
				action: Util.TouchElement.ActionTypes.gestureChange,
				scale: scale,
				rotation: 0,
				targetEl: e.target,
				currentTargetEl: e.currentTarget
			});

		},



		/*
		 * Function: onTouchGestureEnd
		 */
		onTouchGestureEnd: function(e){

			e.preventDefault();

			var 
				touchEvent = Util.Events.getTouchEvent(e),
				touches = (!Util.isNothing(touchEvent.changedTouches)) ? touchEvent.changedTouches : touchEvent.touches,
				scale;

			if (touches.length > 1){
				return;
			}

			if (touches.length === 1){
				scale = this.getTouchPinchScale(touches);

				Util.Events.fire(this, {
					type: Util.TouchElement.EventTypes.onTouch,
					target: this,
					action: Util.TouchElement.ActionTypes.gestureEnd,
					scale: scale,
					rotation: 0,
					targetEl: e.target,
					currentTargetEl: e.currentTarget
				});
			}

			if (touchEvent.touches.length === 0){
				this.isGesture = false;

				Util.Events.remove(this.el, 'touchstart', this.touchGestureStartHandler);
				Util.Events.remove(this.el, 'touchmove', this.touchGestureChangeHandler);
				Util.Events.remove(this.el, 'touchend', this.touchGestureEndHandler);

				Util.Events.add(this.el, 'touchstart', this.touchStartHandler);
			}

		},



		/*
		 * Function: onGestureStart
		 */
		onGestureStart: function(e){

			e.preventDefault();

			var touchEvent = Util.Events.getTouchEvent(e);

			// Temporarily no longer need touch events
			Util.Events.remove(this.el, 'touchstart', this.touchStartHandler);
			if (this.captureSettings.move){
				Util.Events.remove(this.el, 'touchmove', this.touchMoveHandler);
			}
			Util.Events.remove(this.el, 'touchend', this.touchEndHandler);

			Util.Events.fire(this, {
				type: Util.TouchElement.EventTypes.onTouch,
				target: this,
				action: Util.TouchElement.ActionTypes.gestureStart,
				scale: touchEvent.scale,
				rotation: touchEvent.rotation,
				targetEl: e.target,
				currentTargetEl: e.currentTarget
			});

		},



		/*
		 * Function: onGestureChange
		 */
		onGestureChange: function(e){

			e.preventDefault();

			var touchEvent = Util.Events.getTouchEvent(e);

			Util.Events.fire(this, {
				type: Util.TouchElement.EventTypes.onTouch,
				target: this,
				action: Util.TouchElement.ActionTypes.gestureChange,
				scale: touchEvent.scale,
				rotation: touchEvent.rotation,
				targetEl: e.target,
				currentTargetEl: e.currentTarget
			});

		},



		/*
		 * Function: onGestureEnd
		 */
		onGestureEnd: function(e){

			e.preventDefault();

			var touchEvent = Util.Events.getTouchEvent(e);

			Util.Events.add(this.el, 'touchstart', this.touchStartHandler);

			Util.Events.fire(this, {
				type: Util.TouchElement.EventTypes.onTouch,
				target: this,
				action: Util.TouchElement.ActionTypes.gestureEnd,
				scale: touchEvent.scale,
				rotation: touchEvent.rotation,
				targetEl: e.target,
				currentTargetEl: e.currentTarget
			});

		},



		/*
		 * Function: onMSGestureStart
		 */
		onMSGestureStart: function(e){

			var touchEvent = Util.Events.getTouchEvent(e);

			Util.Events.add(this.el, "MSGestureChange", this.msGestureChangeHandler);
			Util.Events.add(this.el, "MSGestureEnd", this.msGestureEndHandler);

			if (this.captureSettings.move){
				Util.Events.remove(this.el, this.pointerMoveEventName, this.pointerMoveHandler);
			}
			Util.Events.remove(this.el, this.pointerUpEventName, this.pointerUpHandler);

			if (this.captureSettings.preventDefaultTouchEvents){
				e.preventDefault();
			}

			this.isMSGesture = true;
			this.pointerDown[touchEvent.pointerId] = true;

		},



		/*
		 * Function: onMSGestureChange
		 */
		onMSGestureChange: function(e){

			var
				point,
				touchEvent = Util.Events.getTouchEvent(e);

			e.preventDefault();

			if (touchEvent.scale !== 1 || touchEvent.rotation !== 0 || this.isGesture){
				if (this.isGesture) {
					Util.Events.fire(this, {
						type: Util.TouchElement.EventTypes.onTouch,
						target: this,
						action: Util.TouchElement.ActionTypes.gestureChange,
						scale: touchEvent.scale,
						rotation: touchEvent.rotation,
						targetEl: e.target,
						currentTargetEl: e.currentTarget
					});
				}
				else {
					Util.Events.fire(this, {
						type: Util.TouchElement.EventTypes.onTouch,
						target: this,
						action: Util.TouchElement.ActionTypes.gestureStart,
						scale: touchEvent.scale,
						rotation: touchEvent.rotation,
						targetEl: e.target,
						currentTargetEl: e.currentTarget
					});

					this.isGesture = true;
				}
			}

			if (this.captureSettings.move && !this.isGesture){
				point = this.getPointerPoint(touchEvent);

				if (this.captureSettings.allowVerticalScroll && Math.abs(this.touchStartPoint.x - point.x) < Math.abs(this.touchStartPoint.y - point.y)){
					return;
				}

				Util.Events.fire(this, {
					type: Util.TouchElement.EventTypes.onTouch,
					target: this,
					action: Util.TouchElement.ActionTypes.touchMove,
					point: point,
					targetEl: e.target,
					currentTargetEl: e.currentTarget
				});
			}

		},



		/*
		 * Function: onMSGestureEnd
		 */
		onMSGestureEnd: function(e){

			e.preventDefault();

			var touchEvent = Util.Events.getTouchEvent(e);

			Util.Events.remove(this.el, this.pointerOutEventName, this.pointerOutHandler);
			Util.Events.remove(this.el, "MSGestureChange", this.msGestureChangeHandler);
			Util.Events.remove(this.el, "MSGestureEnd", this.msGestureEndHandler);

			this.pointerDown[touchEvent.pointerId] = false;
			this.currentInputDeviceType = null;

			this.touchEndTime = new Date();
			this.touchEndPoint =  this.getPointerPoint(touchEvent);

			this.isMSGesture = false;

			if(this.isGesture){
				if (this.captureSettings.preventDefaultTouchEvents){
					e.preventDefault();
				}

				Util.Events.fire(this, {
					type: Util.TouchElement.EventTypes.onTouch,
					target: this,
					action: Util.TouchElement.ActionTypes.gestureEnd,
					scale: touchEvent.scale,
					rotation: touchEvent.rotation,
					targetEl: e.target,
					currentTargetEl: e.currentTarget
				});
				this.isGesture = false;
			}
			else {
				if(this.captureSettings.allowVerticalScroll && Math.abs(this.touchStartPoint.x - this.touchEndPoint.x) < Math.abs(this.touchStartPoint.y - this.touchEndPoint.y)){
					return;
				}

				if (this.captureSettings.preventDefaultTouchEvents){
					e.preventDefault();
				}

				Util.Events.fire(this, {
					type: Util.TouchElement.EventTypes.onTouch,
					target: this,
					action: Util.TouchElement.ActionTypes.touchEnd,
					point: this.touchEndPoint,
					targetEl: e.target,
					currentTargetEl: e.currentTarget
				});

				this.fireTouchEvent(e);
			}

		},



		/*
		 * Function: onMSInertiaStart
		 */
		onMSInertiaStart: function(e){
			if (!Util.isNothing(this.msGesture)){
				this.msGesture.stop();
			}
			e.preventDefault();
		},



		/*
		 * Function: onMSHoldVisualHandler
		 */
		onMSHoldVisualHandler: function(e){
			e.preventDefault();
		}



	});



}
(
	window,
	window.klass,
	window.Code.Util
));
