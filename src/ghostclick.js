// Copyright (c) %%year%% Thorstein Overland and other contributors
// Licensed under the MIT license
// version: %%version%%

// ghostclick.js
(function (window, Util) {
	
	Util.extend(Util, {
		
		GhostClick: {
			
			points: null,
			onClickHandler: null,
			ghostClickTimeout: 1000,
			
			
			
			/*
			 * Function: preventClick
			 */
			preventClick: function(x, y){
				
				if (Util.isNothing(this.onClickHandler)){
					this.points = [];
					this.onClickHandler = this.onClick.bind(this);
				}
				
				this.points.push(x, y);
				
				if (this.points.length < 2){
					Util.Events.add(document, 'click', this.onClickHandler);
				}
				
				window.setTimeout(this.popClick, this.ghostClickTimeout);
				
			},
			
			
			
			/*
			 * Function: popClick
			 */
			popClick: function(){
				
				Util.ClickZapper.points.splice(0, 2);
				
				if (Util.ClickZapper.points.length < 2){
					Util.Events.remove(document, 'click', this.onClickHandler);
				}
				
			},
			
			
			
			/*
			 * Function: onClick
			 */
			onClick: function(e){
				
				var
					x, y, i;
				
				for (i = 0; i < this.points.length; i += 2) {
					x = this.points[i];
					y = this.points[i + 1];
					if (Math.abs(e.clientX - x) < 25 && Math.abs(e.clientY - y) < 25) {
						e.stopPropagation();
						e.preventDefault();
					}
				}
				
			}
			
			
		}
		
		
	});
	
	
}
(
	window,
	window.Code.Util
));
