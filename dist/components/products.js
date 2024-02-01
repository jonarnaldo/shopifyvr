const shopifyUtils = {
  getAllProducts: async function() {
    const response = await fetch("https://localhost:8080/products", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
    })
    return response.json();
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
    
    productData.forEach(product => {
      const scene = document.querySelector('#shelf');
      const box = document.createElement("a-box");
      box.setAttribute('id', 'test');
      box.setAttribute('position', '1 0 0');
      box.setAttribute('color', '#4CC3D9');
      box.setAttribute('log', `message: I\'m a book! my title is ${product.title}`);
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
          const products = shopifyUtils.getShopifyProductData(data);
          console.log('products', products);
          aframeUtils.generateProducts(products);
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