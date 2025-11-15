import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Le composant ProtectedRoute est utilisé pour protéger les routes qui nécessitent une authentification.
// Il vérifie si un utilisateur est connecté en examinant le stockage local (localStorage).
const ProtectedRoute = () => {
    // Tente de récupérer les informations de l'utilisateur depuis le stockage local.
    // Si 'user' n'existe pas ou est null, cela signifie que l'utilisateur n'est pas connecté.
    const user = localStorage.getItem('user');

    // Si aucun utilisateur n'est trouvé dans le stockage local,
    // l'utilisateur n'est pas authentifié.
    if (!user) {
        // Redirige l'utilisateur vers la page de connexion.
        // 'replace' empêche l'utilisateur de revenir à la page protégée via le bouton "retour" du navigateur.
        return <Navigate to="/login" replace />;
    }

    // Si l'utilisateur est authentifié, rend les composants enfants de la route protégée.
    // <Outlet /> est un composant de react-router-dom qui rend le composant enfant correspondant à la route.
    return <Outlet />;
};

export default ProtectedRoute;
