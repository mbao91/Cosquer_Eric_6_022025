//Récupération des données de l'API Works
//  The fetch() function is a web API that allows you to make requests to a server.
// 1. Créer une fonction asynchrone qui récupère les données de l'API Works 
//import {function} from script.js  permet d'importer des fonctions d'un autre fichier
import { checkAdminStatus } from "./login.js";

async function fetchData() {
    // Vérifier le statut de connexion
    checkAdminStatus();
    try {
        // Première requête pour les works
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
        //galery(works);

        // Deuxième requête pour les catégories
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
        //categories(categoryData);

        

    } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
    }  
}
   
// Appel initial de la fonction fetchData
fetchData();