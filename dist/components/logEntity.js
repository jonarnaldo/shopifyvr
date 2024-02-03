AFRAME.registerComponent('log-entity', {
  init: function() {
    let el = this.el;
    console.log('logging')
    el.addEventListener('gripup', function(evt) {
      console.log('hovered');
      console.log(evt);
    })
    el.addEventListener('hover-start', function(evt) {
      console.log('hovered');
      console.log(evt);
    })
  }
});