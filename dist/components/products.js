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
    console.log('adding box...')
    const feetToMeters = aframeUtils.feetToMeters;
    
    let xPos = 0;
    productData.forEach((product, index) => {
      const scene = document.querySelector('#shelf');
      const box = document.createElement("a-box");
      const position = `${xPos - feetToMeters(1.5)}  ${feetToMeters(1)} ${feetToMeters(0.3)}`;
      box.setAttribute('id', 'test');
      box.setAttribute('height', feetToMeters(0.75));
      box.setAttribute('width', feetToMeters(0.5));
      box.setAttribute('depth', feetToMeters(0.05));
      box.setAttribute('position', position);
      box.setAttribute('src', `${product.featuredImage.url}`);
      box.setAttribute('log', `message: I\'m a book! my title is ${product.title}`);
      box.setAttribute('rotation', '-15 0 0');
      xPos += feetToMeters(0.7);
      
      const text = document.createElement('a-text');
      text.setAttribute('value', `${product.title}`);
      text.setAttribute('align', 'center');
      text.setAttribute('color', 'black');
      text.setAttribute('width', feetToMeters(1.2));
      text.setAttribute('position', `0 ${feetToMeters(0.1)} ${feetToMeters(0.05)}`);
      box.appendChild(text);

      scene.appendChild(box);;
    })
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