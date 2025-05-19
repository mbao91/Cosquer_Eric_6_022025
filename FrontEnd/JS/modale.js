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
const modalAddImg = document.getElementById("modalAddingImg");
const overlay = document.getElementById("overlay");

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

function delImage() {
    const deleteBtn = document.querySelector(".fa-trash-can");
    deleteBtn.addEventListener("click", () => {
        modalGallery.style.display = "none";
        let modalDeleteImg = document.getElementById("modalDeletingImg");
        modalDeleteImg.style.display = "flex";
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
closeModal();
addImage();
returnBtn();
validateBtn();