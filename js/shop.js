let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartCountElement = document.querySelector('#cart-count');
const cartItemsList = document.getElementById('cart-items');
const productContainer = document.getElementById('productContainer');
const searchButton = document.getElementById('searchButton');
const searchBar = document.getElementById('search-bar');
const filterButtons = document.querySelectorAll(".filter-btn");

// ========================================================================================


function displayProducts(products) {
    productContainer.innerHTML = "";

    products.forEach(product => {
        const imagePath = product.img ? `../${product.img}` : '../img/default-product.png';

        const productCard = `
            <div class="product-card">
                <img src="${imagePath}" class="product-img" alt="${product.name}">
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <p class="price">$${product.price}</p>
                </div>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        productContainer.innerHTML += productCard;
    });

    if (productContainer.innerHTML === "") {
        productContainer.innerHTML = "<p>No products found.</p>";
    }
}


// ========================================================================================









function displayApprovedProductsHome(category = "all") {
    fetch("http://localhost:5000/products")
        .then(response => response.json())
        .then(products => {
            const approvedProducts = products.filter(product => product.status === "approved");
            const filteredProducts = category === "all" ? approvedProducts : approvedProducts.filter(product => product.category.toLowerCase() === category.toLowerCase());

            productContainer.innerHTML = "";

            filteredProducts.forEach(product => {
                const imagePath = product.img ? `../${product.img}` : '../img/default-product.png';

                const productCard = `
                    <div class="product-card">
                        <img src="${imagePath}" class="product-img" alt="${product.name}">
                        <div class="product-info">
                            <h4>${product.name}</h4>
                            <p class="price">$${product.price}</p>
                        </div>
                        <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                    </div>
                `;
                productContainer.innerHTML += productCard;
            });

            if (productContainer.innerHTML === "") {
                productContainer.innerHTML = "<p>No approved products available in this category.</p>";
            }
        })
        .catch(error => {
            console.error("Error fetching approved products:", error);
            alert("Something went wrong. Please try again.");
        });
}



// ========================================================================================




searchButton.addEventListener("click", function () {
    const searchQuery = searchBar.value.toLowerCase();
    fetch("http://localhost:5000/products")
        .then(response => response.json())
        .then(products => {

            const filteredProducts = products.filter(product =>
                product.name.toLowerCase().includes(searchQuery)
            );


            displayProducts(filteredProducts);
        })
        .catch(error => console.error("Error fetching products:", error));
});


// ========================================================================================


filterButtons.forEach(button => {
    button.addEventListener("click", function () {
        const category = button.getAttribute("data-category");
        displayApprovedProductsHome(category);
    });
});

// ========================================================================================


productContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("add-to-cart")) {
        const productId = event.target.getAttribute("data-id");
        fetch(`http://localhost:5000/products/${productId}`)
            .then(response => response.json())
            .then(product => {
                addProductToCart(product);
                updateCartDisplay();
                saveCartToLocalStorage();
            })
            .catch(error => console.error("Error adding product to cart:", error));
    }
});

function addProductToCart(product) {

    const existingProduct = cart.find(p => p.id === product.id);

    if (existingProduct) {

        existingProduct.quantity += 1;
    } else {

        product.quantity = 1;
        cart.push(product);
    }


    saveCartToLocalStorage();
    console.log("Product added to cart:", product);
}

function saveCartToLocalStorage() {

    localStorage.setItem('cart', JSON.stringify(cart));
}

// ========================================================================================
function updateCartDisplay() {
    cartItemsList.innerHTML = "";

    cart.forEach((product, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <img src="${product.img}" alt="${product.name}">
            <span>${product.name}</span>
            <button class="increase" data-index="${index}">+</button>
            <button class="decrease" data-index="${index}">-</button>
            <button class="remove" data-index="${index}">Remove</button>
            <span>Quantity: ${product.quantity}</span>
        `;
        cartItemsList.appendChild(li);
    });

    cartCountElement.textContent = cart.reduce((total, item) => total + item.quantity, 0);
}

// ----------------------------------------------------------------------------------------

document.getElementById("cart-container").addEventListener("click", function (event) {
    const index = event.target.getAttribute("data-index");

    if (event.target.classList.contains("increase")) {
        cart[index].quantity += 1;
    }

    if (event.target.classList.contains("decrease")) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        }
    }

    if (event.target.classList.contains("remove")) {
        cart.splice(index, 1);
    }

    updateCartDisplay();
    saveCartToLocalStorage();
});

// ========================================================================================


document.getElementById("cart-btn").addEventListener("click", function () {
    const cartContainer = document.getElementById("cart-container");
    cartContainer.classList.toggle("show");
    updateCartDisplay();
});

document.getElementById("close-cart").addEventListener("click", function () {
    const cartContainer = document.getElementById("cart-container");
    cartContainer.classList.remove("show");
});

// ----------------------------------------------------------------------------------------

window.addEventListener("load", () => displayApprovedProductsHome());





document.addEventListener("DOMContentLoaded", function () {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const loginBtn = document.getElementById("loginBtn");
    const signupBtn = document.getElementById("signupBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    if (currentUser) {

        loginBtn.style.display = "none";
        signupBtn.style.display = "none";
        logoutBtn.style.display = "block";
    } else {

        loginBtn.style.display = "block";
        signupBtn.style.display = "block";
        logoutBtn.style.display = "none";
    }
});


document.getElementById("logoutBtn").addEventListener("click", function () {

    localStorage.removeItem("currentUser");

    window.location.href = "login.html";
});

// ----------------------------------------------------------------------------------------
function checkUserLoggedIn() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    return currentUser !== null;
}
// ----------------------------------------------------------------------------------------

document.addEventListener("click", function (event) {
    if (event.target.classList.contains("add-to-cart")) {
        if (!checkUserLoggedIn()) {
            Swal.fire({
                icon: 'warning',
                title: 'Login Required',
                text: 'Please log in or sign up to add products to your cart.',
                showCancelButton: true,
                confirmButtonText: 'Login',
                cancelButtonText: 'Sign Up',
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "login.html";
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    window.location.href = "signup.html";
                }
            });
            event.preventDefault();
            return;
        }

        const productId = event.target.getAttribute("data-id");

    }
});

// ----------------------------------------------------------------------------------------


document.getElementById("checkout-btn").addEventListener("click", function (event) {
    if (!checkUserLoggedIn()) {
        Swal.fire({
            icon: 'warning',
            title: 'Login Required',
            text: 'Please log in or sign up to proceed to checkout.',
            showCancelButton: true,
            confirmButtonText: 'Login',
            cancelButtonText: 'Sign Up',
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "login.html";
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                window.location.href = "signup.html";
            }
        });
        event.preventDefault();
        return;
    }


});
// ----------------------------------------------------------------------------------------
