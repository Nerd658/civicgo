import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav'; // Importation du composant de navigation inférieure
import Modal from './Modal';         // Importation du composant Modal pour les pop-ups

const Feed = () => {
    const navigate = useNavigate(); // Hook pour la navigation programmatique
    const [feedItems, setFeedItems] = useState([]); // État pour stocker les éléments du fil d'actualité
    const [loading, setLoading] = useState(true);   // État pour gérer l'affichage du chargement
    const [error, setError] = useState('');         // État pour gérer les messages d'erreur
    const [isModalOpen, setIsModalOpen] = useState(false); // État pour contrôler l'ouverture/fermeture de la modale
    const [modalContent, setModalContent] = useState({ title: '', body: '' }); // Contenu de la modale
    const [currentUser, setCurrentUser] = useState(null); // Informations sur l'utilisateur actuellement connecté

    // Définition des couleurs et styles pour la cohérence visuelle.
    const primaryColor = '#E4631D'; // Orange
    const backgroundColorLight = '#f6f7f8';
    const textColorLight = '#1A202C';
    const cardBackgroundColor = '#ffffff';
    const slate200 = '#e2e8f0';
    const slate500 = '#64748b';
    const slate600 = '#475569';
    const slate700 = '#334155';
    const slate800 = '#1e293b';
    const slate900 = '#0f172a';
    const red500 = '#ef4444';
    const green500 = '#22c55e';
    const orange500 = '#f97316';

    // Éléments du fil d'actualité codés en dur pour la démonstration.
    // Ces éléments sont filtrés si l'utilisateur y a déjà participé.
    const hardcodedFeedItems = [
        {
            action_id: -1, // ID négatif pour distinguer les actions codées en dur des actions dynamiques.
            proposer_id: -1, // ID du proposant pour les actions codées en dur.
            user: { name: 'Faso-Actu', handle: '@fasoactu', avatar: 'https://placehold.co/40x40/E4631D/white?text=FA' },
            time: 'Il y a 2h',
            title: "Appel à mobilisation pour la Journée d'Engagement Patriotique",
            content: "Le 2 octobre, soyons tous unis pour célébrer notre engagement envers la nation. Participez aux activités de salubrité et aux conférences-débats dans votre localité.",
            image: 'https://minesactu.info/wp-content/uploads/2025/04/Salubrite-7.jpeg',
            category: { name: 'Engagement Citoyen', color: green500 },
            action: 'Participer',
            stats: { likes: 2500, comments: '120', shares: '56' },
            icons: { like: 'groups', comment: 'comment', share: 'share' }
        },
        // ... d'autres éléments codés en dur peuvent être ajoutés ici
    ];

    // Effet pour charger les actions depuis le backend et les combiner avec les éléments codés en dur.
    useEffect(() => {
        // Récupère les informations de l'utilisateur depuis le stockage local.
        const user = JSON.parse(localStorage.getItem('user'));
        setCurrentUser(user); // Met à jour l'état de l'utilisateur actuel.

        const fetchActions = async () => {
            try {
                // Récupère les actions depuis l'API backend.
                const response = await fetch('http://localhost:8000/actions');
                if (!response.ok) {
                    throw new Error('Failed to fetch actions');
                }
                const actions = await response.json(); // Parse la réponse JSON.

                // Crée un ensemble d'IDs d'actions auxquelles l'utilisateur a déjà participé pour un filtrage rapide.
                const participatedActionIds = new Set(user ? user.historique.map(h => h.action_id) : []);

                // Formate les actions récupérées et filtre celles auxquelles l'utilisateur a participé.
                const formattedActions = actions
                    .filter(action => !participatedActionIds.has(action.action_id)) // Filtre les actions déjà participées.
                    .map(action => ({
                        action_id: action.action_id,
                        proposer_id: action.proposer_id,
                        user: {
                            name: action.proposer_username,
                            handle: '@' + action.proposer_username.toLowerCase(),
                            avatar: 'https://placehold.co/40x40/E4631D/white?text=' + action.proposer_username.charAt(0).toUpperCase()
                        },
                        time: 'Il y a peu', // Placeholder pour le temps.
                        title: action.title,
                        content: action.description,
                        image: action.image_url,
                        category: { name: action.type, color: green500 },
                        action: 'Participer',
                        likes: action.likes || 0, // Initialise les likes à 0 si non définis.
                    }));
                
                // Filtre les éléments codés en dur de la même manière.
                const hardcodedFiltered = hardcodedFeedItems.filter(item => !participatedActionIds.has(item.action_id));

                // Combine les actions filtrées (codées en dur et dynamiques) et met à jour l'état.
                setFeedItems([...hardcodedFiltered, ...formattedActions]);
            } catch (err) {
                setError(err.message); // Affiche l'erreur.
                setFeedItems(hardcodedFeedItems); // Affiche les éléments codés en dur même en cas d'échec de l'API.
            } finally {
                setLoading(false); // Désactive l'état de chargement.
            }
        };

        fetchActions(); // Appelle la fonction pour récupérer les actions.
    }, []); // Le tableau vide signifie que cet effet ne s'exécute qu'une seule fois après le montage initial.

    // Fonction pour gérer la participation à une action.
    const handleParticipate = async (actionId) => {
        // Gère les actions de démonstration (codées en dur).
        if (actionId < 0) {
            setModalContent({
                title: 'Action de démonstration',
                body: "La participation à cette action de démonstration n'est pas encore implémentée."
            });
            setIsModalOpen(true);
            return;
        }

        // Vérifie si l'utilisateur est connecté.
        if (!currentUser) {
            setModalContent({
                title: 'Erreur',
                body: 'Vous devez être connecté pour participer.'
            });
            setIsModalOpen(true);
            setTimeout(() => navigate('/login'), 2000); // Redirige vers la page de connexion après un délai.
            return;
        }

        try {
            // Envoie une requête POST au backend pour enregistrer la participation.
            const response = await fetch(`http://localhost:8000/actions/${actionId}/participate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: currentUser.user_id }), // Envoie l'ID de l'utilisateur.
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Une erreur s'est produite.");
            }

            const participation = await response.json(); // Récupère les détails de la participation.
            setModalContent({
                title: 'Participation réussie !',
                body: `Votre code de participation est : ${participation.participation_id}`
            });
            setIsModalOpen(true); // Ouvre la modale avec le code de participation.

        } catch (err) {
            setModalContent({
                title: 'Erreur',
                body: err.message
            });
            setIsModalOpen(true); // Ouvre la modale avec le message d'erreur.
        }
    };

    // Fonction pour gérer l'action "J'aime" sur un post.
    const handleLike = async (actionId) => {
        // Vérifie si l'utilisateur est connecté.
        if (!currentUser) {
            setModalContent({
                title: 'Erreur',
                body: 'Vous devez être connecté pour aimer une action.'
            });
            setIsModalOpen(true);
            return;
        }

        try {
            // Envoie une requête POST au backend pour incrémenter le compteur de likes.
            const response = await fetch(`http://localhost:8000/actions/${actionId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: currentUser.user_id }), // Envoie l'ID de l'utilisateur.
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Une erreur s'est produite lors de l'ajout du like.");
            }

            const updatedAction = await response.json(); // Récupère l'action mise à jour.
            // Met à jour l'état local des feedItems pour refléter le nouveau nombre de likes.
            setFeedItems(prevItems =>
                prevItems.map(item =>
                    item.action_id === actionId ? { ...item, likes: updatedAction.likes } : item
                )
            );
        } catch (err) {
            let errorMessage = err.message;
            if (err.message.includes("Action already liked")) {
                errorMessage = "Vous avez déjà aimé cette action.";
            }
            setModalContent({
                title: 'Erreur',
                body: errorMessage
            });
            setIsModalOpen(true); // Ouvre la modale avec le message d'erreur.
        }
    };

    return (
        // Conteneur principal du fil d'actualité.
        <div className="relative mx-auto flex h-auto min-h-screen w-full max-w-md flex-col overflow-x-hidden font-display" style={{ paddingBottom: '80px', backgroundColor: backgroundColorLight, color: textColorLight }}>
            {/* Composant Modal pour afficher les messages et codes de participation. */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalContent.title}
            >
                <p>{modalContent.body}</p>
            </Modal>

            {/* Barre d'application supérieure. */}
            <div className="sticky top-0 z-10 w-full backdrop-blur-sm" style={{ backgroundColor: 'rgba(246, 247, 248, 0.8)' }}>
                <div className="flex items-center p-4">
                    <div className="flex size-10 shrink-0 items-center justify-center">
                        <span className="material-symbols-outlined text-3xl" style={{ color: primaryColor }}>campaign</span>
                    </div>
                    <h2 className="ml-2 flex-1 text-xl font-bold leading-tight tracking-[-0.015em]" style={{ color: slate900 }}>CivicFeed</h2>
                    {/* ... boutons de recherche et de notification (non implémentés ici) */}
                </div>
            </div>

            {/* Puces de filtre (non fonctionnelles dans ce prototype). */}
            <div className="flex gap-3 overflow-x-auto p-4 pt-2 [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="flex h-9 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-full pl-4 pr-4" style={{ backgroundColor: primaryColor }}>
                    <p className="text-white text-sm font-medium leading-normal">Tout</p>
                </div>
                {/* ... autres puces de filtre */}
            </div>

            {/* Contenu du fil d'actualité. */}
            <div className="flex flex-col gap-3 px-4">
                {loading && <p>Chargement...</p>} {/* Message de chargement. */}
                {error && <p className="text-red-500">{error}</p>}     {/* Message d'erreur. */}
                {feedItems.map((item, index) => (
                    // Carte individuelle pour chaque élément du fil d'actualité.
                    <div key={item.action_id || index} className="flex flex-col overflow-hidden rounded shadow-sm" style={{ backgroundColor: cardBackgroundColor }}>
                        <div className="flex flex-col p-4">
                            {/* Informations sur l'utilisateur proposant l'action. */}
                            <div className="flex items-center gap-3">
                                <img className="h-10 w-10 rounded-full" alt={`Avatar de ${item.user.name}`} src={item.user.avatar} />
                                <div className="flex-1">
                                    <p className="text-base font-bold" style={{ color: slate800 }}>{item.user.name}</p>
                                    <p className="text-sm" style={{ color: slate500 }}>{item.user.handle} • {item.time}</p>
                                </div>
                            </div>
                            {/* Titre et contenu de l'action. */}
                            <p className="mt-4 text-lg font-bold leading-tight tracking-[-0.015em]" style={{ color: slate900 }}>{item.title}</p>
                            <p className="mt-2 text-base" style={{ color: slate600 }}>{item.content}</p>
                        </div>
                        {/* Affichage de l'image si disponible. */}
                        {item.image && (
                            <div className="aspect-video w-full bg-cover bg-center" style={{ backgroundImage: `url("${item.image}")` }}></div>
                        )}
                        <div className="p-4 pt-2">
                            <div className="mb-2 flex items-center justify-between">
                                {/* Catégorie de l'action. */}
                                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: item.category.color }}>{item.category.name}</p>
                                {/* Bouton "Participer" conditionnel : n'apparaît pas si l'utilisateur est le proposant. */}
                                {currentUser && item.proposer_id !== currentUser.user_id && (
                                    <button onClick={() => handleParticipate(item.action_id)} className="flex h-9 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full px-4 text-sm font-medium leading-normal text-white" style={{ backgroundColor: primaryColor }}>
                                        <span className="truncate">{item.action}</span>
                                    </button>
                                )}
                            </div>
                            {/* Séparateur. */}
                            <div className="my-2 h-px" style={{ backgroundColor: slate200 }}></div>
                            {/* Statistiques d'interaction (likes, commentaires, partages). */}
                            <div className="flex flex-wrap justify-between">
                                {/* Bouton "J'aime" avec compteur. */}
                                <div className="flex items-center justify-center gap-2 px-3 py-2 cursor-pointer" onClick={() => handleLike(item.action_id)}>
                                    <span className="material-symbols-outlined text-2xl" style={{ color: slate500 }}>thumb_up</span>
                                    <p className="text-[13px] font-bold leading-normal tracking-[0.015em]" style={{ color: slate500 }}>{item.likes}</p>
                                </div>
                                {/* Compteur de commentaires (non fonctionnel dans ce prototype). */}
                                <div className="flex items-center justify-center gap-2 px-3 py-2">
                                    <span className="material-symbols-outlined text-2xl" style={{ color: slate500 }}>comment</span>
                                    <p className="text-[13px] font-bold leading-normal tracking-[0.015em]" style={{ color: slate500 }}>{item.stats?.comments || '0'}</p>
                                </div>
                                {/* Compteur de partages (non fonctionnel dans ce prototype). */}
                                <div className="flex items-center justify-center gap-2 px-3 py-2">
                                    <span className="material-symbols-outlined text-2xl" style={{ color: slate500 }}>share</span>
                                    <p className="text-[13px] font-bold leading-normal tracking-[0.015em]" style={{ color: slate500 }}>{item.stats?.shares || '0'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bouton d'action flottant pour proposer une nouvelle action. */}
            <button onClick={() => navigate('/propose-action')} className="fixed bottom-24 right-6 flex h-14 w-14 cursor-pointer items-center justify-center overflow-hidden rounded-lg text-white shadow-lg" style={{ backgroundColor: primaryColor }}>
                <span className="material-symbols-outlined text-3xl">add</span>
            </button>

            {/* Barre de navigation inférieure. */}
            <BottomNav />
        </div>
    );
};

export default Feed;