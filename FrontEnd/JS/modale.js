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
        

    } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
    }
}

const token = localStorage.getItem("token");
const modalAddImg = document.getElementById("modalAddingImg");
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

function addImage() {
    const addImgBtn = document.getElementById("add-img");
    addImgBtn.textContent = "Ajouter une image";
    addImgBtn.classList.add("filter-btn");
    addImgBtn.addEventListener("click", () => {
        modalGallery.style.display = "none";
        let modalAddImg = document.getElementById("modalAddingImg");
        modalAddImg.style.display = "flex";
    });
}

let modalClose = document.getElementById("modal-close");
modalClose.addEventListener("click", function () {
    modalGallery.style.display = "none";
    console.log("Modal closed");
})

let modalClose2 = document.getElementById("modal-close2");
modalClose2.addEventListener("click", function () {
    modalAddImg.style.display = "none";
    console.log("Modal closed");
    modalGallery.style.display = "none";
    console.log("Modal shown");
})

fetchData();
addImage();