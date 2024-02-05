AFRAME.registerComponent('log-entity', {
  schema: {
    id: {type: 'string', default: ''}
  },
  init: function() {
    let el = this.el;
    console.log('logging')

    el.addEventListener('hover-start', function(evt) {
      console.log('hover start');
    })

    el.addEventListener('hover-end', function(evt) {
      console.log('hover end');
    })
  }
});