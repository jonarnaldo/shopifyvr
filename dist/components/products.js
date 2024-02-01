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
  generateProducts: function(productData) {
    console.log('adding box...')
    
    let xPos = 0;
    productData.forEach((product, index) => {
      const scene = document.querySelector('#shelf');
      const box = document.createElement("a-box");
      const position = `${xPos - 1} 1 0.15`;
      box.setAttribute('id', 'test');
      box.setAttribute('height', 0.5);
      box.setAttribute('width', 0.3);
      box.setAttribute('depth', 0.05);
      box.setAttribute('position', position);
      box.setAttribute('color', '#4CC3D9');
      box.setAttribute('log', `message: I\'m a book! my title is ${product.title}`);
      box.setAttribute('rotation', '-15 0 0');
      xPos += 0.5;
      
      const text = document.createElement('a-text');
      text.setAttribute('value', `${product.title}`);
      text.setAttribute('align', 'center');
      text.setAttribute('width', 1);
      text.setAttribute('position', '0 -0.3 0.1');
      box.appendChild(text);

      console.log('adding box...', box);
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