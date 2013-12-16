// Util
// Copyright (c) %%year%% Code Computerlove and other contributors
// Licensed under the MIT license
// version: %%version%%

// events.jquery.js
(function (window, $, Util) {
	
	Util.extend(Util, {
		
		Events: {
			
			
			/*
			 * Function: add
			 * Add an event handler
			 */
			add: function(obj, type, handler){
				
				if (type === 'mousewheel'){
					type = this._normaliseMouseWheelType();
				}
				
				$(obj).bind(type, handler);
				
			},
			
			
			
			/*
			 * Function: remove
			 * Removes a handler or all handlers associated with a type
			 */
			remove: function(obj, type, handler){
				
				if (type === 'mousewheel'){
					type = this._normaliseMouseWheelType();
				}
				
				$(obj).unbind(type, handler);
				
			},
			
			
			/*
			 * Function: fire
			 * Fire an event
			 */
			fire: function(obj, type){
				
				var 
					event,
					args = Array.prototype.slice.call(arguments).splice(2);
				
				if (type === 'mousewheel'){
					type = this._normaliseMouseWheelType();
				}
				
				if (typeof type === "string"){
					event = { type: type };
				}
				else{
					event = type;
				}
				
				$(obj).trigger( $.Event(event.type, event),  args);
				
			},
			
			
			/*
			 * Function: getMousePosition
			 */
			getMousePosition: function(event){
				
				var retval = {
					x: event.pageX,
					y: event.pageY
				};
				
				return retval;
				
			},
			
			
			/*
			 * Function: getTouchEvent
			 */
			getTouchEvent: function(event){
				
				return event.originalEvent;
				
			},
			
			
			/*
			 * Function: getWheelDelta
			 */
			getWheelDelta: function(event){
			
				var delta = {
					x: 0,
					y: 0,
					step: false
				};
				
				if (!Util.isNothing(event.originalEvent.deltaX)){
					delta.x = -event.originalEvent.deltaX;
					
					delta.step = (Math.abs(delta.x) === 3);
					if (Math.abs(delta.x) > 3){
						delta.x = delta.x / 100;
					}
				}
				
				if (!Util.isNothing(event.originalEvent.deltaY)){
					delta.y = -event.originalEvent.deltaY;
					
					if (!delta.step){
						delta.step = (Math.abs(delta.y) === 3);
					}
					if (Math.abs(delta.y) > 3){
						delta.y = delta.y / 100;
					}
					
					return delta;
				}
				
				if (!Util.isNothing(event.originalEvent.wheelDelta)){
					delta.y = event.originalEvent.wheelDelta;
					delta.step = true;
					
					return delta;
				}
				
				if (!Util.isNothing(event.originalEvent.detail)){
					delta.y = -event.originalEvent.detail / 3;
					delta.step = true;
				}
				
				return delta;
				
			},
			
			
			/*
			 * Function: domReady
			 */
			domReady: function(handler){
				
				$(document).ready(handler);
				
			},
			
			
			_normaliseMouseWheelType: function(){
				
				if (Util.Browser.isEventSupported('wheel')){
					return 'wheel';
				}
				
				if (Util.Browser.msie && Util.Browser.version > 8){
					return 'wheel';
				}
				
				if (Util.Browser.isEventSupported('mousewheel')){
					return 'mousewheel';
				}
				
				return 'DOMMouseScroll';
				
			}
			
			
		}
	
		
	});
	
	
}
(
	window,
	window.jQuery,
	window.Code.Util
));
