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
    const response2 = await fetch("http://localhost:5678/api/categories")
    .then((res) => res.json())
    .then((categoryData) => {
        console.log(categoryData)
        for (let i = 0; i < categoryData.length; i++) {
            console.log(categoryData[i].name)
        }
        categories(categoryData);
    })

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
    
            figure.appendChild(img);
            figure.appendChild(figcaption);
            gallery.appendChild(figure);
        });
    }
    
    function categories(categoryData, works) {
        const portfolioSection = document.querySelector("#portfolio");
        const portfolioTitle = portfolioSection.querySelector("h2");
    
        const filterContainer = document.createElement("div");
        filterContainer.classList.add("filter-container");
    
        // Création du bouton "Tous"
        const allFilter = document.createElement("button");
        allFilter.textContent = "Tous";
        allFilter.classList.add("filter-btn", "active");
        allFilter.addEventListener("click", () => filterWorks("Tous"));
        filterContainer.appendChild(allFilter);
    
        // Création des autres filtres
        categoryData.forEach(category => {
            const filter = document.createElement("button");
            filter.textContent = category.name;
            filter.classList.add("filter-btn");
            filter.addEventListener("click", () => filterWorks(category.name));
            filterContainer.appendChild(filter);
        });
    
        portfolioTitle.insertAdjacentElement('afterend', filterContainer);
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
    
}
fetchData();