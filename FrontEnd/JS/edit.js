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
        //gallery(works);

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

        const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        body: FormData,
        headers: {
                "Accept": "multipart/form-data"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const form = document.getElementById("title");
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const photo = e.target.photo.value;
            const title = e.target.title.value;
            const category = e.target.category.value;

            const FormData = new FormData();
            FormData.append("title", title);
            FormData.append("category", category);
            FormData.append("image", photo);

            console.log(FormData);
        });

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

document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('image');
    const uploadArea = document.getElementById('uploadArea');
    const uploadContent = document.querySelector('.upload-content');
    const imagePreview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const addWorkForm = document.getElementById('addWorkForm');
    const submitBtn = document.getElementById('submitBtn');

    // Charger les catégories dans le select
    loadCategories();

    // Gestion de la prévisualisation d'image
    if (imageInput) {
        imageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Vérifier la taille du fichier (4MB max)
                if (file.size > 4 * 1024 * 1024) {
                    alert('Le fichier est trop volumineux. Taille maximale : 4MB');
                    imageInput.value = '';
                    return;
                }

                // Vérifier le type de fichier
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
                if (!allowedTypes.includes(file.type)) {
                    alert('Format de fichier non supporté. Utilisez JPG, PNG ou WebP.');
                    imageInput.value = '';
                    return;
                }

                // Créer l'aperçu
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImg.src = e.target.result;
                    uploadContent.style.display = 'none';
                    imagePreview.style.display = 'flex';
                };
                reader.readAsDataURL(file);
            }
        });

        // Permettre de cliquer sur l'image pour changer
        if (imagePreview) {
            imagePreview.addEventListener('click', function() {
                imageInput.click();
            });
        }
    }

    // Gestion du formulaire d'ajout
    if (addWorkForm) {
        addWorkForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            console.log('Formulaire soumis');
            
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Vous devez être connecté pour ajouter une œuvre');
                return;
            }

            const image = document.getElementById('image').files[0];
            const title = document.getElementById('title').value.trim();
            const categoryId = document.getElementById('category').value;

            console.log('Données du formulaire:', { image, title, categoryId });

            // Validation détaillée
            if (!image) {
                alert('Veuillez sélectionner une image');
                return;
            }

            if (!title || title.length === 0) {
                alert('Veuillez saisir un titre');
                return;
            }

            if (!categoryId || categoryId === '') {
                alert('Veuillez sélectionner une catégorie');
                return;
            }

            // Préparer FormData
            const formData = new FormData();
            formData.append('image', image);
            formData.append('title', title);
            formData.append('category', categoryId);

            // Désactiver le bouton pendant l'envoi
            submitBtn.disabled = true;
            submitBtn.value = 'Envoi en cours...';

            try {
                console.log('Envoi vers l\'API...');
                
                const response = await fetch('http://localhost:5678/api/works', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                console.log('Réponse reçue:', response.status);

                if (response.ok) {
                    const newWork = await response.json();
                    console.log('Nouvelle œuvre créée:', newWork);
                    
                    alert('Œuvre ajoutée avec succès !');
                    
                    // Réinitialiser le formulaire
                    addWorkForm.reset();
                    uploadContent.style.display = 'flex';
                    imagePreview.style.display = 'none';
                    
                    // Fermer la modale
                    const modalAddingImg = document.getElementById('modalAddingImg');
                    if (modalAddingImg) {
                        modalAddingImg.style.display = 'none';
                    }
                    
                    // Recharger complètement la page pour éviter les duplications
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                    
                } else {
                    const errorText = await response.text();
                    console.error('Erreur serveur:', response.status, errorText);
                    
                    let errorMessage = 'Erreur lors de l\'ajout de l\'œuvre';
                    
                    if (response.status === 400) {
                        errorMessage = 'Données invalides. Vérifiez tous les champs.';
                    } else if (response.status === 401) {
                        errorMessage = 'Non autorisé. Veuillez vous reconnecter.';
                        localStorage.removeItem('token');
                        localStorage.removeItem('isAdmin');
                        window.location.href = './login.html';
                        return;
                    } else if (response.status === 500) {
                        errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
                    }
                    
                    alert(errorMessage);
                }
            } catch (error) {
                console.error('Erreur réseau:', error);
                alert('Erreur de connexion au serveur. Vérifiez que le serveur est démarré.');
            } finally {
                // Réactiver le bouton
                submitBtn.disabled = false;
                submitBtn.value = 'Valider';
            }
        });
    }

    // Drag and drop
    if (uploadArea) {
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadArea.style.borderColor = '#1D6154';
            uploadArea.style.backgroundColor = '#f0f8ff';
        });

        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            uploadArea.style.borderColor = '#ccc';
            uploadArea.style.backgroundColor = '#f8f9fa';
        });

        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadArea.style.borderColor = '#ccc';
            uploadArea.style.backgroundColor = '#f8f9fa';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const dt = new DataTransfer();
                dt.items.add(files[0]);
                imageInput.files = dt.files;
                imageInput.dispatchEvent(new Event('change'));
            }
        });
    }
});

// Fonction pour charger les catégories dans le select
async function loadCategories() {
    try {
        const response = await fetch("http://localhost:5678/api/categories");
        if (response.ok) {
            const categories = await response.json();
            const categorySelect = document.getElementById("category");
            if (categorySelect) {
                categorySelect.innerHTML = '<option value="">Sélectionnez une catégorie</option>';
                categories.forEach(category => {
                    const option = document.createElement("option");
                    option.value = category.id;
                    option.textContent = category.name;
                    categorySelect.appendChild(option);
                });
            }
        }
    } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
    }
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