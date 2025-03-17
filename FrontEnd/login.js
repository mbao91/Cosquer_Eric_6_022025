const login = document.getElementById("loginForm"); // On récupère le formulaire

login.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(login);
    const loginData = Object.fromEntries(formData);
    console.log(loginData);

    const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
    });

    const data = await response.json();
    console.log(data);
    if (data.error) {
        alert(data.error);
    } else {
        localStorage.setItem("token", data.token);
        window.location.href = "index.html";
    }
});

/*deconnexion.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(deconnexion);
    const deconnexionData = Object.fromEntries(formData);
    console.log(deconnexionData);

    const response = await fetch("http://localhost:5678/api/users/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(deconnexionData),
    });

    const data = await response.json();
    console.log(data);
    if (data.error) {
        alert(data.error);
    } else {
        localStorage.removeItem("token");
        window.location.href = "index.html";
    }
});*/


//Faire la deconnexion