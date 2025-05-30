import { checkAdminStatus } from "./login.js";

async function fetchData() {
    checkAdminStatus();
    try {
        const worksResponse = await fetch("http://localhost:5678/api/works", {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });
        
        if (!worksResponse.ok) {
            throw new Error(`HTTP error! status: ${worksResponse.status}`);
        }
        
        const works = await worksResponse.json();
        galery(works);
        gallery(works);

        const categoriesResponse = await fetch("http://localhost:5678/api/categories", {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        if (!categoriesResponse.ok) {
            throw new Error(`HTTP error! status: ${categoriesResponse.status}`);
        }
        
        const categoryData = await categoriesResponse.json();
        const category = await categoriesResponse.json();
        categories(categoryData);
        filterWorks(category)

    } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
    }
}

const token = localStorage.getItem("token");
const overlay = document.getElementById("overlay");
const modalGallery = document.getElementById("modalGallery");

    function checkLoginStatus() {
        const token = localStorage.getItem("token");
        const isAdmin = localStorage.getItem("isAdmin") === "true";
        const loginLink = document.getElementById("login-link");
        const edit = document.getElementById("header-edit");
        const filterContainer = document.querySelector(".filter-container");
        const modify = document.getElementById("modify");
    
        if (token && isAdmin) {
            loginLink.textContent = "logout";
            loginLink.onclick = function (e) {
                e.preventDefault();
                handleLogout();
            };
            // Afficher le bouton de modification
            edit.style.display = "flex";
            // Masquer les filtres si admin
            if (filterContainer) {
                filterContainer.style.display = "none";
            }
            
        } else {
            loginLink.textContent = "login";
            edit.style.display = "none";
            modify.style.display = "none";
            // Afficher les filtres si non admin
            if (filterContainer) {
                filterContainer.style.display = "flex";
            }
        }
    }
    function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    window.location.href = "./index.html";
    }

    function categories(categoryData) {
        const portfolioSection = document.querySelector("#portfolio");
        const portfolioTitle = portfolioSection.querySelector("h2");
    
        // Créer le conteneur de filtres
        const filterContainer = document.createElement("div");
        filterContainer.classList.add("filter-container");
        
        // Bouton "Tous"
        const allFilter = document.createElement("button");
        allFilter.textContent = "Tous";
        allFilter.classList.add("filter-btn");
        // Ajouter la classe active par défaut
        allFilter.classList.add("filter-btn", "active");
        // Ajouter l'écouteur d'événement pour "Tous"
        allFilter.addEventListener("click", () => filterWorks("Tous"));
        filterContainer.appendChild(allFilter);
    
        // Autres boutons de filtre
        categoryData.forEach(category => {
            const filterBtn = document.createElement("button");
            filterBtn.textContent = category.name;
            filterBtn.classList.add("filter-btn");
            // Ajouter l'écouteur d'événement pour chaque catégorie
            filterBtn.addEventListener("click", () => filterWorks(category.name));
            filterContainer.appendChild(filterBtn);
        });
    
        // Insérer les filtres après le titre
        portfolioTitle.insertAdjacentElement('afterend', filterContainer);
    
        // Gérer la visibilité en fonction du statut admin
        const isAdmin = localStorage.getItem("isAdmin") === "true";
        filterContainer.style.display = isAdmin ? "none" : "flex";
    }

    function filterWorks(category) {
        const works = document.querySelectorAll(".gallery figure");
        const buttons = document.querySelectorAll(".filter-btn");
    
        // Mise à jour des boutons actifs
        buttons.forEach(button => {
            if (button.textContent === category) {
                button.classList.add("active");
            } else {
                button.classList.remove("active");
            }
        });
    
        // Filtrage des works
        works.forEach(work => {
            if (category === "Tous") {
                work.style.display = "block";
            } else {
                work.style.display = work.dataset.category === category ? "block" : "none";
            }
        });
    }

    function galery(works) {
        const gallery = document.querySelector(".gallery");
        gallery.innerHTML = ""; // Nettoyer la galerie
    
        works.forEach(work => {
            const figure = document.createElement("figure");
            const img = document.createElement("img");
            const figcaption = document.createElement("figcaption");
            
    
            // Ajouter l'attribut data-category pour le filtrage
            figure.dataset.category = work.category.name;
    
            img.src = work.imageUrl;
            img.alt = work.title;
            figcaption.textContent = work.title;
            
            gallery.appendChild(figure);
            figure.appendChild(img);
            figure.appendChild(figcaption);
            
        });
    }

    function gallery(works) {
    const gallery = document.querySelector(".modal-gallery");
    gallery.innerHTML = ""; // Nettoyer la galerie
    works.forEach(work => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const i = document.createElement("i");
        i.classList.add("fa-regular", "fa-trash-can");
        const div = document.createElement("div");
        div.classList.add("modal-img");

        gallery.appendChild(figure);
        figure.appendChild(div);
        div.appendChild(img);
        div.appendChild(i);
        img.src = work.imageUrl;
        img.alt = work.title;
        /*gallery.appendChild("<i class="fa-regular fa-trash-can"></i>");*/
    });
}

    function validateBtn() {
    const validateBtn = document.getElementById("validate");
    validateBtn.classList.add("filter-btn");
    validateBtn.textContent = "Valider";
    validateBtn.addEventListener("click", () => {
        window.location.href = "./index.html";
    });    
    }

    function returnBtn() {
    const returnBtn = document.getElementById("modal-return");
    returnBtn.addEventListener("click", () => {
        modalGallery.style.display = "flex";
        let modalReturnImg = document.getElementById("modalAddingImg");
        modalReturnImg.style.display = "none";
    });
    }

    function closeModal() {

    overlay.addEventListener("click", function (event) {
        if (event.target === overlay) {
            modalGallery.style.display = "none";
            console.log("Modal closed");
        }
    });   

    /*modalGallery.style.display = "none";*/
}



fetchData();
checkLoginStatus();
closeModal();
returnBtn();
validateBtn();
checkAdminStatus();
categories();
filterWorks();


/*function addingImg() {
    const addImgBtn = document.getElementsByClassName("modal-adding");
    addImgBtn.appendChild(document.createTextNode("Ajouter une image"));
}

let formData = new FormData();
formData.append('key1', 'value1');
formData.append('key2', 'value2');

// List key/value pairs
for(let [name, value] of formData) {
  alert(`${name} = ${value}`); // key1 = value1, ensuite key2 = value2
}*/