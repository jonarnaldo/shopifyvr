AFRAME.registerComponent('theme-picker-controls', {
	init: function () {
		const el = this.el;
		el.addEventListener('hover-start', function(evt) {
			console.log('hovered');
			
			el.setAttribute(
				"animation", "property: position; from: 3 0.5 -4; to: 3 0 -4; dur: 800; easing: easeInOutElastic",
			);
					
			document.getElementById('store-floor').setAttribute("visible", "true");
			document.getElementById('store-interior').setAttribute("visible", "true");
			document.getElementById('store-model').setAttribute("visible", "true");
			document.getElementById('interactive-shelf').setAttribute("visible", "true");
			
			document.getElementById('store-floor').setAttribute(
				"animation", "property: position; from: 0 20 -1; to: 0 0 -1; dur: 500; easing: easeInOutCirc"
			);
			
			document.getElementById('store-interior').setAttribute(
				"animation", "property: position; from: 0 20 -1; to: 0 0 -1; dur: 1000; easing: easeInOutCirc"
			);

			document.getElementById('store-interior').setAttribute(
				"animation", "property: position; from: 0 20 -1; to: 0 0 -1; dur: 100; easing: easeInOutCirc"
			);

			document.getElementById('store-model').setAttribute(
				"animation", "property: position; from: 0 20 -1; to: 0 0 -1; dur: 1000; easing: easeInOutCirc"
			);
		});
	}
});
