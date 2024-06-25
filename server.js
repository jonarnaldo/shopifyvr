const express = require('express');
const path = require('path');
const axios = require('axios');
const https = require("https");
const fs = require("fs");

const port = process.env.PORT || 8080;
const app = express();

const privateKey  = fs.readFileSync("key.pem")
const certificate = fs.readFileSync("cert.pem")
const credentials = {key: privateKey, cert: certificate};

app.use(express.static(path.join(__dirname + '/dist')));

app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, 'index.html'));
});


app.post('/products', async (req, res) => {
  // graphql url
  // ex. https://hop-page.myshopify.com/api/2024-01/graphql.json
  const url = "https://some_shop.myshopify.com/api/2024-01/graphql.json";
  const accessToken = process.env.ACCESS_TOKEN;
  
  const headers = {
    "Content-Type": "application/json",
    "X-Shopify-Storefront-Access-Token": accessToken,
  };

  const graphqlQuery = JSON.stringify({
    query: `{
      products(first: 30) {
        edges {
          node {
            id
            title
            featuredImage {
              url
            }
            variants(first: 1) {
              nodes {
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }`
  })

  const response = await axios({
    url,
    method: 'post',
    headers: headers,
    data: graphqlQuery
  });
  
  res.send(response.data);
})

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, '0.0.0.0', function() {
  console.log("HTTPS server started on port " + port);
});
