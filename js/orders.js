document.addEventListener('DOMContentLoaded', function () {

    const currentSellerId = 1;


    fetch('http://localhost:5000/orders')
        .then(response => response.json())
        .then(orders => {
            const sellerOrders = orders.filter(order =>
                order.items.some(item => item.sellerId === currentSellerId)
            );


            const ordersList = document.getElementById('ordersList');


            if (sellerOrders.length === 0) {
                ordersList.innerHTML = "<tr><td colspan='6'>No orders found for this seller.</td></tr>";
            } else {

                sellerOrders.forEach(order => {
                    order.items.forEach(item => {
                        if (item.sellerId === currentSellerId) {
                            const orderRow = document.createElement('tr');
                            orderRow.innerHTML = `
                            <td>${order.id}</td>
                            <td>${order.customerId}</td>
                            <td>${item.productName}</td>
                            <td>${item.quantity}</td>
                            <td>$${item.price}</td>
                            <td>${order.status}</td>
                        `;
                            ordersList.appendChild(orderRow);
                        }
                    });
                });
            }
        })
        .catch(error => console.error('Error fetching orders:', error));
});
