// 1. Ta configuration Firebase officielle pour FAY-BeninMARKET
const firebaseConfig = {
  apiKey: "AIzaSyBgxEKac2BFnGp1zz8Df3yKhW656vepF_k",
  authDomain: "fay-beninmarket.firebaseapp.com",
  databaseURL: "https://fay-beninmarket-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fay-beninmarket",
  storageBucket: "fay-beninmarket.firebasestorage.app",
  messagingSenderId: "1015486006380",
  appId: "1:1015486006380:web:9a611b70b258933a848449"
};

// Initialisation de Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

// Référence vers ton nœud de produits dans la base de données
const produitsRef = database.ref('produits');

// Sélections des éléments HTML
const grilleProduits = document.getElementById('grille-produits-accueil');

// 2. Écouter la base de données en temps réel pour charger les produits
produitsRef.on('value', (snapshot) => {
    // On vide la grille (qui contient le message de chargement)
    grilleProduits.innerHTML = "";
    
    const produits = snapshot.val();
    
    // Si aucun produit n'est présent dans la base de données
    if (!produits) {
        grilleProduits.innerHTML = `
            <div class="aucun-produit">
                <i class="fas fa-box-open"></i>
                <p>Aucun produit n'est disponible pour le moment. Revenez plus tard !</p>
            </div>
        `;
        return;
    }
    
    // Si des produits existent, on boucle dessus pour les afficher
    Object.keys(produits).forEach((key) => {
        const produit = produits[key];
        
        // Création de la carte produit avec le nouveau design lumineux
        const carteHTML = `
            <div class="card-produit" style="
                background: #ffffff;
                border: 1px solid #e2e8f0;
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 10px 25px rgba(11, 78, 162, 0.03);
                transition: all 0.4s ease;
                position: relative;
            " onmouseover="this.style.transform='translateY(-5px)'; this.style.borderColor='#2ecc71'; this.style.boxShadow='0 15px 30px rgba(46, 204, 113, 0.15)';" onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 10px 25px rgba(11, 78, 162, 0.03)';">
                
                <!-- Image du produit -->
                <div style="height: 200px; width: 100%; overflow: hidden; position: relative; background: #f1f5f9;">
                    <img src="${produit.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600&auto=format&fit=crop'}" alt="${produit.nom}" style="width: 100%; height: 100%; object-fit: cover;">
                    <span style="
                        position: absolute;
                        top: 15px;
                        left: 15px;
                        background: #0b4ea2;
                        color: #ffffff;
                        padding: 5px 12px;
                        border-radius: 20px;
                        font-size: 11px;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    ">${produit.categorie || 'Général'}</span>
                </div>
                
                <!-- Détails du produit -->
                <div style="padding: 20px;">
                    <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 8px; color: #0f172a;">${produit.nom}</h3>
                    <p style="font-size: 13px; color: #64748b; margin-bottom: 20px; height: 40px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                        ${produit.description || 'Aucune description disponible.'}
                    </p>
                    
                    <!-- Prix et Action -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 15px;">
                        <div>
                            <span style="font-size: 11px; color: #94a3b8; display: block; text-transform: uppercase; font-weight: 600;">Prix</span>
                            <span style="font-size: 20px; font-weight: 800; color: #2ecc71;">${produit.prix} FCFA</span>
                        </div>
                        <a href="https://wa.me/${produit.whatsapp || '22900000000'}?text=Bonjour,%20je%20suis%20intéressé(e)%20par%20votre%20produit%20*${encodeURIComponent(produit.nom)}*%20sur%20FAY-BeninMARKET" target="_blank" style="
                            background: #2ecc71;
                            color: #ffffff;
                            width: 45px;
                            height: 45px;
                            border-radius: 12px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 18px;
                            text-decoration: none;
                            transition: all 0.3s ease;
                            box-shadow: 0 4px 10px rgba(46, 204, 113, 0.2);
                        " onmouseover="this.style.background='#27ae60'; this.style.transform='scale(1.05)';" onmouseout="this.style.background='#2ecc71'; this.style.transform='scale(1)';">
                            <i class="fab fa-whatsapp"></i>
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        // On injecte la carte dans la grille
        grilleProduits.innerHTML += carteHTML;
    });
}, (error) => {
    console.error("Erreur de lecture Firebase : ", error);
    grilleProduits.innerHTML = `
        <div class="aucun-produit">
            <i class="fas fa-exclamation-triangle" style="color: #e74c3c;"></i>
            <p>Une erreur est survenue lors de la connexion. Veuillez réessayer.</p>
        </div>
    `;
});