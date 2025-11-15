import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BottomNav from './BottomNav'; // Importation du composant de navigation inférieure.

const Leaderboard = () => {
    // États pour stocker la liste des utilisateurs, l'état de chargement et les erreurs.
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Définition des couleurs utilisées dans le composant pour la cohérence visuelle.
    const primaryColor = '#D16002';
    const secondaryColor = '#2C7A7B';
    const backgroundColorLight = '#FFF8F0';
    const textColorLight = '#1A202C';
    const cardLight = '#ffffff';
    const accentColor = '#FBBF24';
    const white = '#ffffff'; // Couleur blanche explicitement définie.

    // Effet pour récupérer les données du classement depuis le backend lors du montage du composant.
    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                // Envoie une requête GET au backend pour obtenir le classement.
                const response = await fetch('http://localhost:8000/leaderboard');
                if (!response.ok) {
                    throw new Error('Failed to fetch leaderboard'); // Gère les erreurs de réponse HTTP.
                }
                const data = await response.json(); // Parse la réponse JSON.
                setUsers(data); // Met à jour l'état avec les données des utilisateurs.
            } catch (err) {
                setError(err.message); // Affiche l'erreur.
            } finally {
                setLoading(false); // Désactive l'état de chargement.
            }
        };

        fetchLeaderboard(); // Appelle la fonction pour récupérer le classement.
    }, []); // Le tableau vide signifie que cet effet ne s'exécute qu'une seule fois après le montage initial.

    return (
        // Conteneur principal de la page du classement.
        <div className="relative mx-auto flex h-auto min-h-screen w-full max-w-md flex-col overflow-x-hidden font-display" style={{ backgroundColor: backgroundColorLight, color: textColorLight }}>
            {/* En-tête de la page. */}
            <header className="relative flex items-center bg-transparent p-4 pb-2 justify-between z-10">
                <div className="flex size-12 shrink-0 items-center justify-start">
                    {/* Bouton de retour vers le fil d'actualité. */}
                    <Link to="/feed" className="flex items-center justify-center size-10 rounded-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', color: textColorLight }}>
                        <span className="material-symbols-outlined text-2xl">arrow_back</span>
                    </Link>
                </div>
                <h1 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Classement</h1>
                <div className="flex size-12 shrink-0 items-center"></div>
            </header>
            {/* Contenu principal du classement. */}
            <main className="flex-grow p-4 space-y-6" style={{ paddingBottom: '80px' }}>
                {loading && <p className="text-center">Chargement...</p>} {/* Message de chargement. */}
                {error && <p className="text-center text-red-500">{error}</p>}     {/* Message d'erreur. */}
                <div className="flex flex-col gap-3">
                    {/* Parcours de la liste des utilisateurs pour afficher chaque entrée du classement. */}
                    {users.map((user, index) => (
                        <div key={user.user_id} className="flex items-center gap-4 px-4 py-3 rounded-xl shadow-sm" style={{ backgroundColor: cardLight }}>
                            {/* Affichage du rang de l'utilisateur. */}
                            <div className="flex items-center justify-center rounded-full shrink-0 size-10 font-bold text-lg" style={{ backgroundColor: accentColor, color: white }}>
                                {index + 1} {/* Le rang est basé sur l'index dans le tableau trié. */}
                            </div>
                            {/* Avatar de l'utilisateur (actuellement une image générique). */}
                            <img alt={`Avatar de ${user.username}`} className="rounded-full h-12 w-12 object-cover border-2" src={`https://i.pravatar.cc/150?u=${user.user_id}`} style={{ borderColor: cardLight }} />
                            <div className="flex flex-col justify-center grow">
                                {/* Nom d'utilisateur. */}
                                <p className="text-base font-bold leading-normal line-clamp-1" style={{ color: textColorLight }}>{user.username}</p>
                                {/* Points de l'utilisateur. */}
                                <p className="text-sm font-medium leading-normal" style={{ color: secondaryColor }}>{user.points} points</p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            {/* Barre de navigation inférieure. */}
            <BottomNav />
        </div>
    );
};

export default Leaderboard;
