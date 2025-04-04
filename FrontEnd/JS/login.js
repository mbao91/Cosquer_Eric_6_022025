const filterBtn = document.getElementsByClassName("filterBtn");


document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    // Vérifier le statut de connexion au chargement
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            
            console.log("Tentative de connexion avec:", email); // Pour déboguer

            try {
                const response = await fetch("http://localhost:5678/api/users/login", {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                });

                if (!response.ok) {
                    throw new Error("Email ou mot de passe incorrect");
                }
                
                const data = await response.json();

                if (data.token) {
                    localStorage.setItem("token", data.token);
                    // Vérifier si c'est Sophie Bluel (administrateur)
                    if (email === "sophie.bluel@test.tld") {
                        localStorage.setItem("isAdmin", "true");
                    } else {
                        localStorage.setItem("isAdmin", "false");
                    }
                    
                    window.location.href = "./index.html";
                }
            } catch (error) {
                console.error("Erreur lors de la connexion:", error);
                alert("Email ou mot de passe incorrect");
            }
        });
    }
});

export function checkAdminStatus() {
    const token = localStorage.getItem("token");
    // Initialisation explicite - par défaut, personne n'est admin
    let isAdmin = false;

    // Vérifier si le flag admin est explicitement défini à "true"
    if (localStorage.getItem("isAdmin") === "true") {
        isAdmin = true;
    }
    
    const headerEdit = document.getElementById("header-edit");
    const filterButtons = document.getElementsByClassName("filterBtn");
    
    // Si token existe et isAdmin est true
    if (token && isAdmin) {
        // Afficher le mode édition
        if (headerEdit) headerEdit.style.display = "flex";
        // Cacher les filtres
        Array.from(filterButtons).forEach(btn => {
            if (btn) btn.style.display = "none";
        });
    } else {
        // Cacher le mode édition
        if (headerEdit) headerEdit.style.display = "none";
        // Afficher les filtres
        Array.from(filterButtons).forEach(btn => {
            if (btn) btn.style.display = "block";
        });
    }
}
    //checkAdminStatus();
    //=== "false"