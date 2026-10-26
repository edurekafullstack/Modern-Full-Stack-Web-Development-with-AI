function calculateSubtotal(unitPrice, quantity) {
    const subtotal = unitPrice * quantity;
    
    return subtotal;
}

const firstSubtotal = calculateSubtotal(250, 2);
const secondSubtotal = calculateSubtotal(100, 3);

console.log("First subtotal:", firstSubtotal);
console.log("Second subtotal:", secondSubtotal);

const deliveryFee = 40;
const total = firstSubtotal + deliveryFee;

console.log("Delivery fee:", deliveryFee);
console.log("Total:", total);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       

