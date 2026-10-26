import { loadProducts } from "./product.js";

let products = [];

const searchInput = document.querySelector("#product-search");
const categorySelect = document.querySelector("#product-category");
const productList = document.querySelector("#product-list");
const productCount = document.querySelector("#product-count");
const emptyMessage = document.querySelector("#empty-message");
const productStatus = document.querySelector("#product-status");

function renderProducts(records) {
    productList.replaceChildren();

    for (let index = 0; index < records.length; index++) {
        const product = records[index];

        const listItem = document.createElement("li");

        listItem.textContent =
            `${product.name} — Price: ${product.price}`;

        productList.append(listItem);
    }

    productCount.textContent = `Products listed: ${records.length}`;

    if (records.length === 0) {
        emptyMessage.textContent =
            "No products match. Try another search or category.";
    } else {
        emptyMessage.textContent = "";
    }

}

function applyFilters() {
    const searchText = searchInput.value.trim().toLowerCase();
    const selectedCategory = categorySelect.value;

    const matchingProducts = products.filter((product) => {
        const matchesText =
            product.name.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        return matchesText && matchesCategory;
    });

    renderProducts(matchingProducts);
}

async function initialiseProducts() {
    searchInput.disabled = true;
    categorySelect.disabled = true;

    productStatus.textContent = "Loading products...";
    productCount.textContent = "";
    emptyMessage.textContent = "";
    productList.replaceChildren();

    try {
        products = await loadProducts();

        searchInput.addEventListener("input", applyFilters);
        categorySelect.addEventListener("change", applyFilters);

        applyFilters();

        searchInput.disabled = false;
        categorySelect.disabled = false;

        productStatus.textContent = "Products loaded.";
    } catch (error) {
        products = [];
        productList.replaceChildren();
        productCount.textContent = "";
        emptyMessage.textContent = "";

        productStatus.textContent =
            "Products could not be loaded. Reload the page to try again.";

        console.error("Product loading failed:", error);
    }
}

initialiseProducts();