const products = [
    {
        id: "P001",
        name: "HTML Handbook",
        category: "Books",
        price: 250
    },
    {
        id: "P002",
        name: "CSS Guide",
        category: "Books",
        price: 300
    },
    {
        id: "P003",
        name: "Wireless Mouse",
        category: "Accessories",
        price: 600
    }
];

console.table(products);

console.log("Product count:", products.length);

const firstProduct = products[0];

console.log("First product:", firstProduct.name);
console.log("First product price:", firstProduct.price);

const selectedCategory = "Books";

function matchesCategory(product) {
    return product.category === selectedCategory;
}

const filteredProducts = products.filter(matchesCategory);

console.log("Selected category:", selectedCategory);
console.log("Matching products:", filteredProducts.length);
console.table(filteredProducts);