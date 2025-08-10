import { checkAdminStatus } from "./login.js";

let worksData = [];

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
        
        worksData = await worksResponse.json();
        displayModalGallery(worksData);

    } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
    }
}

const token = localStorage.getItem("token");
const modalGallery = document.getElementById("modalGallery");
const modalAddingImg = document.getElementById("modalAddingImg");

function initializeModals() {
    if (!token) {
        console.log("Token non trouvé");
        return;
    }

    const modify = document.getElementById("modify");
    if (modify) {
        modify.addEventListener("click", (e) => {
            e.preventDefault();
            showModal(modalGallery);
        });
    }

    const addImgBtn = document.getElementById("add-img");
    if (addImgBtn) {
        addImgBtn.addEventListener("click", (e) => {
            e.preventDefault();
            hideModal(modalGallery);
            showModal(modalAddingImg);
        });
    }

    setupModalClosing();
    setupAddWorkForm();
    loadCategories();
}

function displayModalGallery(works) {
    const gallery = document.querySelector(".modal-gallery");
    if (!gallery) return;
    
    gallery.innerHTML = "";
    works.forEach(work => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const deleteBtn = document.createElement("button");
        
        img.src = work.imageUrl;
        img.alt = work.title;
        
        deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        deleteBtn.classList.add("delete-work-btn");
        deleteBtn.addEventListener("click", () => deleteWork(work.id));
        
        figure.appendChild(img);
        figure.appendChild(deleteBtn);
        gallery.appendChild(figure);
    });
}

async function deleteWork(workId) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette œuvre ?")) return;

    try {
        const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            worksData = worksData.filter(work => work.id !== workId);
            displayModalGallery(worksData);
            //location.reload();
            fetchData(); // Recharger les données pour mettre à jour la galerie
        }
    } catch (error) {
        console.error("Erreur lors de la suppression:", error);
    }
    
}

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

function setupAddWorkForm() {
    const imageInput = document.getElementById('image');
    const uploadArea = document.getElementById('uploadArea');
    const uploadContent = document.querySelector('.upload-content');
    const imagePreview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const addWorkForm = document.getElementById('addWorkForm');
    const submitBtn = document.getElementById('submitBtn');

    // Gestion de la prévisualisation d'image
    if (imageInput) {
        imageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 4 * 1024 * 1024) {
                    alert('Le fichier est trop volumineux. Taille maximale : 4MB');
                    imageInput.value = '';
                    return;
                }

                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
                if (!allowedTypes.includes(file.type)) {
                    alert('Format de fichier non supporté. Utilisez JPG, PNG ou WebP.');
                    imageInput.value = '';
                    return;
                }

                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImg.src = e.target.result;
                    uploadContent.style.display = 'none';
                    imagePreview.style.display = 'flex';
                };
                reader.readAsDataURL(file);
            }
        });

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
            
            if (!token) {
                alert('Vous devez être connecté pour ajouter une œuvre');
                return;
            }

            const image = document.getElementById('image').files[0];
            const title = document.getElementById('title').value.trim();
            const categoryId = document.getElementById('category').value;

            if (!image || !title || !categoryId) {
                alert('Veuillez remplir tous les champs');
                return;
            }

            const formData = new FormData();
            formData.append('image', image);
            formData.append('title', title);
            formData.append('category', categoryId);

            submitBtn.disabled = true;
            submitBtn.value = 'Envoi en cours...';

            try {
                const response = await fetch('http://localhost:5678/api/works', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                if (response.ok) {
                    alert('Œuvre ajoutée avec succès !');
                    
                    addWorkForm.reset();
                    uploadContent.style.display = 'flex';
                    imagePreview.style.display = 'none';
                    hideModal(modalAddingImg);
                    
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                    
                } else {
                    let errorMessage = 'Erreur lors de l\'ajout de l\'œuvre';
                    
                    if (response.status === 401) {
                        errorMessage = 'Non autorisé. Veuillez vous reconnecter.';
                        localStorage.removeItem('token');
                        localStorage.removeItem('isAdmin');
                        window.location.href = './login.html';
                        return;
                    }
                    
                    alert(errorMessage);
                }
            } catch (error) {
                console.error('Erreur réseau:', error);
                alert('Erreur de connexion au serveur.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.value = 'Valider';
            }
        });
    }
}

function setupModalClosing() {
    const overlay = document.getElementById("overlay");
    const modalClose = document.getElementById("modal-close");
    
    if (overlay) {
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) hideModal(modalGallery);
        });
    }
    
    if (modalClose) {
        modalClose.addEventListener("click", () => hideModal(modalGallery));
    }

    const overlayAdd = document.getElementById("overlay-add");
    const modalCloseAdd = document.getElementById("modal-close-add");
    
    if (overlayAdd) {
        overlayAdd.addEventListener("click", (e) => {
            if (e.target === overlayAdd) hideModal(modalAddingImg);
        });
    }
    
    if (modalCloseAdd) {
        modalCloseAdd.addEventListener("click", () => hideModal(modalAddingImg));
    }
}

function showModal(modal) {
    if (modal) modal.style.display = "flex";
}

function hideModal(modal) {
    if (modal) modal.style.display = "none";
}

fetchData();
initializeModals();