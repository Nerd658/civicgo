import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SelectInput from './SelectInput';   // Composant pour les champs de sélection déroulants
import TextInput from './TextInput';     // Composant pour les champs de texte simples
import TextAreaInput from './TextAreaInput'; // Composant pour les champs de texte multilignes

const ProposeAction = () => {
    const navigate = useNavigate(); // Hook pour la navigation programmatique
    // Définition des couleurs utilisées dans le composant pour la cohérence visuelle.
    const primaryColor = '#D17F23';
    const primaryDarker = '#B86E1D';
    const backgroundColorLight = '#FFF8F0';
    const textColorLight = '#4A3B29';

    // États du composant pour gérer les données du formulaire.
    const [title, setTitle] = useState('');       // Titre de l'action
    const [description, setDescription] = useState(''); // Description de l'action
    const [type, setType] = useState('');         // Type de l'action
    const [impact, setImpact] = useState('');       // Impact de l'action
    const [imageUrl, setImageUrl] = useState('');     // URL de l'image (optionnel)
    const [requiredParticipants, setRequiredParticipants] = useState(1); // Nombre de participants requis
    const [deadline, setDeadline] = useState('');       // Date limite pour l'action
    const [error, setError] = useState('');       // Message d'erreur
    const [success, setSuccess] = useState('');     // Message de succès

    // Options pour le champ de sélection "Type".
    const typeOptions = [
        { value: '', label: 'Sélectionnez un type' },
        { value: 'nettoyage', label: 'Nettoyage' },
        { value: 'sensibilisation', label: 'Sensibilisation' },
        { value: 'animation', label: 'Animation' },
        { value: 'rehabilitation', label: 'Réhabilitation' },
        { value: 'assistance', label: 'Assistance' },
    ];

    // Options pour le champ de sélection "Impact".
    const impactOptions = [
        { value: '', label: 'Sélectionnez un impact' },
        { value: 'faible', label: 'Faible' },
        { value: 'moyen', label: 'Moyen' },
        { value: 'eleve', label: 'Élevé' },
    ];

    // Fonction de gestion de la soumission du formulaire.
    const handleSubmit = async (e) => {
        e.preventDefault(); // Empêche le rechargement de la page.
        setError('');      // Réinitialise les messages d'erreur.
        setSuccess('');    // Réinitialise les messages de succès.

        // Récupère les informations de l'utilisateur connecté depuis le stockage local.
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            setError('Vous devez être connecté pour proposer une action.');
            return;
        }

        try {
            // Envoie une requête POST au backend pour créer une nouvelle action.
            const response = await fetch('http://localhost:8000/actions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action_id: Date.now(), // Utilise le timestamp actuel comme ID temporaire unique.
                    proposer_id: user.user_id, // ID de l'utilisateur qui propose l'action.
                    title,
                    description,
                    type,
                    impact,
                    image_url: imageUrl, // URL de l'image fournie par l'utilisateur.
                    required_participants: parseInt(requiredParticipants), // Nombre de participants requis.
                    deadline: deadline ? new Date(deadline).toISOString() : null, // Date limite au format ISO.
                }),
            });

            // Gère les réponses non-OK du serveur.
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Une erreur s'est produite.");
            }

            setSuccess('Action proposée avec succès !'); // Affiche un message de succès.
            setTimeout(() => navigate('/feed'), 2000); // Redirige vers le fil d'actualité après 2 secondes.
        } catch (err) {
            setError(err.message); // Affiche l'erreur à l'utilisateur.
        }
    };

    return (
        // Conteneur principal de la page de proposition d'action.
        <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden mx-auto max-w-md" style={{ backgroundColor: backgroundColorLight, color: textColorLight }}>
            {/* En-tête de la page. */}
            <header className="relative flex items-center bg-transparent p-4 pb-2 justify-between z-10">
                <div className="flex size-12 shrink-0 items-center justify-start">
                    {/* Bouton de retour vers le fil d'actualité. */}
                    <Link to="/feed" className="flex items-center justify-center size-10 rounded-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', color: textColorLight }}>
                        <span className="material-symbols-outlined text-2xl">arrow_back</span>
                    </Link>
                </div>
                <h1 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Proposer une action</h1>
                <div className="flex size-12 shrink-0 items-center"></div>
            </header>
            {/* Contenu principal de la page (formulaire). */}
            <main className="flex-grow p-6 flex flex-col items-center relative z-10">
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}     {/* Affichage des messages d'erreur. */}
                {success && <p className="text-green-500 text-center mb-4">{success}</p>} {/* Affichage des messages de succès. */}
                {/* Formulaire de proposition d'action. */}
                <form className="w-full max-w-md space-y-6" onSubmit={handleSubmit}>
                    {/* Champ de saisie pour le titre de l'action. */}
                    <TextInput
                        label="Titre de l'action"
                        placeholder="Ex: Nettoyage du parc"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    {/* Champ de saisie pour la description de l'action. */}
                    <TextAreaInput
                        label="Description"
                        placeholder="Décrivez l'action en détail"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    {/* Champ de sélection pour le type d'action. */}
                    <SelectInput label="Type" options={typeOptions} value={type} onChange={(e) => setType(e.target.value)} />
                    {/* Champ de sélection pour l'impact de l'action. */}
                    <SelectInput label="Impact" options={impactOptions} value={impact} onChange={(e) => setImpact(e.target.value)} />
                    {/* Champ de saisie pour l'URL de l'image. */}
                    <TextInput
                        label="URL de l'image (optionnel)"
                        placeholder="https://example.com/image.jpg"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                    />
                    {/* Champ de saisie pour le nombre de participants requis. */}
                    <TextInput
                        label="Nombre de participants requis"
                        placeholder="Ex: 10"
                        value={requiredParticipants}
                        onChange={(e) => setRequiredParticipants(e.target.value)}
                        type="number" // Assure que l'entrée est un nombre
                    />
                    {/* Champ de saisie pour la date limite. */}
                    <TextInput
                        label="Date limite"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        type="date" // Utilise un sélecteur de date
                    />
                    <div className="flex w-full">
                        {/* Bouton de soumission du formulaire. */}
                        <button
                            type="submit"
                            className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 text-white text-base font-bold leading-normal tracking-[0.015em] transition-colors shadow-lg"
                            style={{
                                backgroundColor: primaryColor,
                                boxShadow: `0 10px 15px -3px rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(primaryColor.slice(3, 5), 16)}, ${parseInt(primaryColor.slice(5, 7), 16)}, 0.3), 0 4px 6px -2px rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(primaryColor.slice(3, 5), 16)}, ${parseInt(primaryColor.slice(5, 7), 16)}, 0.05)`
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = primaryDarker}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = primaryColor}
                        >
                            <span className="truncate">Proposer l'action</span>
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default ProposeAction;