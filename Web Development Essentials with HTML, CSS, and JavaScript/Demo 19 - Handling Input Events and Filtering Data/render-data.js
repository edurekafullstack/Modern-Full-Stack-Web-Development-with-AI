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

const searchInput = document.querySelector("#product-search");
const productList = document.querySelector("#product-list");
const productCount = document.querySelector("#product-count");

function renderProducts(records) {
    productList.replaceChildren();

    for (let index = 0; index < records.length; index++) {
        const product = records[index];

        const listItem = document.createElement("li");

        listItem.textContent =
            product.name + " — Price: " + product.price;

        productList.append(listItem);
    }

    productCount.textContent = "Products listed: " + records.length;
}

function handleSearch() {
    const searchText = searchInput.value.trim().toLowerCase();

    function matchesSearch(product) {
        return product.name.toLowerCase().includes(searchText);
    }

    const matchingProducts = products.filter(matchesSearch);

    renderProducts(matchingProducts);
}

searchInput.addEventListener("input", handleSearch);

renderProducts(products);