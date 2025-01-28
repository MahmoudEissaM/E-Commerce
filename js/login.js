

document.getElementById("login-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:5000/users")
        .then(response => response.json())
        .then(users => {
            const user = users.find(user => user.username === username && user.password === password);

            if (user) {
                Swal.fire({
                    title: "Login successful!",
                    text: "Redirecting to your dashboard...",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false,
                }).then(() => {
                    localStorage.setItem("currentUser", JSON.stringify(user));

                    if (user.role === "admin") {
                        window.location.href = "admin.html";
                    } else if (user.role === "customer") {
                        window.location.href = "../index.html";
                    } else if (user.role === "seller") {
                        window.location.href = "sellers.html";
                    }
                });
            } else {
                Swal.fire({
                    title: "Login Failed",
                    text: "Invalid username or password. Please try again.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }
        })
        .catch(error => {
            console.error("Error:", error);
            Swal.fire({
                title: "Error",
                text: "Something went wrong. Please try again later.",
                icon: "error",
                confirmButtonText: "OK",
            });
        });
});


// ==============================================================================

document.addEventListener("DOMContentLoaded", function () {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const loginBtn = document.getElementById("loginBtn");
    const signupBtn = document.getElementById("signupBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    if (currentUser) {

        loginBtn.style.display = "none";
        signupBtn.style.display = "none";
        logoutBtn.style.display = "inline-block";
    } else {

        loginBtn.style.display = "inline-block";
        signupBtn.style.display = "inline-block";
        logoutBtn.style.display = "none";
    }
});
document.getElementById("logoutBtn").addEventListener("click", function (event) {
    event.preventDefault();


    localStorage.removeItem("currentUser");

    window.location.href = "login.html";
});