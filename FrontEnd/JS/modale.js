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

    } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
    }
}

const token = localStorage.getItem("token");
const modalGallery = document.getElementById("modalGallery");

if (token) {
    // Gérer le clic sur modifier pour chaque image
    const modify = document.getElementById("modify");
    modify.addEventListener("click", () => {
        modalGallery.style.display = "flex";
    }
)} else {
    console.log("Token non trouvé");
        modalGallery.style.display = "none";
};

function galery(works) {
    const gallery = document.querySelector(".modal-gallery");
    gallery.innerHTML = ""; // Nettoyer la galerie
    works.forEach(work => {
        const img = document.createElement("img");

        gallery.appendChild(img);
        img.src = work.imageUrl;
        img.alt = work.title;
        /*gallery.appendChild("<i class="fa-regular fa-trash-can"></i>");*/
    });
}

function addImage() {
    const addImgBtn = document.getElementById("add-img");
    addImgBtn.textContent = "Ajouter une image";
    addImgBtn.classList.add("filter-btn");
    addImgBtn.addEventListener("click", () => {
        modalGallery.style.display = "none";
        let modalAddImg = document.getElementById("modalAddingImg");
        modalAddImg.style.display = "flex";
    });
    addImage();
}

function closeModal() {
    
    modalGallery.style.display = "none";
}

let modalClose = document.getElementById("modal-close");
modalClose.addEventListener("click", closeModal);  

fetchData();