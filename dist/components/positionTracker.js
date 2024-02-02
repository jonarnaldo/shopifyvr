AFRAME.registerComponent(
  'position-tracker',
  {
    init: function() {
      this.worldPos = new THREE.Vector3();
      this.currentPos = this.el.getAttribute('position');
      this.raycastTarget = null;
      this.currentPos = this.el.object3D.getWorldPosition(this.worldPos);
      
      
      this.el.addEventListener('abuttondown', function(evt) {
        console.log('abuttondown');
        this.raycastTarget.setAttribute('position', this.currentPos);
      })
      
      this.el.addEventListener('raycaster-intersection', function(evt) {
        const raycastEls = evt.detail.els;        
        this.raycastTarget = raycastEls[0];
        console.log('raycaster interstion', this.el.object3D.getWorldPosition(this.worldPos));
      }.bind(this));
    },
    update: function() {
      
    },
    tick: function() {
      const entity = this.el;
    }
  }
)