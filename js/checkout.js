document.getElementById('order-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const customerId = document.getElementById('customer-id').value;
    const address = document.getElementById('address').value;
    const cardNumber = document.getElementById('card-number').value;
    const expiryDate = document.getElementById('expiry-date').value;
    const cvc = document.getElementById('cvc').value;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        alert("Your cart is empty, please add items before placing an order.");
        return;
    }

    if (!customerId) {
        alert("Please enter your customer ID.");
        return;
    }

    if (!address) {
        alert("Please enter your address.");
        return;
    }

    const cardNumberRegex = /^[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}$/;
    if (!cardNumberRegex.test(cardNumber)) {
        alert("Please enter a valid card number (16 digits, grouped in 4).");
        return;
    }

    const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryDateRegex.test(expiryDate)) {
        alert("Please enter a valid expiry date (MM/YY).");
        return;
    }

    const cvcRegex = /^\d{3}$/;
    if (!cvc.match(cvcRegex)) {
        alert("CVC code must be 3 digits.");
        return;
    }

    const orderItems = cart.map(product => ({
        productName: product.name,
        sellerId: product.sellerId,
        quantity: product.quantity,
        price: product.price
    }));
    const orderData = {
        customerId: customerId,
        address: address,
        payment: {
            cardNumber: cardNumber,
            expiryDate: expiryDate,
            cvc: cvc
        },
        items: orderItems
    };

    fetch('http://localhost:5000/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Order placed successfully:', data);
            alert("Your order has been placed successfully!");

        })
        .catch(error => {
            console.error('An error occurred:', error);
            alert("An error occurred while placing the order. Please try again.");
        });
});

// ========================================================================================

document.addEventListener('DOMContentLoaded', function () {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const cartContainer = document.getElementById('cart-container');

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    cart.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('cart-item');
        productElement.innerHTML = `
            <p><strong>Product Name:</strong> ${product.name}</p>
            <p><strong>Seller:</strong> ${product.sellerId}</p>
            <p><strong>Price:</strong> $${product.price}</p>
            <p><strong>Quantity:</strong> ${product.quantity}</p>
        `;
        cartContainer.appendChild(productElement);
    });
});





