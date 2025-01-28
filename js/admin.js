
//====================================	User Management // =============================================




const userManagementLink = document.getElementById("userManagementLink");
const productManagementLink = document.getElementById("productManagementLink");
const userManagementSection = document.getElementById("user-management-section");
const productManagementSection = document.getElementById("product-management-section");

// ========================================================================================


userManagementLink.addEventListener("click", () => {
    userManagementSection.style.display = "block";
    productManagementSection.style.display = "none";
});

productManagementLink.addEventListener("click", () => {
    userManagementSection.style.display = "none";
    productManagementSection.style.display = "block";
    displayProductsAdmin(); // تحديث عرض المنتجات
});


// ========================================================================================





function fetchUsers() {
    fetch("http://localhost:5000/users")
        .then(response => response.json())
        .then(users => {
            const userTableBody = document.querySelector("#user-table tbody");
            userTableBody.innerHTML = "";

            users.forEach(user => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${user.firstName} ${user.lastName}</td>
                    <td>${user.email}</td>
                    <td>${user.username}</td>
                    <td>${user.role}</td>
                    <td>
                        <button onclick="deleteUser('${user.id}')">Delete</button>
                        <button onclick="editUserRole('${user.id}')">Edit Role</button>
                    </td>
                `;
                userTableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Error fetching users:", error);
            alert("Something went wrong. Please try again.");
        });
}

// ========================================================================================



document.getElementById("addUser").addEventListener("click", function () {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    const newUser = {
        firstName,
        lastName,
        email,
        username,
        password,
        role
    };

    fetch("http://localhost:5000/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newUser)
    })
        .then(response => response.json())
        .then(data => {
            console.log("User added:", data);
            alert("User added successfully!");
            fetchUsers();
        })
        .catch(error => {
            console.error("Error adding user:", error);
            alert("Something went wrong. Please try again.");
        });
});


// ========================================================================================



function deleteUser(userId) {
    fetch(`http://localhost:5000/users/${userId}`, {
        method: "DELETE"
    })
        .then(response => response.json())
        .then(data => {
            console.log("User deleted:", data);
            alert("User deleted successfully!");
            fetchUsers();
        })
        .catch(error => {
            console.error("Error deleting user:", error);
            alert("Something went wrong. Please try again.");
        });
}

// ========================================================================================



function editUserRole(userId) {
    const newRole = prompt("Enter new role (admin/seller/customer):");

    if (newRole && (newRole === "admin" || newRole === "seller" || newRole === "customer")) {
        fetch(`http://localhost:5000/users/${userId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ role: newRole })
        })
            .then(response => response.json())
            .then(data => {
                console.log("User role updated:", data);
                alert("User role updated successfully!");
                fetchUsers();
            })
            .catch(error => {
                console.error("Error updating user role:", error);
                alert("Something went wrong. Please try again.");
            });
    } else {
        alert("Invalid role. Please choose either admin, seller, or customer.");
    }
}

fetchUsers();



//==================================== Product Management // =============================================





function displayProductsAdmin() {
    fetch("http://localhost:5000/products")
        .then(response => response.json())
        .then(products => {
            const productContainer = document.getElementById("product-container");
            productContainer.innerHTML = "";

            products.forEach(product => {
                const productCard = `
    <div class="product-card">
        <img src="${location.href.split('html')[0]}${product.img}">
        <div class="product-info">
            <h4>${product.name}</h4>
            <p class="price">$${product.price}</p>
            <p class="seller">Seller: ${product.sellerId}</p>
        </div>
        <button class="delete-btn" onclick="deleteProduct(${product.id})">Delete</button>
        <button class="edit-btn" onclick="editProduct(${product.id})">Edit</button>
    </div>
`;

                productContainer.innerHTML += productCard;
            });
        })
        .catch(error => {
            console.error("Error fetching products:", error);
            alert("Something went wrong. Please try again.");
        });
}

// ========================================================================================

document.getElementById("addProductForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("productName").value;
    const price = document.getElementById("productPrice").value;
    const seller = document.getElementById("productSeller").value;
    const file = document.getElementById("productImg").files[0];

    if (!file) {
        alert("Please select an image.");
        return;
    }

    const reader = new FileReader();
    reader.onloadend = function () {
        const imgBase64 = reader.result;

        const randomId = (Math.floor(Math.random() * 1000) + 1).toString();

        const newProduct = {
            id: randomId,
            name: name,
            price: price,
            sellerId: seller,
            img: imgBase64,
            status: "pending"
        };

        fetch("http://localhost:5000/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newProduct)
        })
            .then(response => response.json())
            .then(data => {
                console.log("Product added:", data);
                alert("Product added successfully!");
                displayProductsAdmin();
            })
            .catch(error => {
                console.error("Error adding product:", error);
                alert("Something went wrong. Please try again.");
            });
    };

    reader.readAsDataURL(file);
});



// ========================================================================================


function deleteProduct(productId) {
    fetch(`http://localhost:5000/products/${productId}`, {
        method: "DELETE"
    })
        .then(response => response.json())
        .then(data => {
            console.log("Product deleted:", data);
            alert("Product deleted successfully!");
            displayProductsAdmin();
        })
        .catch(error => {
            console.error("Error deleting product:", error);
            alert("Something went wrong. Please try again.");
        });
}


// ========================================================================================



function editProduct(productId) {
    fetch(`http://localhost:5000/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            const newName = prompt("Enter new product name:", product.name);
            const newPrice = prompt("Enter new product price:", product.price);

            if (newName && newPrice) {
                const updatedProduct = {
                    name: newName,
                    price: newPrice,
                    sellerId: product.sellerId,
                    img: product.img,
                    status: product.status
                };

                fetch(`http://localhost:5000/products/${productId}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(updatedProduct)
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log("Product updated:", data);
                        alert("Product updated successfully!");
                        displayProductsAdmin();
                    })
                    .catch(error => {
                        console.error("Error updating product:", error);
                        alert("Something went wrong. Please try again.");
                    });
            }
        })
        .catch(error => {
            console.error("Error fetching product:", error);
            alert("Something went wrong. Please try again.");
        });
}



// ========================================================================================



function togglePendingProducts() {
    const pendingSection = document.getElementById("pending-products-section");
    pendingSection.style.display = pendingSection.style.display === "none" ? "block" : "none";

    if (pendingSection.style.display === "block") {
        displayPendingProductsAdmin();
    }
}



// ========================================================================================


function displayPendingProductsAdmin() {
    fetch("http://localhost:5000/products")
        .then(response => response.json())
        .then(products => {
            const pendingProductsContainer = document.getElementById("pending-products-container");
            pendingProductsContainer.innerHTML = "";


            products.filter(product => product.status === "pending").forEach(product => {
                const productCard = `
                    <div class="product-card">
                        <img src="${product.img}" alt="Product Image">
                        <div class="product-info">
                            <h4>${product.name}</h4>
                            <p class="price">$${product.price}</p>
                            <p class="seller">Seller: ${product.sellerId}</p>
                        </div>
                        <button class="approve-btn" onclick="approveProduct(${product.id})">Approve</button>
                        <button class="reject-btn" onclick="rejectProduct(${product.id})">Reject</button>
                    </div>
                `;
                pendingProductsContainer.innerHTML += productCard;
            });
        })
        .catch(error => {
            console.error("Error fetching products:", error);
            alert("Something went wrong. Please try again.");
        });
}

// ========================================================================================



function approveProduct(productId) {
    fetch(`http://localhost:5000/products/${productId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: "approved" })
    })
        .then(response => response.json())
        .then(data => {
            console.log("Product approved:", data);
            alert("Product approved successfully!");
            displayPendingProductsAdmin();
        })
        .catch(error => {
            console.error("Error approving product:", error);
            alert("Something went wrong. Please try again.");
        });
}

// ========================================================================================


function rejectProduct(productId) {
    fetch(`http://localhost:5000/products/${productId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: "rejected" })
    })
        .then(response => response.json())
        .then(data => {
            console.log("Product rejected:", data);
            alert("Product rejected!");
            displayPendingProductsAdmin();
        })
        .catch(error => {
            console.error("Error rejecting product:", error);
            alert("Something went wrong. Please try again.");
        });
}





