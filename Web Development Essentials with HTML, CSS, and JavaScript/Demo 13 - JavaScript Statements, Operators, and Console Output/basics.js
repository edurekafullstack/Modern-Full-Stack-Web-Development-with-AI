console.log("JavaScript is connected.");

const itemName = "HTML Handbook";
const unitPrice = 250;
let quantity = 2;

const subtotal = unitPrice * quantity;
const deliveryFee = 40;
const total = subtotal + deliveryFee;

console.log("Item:", itemName);
console.log("Unit price:", unitPrice);
console.log("Quantity:", quantity);
console.log("Subtotal:", subtotal);
console.log("Delivery fee:", deliveryFee);
console.log("Total:", total);

console.log("Item name type:", typeof itemName);
console.log("Unit price type:", typeof unitPrice);

quantity = 3;

console.log("Updated quantity:", quantity);
console.log("Stored subtotal:", subtotal);

const updatedSubtotal = unitPrice * quantity;
const updatedTotal = updatedSubtotal + deliveryFee;

console.log("Updated subtotal:", updatedSubtotal);
console.log("Updated total:", updatedTotal);