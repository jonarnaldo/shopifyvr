
const url = "https://localhost:8080/products";

const getAllProducts = async (url) => {
  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
  })
  return response.json()
}

const products = getAllProducts(url);

products
  .then((data) => console.log(data))
  .catch(e => console.log(e))