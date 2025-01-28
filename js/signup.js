


document.getElementById("signup-form").addEventListener("submit", function (event) {
    event.preventDefault();

    //   ---------------------------------------------------------------------------------------------


    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const birthDate = document.getElementById("birthdate").value;
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    const newUser = {
        firstName,
        lastName,
        birthDate,
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
            alert("Registration successful!");
            window.location.href = "login.html";
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Something went wrong. Please try again.");
        });
});
