import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo'; // Importation du composant Logo

const Auth = () => {
    const location = useLocation(); // Hook pour obtenir l'objet de localisation actuel
    const navigate = useNavigate(); // Hook pour la navigation programmatique
    const [activeTab, setActiveTab] = useState('login'); // Gère l'onglet actif (connexion ou inscription)

    // États pour le formulaire de connexion
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // États pour le formulaire d'inscription
    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
    const [registerAge, setRegisterAge] = useState('');
    const [error, setError] = useState('');   // Gère les messages d'erreur
    const [success, setSuccess] = useState(''); // Gère les messages de succès


    // Effet pour changer l'onglet actif en fonction du chemin de l'URL
    useEffect(() => {
        if (location.pathname === '/register') {
            setActiveTab('register');
        } else {
            setActiveTab('login');
        }
    }, [location.pathname]); // Se déclenche lorsque le chemin de l'URL change

    // Fonction de gestion de la connexion
    const handleLogin = async (e) => {
        e.preventDefault(); // Empêche le rechargement de la page
        setError('');      // Réinitialise les messages d'erreur
        setSuccess('');    // Réinitialise les messages de succès

        try {
            // Envoie une requête POST au backend pour la connexion
            const response = await fetch('http://localhost:8000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: loginEmail,
                    password: loginPassword,
                }),
            });

            // Gère les réponses non-OK du serveur
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Une erreur s'est produite.");
            }

            // Stocke les données de l'utilisateur dans le stockage local et navigue vers le fil d'actualité
            const userData = await response.json();
            localStorage.setItem('user', JSON.stringify(userData));
            navigate('/feed');
        } catch (err) {
            setError(err.message); // Affiche l'erreur à l'utilisateur
        }
    };

    // Fonction de gestion de l'inscription
    const handleRegister = async (e) => {
        e.preventDefault(); // Empêche le rechargement de la page
        setError('');      // Réinitialise les messages d'erreur
        setSuccess('');    // Réinitialise les messages de succès

        // Vérifie si les mots de passe correspondent
        if (registerPassword !== registerConfirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            // Envoie une requête POST au backend pour l'inscription
            const response = await fetch('http://localhost:8000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: registerName,
                    email: registerEmail,
                    password: registerPassword,
                    age: parseInt(registerAge, 10), // Convertit l'âge en entier
                }),
            });

            // Gère les réponses non-OK du serveur
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Une erreur s'est produite.");
            }

            setSuccess("Inscription réussie ! Vous pouvez maintenant vous connecter.");
            // Bascule vers l'onglet de connexion après une inscription réussie
            setActiveTab('login');
        } catch (err) {
            setError(err.message); // Affiche l'erreur à l'utilisateur
        }
    };

    return (
        // Conteneur principal de la page d'authentification
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden" style={{ backgroundColor: '#FFF8F2', color: '#284A39' }}>
            {/* En-tête de la page d'authentification */}
            <header className="relative p-6 pt-10 text-center">
                {/* Composant Logo en arrière-plan */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <Logo />
                </div>
                {/* Contenu de l'en-tête (titre et slogan) */}
                <div className="relative z-10">
                    <h1 className="text-4xl font-extrabold leading-tight tracking-tighter" style={{ color: '#284A39' }}>CivicGo</h1>
                    <p className="mt-2 text-base" style={{ color: 'rgba(40, 74, 57, 0.8)' }}>Votre communauté, votre voix.</p>
                </div>
            </header>
            {/* Contenu principal de la page (onglets et formulaires) */}
            <main className="z-10 flex flex-1 flex-col px-6 pb-6">
                {/* Sélecteur d'onglets (Connexion/Inscription) */}
                <div className="mb-6 mt-4">
                    <div className="flex rounded-xl bg-accent/30 dark:bg-white/5 p-1">
                        <button
                            onClick={() => setActiveTab('login')}
                            className={`flex-1 rounded-lg py-3 text-base font-bold transition-colors duration-300 ${activeTab === 'login' ? 'bg-white shadow-md' : ''}`}
                            style={{ color: activeTab === 'login' ? '#284A39' : 'rgba(40, 74, 57, 0.7)' }}
                        >
                            Connexion
                        </button>
                        <button
                            onClick={() => setActiveTab('register')}
                            className={`flex-1 rounded-lg py-3 text-base font-bold transition-colors duration-300 ${activeTab === 'register' ? 'bg-white shadow-md' : ''}`}
                            style={{ color: activeTab === 'register' ? '#284A39' : 'rgba(40, 74, 57, 0.7)' }}
                        >
                            Inscription
                        </button>
                    </div>
                </div>
                {/* Zone d'affichage des messages d'erreur/succès et des formulaires */}
                <div className="flex-1">
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    {success && <p className="text-green-500 text-center mb-4">{success}</p>}
                    {/* Formulaire de connexion */}
                    {activeTab === 'login' && (
                        <div>
                            <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                                {/* Champ Email */}
                                <div>
                                    <label className="text-sm font-medium leading-normal pb-2 block" style={{ color: 'rgba(40, 74, 57, 0.9)' }} htmlFor="login-email">Adresse e-mail</label>
                                    <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl h-14 p-4 text-base font-normal leading-normal"
                                        style={{
                                            borderColor: 'rgba(245, 214, 182, 0.5)',
                                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                            color: '#284A39',
                                            '--tw-focus-ring-color': 'rgba(228, 99, 29, 0.5)',
                                        }}
                                        id="login-email" placeholder="Entrez votre e-mail" type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
                                </div>
                                {/* Champ Mot de passe */}
                                <div>
                                    <label className="text-sm font-medium leading-normal pb-2 block" style={{ color: 'rgba(40, 74, 57, 0.9)' }} htmlFor="login-password">Mot de passe</label>
                                    <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl h-14 p-4 text-base font-normal leading-normal"
                                        style={{
                                            borderColor: 'rgba(245, 214, 182, 0.5)',
                                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                            color: '#284A39',
                                            '--tw-focus-ring-color': 'rgba(228, 99, 29, 0.5)',
                                        }}
                                        id="login-password" placeholder="Entrez votre mot de passe" type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
                                </div>
                                <a className="text-sm font-medium leading-normal text-right underline" style={{ color: '#E4631D' }} href="#">Mot de passe oublié ?</a>
                                {/* Bouton de connexion */}
                                <button className="flex h-14 w-full items-center justify-center gap-2 rounded-xl px-6 text-base font-bold text-white shadow-lg mt-4"
                                    style={{
                                        backgroundColor: '#E4631D',
                                        boxShadow: '0 10px 15px -3px rgba(228, 99, 29, 0.3), 0 4px 6px -2px rgba(228, 99, 29, 0.05)'
                                    }}
                                    type="submit">Se connecter</button>
                            </form>
                        </div>
                    )}
                    {/* Formulaire d'inscription */}
                    {activeTab === 'register' && (
                        <div>
                            <form className="flex flex-col gap-4" onSubmit={handleRegister}>
                                {/* Champ Nom complet */}
                                <div>
                                    <label className="text-sm font-medium leading-normal pb-2 block" style={{ color: 'rgba(40, 74, 57, 0.9)' }} htmlFor="register-name">Nom complet</label>
                                    <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl h-14 p-4 text-base font-normal leading-normal"
                                        style={{
                                            borderColor: 'rgba(245, 214, 182, 0.5)',
                                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                            color: '#284A39',
                                            '--tw-focus-ring-color': 'rgba(228, 99, 29, 0.5)',
                                        }}
                                        id="register-name" placeholder="Entrez votre nom complet" type="text" value={registerName} onChange={(e) => setRegisterName(e.target.value)} required />
                                </div>
                                {/* Champ Email */}
                                <div>
                                    <label className="text-sm font-medium leading-normal pb-2 block" style={{ color: 'rgba(40, 74, 57, 0.9)' }} htmlFor="register-email">Adresse e-mail</label>
                                    <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl h-14 p-4 text-base font-normal leading-normal"
                                        style={{
                                            borderColor: 'rgba(245, 214, 182, 0.5)',
                                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                            color: '#284A39',
                                            '--tw-focus-ring-color': 'rgba(228, 99, 29, 0.5)',
                                        }}
                                        id="register-email" placeholder="Entrez votre e-mail" type="email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} required />
                                </div>
                                {/* Champ Mot de passe */}
                                <div>
                                    <label className="text-sm font-medium leading-normal pb-2 block" style={{ color: 'rgba(40, 74, 57, 0.9)' }} htmlFor="register-password">Mot de passe</label>
                                    <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl h-14 p-4 text-base font-normal leading-normal"
                                        style={{
                                            borderColor: 'rgba(245, 214, 182, 0.5)',
                                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                            color: '#284A39',
                                            '--tw-focus-ring-color': 'rgba(228, 99, 29, 0.5)',
                                        }}
                                        id="register-password" placeholder="Créez un mot de passe" type="password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} required />
                                </div>
                                {/* Champ Confirmer le mot de passe */}
                                <div>
                                    <label className="text-sm font-medium leading-normal pb-2 block" style={{ color: 'rgba(40, 74, 57, 0.9)' }} htmlFor="register-confirm-password">Confirmer le mot de passe</label>
                                    <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl h-14 p-4 text-base font-normal leading-normal"
                                        style={{
                                            borderColor: 'rgba(245, 214, 182, 0.5)',
                                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                            color: '#284A39',
                                            '--tw-focus-ring-color': 'rgba(228, 99, 29, 0.5)',
                                        }}
                                        id="register-confirm-password" placeholder="Confirmez votre mot de passe" type="password" value={registerConfirmPassword} onChange={(e) => setRegisterConfirmPassword(e.target.value)} required />
                                </div>
                                {/* Champ Âge */}
                                <div>
                                    <label className="text-sm font-medium leading-normal pb-2 block" style={{ color: 'rgba(40, 74, 57, 0.9)' }} htmlFor="register-age">Âge</label>
                                    <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl h-14 p-4 text-base font-normal leading-normal"
                                        style={{
                                            borderColor: 'rgba(245, 214, 182, 0.5)',
                                            backgroundColor: 'rgba(255, 255, 255, .5)',
                                            color: '#284A39',
                                            '--tw-focus-ring-color': 'rgba(228, 99, 29, 0.5)',
                                        }}
                                        id="register-age" placeholder="Entrez votre âge" type="number" value={registerAge} onChange={(e) => setRegisterAge(e.target.value)} required />
                                </div>
                                {/* Bouton de création de compte */}
                                <button className="flex h-14 w-full items-center justify-center gap-2 rounded-xl px-6 text-base font-bold text-white shadow-lg mt-4"
                                    style={{
                                        backgroundColor: '#E4631D',
                                        boxShadow: '0 10px 15px -3px rgba(228, 99, 29, 0.3), 0 4px 6px -2px rgba(228, 99, 29, 0.05)'
                                    }}
                                    type="submit">Créer un compte</button>
                            </form>
                        </div>
                    )}
                </div>
                {/* Pied de page avec les liens vers les conditions et la politique de confidentialité */}
                <footer className="mt-auto pt-8">
                    <div className="text-center">
                        <p className="text-xs" style={{ color: 'rgba(40, 74, 57, 0.6)' }}>En continuant, vous acceptez nos <a className="font-semibold underline" style={{ color: '#E4631D' }} href="#">Conditions</a> et <a className="font-semibold underline" style={{ color: '#E4631D' }} href="#">Politique de confidentialité</a>.</p>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default Auth;