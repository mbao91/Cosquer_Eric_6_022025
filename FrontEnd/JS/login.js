const login = document.getElementById("loginForm"); // On récupère le formulaire
const logout = document.getElementById("loginBtn"); // On récupère le bouton de déconnexion
const filterBtn = document.getElementsByClassName("filterBtn");

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
        alert("Email ou mot de passe incorrect");
    } else if (loginData.email === "sophie.bluel@test.tld"){
        localStorage.setItem("token", data.token);
        localStorage.setItem("isAdmin", true);
        window.location.href = "index.html";
        document.getElementsByClassName("filterBtn").style.display = "none";
    }
});

checkAdminStatus() {
    const isAdmin = false;
    const headerEdit = document.getElementById("header-edit");
    const filterButtons = document.getElementsByClassName("filterBtn");
    
    if (isAdmin) {
        // Afficher les éléments d'administration
        headerEdit.style.display = "flex";
        Array.from(filterButtons).forEach(btn => btn.style.display = "block");
    } else {
        // Cacher les éléments d'administration
        headerEdit.style.display = "none";
        Array.from(filterButtons).forEach(btn => btn.style.display = "none");
    }
}

logout.addEventListener("submit", async (event) => {
    event.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin"); 
    window.location.href = "index.html";
});


//Faire la deconnexion