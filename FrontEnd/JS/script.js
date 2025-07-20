//Récupération des données de l'API Works
//  The fetch() function is a web API that allows you to make requests to a server.
// 1. Créer une fonction asynchrone qui récupère les données de l'API Works 
//import {function} from script.js  permet d'importer des fonctions d'un autre fichier
import { checkAdminStatus } from "./login.js";

async function fetchData() {
    checkLoginStatus();

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
        categories(categoryData);
        populateCategorySelect(categoryData);

        checkAdminStatus();

    } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
    }  
}

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
        if (edit) edit.style.display = "flex";
        if (filterContainer) filterContainer.style.display = "none";
        if (modify) modify.style.display = "flex";
    } else {
        loginLink.textContent = "login";
        if (edit) edit.style.display = "none";
        if (modify) modify.style.display = "none";
        if (filterContainer) filterContainer.style.display = "flex";
    }
}

function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    window.location.href = "./index.html";
}

function galery(works) {
    const gallery = document.querySelector(".gallery");
    if (!gallery) return;
    
    gallery.innerHTML = "";

    works.forEach(work => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const figcaption = document.createElement("figcaption");

        figure.dataset.category = work.category ? work.category.name : "Inconnu";

        img.src = work.imageUrl;
        img.alt = work.title;
        figcaption.textContent = work.title;
        
        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    });
}

function categories(categoryData) {
    const portfolioSection = document.querySelector("#portfolio");
    const portfolioTitle = portfolioSection.querySelector(".project-title h2");
    
    // Vérifier si les filtres existent déjà
    let filterContainer = document.querySelector(".filter-container");
    if (!filterContainer) {
        filterContainer = document.createElement("div");
        filterContainer.classList.add("filter-container");
        
        const allFilter = document.createElement("button");
        allFilter.textContent = "Tous";
        allFilter.classList.add("filter-btn", "active");
        allFilter.addEventListener("click", () => filterWorks("Tous"));
        filterContainer.appendChild(allFilter);

        categoryData.forEach(category => {
            const filterBtn = document.createElement("button");
            filterBtn.textContent = category.name;
            filterBtn.classList.add("filter-btn");
            filterBtn.addEventListener("click", () => filterWorks(category.name));
            filterContainer.appendChild(filterBtn);
        });

        portfolioTitle.insertAdjacentElement('afterend', filterContainer);
    }

    const isAdmin = localStorage.getItem("isAdmin") === "true";
    filterContainer.style.display = isAdmin ? "none" : "flex";
}

function populateCategorySelect(categoryData) {
    const categorySelect = document.getElementById("category");
    if (!categorySelect) return;
    
    // Vider le select et ajouter l'option par défaut
    categorySelect.innerHTML = '<option value="">Sélectionnez une catégorie</option>';
    
    // Ajouter les catégories
    categoryData.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
}

function filterWorks(category) {
    const works = document.querySelectorAll(".gallery figure");
    const buttons = document.querySelectorAll(".filter-btn");

    buttons.forEach(button => {
        button.classList.toggle("active", button.textContent === category);
    });

    works.forEach(work => {
        if (category === "Tous") {
            work.style.display = "block";
        } else {
            work.style.display = work.dataset.category === category ? "block" : "none";
        }
    });
}

fetchData();