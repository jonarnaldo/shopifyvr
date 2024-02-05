// ex. data.products.edges[0].node.featuredImage.url
const dummyProducts = new Promise((res, rej) => {
  return res({
    data: {
      products: {
        edges: [
          { 
            node: {
              featuredImage: {url: 'https://cdn.shopify.com/s/files/1/0550/9165/8808/products/putting-on-your-shoes_925x_f71c19ac-c091-4c7f-bbfe-a43d6a0456b7.jpg?v=1619565238'},
              id: 'gid://shopify/Product/6581516075064',
              title: 'LED High Tops',
              description: 'the most high tech high tops ever made. it\'s like walking into the future',
              variants: {
                nodes: [
                  {
                    price: {
                      amount: "90.00",
                      currencyCode: "CAD"
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    }
  })
});

const shopifyUtils = {
  currency: {
    'CAD': '$',
    'USD': '$'
  },

  getAllProducts: async function() {
    try {
      const localhost = '192.168.68.63';
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
  },

  getProductPrice(product) {
    if (product.variants?.nodes.length) {
      const price = product.variants.nodes[0].price;
      return `${shopifyUtils.currency[price.currencyCode]}${price.amount}`;
    }
  }
}

const aframeUtils = {
  feetToMeters: function(feet) {
    return feet/3.28084;
  },

  setAttributes: function(el, attributes) {
    for (key in attributes) {
      el.setAttribute(key, attributes[key]);
    }
  },

  generateProducts: function(productData) {
    const feetToMeters = aframeUtils.feetToMeters;   
    let xPos = 0;
    let yPos = 2.1;
    const scene = document.querySelector('a-scene');
    const shelf = document.createElement('a-entity');
    
    aframeUtils.setAttributes(shelf, {
      "id": "interactive-shelf",
      "visible": "true",
      "gltf-model": "#bookshelf-empty",
      "scale": "1 1 1" ,
      "position": "0 0 -1",
      "rotation": "0 -180 0",
      "static-body": "",
    });
    
    productData.forEach((product, index) => {        
      const box = document.createElement("a-box");
      if ((index) % 5 === 0) {
        yPos = yPos - 0.3;
        xPos = 0;
      }
      
      aframeUtils.setAttributes(box, {
        'id': 'test',
        'height': feetToMeters(0.75),
        'width': feetToMeters(0.5),
        'depth': feetToMeters(0.05),
        'position': `1.9 ${yPos} ${xPos - feetToMeters(2.2)}`, // this is relative to the parent(shelf)
        'rotation': `0 -90 0`,
        'grabbable': '',
        'hoverable': '',
        'log-entity': '',
        'book': `title: I\'m a book! my title is ${product.title}; id: ${index}`,
      });

      if (product.featuredImage && product.featuredImage.url) {
        box.setAttribute('src', product.featuredImage.url)
      }

      xPos += feetToMeters(0.65);
      
      // add book title
      const text = document.createElement('a-text');
      aframeUtils.setAttributes(text, {
        'value': `${product.title}`,
        'align': 'center',
        'color': 'black',
        'width': feetToMeters(1.2),
        'position': `0 ${feetToMeters(0.1)} ${feetToMeters(0.05)}`,
      });

      // add info display
      const infoDisplay = document.createElement('a-box');
      aframeUtils.setAttributes(infoDisplay, {
        id: `info-display-${index}`,
        visible: 'false',
        position: `0 ${feetToMeters(0.8)} 0`,
        height: feetToMeters(0.3),
        width: feetToMeters(0.5),
        depth: feetToMeters(0.01),
        material: "opacity: 0.5; transparent: true"
      });

      const displayImage = document.createElement('a-image');
      aframeUtils.setAttributes(displayImage, {
        src: product.featuredImage.url,
        height: feetToMeters(0.04),
        width: feetToMeters(0.06)
      })

      const displayText = document.createElement('a-text');
      let copy = `${product.title} \n ${shopifyUtils.getProductPrice(product)}`
      if (product.description) {
        copy += `\n \n ${product.description}`;
      }

      aframeUtils.setAttributes(displayText, {
        'value': copy,
        'align': 'center',
        'color': 'black',
        'width': feetToMeters(0.5),
        'position': `0 ${feetToMeters(-0.01)} ${feetToMeters(0.05)}`,
      });

      infoDisplay.appendChild(displayImage);
      infoDisplay.appendChild(displayText);

      box.appendChild(text);
      box.appendChild(infoDisplay);
      shelf.appendChild(box);;
    });

    scene.appendChild(shelf);
  }
}

AFRAME.registerComponent(
  'products',
  {
    init: function() {
      // const products = shopifyUtils.getAllProducts();      
      const products = dummyProducts;

      console.log('populating products...');
      products
        .then(({data}) => {
          console.log(data, 'data')
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
      title: {type: 'string', default: 'title'},
      id: {type: 'number', default: ''}
    },
    update: function () {
      let el = this.el;
      let data = this.data;
      el.addEventListener('hover-start', function () {
        console.log('hover start')
        el.setAttribute('collision-filter', {collisionForces: false })
      })

      el.addEventListener('grab-start', function () {
        console.log('grab start')

        const infoDisplayEntity = document.querySelector(`#info-display-${data.id}`);
        infoDisplayEntity.setAttribute('visible', 'true');
        // todo: add some snazzy animation here
      })

      el.addEventListener('hover-end', function () {
        console.log('hover end')
        el.setAttribute('dynamic-body', '');
        el.setAttribute('collision-filter', {collisionForces: true})
      })

      el.addEventListener('grab-end', function () {
        console.log('grab end')
        const infoDisplayEntity = document.querySelector(`#info-display-${data.id}`);
        console.log(infoDisplayEntity)
        infoDisplayEntity.setAttribute('visible', 'true');
      })
    },
    remove: function () {
      let el = this.el;
    }
  }
)