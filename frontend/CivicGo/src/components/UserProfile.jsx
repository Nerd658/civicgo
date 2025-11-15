import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const navigate = useNavigate(); // Hook pour la navigation programmatique.
    const [user, setUser] = useState(null); // État pour stocker les informations de l'utilisateur connecté.

    // Définition des couleurs utilisées dans le composant pour la cohérence visuelle.
    const primaryColor = '#D16002';
    const secondaryColor = '#2C7A7B';
    const backgroundColorLight = '#FFF8F0';
    const textColorLight = '#1A202C';
    const textSubtleLight = '#4A5568';
    const cardLight = '#ffffff';
    const accentColor = '#FBBF24';

    // Effet pour charger les informations de l'utilisateur depuis le stockage local lors du montage du composant.
    useEffect(() => {
        const userData = localStorage.getItem('user'); // Tente de récupérer les données utilisateur.
        if (userData) {
            setUser(JSON.parse(userData)); // Si des données existent, les parse et les stocke dans l'état.
        } else {
            navigate('/'); // Si aucune donnée utilisateur, redirige vers la page d'accueil (qui redirigera vers la connexion).
        }
    }, [navigate]); // Se déclenche une seule fois au montage et si 'navigate' change.

    // Fonction pour gérer la déconnexion de l'utilisateur.
    const handleLogout = () => {
        localStorage.removeItem('user'); // Supprime les informations de l'utilisateur du stockage local.
        navigate('/'); // Redirige l'utilisateur vers la page d'accueil (qui redirigera vers la connexion).
    };

    // Affiche un indicateur de chargement ou rien si les données utilisateur ne sont pas encore chargées.
    if (!user) {
        return null; // Ou un spinner de chargement.
    }

    return (
        // Conteneur principal de la page de profil utilisateur.
        <div className="relative mx-auto flex h-auto min-h-screen w-full max-w-md flex-col overflow-x-hidden font-display" style={{ backgroundColor: backgroundColorLight, color: textColorLight }}>
            {/* En-tête de la page de profil. */}
            <header className="relative flex items-center bg-transparent p-4 pb-2 justify-between z-10">
                <div className="flex size-12 shrink-0 items-center justify-start">
                    {/* Bouton de retour vers le fil d'actualité. */}
                    <Link to="/feed" className="flex items-center justify-center size-10 rounded-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', color: textColorLight }}>
                        <span className="material-symbols-outlined text-2xl">arrow_back</span>
                    </Link>
                </div>
                <h1 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Profil Utilisateur</h1>
                <div className="flex size-12 shrink-0 items-center justify-end">
                    {/* Bouton de déconnexion. */}
                    <button onClick={handleLogout} className="flex items-center justify-center size-10 rounded-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', color: textColorLight }}>
                        <span className="material-symbols-outlined text-2xl">logout</span>
                    </button>
                </div>
            </header>
            {/* Contenu principal du profil. */}
            <main className="flex-grow p-4 space-y-6" style={{ paddingBottom: '120px' }}>
                {/* Section d'informations de base de l'utilisateur (avatar, nom, points). */}
                <section className="flex flex-col gap-4 rounded-xl shadow-sm relative overflow-hidden" style={{ backgroundColor: cardLight }}>
                    {/* Élément de design en arrière-plan. */}
                    <div className="absolute inset-0 bg-[url('image-06ed53d0698748378c8c5c7d0d04f21d')] bg-cover bg-center opacity-10"></div>
                    <div className="relative p-4">
                        <div className="flex w-full items-center gap-4">
                            {/* Avatar de l'utilisateur (première lettre du nom d'utilisateur). */}
                            <div className="rounded-full h-20 w-20 flex items-center justify-center bg-gray-300 text-gray-600 text-4xl font-bold border-4 shadow-md" style={{ borderColor: cardLight }}>
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col justify-center">
                                {/* Nom d'utilisateur. */}
                                <p className="text-lg font-bold leading-tight tracking-[-0.015em]" style={{ color: textColorLight }}>{user.username}</p>
                                <div className="flex items-center gap-1.5 mt-1">
                                    {/* Affichage des points de l'utilisateur. */}
                                    <span className="material-symbols-outlined text-xl" style={{ color: accentColor }}>star</span>
                                    <p className="text-base font-bold leading-normal" style={{ color: secondaryColor }}>{user.points} Points</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Section des informations détaillées de l'utilisateur (âge, rôle). */}
                <section className="flex flex-col items-stretch justify-start rounded-xl p-4 shadow-sm space-y-3" style={{ backgroundColor: cardLight }}>
                    <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]" style={{ color: textColorLight }}>Informations</h2>
                    <div className="flex items-center justify-between">
                        <p className="text-base font-normal leading-normal" style={{ color: textSubtleLight }}>Âge</p>
                        <p className="text-base font-medium leading-normal" style={{ color: textColorLight }}>{user.age}</p>
                    </div>
                    <hr className="border-gray-100" />
                    <div className="flex items-center justify-between">
                        <p className="text-base font-normal leading-normal" style={{ color: textSubtleLight }}>Rôle</p>
                        <p className="text-base font-medium leading-normal" style={{ color: textColorLight }}>{user.role}</p>
                    </div>
                </section>
                {/* Section de l'historique récent des participations. */}
                <section>
                    <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] px-2 pb-2" style={{ color: textColorLight }}>Historique Récent</h2>
                    <div className="flex flex-col gap-3">
                        {user.historique.length > 0 ? (
                            // Parcours de l'historique pour afficher chaque participation.
                            user.historique.map((item, index) => (
                                <div key={index} className="flex items-center gap-4 px-4 py-3 rounded-xl shadow-sm" style={{ backgroundColor: cardLight }}>
                                    <div className="flex items-center justify-center rounded-lg shrink-0 size-10" style={{ backgroundColor: backgroundColorLight, color: secondaryColor }}>
                                        <span className="material-symbols-outlined">celebration</span>
                                    </div>
                                    <div className="flex flex-col justify-center grow">
                                        {/* Titre de l'action à laquelle l'utilisateur a participé. */}
                                        <p className="text-base font-medium leading-normal line-clamp-1" style={{ color: textColorLight }}>{item.action_title}</p>
                                        {/* Date de la participation (actuellement un placeholder). */}
                                        <p className="text-sm font-normal leading-normal line-clamp-2" style={{ color: textSubtleLight }}>Il y a peu</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">Aucun historique récent.</p>
                        )}
                    </div>
                </section>
            </main>
            {/* Pied de page avec les boutons d'action rapide. */}
            <footer className="fixed bottom-0 w-full max-w-md p-4 backdrop-blur-sm" style={{ backgroundColor: 'rgba(255, 248, 240, 0.8)' }}>
                <div className="flex items-center gap-3">
                    {/* Bouton pour valider un code. */}
                    <Link to="/validate-code" className="flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold shadow-sm transition-colors active:bg-secondary/20 border" style={{ backgroundColor: cardLight, color: secondaryColor, borderColor: 'rgba(44, 122, 123, 0.2)' }}>
                        <span className="material-symbols-outlined">qr_code_scanner</span> Valider Code
                    </Link>
                    {/* Bouton pour proposer une action. */}
                    <Link to="/propose-action" className="flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white shadow-lg transition-transform active:scale-95" style={{ backgroundColor: primaryColor, boxShadow: '0 10px 15px -3px rgba(209, 96, 2, 0.3), 0 4px 6px -2px rgba(209, 96, 2, 0.05)' }}>
                        <span className="material-symbols-outlined">add_circle</span> Proposer
                    </Link>
                </div>
            </footer>
        </div>
    );
};

export default UserProfile;