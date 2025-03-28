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
                
                console.log("Statut de réponse:", response.status); // Pour déboguer

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Réponse d'erreur:", errorText);
                    throw new Error("Email ou mot de passe incorrect");
                }
                
                const data = await response.json();
                console.log("Données reçues:", data); // Pour déboguer

                if (data.token) {
                    localStorage.setItem("token", data.token);
                    //localStorage.setItem("isAdmin", "true");
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
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    const headerEdit = document.getElementById("header-edit");
    const filterButtons = document.getElementsByClassName("filterBtn");
    
    if (isAdmin) {
        headerEdit.style.display = "flex";
        Array.from(filterButtons).forEach(btn => btn.style.display = "none");
    } else {
        headerEdit.style.display = "none";
        Array.from(filterButtons).forEach(btn => btn.style.display = "block");
    }
}