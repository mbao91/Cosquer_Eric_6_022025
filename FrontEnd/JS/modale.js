import { checkAdminStatus } from "./login.js";

async function fetchData() {
    checkAdminStatus();
    const response = await fetch("http://localhost:5678/api/works")
    .then((res) => res.json())
    .then((works) => {
        console.log(works)
        for (let i = 0; i < works.length; i++) {
            console.log(works[i].title)
        }
        galery(works);
    })
}
const token = localStorage.getItem("token");

//const modify = document.getElementById("modify");
//const modal = document.getElementById("modal");

if (token) {
    // Gérer le clic sur modifier pour chaque image
    const modify = document.getElementById("modify");
    modify.addEventListener("click", (works) => {
        const modal = document.getElementById("modalGallery");
        modal.style.display = "block";
    }
)} else {
    console.log("Token non trouvé");
    const modal = document.getElementById("modalGallery");
        modal.style.display = "none";
};

function closeModal() {
    const modal = document.getElementById("modalGallery");
    modal.style.display = "none";
}

let modalClose = document.getElementById("modal-close");
modalClose.addEventListener("click", closeModal);  

fetchData();