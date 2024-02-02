AFRAME.registerComponent(
  'position-tracker',
  {
    init: function() {
      this.worldPos = new THREE.Vector3();
      this.currentPos = this.el.getAttribute('position');
      this.raycastTarget = null;
      this.currentPos = this.el.object3D.getWorldPosition(this.worldPos);
      this.el.addEventListener('thumbstickmoved', function (evt) {
        if (evt.detail.y > 0.95) { console.log("DOWN"); }
        if (evt.detail.y < -0.95) { console.log("UP"); }
        if (evt.detail.x < -0.95) { console.log("LEFT"); }
        if (evt.detail.x > 0.95) { console.log("RIGHT"); }
      });
      this.el.addEventListener("gripdown", function (evt) {
        console.log("gripdown button pressed!");
      });
     
      // this.el.addEventListener('raycaster-intersection', function(evt) {
      //   const raycastEls = evt.detail.els;        
      //   this.raycastTarget = raycastEls[0];
      //   console.log('raycaster interstion', this.el.object3D.getWorldPosition(this.worldPos));
      // }.bind(this));
    },
    update: function() {
      
    },
    tick: function() {
      const entity = this.el;
    }
  }
)