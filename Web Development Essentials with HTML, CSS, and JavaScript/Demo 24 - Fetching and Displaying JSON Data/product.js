export async function loadProducts() {
    const response = await fetch("./products.json");

    if (!response.ok) {
        throw new Error(`Product request failed: ${response.status}`);
    }

    const records = await response.json();

    return records;
}