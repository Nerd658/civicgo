import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomNav = () => {
    const location = useLocation(); // Hook pour obtenir l'objet de localisation actuel, utilisé pour surligner l'élément de navigation actif.
    const primaryColor = '#E4631D'; // Couleur principale utilisée pour les éléments actifs.
    const slate500 = '#64748b';     // Couleur secondaire pour les éléments inactifs.

    // Définition des éléments de navigation avec leur chemin, icône Material Symbols et libellé.
    const navItems = [
        { path: '/feed', icon: 'home', label: 'Accueil' },
        { path: '/leaderboard', icon: 'leaderboard', label: 'Classement' },
        { path: '/propose-action', icon: 'add_circle', label: 'Proposer' },
        { path: '/chatbot', icon: 'smart_toy', label: 'Chatbot' }, // Optionnel, si le chatbot est implémenté.
        { path: '/profile', icon: 'person', label: 'Profil' },
    ];

    return (
        // Conteneur principal de la barre de navigation inférieure.
        // 'fixed bottom-0 z-10 w-full max-w-md' assure qu'elle reste en bas de l'écran.
        // 'border-t backdrop-blur-sm' ajoute une bordure supérieure et un effet de flou.
        <div className="fixed bottom-0 z-10 w-full max-w-md border-t backdrop-blur-sm" style={{ borderColor: '#e2e8f0', backgroundColor: 'rgba(246, 247, 248, 0.8)' }}>
            {/* Flex container pour aligner les éléments de navigation. */}
            <div className="flex h-20 items-center justify-around">
                {/* Parcours de chaque élément de navigation pour le rendre. */}
                {navItems.map((item) => (
                    <Link
                        key={item.path} // Clé unique pour chaque élément de la liste.
                        to={item.path}  // Le chemin vers lequel naviguer.
                        className="flex cursor-pointer flex-col items-center gap-1"
                        // Applique la couleur primaire si le chemin actuel correspond à l'élément, sinon utilise la couleur secondaire.
                        style={{ color: location.pathname === item.path ? primaryColor : slate500 }}
                    >
                        {/* Icône Material Symbols. */}
                        <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                        {/* Libellé de l'élément de navigation, en gras si actif. */}
                        <p className={`text-xs ${location.pathname === item.path ? 'font-bold' : 'font-medium'}`}>{item.label}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default BottomNav;