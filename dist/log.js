AFRAME.registerComponent(
    'log',
    {
      schema: {
        message: {type: 'string', default: 'hi!'}
      },
      update: function () {
        let el = this.el;
        console.log('heheheheheheh')
        let data = this.data;
        this.log = function () {
          alert(data.message);  
        }
        el.addEventListener('click', this.log);
      },
      remove: function () {
        let el = this.el;
        el.remveEventListener('click', this.log);
      }
    }
  )
  
  // document.querySelector('a-cylinder').addEventListener('click', function (evt) {
  //   console.log('This 2D element was clicked!');
  // });