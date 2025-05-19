import { checkAdminStatus } from "./login.js";

/*async function fetchData() {
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
const overlay = document.getElementById("overlay");
const returnBtn = document.getElementById("modal-return");

fetchData();*/
checkAdminStatus();

function addingImg() {
    const addImgBtn = document.getElementsByClassName("modal-adding");
    addImgBtn.appendChild(document.createTextNode("Ajouter une image"));
}

/*let formData = new FormData();
formData.append('key1', 'value1');
formData.append('key2', 'value2');*/

// List key/value pairs
for(let [name, value] of formData) {
  alert(`${name} = ${value}`); // key1 = value1, ensuite key2 = value2
}