# Documentation Frontend pour l'Intégration de l'IA

Ce document est destiné à la personne chargée d'implémenter les fonctionnalités d'intelligence artificielle (IA) côté frontend de l'application CIVIC. Il décrit la structure du frontend, les composants clés, les mécanismes de communication avec le backend, et les étapes recommandées pour intégrer des fonctionnalités d'IA ou afficher les résultats provenant du backend.

## 1. Vue d'ensemble du Frontend

Le frontend de CIVIC est une application **React** moderne, initialisée avec **Vite**, et stylisée avec **Tailwind CSS**. Il offre une interface utilisateur réactive et interactive, communiquant avec le backend FastAPI via des appels API REST.

## 2. Composants Frontend Clés et Interaction avec l'IA

Plusieurs composants pourraient être affectés ou enrichis par l'intégration de l'IA :

*   **`Feed.jsx` :** Affiche la liste des actions. Pourrait être étendu pour afficher des **suggestions d'actions personnalisées** générées par l'IA, ou pour trier les actions en fonction d'une pertinence calculée par l'IA.
*   **`UserProfile.jsx` :** Affiche le profil de l'utilisateur, son historique et ses points. Pourrait afficher des **statistiques ou des insights générés par l'IA** basés sur l'historique de l'utilisateur, ou des **recommandations pour améliorer son score**.
*   **`ProposeAction.jsx` :** Formulaire de proposition d'action. L'IA pourrait potentiellement **suggérer des catégories, des impacts**, ou même **estimer la faisabilité/l'impact potentiel** d'une action pendant sa création.
*   **`Chatbot.jsx` :** Si un chatbot RAG est implémenté côté backend, ce composant serait le point d'interaction direct avec l'utilisateur.

## 3. Communication Frontend-Backend pour l'IA

Le frontend communique avec le backend via des requêtes HTTP (GET, POST, etc.) en utilisant l'API `fetch` native du navigateur.

*   **URL du Backend :** Le backend est accessible à `http://localhost:8000`. Toutes les requêtes API doivent cibler cette URL.
*   **Format des Données :** Les données sont échangées au format JSON.
*   **Authentification :** Les requêtes vers les endpoints protégés nécessitent un token d'authentification (généralement stocké dans `localStorage` après la connexion).

## 4. Points d'Intégration Frontend pour l'IA

### 4.1. Consommation du Score d'IA (via `validate_participation_code`)

Actuellement, la fonction `validate_participation_code` du backend renvoie l'objet `User` mis à jour avec les nouveaux points. Lorsque le backend intégrera le scoring par IA, le frontend n'aura pas besoin de modifications majeures pour *recevoir* le score.

*   **Composant concerné :** Le composant qui appelle l'endpoint de validation (actuellement non directement exposé dans un composant spécifique, mais la logique de validation est déclenchée après avoir reçu un code).
*   **Action :** Après un appel `fetch` réussi à `http://localhost:8000/participations/validate`, le frontend recevra un objet `User` dont le champ `points` aura été mis à jour par le score de l'IA.
*   **Affichage :** Les composants comme `UserProfile.jsx` et `Leaderboard.jsx` afficheront automatiquement ces nouveaux points.

### 4.2. Intégration de Nouvelles Fonctionnalités d'IA (Ex: Suggestions d'Actions)

Si le backend expose de nouveaux endpoints d'IA (ex: `/ai/suggest-actions`), le frontend devra :

1.  **Déclencher l'appel API :**
    *   **Quand ?** Généralement au chargement d'un composant (via `useEffect`), ou en réponse à une action utilisateur (clic sur un bouton "Voir les suggestions").
    *   **Où ?** Dans le composant qui affichera les résultats (ex: `Feed.jsx` pour les suggestions d'actions).

2.  **Effectuer la requête `fetch` :**
    *   Construire l'URL de l'endpoint d'IA (ex: `http://localhost:8000/ai/suggest-actions`).
    *   Inclure les données nécessaires (ex: `user_id` de l'utilisateur connecté).
    *   Gérer les en-têtes (notamment `Content-Type: application/json` et le token d'authentification si l'endpoint est protégé).

    ```javascript
    // Exemple dans Feed.jsx
    import React, { useState, useEffect } from 'react';
    // ... autres imports ...

    const Feed = () => {
        const [suggestedActions, setSuggestedActions] = useState([]);
        const [loadingSuggestions, setLoadingSuggestions] = useState(false);
        const [errorSuggestions, setErrorSuggestions] = useState('');

        useEffect(() => {
            const fetchSuggestedActions = async () => {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user) return;

                setLoadingSuggestions(true);
                setErrorSuggestions('');
                try {
                    const response = await fetch('http://localhost:8000/ai/suggest-actions', {
                        method: 'POST', // Ou GET selon l'endpoint AI
                        headers: {
                            'Content-Type': 'application/json',
                            // 'Authorization': `Bearer ${user.token}` // Si l'endpoint est protégé
                        },
                        body: JSON.stringify({ user_id: user.user_id }) // Données nécessaires pour l'IA
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.detail || "Erreur lors de la récupération des suggestions.");
                    }

                    const data = await response.json();
                    setSuggestedActions(data);
                } catch (err) {
                    setErrorSuggestions(err.message);
                } finally {
                    setLoadingSuggestions(false);
                }
            };

            fetchSuggestedActions();
        }, []); // Déclencher au montage du composant

        // ... Rendu du composant ...
        return (
            <div>
                {/* ... Affichage des actions normales ... */}
                {loadingSuggestions && <p>Chargement des suggestions AI...</p>}
                {errorSuggestions && <p className="text-red-500">{errorSuggestions}</p>}
                {suggestedActions.length > 0 && (
                    <div>
                        <h2>Suggestions AI pour vous :</h2>
                        {/* Afficher les suggestedActions ici */}
                    </div>
                )}
            </div>
        );
    };
    ```

3.  **Gérer l'état du composant :**
    *   Utiliser `useState` pour stocker les données reçues de l'IA (`suggestedActions`, `chatbotResponse`, etc.).
    *   Utiliser `useState` pour gérer les états de chargement (`loadingSuggestions`) et d'erreur (`errorSuggestions`) afin de fournir un feedback utilisateur.

4.  **Afficher les résultats dans l'UI :**
    *   Concevoir des éléments d'interface utilisateur pour présenter les informations de l'IA de manière claire et intuitive.
    *   Utiliser des boucles (`.map()`) pour rendre des listes de suggestions.
    *   Adapter le style avec Tailwind CSS pour une intégration harmonieuse.

## 5. Considérations Importantes pour le Frontend

*   **Expérience Utilisateur (UX) :**
    *   **Feedback de chargement :** Toujours afficher des indicateurs de chargement lorsque des appels API d'IA sont en cours, car ils peuvent prendre plus de temps.
    *   **Gestion des erreurs :** Afficher des messages d'erreur clairs si l'appel à l'API d'IA échoue.
    *   **Transparence :** Si l'IA prend des décisions importantes (ex: filtrage de contenu), il peut être utile d'expliquer pourquoi certains éléments sont affichés ou non.
*   **Performance :**
    *   Éviter les appels API d'IA inutiles. Utiliser `useEffect` avec des tableaux de dépendances appropriés.
    *   Optimiser le rendu des listes d'éléments générés par l'IA (ex: virtualisation de listes pour de très grands ensembles).
*   **Sécurité :**
    *   Ne jamais exposer de clés API ou d'informations sensibles côté client. Toutes les logiques sensibles doivent rester côté backend.
    *   Assurez-vous que les données envoyées au backend pour l'IA sont correctement validées et nettoyées.
*   **Évolutivité :**
    *   Concevoir les composants de manière modulaire pour faciliter l'ajout de nouvelles fonctionnalités d'IA à l'avenir.
    *   Envisager l'utilisation de bibliothèques de gestion d'état plus robustes (ex: Redux, Zustand) si l'application et les interactions avec l'IA deviennent très complexes.
