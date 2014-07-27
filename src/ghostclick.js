// Copyright (c) %%year%% Thorstein Overland and other contributors
// Licensed under the MIT license
// version: %%version%%

// ghostclick.js
(function (window, Util) {
	
	Util.extend(Util, {
		
		GhostClick: {
			
			points: null,
			elements: null,
			onClickPointHandler: null,
			onClickElementHandler: null,
			ghostClickTimeout: 1000,
			
			
			
			/*
			 * Function: preventClickPoint
			 */
			preventClickPoint: function(x, y){
				
				if (Util.isNothing(this.onClickPointHandler)){
					this.points = [];
					this.onClickPointHandler = this.onClickPoint.bind(this);
				}
				
				if (this.points.length < 2){
					Util.Events.add(document, 'click', this.onClickPointHandler);
				}
				
				this.points.push(x, y);
				
				window.setTimeout(this.popClickPoint, this.ghostClickTimeout);
				
			},
			
			
			
			/*
			 * Function: popClickPoint
			 */
			popClickPoint: function(){
				
				Util.GhostClick.points.splice(0, 2);
				
				if (Util.GhostClick.points.length < 2){
					Util.Events.remove(document, 'click', Util.GhostClick.onClickPointHandler);
				}
				
			},
			
			
			
			/*
			 * Function: onClickPoint
			 */
			onClickPoint: function(e){
				
				var
					i, x, y;
				
				for (i = 0; i < this.points.length; i += 2) {
					x = this.points[i];
					y = this.points[i + 1];
					if (Math.abs(e.clientX - x) < 25 && Math.abs(e.clientY - y) < 25) {
						e.stopPropagation();
						e.preventDefault();
					}
				}
				
			},
			
			
			
			/*
			 * Function: preventClickElement
			 */
			preventClickElement: function(el){
				
				if (Util.isNothing(this.onClickElementHandler)){
					this.elements = [];
					this.onClickElementHandler = this.onClickElement.bind(this);
				}
				
				Util.Events.add(el, 'click', this.onClickElementHandler);
				
				this.elements.push(el);
				
				window.setTimeout(this.popClickElement, this.ghostClickTimeout);
				
			},
			
			
			
			/*
			 * Function: popClickElement
			 */
			popClickElement: function(){
				
				Util.Events.remove(Util.GhostClick.elements[0], 'click', Util.GhostClick.onClickElementHandler);
				
				Util.GhostClick.elements.splice(0, 1);
				
			},
			
			
			
			/*
			 * Function: onClickElement
			 */
			onClickElement: function(e){
				
				e.stopPropagation();
				e.preventDefault();
				
			}
			
			
		}
		
		
	});
	
	
}
(
	window,
	window.Code.Util
));
