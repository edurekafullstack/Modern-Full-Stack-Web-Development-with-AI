const products = [
    {
        name: "HTML Handbook",
        price: 250
    },
    {
        name: "CSS Guide",
        price: 300
    },
    {
        name: "Wireless Mouse",
        price: 600
    }
];

const productList = document.querySelector("#product-list");
const productCount = document.querySelector("#product-count");

for (let index = 0; index < products.length; index++) {
    const product = products[index];

    const listItem = document.createElement("li");

    listItem.textContent =
        product.name + " — Price: " + product.price;

    productList.append(listItem);
}

productCount.textContent = "Products listed: " + products.length;