import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CodeValidation = () => {
    // Définition des couleurs utilisées dans le composant pour la cohérence visuelle.
    const primaryColor = '#D17F23';
    const primaryDarker = '#B86E1D';
    const backgroundColorLight = '#FFF8F0';
    const successColor = '#349A58';
    const errorColor = '#E54D4D';
    const textColorLight = '#4A3B29';
    const borderColorLight = '#D4BFA5';
    const placeholderLight = '#8C7B68';
    const white = '#ffffff';
    const gray400 = '#9ca3af';

    // États du composant pour gérer l'entrée du code, les messages de validation et l'état de chargement.
    const [code, setCode] = useState(''); // Stocke le code de participation saisi par l'utilisateur.
    const [validationMessage, setValidationMessage] = useState(null); // Affiche les messages de succès ou d'erreur.
    const [isLoading, setIsLoading] = useState(false); // Indique si une requête API est en cours.

    // Effet pour masquer automatiquement les messages de validation après un certain délai.
    useEffect(() => {
        if (validationMessage) {
            const timer = setTimeout(() => {
                setValidationMessage(null); // Réinitialise le message après 3 secondes.
            }, 3000);
            return () => clearTimeout(timer); // Nettoie le timer si le composant est démonté ou si le message change.
        }
    }, [validationMessage]); // Se déclenche lorsque validationMessage change.

    // Fonction asynchrone pour gérer la validation du code.
    const handleValidateCode = async () => {
        if (isLoading || !code) return; // Empêche les soumissions multiples ou si le code est vide.

        setIsLoading(true); // Active l'état de chargement.
        setValidationMessage(null); // Efface tout message précédent.

        try {
            // Envoie une requête POST au backend pour valider le code de participation.
            const response = await fetch('http://localhost:8000/participations/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code }), // Envoie le code saisi.
            });

            const data = await response.json(); // Parse la réponse JSON.

            // Vérifie si la réponse de l'API est OK (statut 2xx).
            if (!response.ok) {
                throw new Error(data.detail || 'Une erreur est survenue.'); // Lance une erreur si la validation échoue.
            }

            // Met à jour les données de l'utilisateur dans le stockage local après une validation réussie.
            // Le backend renvoie l'objet utilisateur mis à jour.
            localStorage.setItem('user', JSON.stringify(data));

            // Affiche un message de succès avec les points mis à jour.
            setValidationMessage({ type: 'success', text: `Code validé ! Vous avez maintenant ${data.points} points.` });
            setCode(''); // Efface le champ de saisie du code.
        } catch (err) {
            setValidationMessage({ type: 'error', text: err.message }); // Affiche le message d'erreur.
        } finally {
            setIsLoading(false); // Désactive l'état de chargement, que la requête ait réussi ou échoué.
        }
    };

    // Gère l'appui sur la touche "Entrée" pour déclencher la validation du code.
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleValidateCode();
        }
    };

    return (
        // Conteneur principal de la page de validation de code.
        <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden mx-auto max-w-md" style={{ backgroundColor: backgroundColorLight, color: textColorLight }}>
            {/* Éléments de design en arrière-plan pour l'esthétique. */}
            <div className="absolute inset-0 z-0 opacity-10">
                <div className="absolute -top-20 -left-20 w-80 h-80 bg-contain bg-no-repeat" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBWEOooEwXZxbC6NeIlOC10R7smy3SlhCZzM30o9XXrbAj-YweUjD9wHTl7MRDtzXSA2SmsYgqBuc9EBCD9IYc80H5uYirdRH-7KoUi9ldnTIFnL2e978lgruxFjwGENy3_t3z-_UUhKHqTvJJxjH6J3bqc_zCSEdvwT6rM3h7SmUALmHn0wnXZAAtjcs4ZOFEbl4AL7Im88p2DzzOmoczIahceJcghfE6ZWFpsDk_OirIoSDF8SZarnyKEraR8S_vLDS6Lb6UMXIG1s")' }}></div>
                <div className="absolute -bottom-24 -right-16 w-72 h-72 bg-contain bg-no-repeat" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBWEOooEwXZxbC6NeIlOC10R7smy3SlhCZzM30o9XrbAj-YweUjD9wHTl7MRDtzXSA2SmsYgqBuc9EBCD9IYc80H5uYirdRH-7KoUi9ldnTIFnL2e978lgruxFjwGENy3_t3z-_UUhKHqTvJJxjH6J3bqc_zCSEdvwT6rM3h7SmUALmHn0wnXZAAtjcs4ZOFEbl4AL3Im88p2DzzOmoczIahceJcghfE6ZWFpsDk_OirIoSDF8SZarnyKEraR8S_vLDS6Lb6UMXIG1s")' }}></div>
            </div>
            {/* En-tête de la page */}
            <header className="relative flex items-center bg-transparent p-4 pb-2 justify-between z-10">
                <div className="flex size-12 shrink-0 items-center justify-start">
                    {/* Bouton de retour vers le profil utilisateur. */}
                    <Link to="/profile" className="flex items-center justify-center size-10 rounded-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', color: textColorLight }}>
                        <span className="material-symbols-outlined text-2xl">arrow_back</span>
                    </Link>
                </div>
                <h1 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Valider un code</h1>
                <div className="flex size-12 shrink-0 items-center"></div>
            </header>
            {/* Contenu principal de la page */}
            <main className="flex-grow p-6 flex flex-col items-center relative z-10">
                <div className="w-full max-w-md">
                    <p className="text-base font-normal leading-normal text-center mb-8">Saisissez le code de participation pour valider votre action et gagner des points.</p>
                    <div className="space-y-6">
                        <div className="flex w-full flex-wrap items-end">
                            <label className="flex flex-col min-w-40 flex-1">
                                <span className="text-sm font-medium leading-normal pb-2">Code de participation</span>
                                <div className="flex w-full flex-1 items-stretch rounded-xl shadow-lg" style={{ boxShadow: `0 10px 15px -3px rgba(209, 127, 35, 0.1), 0 4px 6px -2px rgba(209, 127, 35, 0.05)` }}>
                                    {/* Champ de saisie pour le code de participation. */}
                                    <input
                                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl focus:outline-0 focus:ring-2 h-14 p-[15px] text-base font-normal leading-normal text-center tracking-widest"
                                        style={{
                                            color: textColorLight,
                                            borderColor: borderColorLight,
                                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                            '--tw-focus-ring-color': `rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(primaryColor.slice(3, 5), 16)}, ${parseInt(primaryColor.slice(5, 7), 16)}, 0.5)`,
                                            '::placeholder': { color: placeholderLight }
                                        }}
                                        placeholder="A1B2-C3D4"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        disabled={isLoading} // Désactive le champ pendant le chargement.
                                    />
                                </div>
                            </label>
                        </div>
                        <div className="flex w-full">
                            {/* Bouton de validation du code. */}
                            <button
                                className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 text-white text-base font-bold leading-normal tracking-[0.015em] transition-colors shadow-lg disabled:opacity-50"
                                style={{
                                    backgroundColor: isLoading ? gray400 : primaryColor, // Change la couleur si en chargement.
                                    boxShadow: `0 10px 15px -3px rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(primaryColor.slice(3, 5), 16)}, ${parseInt(primaryColor.slice(5, 7), 16)}, 0.3), 0 4px 6px -2px rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(primaryColor.slice(3, 5), 16)}, ${parseInt(primaryColor.slice(5, 7), 16)}, 0.05)`
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = isLoading ? gray400 : primaryDarker}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = isLoading ? gray400 : primaryColor}
                                onClick={handleValidateCode}
                                disabled={isLoading} // Désactive le bouton pendant le chargement.
                            >
                                {isLoading ? (
                                    // Animation de chargement.
                                    <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 animate-pulse rounded-full bg-white" style={{ animationDelay: '-0.3s' }}></span>
                                        <span className="h-2 w-2 animate-pulse rounded-full bg-white" style={{ animationDelay: '-0.15s' }}></span>
                                        <span className="h-2 w-2 animate-pulse rounded-full bg-white"></span>
                                    </div>
                                ) : (
                                    <span className="truncate">Valider le code</span>
                                )}
                            </button>
                        </div>
                    </div>
                    {/* Zone d'affichage des messages de validation (succès/erreur). */}
                    <div className="w-full mt-8 h-10">
                        {validationMessage && (
                            <div className={`flex items-center p-4 rounded-xl border ${validationMessage.type === 'success' ? 'text-success' : 'text-error'}`}
                                style={{
                                    backgroundColor: validationMessage.type === 'success' ? 'rgba(52, 154, 88, 0.1)' : 'rgba(229, 77, 77, 0.1)',
                                    borderColor: validationMessage.type === 'success' ? 'rgba(52, 154, 88, 0.3)' : 'rgba(229, 77, 77, 0.3)'
                                }}>
                                <span className="material-symbols-outlined mr-3">{validationMessage.type === 'success' ? 'check_circle' : 'error'}</span>
                                <p className="text-sm font-medium">{validationMessage.text}</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CodeValidation;