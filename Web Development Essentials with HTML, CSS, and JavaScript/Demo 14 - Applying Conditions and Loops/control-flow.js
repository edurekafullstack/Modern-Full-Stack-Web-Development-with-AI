const unitPrice = 250;
let quantity = 1;

const subtotal = unitPrice * quantity;
let deliveryFee;

if (subtotal >= 500) {
    deliveryFee = 0;
} else {
    deliveryFee = 40;
}

const total = subtotal + deliveryFee;

console.log("Quantity:", quantity);
console.log("Subtotal:", subtotal);
console.log("Delivery fee:", deliveryFee);
console.log("Total:", total);

console.log("Subtotals for quantities 1 to 3:");

for (let itemCount = 1; itemCount <= 3; itemCount++) {
    const calculatedSubtotal = unitPrice * itemCount;

    console.log(
        "Quantity:", itemCount,
        "Subtotal:", calculatedSubtotal
    );
}