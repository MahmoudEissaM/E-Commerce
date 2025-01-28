let products = JSON.parse(localStorage.getItem("products")) || [];
let editingProductIndex = null;


const currentSellerId = 1;

// ----------------------------------------------------------------------------------------


document.getElementById("addProductForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("productName").value;
    const price = document.getElementById("productPrice").value;
    const file = document.getElementById("productImg").files[0];

    if (!file) {
        alert("Please select an image.");
        return;
    }

    const reader = new FileReader();
    reader.onloadend = function () {
        const imgBase64 = reader.result;

        const randomId = (Math.floor(Math.random() * 1000) + 1).toString();
        const category = "electronics";

        const newProduct = {
            id: randomId,
            sellerId: currentSellerId,
            name: name,
            price: price,
            category: category,
            img: imgBase64,
            status: "pending",
        };

        products.push(newProduct);
        localStorage.setItem("products", JSON.stringify(products));
        sendProductToServer(newProduct);

        document.getElementById("productName").value = "";
        document.getElementById("productPrice").value = "";
        document.getElementById("productImg").value = "";

        displayProducts();
        alert("Your product is pending approval.");
    };

    reader.readAsDataURL(file);
});

// ----------------------------------------------------------------------------------------

function deleteProduct(index) {
    const productId = products[index].id;
    products.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(products));
    displayProducts();
    alert("Product deleted successfully!");
    deleteProductFromServer(productId);
}

// ----------------------------------------------------------------------------------------

function displayProducts() {
    const productsList = document.getElementById("productsList");
    productsList.innerHTML = "";

    const sellerProducts = products.filter((product) => product.sellerId === currentSellerId);

    sellerProducts.forEach((product, index) => {
        const productCard = `
            <div class="product-card">
                <img src="${product.img}" alt="${product.name}">
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <p class="price">$${product.price}</p>
                    <p class="status">Status: <strong>${product.status}</strong></p>
                </div>
                <button class="delete-btn" onclick="deleteProduct(${index})">Delete</button>
                <button class="edit-btn" onclick="openEditModal(${index})">Edit</button>
            </div>
        `;
        productsList.innerHTML += productCard;
    });
}

// ----------------------------------------------------------------------------------------

function updateProductStatusFromServer() {
    fetch(`http://localhost:5000/products?sellerId=${currentSellerId}`)
        .then(response => response.json())
        .then(serverProducts => {
            let isUpdated = false;
            serverProducts.forEach((serverProduct) => {
                const localProductIndex = products.findIndex(product => product.id === serverProduct.id);
                if (localProductIndex !== -1 && products[localProductIndex].status !== serverProduct.status) {
                    products[localProductIndex].status = serverProduct.status;
                    isUpdated = true;
                }
            });

            if (isUpdated) {
                localStorage.setItem("products", JSON.stringify(products));
                displayProducts();
            }
        })
        .catch(error => console.error("Error fetching products from server:", error));
}

// ----------------------------------------------------------------------------------------

function openEditModal(index) {
    const product = products[index];
    editingProductIndex = index;

    document.getElementById("editProductName").value = product.name;
    document.getElementById("editProductPrice").value = product.price;
    document.getElementById("editProductModal").style.display = "block";
}

// ----------------------------------------------------------------------------------------

function closeEditModal() {
    document.getElementById("editProductModal").style.display = "none";
}

// ----------------------------------------------------------------------------------------

document.getElementById("saveEditBtn").addEventListener("click", function () {
    const newName = document.getElementById("editProductName").value;
    const newPrice = document.getElementById("editProductPrice").value;

    if (newName && newPrice) {
        const updatedProduct = {
            ...products[editingProductIndex],
            name: newName,
            price: newPrice,
        };


        updateProductOnServer(updatedProduct)
            .then(() => {

                products[editingProductIndex] = updatedProduct;
                localStorage.setItem("products", JSON.stringify(products));

                closeEditModal();
                displayProducts();
                alert("Your product has been updated.");
            })
            .catch(error => {
                console.error("Error updating product:", error);
                alert("Failed to update product. Please try again.");
            });
    }
});

// ----------------------------------------------------------------------------------------

function sendProductToServer(product) {
    fetch("http://localhost:5000/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
    })
        .then(response => {
            if (response.ok) {
                console.log("Product sent to server successfully.");
            } else {
                console.error("Failed to send product to server.");
            }
        })
        .catch(error => {
            console.error("Error sending product to server:", error);
        });
}

// ----------------------------------------------------------------------------------------

function updateProductOnServer(product) {
    return fetch(`http://localhost:5000/products/${product.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
    }).then(response => {
        if (!response.ok) {
            throw new Error("Failed to update product on server.");
        }
        return response.json();
    });
}

// ----------------------------------------------------------------------------------------

function deleteProductFromServer(productId) {
    fetch(`http://localhost:5000/products/${productId}`, {
        method: "DELETE",
    })
        .then(response => {
            if (response.ok) {
                console.log("Product deleted from server.");
            } else {
                console.error("Failed to delete product from server.");
            }
        })
        .catch(error => {
            console.error("Error deleting product from server:", error);
        });
}

// ----------------------------------------------------------------------------------------

window.addEventListener("load", () => {
    displayProducts();
    updateProductStatusFromServer();
});

setInterval(updateProductStatusFromServer, 5000);












