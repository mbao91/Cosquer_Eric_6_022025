//Récupération des données de l'API Works
//  The fetch() function is a web API that allows you to make requests to a server.
// 1. Créer une fonction asynchrone qui récupère les données de l'API Works 
async function fetchData() {
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

function galery(works) {

    const gallery = document.querySelector(".gallery");

    for (let i = 0; i < works.length; i++) {
        console.log(works[i].title)
        //Création des différents élements
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const figcaption = document.createElement("figcaption");

        //Stucturation des élements
        gallery.appendChild(figure);
        figure.appendChild(img);
        figure.appendChild(figcaption);

        //Attribution des données de chaque éléments
        img.src = works[i].imageUrl;
        img.alt = works[i].title;
        figcaption.textContent = works[i].title;

    };
}

fetchData();
