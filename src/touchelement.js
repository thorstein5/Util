// Util
// Copyright (c) %%year%% Code Computerlove and other contributors
// Licensed under the MIT license
// version: %%version%%

// touchelement.js
(function(window, klass, Util){
	
	
	Util.registerNamespace('Code.Util.TouchElement');
	
	
	Util.TouchElement.EventTypes = {
	
		onTouch: 'CodeUtilTouchElementOnTouch'
	
	};
	
	
	Util.TouchElement.ActionTypes = {
		
		touchStart: 'touchStart',
		touchMove: 'touchMove',
		touchEnd: 'touchEnd',
		touchMoveEnd: 'touchMoveEnd',
		tap: 'tap',
		doubleTap: 'doubleTap',
		swipeLeft: 'swipeLeft',
		swipeRight: 'swipeRight',
		swipeUp: 'swipeUp',
		swipeDown: 'swipeDown',
		swipeEdgeLeft: 'swipeEdgeLeft',
		swipeEdgeRight: 'swipeEdgeRight',
		swipeEdgeUp: 'swipeEdgeUp',
		swipeEdgeDown: 'swipeEdgeDown',
		gestureStart: 'gestureStart',
		gestureChange: 'gestureChange',
		gestureEnd: 'gestureEnd'
	
	};
	
	
}
(
	window,
	window.klass,
	window.Code.Util
));
