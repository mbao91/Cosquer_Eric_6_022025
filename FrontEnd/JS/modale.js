async function fetchData() {
    checkLoginStatus();
    const response = await fetch("http://localhost:5678/api/works")
    .then((res) => res.json())
    .then((works) => {
        console.log(works)
        for (let i = 0; i < works.length; i++) {
            console.log(works[i].title)
        }
        galery(works);
    })

const token = localStorage.getItem("token");

//const modify = document.getElementById("modify");
//const modal = document.getElementById("modal");

if (token) {
    // Gérer le clic sur modifier pour chaque image
    const modify = document.querySelectorAll(".modify");
    modify.addevetListener("click", (works) => {
        const modal = document.getElementById("modal");
        modal.style.display = "block";
    }
};
}

// Ajouter les propriétés CSS pour le modal