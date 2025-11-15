# Plateforme d'Engagement Civique CIVIC

CIVIC est une application web conçue pour favoriser l'engagement civique. Elle permet aux utilisateurs de proposer des actions locales, d'y participer, de valider leur participation et de gagner des points pour grimper dans un classement.

## Structure du Projet

Le projet est divisé en deux parties principales :

-   `backend/`: Un backend basé sur Python construit avec le framework **FastAPI**. Il gère toute la logique métier, la gestion des utilisateurs et le stockage des données (en utilisant des fichiers JSON comme une base de données simple).
-   `frontend/CivicGo/`: Une application frontend moderne construite avec **React** (utilisant Vite). Elle offre une interface utilisateur réactive et interactive.

---

## Installation et Configuration

Suivez ces instructions pour faire fonctionner le projet sur votre machine locale.

### 1. Configuration du Backend

Le serveur backend fonctionne sur `http://localhost:8000`.

**Prérequis :**
- Python 3.8+
- `pip` (gestionnaire de paquets Python)

**Instructions :**

1.  **Naviguez vers le répertoire du backend :**
    ```bash
    cd backend
    ```

2.  **Créez et activez un environnement virtuel Python :**
    ```bash
    # Créez l'environnement
    python3 -m venv venv

    # Activez l'environnement (sur Linux/macOS)
    source venv/bin/activate
    
    # Sur Windows, utilisez :
    # venv\Scripts\activate
    ```

3.  **Installez les dépendances requises :**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Lancez le serveur backend :**
    ```bash
    uvicorn main:app --reload --host 0.0.0.0 --port 8000
    ```
    Le serveur sera maintenant en cours d'exécution et se rechargera automatiquement si vous apportez des modifications au code.

### 2. Configuration du Frontend

Le serveur de développement frontend fonctionne sur `http://localhost:5173`.

**Prérequis :**
- Node.js 16.x ou supérieur
- `npm` (gestionnaire de paquets Node)

**Instructions :**

1.  **Naviguez vers le répertoire du frontend :**
    ```bash
    cd frontend/CivicGo
    ```

2.  **Installez les dépendances :**
    ```bash
    npm install
    ```

3.  **Lancez le serveur de développement frontend :**
    ```bash
    npm run dev
    ```
    Le serveur de développement démarrera, et vous pourrez maintenant accéder à l'application dans votre navigateur web à l'adresse `http://localhost:5173`.

---

### 3. Implémentation de la Fonctionnalité d'IA

Pour intégrer des fonctionnalités d'intelligence artificielle (IA) dans CIVIC, la personne chargée de cette tâche devra suivre une approche structurée, en se concentrant principalement sur le backend pour le traitement lourd et l'exposition des services d'IA.

**Où intégrer l'IA ?**
L'IA pourrait être utilisée pour diverses fonctionnalités, par exemple :
*   **Suggestions d'actions personnalisées** : Basées sur l'historique de participation de l'utilisateur ou ses préférences.
*   **Prédiction d'impact** : Estimer l'impact potentiel d'une action proposée.
*   **Chatbot d'assistance** : Répondre aux questions des utilisateurs ou les guider.
*   **Modération de contenu** : Détecter les actions inappropriées.

**Approche d'Implémentation :**

1.  **Intégration Backend (FastAPI) :**
    *   **Développement du Modèle d'IA :** Utilisez des bibliothèques Python populaires comme `TensorFlow`, `PyTorch`, ou `scikit-learn` pour développer et entraîner votre modèle d'IA.
    *   **Exposition via FastAPI :** Créez de nouveaux endpoints FastAPI dédiés à vos services d'IA. Par exemple, un endpoint `/ai/suggest-actions` qui prendrait l'ID d'un utilisateur et retournerait des suggestions d'actions.
    *   **Gestion des Données :** Pour l'entraînement et l'inférence, le modèle d'IA pourrait utiliser les données existantes (`users.json`, `actions.json`). Pour des modèles plus complexes ou de plus grands volumes de données, il serait judicieux d'envisager une intégration avec une base de données plus robuste (ex: PostgreSQL, MongoDB) plutôt que des fichiers JSON.
    *   **Dépendances :** Ajoutez les bibliothèques d'IA nécessaires au `requirements.txt` du backend.

2.  **Intégration Frontend (React) :**
    *   **Appels API :** Le frontend (dans `frontend/CivicGo/src/`) effectuera des requêtes `fetch` ou `axios` vers les nouveaux endpoints FastAPI d'IA.
    *   **Affichage des Résultats :** Les résultats retournés par le backend (ex: liste d'actions suggérées, score d'impact) devront être traités et affichés de manière conviviale dans l'interface utilisateur. Par exemple, une nouvelle section "Suggestions pour vous" sur la page `Feed.jsx`.

**Considérations Clés :**

*   **Performance :** Les opérations d'IA peuvent être gourmandes en ressources. Assurez-vous que les endpoints d'IA sont optimisés et, si nécessaire, utilisez des tâches asynchrones ou des services de file d'attente (comme Celery) pour les traitements longs.
*   **Évolutivité :** À mesure que les modèles d'IA deviennent plus complexes et que le volume de données augmente, la transition des fichiers JSON vers une base de données dédiée sera essentielle.
*   **Éthique et Transparence :** Si l'IA prend des décisions importantes (ex: modération), il est crucial de considérer la transparence, l'équité et la gestion des biais potentiels.

---

## Comment utiliser l'application

1.  **Créez un nouveau compte** ou connectez-vous si vous en avez déjà un.
2.  **Parcourez le fil d'actualité** pour voir les actions proposées.
3.  **Proposez une nouvelle action** en utilisant le bouton "Proposer".
4.  **Participez** à une action existante pour recevoir un code de validation.
5.  Après avoir terminé l'action, **validez votre code** sur votre page de profil pour gagner des points.
6.  **Consultez le classement** pour voir votre position parmi les autres utilisateurs !