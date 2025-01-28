document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:5000/orders')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch orders.');
            }
            return response.json();
        })
        .then(orders => {
            const ordersList = document.getElementById('ordersList');


            if (orders.length === 0) {
                ordersList.innerHTML = "<tr><td colspan='6'>No orders found.</td></tr>";
            } else {


                orders.forEach(order => {
                    order.items.forEach(item => {
                        const orderRow = document.createElement('tr');
                        orderRow.innerHTML = `
                            <td>${order.id}</td>
                            <td>${order.customerId}</td>
                            <td>${item.productName}</td>
                            <td>${item.quantity}</td>
                            <td>$${item.price}</td>
                            <td>${order.status || 'Pending'}</td>
                        `;
                        ordersList.appendChild(orderRow);
                    });
                });
            }
        })
        .catch(error => {
            console.error('Error fetching orders:', error);
            const ordersList = document.getElementById('ordersList');
            ordersList.innerHTML = "<tr><td colspan='6'>An error occurred while loading orders.</td></tr>";
        });
});
