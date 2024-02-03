AFRAME.registerComponent('theme-picker-controls', {
	init: function () {
		const el = this.el;
		el.addEventListener('hover-start', function(evt) {
			console.log('hovered');
			document.getElementById('store-model').setAttribute("visible", "true");
			document.getElementById('store-model').setAttribute(
				"animation", "property: position; from: 0 20 -1; to: 0 0 -1; dur: 1500; easing: easeInOutCirc"
			);			
		});
	}
});
