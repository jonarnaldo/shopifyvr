const shopifyUtils = {
  getAllProducts: async function() {
    try {
      const localhost = 'your local ip here';
      const response = await fetch(`https://${localhost}:8080/products`, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
      })
      return response.json();
    } catch (error) {
      // hack to fix certs error
      const response = await fetch("https://localhost:8080/products", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
      })
      return response.json();
    }
  },

  getShopifyProductData: function (data) {
    console.log(data)
    if (data.products.edges.length) {
      return data.products.edges.map(({node}) => {
        return node;
      })
    }
  }
}

const aframeUtils = {
  feetToMeters: function(feet) {
    return feet/3.28084;
  },

  generateProducts: function(productData) {
    const feetToMeters = aframeUtils.feetToMeters;   
    let pos = 0;
    const scene = document.querySelector('a-scene');
    const shelf = document.createElement('a-entity');
    
    shelf.setAttribute("gltf-model", "#bookshelf-empty")
    shelf.setAttribute("scale", "1 1 1" )
    shelf.setAttribute("position", "0 0 -1")
    shelf.setAttribute("static-body", "")
    
    productData.forEach((product, index) => {        
      const box = document.createElement("a-box");
      const position = `${pos - feetToMeters(2.2)}  ${feetToMeters(1)} ${feetToMeters(0.3)}`;
      
      box.setAttribute('id', 'test');
      box.setAttribute('height', feetToMeters(0.75));
      box.setAttribute('width', feetToMeters(0.5));
      box.setAttribute('depth', feetToMeters(0.05));
      box.setAttribute('position', `1.9 1.2 ${position}`); // this is relative to the parent(shelf)
      box.setAttribute('src', `${product.featuredImage.url}`);
      box.setAttribute('rotation', `0 -90 0`);
      box.setAttribute('grabbable', '');
      box.setAttribute('hoverable', '');
      box.setAttribute('log-entity', '');
      box.setAttribute('book', `title: I\'m a book! my title is ${product.title}`);
      pos += feetToMeters(0.65);
      
      // add book title
      const text = document.createElement('a-text');
      text.setAttribute('value', `${product.title}`);
      text.setAttribute('align', 'center');
      text.setAttribute('color', 'black');
      text.setAttribute('width', feetToMeters(1.2));
      text.setAttribute('position', `0 ${feetToMeters(0.1)} ${feetToMeters(0.05)}`);

      // add book to shelf
      box.appendChild(text);
      shelf.appendChild(box);;
    });

    // add shelf to scene
    scene.appendChild(shelf);
  }
}

AFRAME.registerComponent(
  'products',
  {
    init: function() {
      const products = shopifyUtils.getAllProducts();
      console.log('populating products...');
      products
        .then(({data}) => {
          const productData = shopifyUtils.getShopifyProductData(data);
          aframeUtils.generateProducts(productData);
        })
        .catch(e => console.log(e))
    }
  }
)

AFRAME.registerComponent(
  'book',
  {
    schema: {
      title: {type: 'string', default: 'title'}
    },
    update: function () {
      let el = this.el;
      let data = this.data;
      el.addEventListener('grab-start', function () {
        console.log('hey')
        el.setAttribute('collision-filter', {collisionForces: false })
      })
      el.addEventListener('grab-end', function () {
        console.log('yo')
        el.setAttribute('dynamic-body', '');
        el.setAttribute('collision-filter', {collisionForces: true})
      })
    },
    remove: function () {
      let el = this.el;
    }
  }
)