# Documentation Backend pour l'Intégration de l'IA

Ce document est destiné à la personne chargée d'implémenter les fonctionnalités d'intelligence artificielle (IA) dans le projet CIVIC. Il décrit la structure du backend, les modèles de données pertinents, les points d'intégration clés et les étapes recommandées pour l'implémentation de l'IA, notamment pour le scoring des participations.

## 1. Vue d'ensemble du Backend

Le backend de CIVIC est construit avec **FastAPI** (Python) et gère la logique métier, l'authentification, la gestion des actions et des participations. Pour des raisons de simplicité et de prototypage, les données sont stockées dans des fichiers JSON (`users.json`, `actions.json`, `participations.json`) plutôt que dans une base de données traditionnelle.

## 2. Modèles de Données Clés pour l'IA

Comprendre la structure des données est essentiel pour l'entraînement et l'inférence du modèle d'IA.

### `User` Model (dans `main.py`)

Représente un utilisateur. Les champs pertinents pour l'IA incluent :
*   `user_id`: Identifiant unique de l'utilisateur.
*   `username`: Nom d'utilisateur.
*   `email`: Adresse email.
*   `role`: Rôle de l'utilisateur (ex: "participant").
*   `points`: Points cumulés par l'utilisateur.
*   `historique`: **Liste de dictionnaires détaillant les participations passées.** C'est un point crucial pour l'IA.
*   `age`: Âge de l'utilisateur.

### `Action` Model (dans `main.py`)

Représente une action civique proposée. Les champs pertinents pour l'IA incluent :
*   `action_id`: Identifiant unique de l'action.
*   `proposer_id`: ID de l'utilisateur ayant proposé l'action.
*   `title`: Titre de l'action.
*   `description`: Description détaillée.
*   `type`: Catégorie de l'action (ex: "nettoyage", "sensibilisation").
*   `impact`: Niveau d'impact de l'action (ex: "faible", "moyen", "élevé").
*   `image_url`: URL d'une image associée (peut être une caractéristique pour l'IA si l'on fait de l'analyse d'image).
*   `likes`: Nombre de "j'aime" reçus.
*   `required_participants`: Nombre de participants requis.
*   `deadline`: Date limite pour l'action.

### `Participation` Model (dans `main.py`)

Représente une participation validée à une action.
*   `participation_id`: Code unique (UUID) généré pour chaque participation.
*   `action_id`: ID de l'action concernée.
*   `user_id`: ID de l'utilisateur participant.
*   `used`: Booléen indiquant si le code a été validé.

## 3. Points d'Intégration Clés pour l'IA

Le point d'intégration principal pour le scoring d'IA est la fonction `validate_participation_code`.

### Endpoint `/participations/validate`

*   **Fichier :** `backend/main.py`
*   **Fonction :** `validate_participation_code(request: CodeValidationRequest)`
*   **Logique actuelle :**
    1.  Reçoit un `code` de participation.
    2.  Vérifie la validité et l'état (`used`) du code dans `participations_db`.
    3.  Marque la participation comme `used = True`.
    4.  Récupère l'objet `user` et les détails de l'`action` correspondants.
    5.  **Construit une entrée enrichie pour l'historique de l'utilisateur.** C'est ici que le "terrain est préparé" pour l'IA.
    6.  Attribue actuellement `+10` points fixes à l'utilisateur. **C'est cette ligne qui devra être remplacée par le score de l'IA.**
    7.  Met à jour l'historique et les points de l'utilisateur dans `users_db`.

### La variable `a_participe` et l'Historique Enrichi

Comme discuté, `a_participe` n'est pas une variable stockée directement, mais un indicateur clé pour le modèle d'IA. Dans le contexte de la validation d'un code, `a_participe` est implicitement `1` (l'utilisateur a participé).

L'entrée `historique` de l'utilisateur a été enrichie pour servir de "vecteur de caractéristiques" pour le modèle d'IA. Chaque entrée dans `user["historique"]` contient désormais :

```json
{
    "action_id": <int>,
    "action_title": <str>,
    "date": <ISO_datetime_str>,
    "a_participe": 1, // Indique une participation réussie
    "action_type": <str>,
    "action_impact": <str>,
    "action_required_participants": <int>,
    "action_deadline": <ISO_datetime_str or null>,
    "user_age_at_participation": <int>,
    "user_role_at_participation": <str>,
    "user_points_at_participation": <int> // Points de l'utilisateur AVANT cette validation
}
```
Cette structure fournit au modèle d'IA un instantané complet des conditions (utilisateur et action) au moment de la participation.

## 4. Étapes d'Implémentation de l'IA (Scoring des Participations)

Voici un guide pas à pas pour intégrer le modèle d'IA de scoring :

### Étape 4.1 : Préparation et Entraînement du Modèle d'IA

1.  **Collecte/Génération du Dataset :**
    *   Utilisez les données existantes dans `users.json` et `actions.json` pour créer un dataset d'entraînement.
    *   Pour le prototype, vous devrez générer un dataset factice qui simule des participations et les points correspondants (`points_obtenus`) que le modèle devra apprendre à prédire. Ce dataset doit inclure toutes les caractéristiques présentes dans l'historique enrichi (voir ci-dessus).
    *   Assurez-vous que votre dataset inclut une colonne `a_participe` avec la valeur `1` pour toutes les participations réussies.

2.  **Développement du Modèle (Python/scikit-learn) :**
    *   Créez un script Python séparé (ex: `backend/ai_model/train.py`).
    *   Importez `RandomForestRegressor` de `sklearn.ensemble`.
    *   Chargez votre dataset.
    *   Définissez vos caractéristiques (features) X (toutes les colonnes de l'historique enrichi sauf `action_id`, `action_title`, `date`, et `a_participe` qui est une feature elle-même) et votre cible Y (`points_obtenus`).
    *   Entraînez votre modèle : `model = RandomForestRegressor(n_estimators=100, random_state=42)`.
    *   `model.fit(X_train, y_train)`.

3.  **Sauvegarde du Modèle :**
    *   Utilisez `joblib` ou `pickle` pour sauvegarder votre modèle entraîné dans un fichier (ex: `backend/ai_model/rf_model.pkl`).
    *   `import joblib`
    *   `joblib.dump(model, 'backend/ai_model/rf_model.pkl')`

### Étape 4.2 : Intégration du Modèle dans FastAPI

1.  **Mise à jour des Dépendances :**
    *   Ajoutez `scikit-learn` et `joblib` (si utilisé) à `backend/requirements.txt`.
    *   `pip install -r backend/requirements.txt`

2.  **Chargement du Modèle au Démarrage de l'Application :**
    *   Dans `backend/main.py` (ou un nouveau module `backend/ai_service.py` si l'on veut séparer la logique), chargez le modèle entraîné une seule fois au démarrage de l'application.
    *   ```python
        # Dans main.py ou ai_service.py
        import joblib
        # ... autres imports ...

        # Charger le modèle d'IA au démarrage
        try:
            ai_model = joblib.load("backend/ai_model/rf_model.pkl")
            print("Modèle AI chargé avec succès.")
        except FileNotFoundError:
            ai_model = None
            print("Attention : Modèle AI non trouvé. Le scoring utilisera la valeur par défaut.")
        ```

3.  **Modification de `validate_participation_code` pour l'Inférence :**
    *   Localisez la fonction `validate_participation_code` dans `backend/main.py`.
    *   Après la construction de `history_entry` (le vecteur de caractéristiques), utilisez le modèle chargé pour prédire les points.
    *   **Logique à remplacer/ajouter :**
        ```python
        # ... (code existant pour construire history_entry) ...

        predicted_points = 10 # Valeur par défaut si le modèle n'est pas chargé ou en cas d'erreur

        if ai_model:
            # Convertir history_entry en un format compatible avec le modèle (ex: DataFrame ou array)
            # Assurez-vous que l'ordre et le type des features correspondent à ceux utilisés lors de l'entraînement
            features_for_prediction = [
                history_entry["user_age_at_participation"],
                history_entry["user_role_at_participation"], # Nécessite un encodage numérique (ex: One-Hot Encoding)
                history_entry["user_points_at_participation"],
                history_entry["action_type"], # Nécessite un encodage numérique
                history_entry["action_impact"], # Nécessite un encodage numérique
                history_entry["action_required_participants"],
                # history_entry["action_deadline"], # Peut nécessiter une conversion en jours restants, etc.
                history_entry["a_participe"]
            ]
            # Exemple simple : convertir les rôles/types/impacts en valeurs numériques si ce n'est pas déjà fait
            # Il est crucial que cet encodage soit le MÊME que celui utilisé lors de l'entraînement du modèle.
            # Vous devrez peut-être créer des fonctions d'encodage/décodage.
            
            # Exemple d'encodage simple (à adapter)
            encoded_role = 0 # Ex: 0 pour participant, 1 pour admin
            if history_entry["user_role_at_participation"] == "participant":
                encoded_role = 0
            # ... autres rôles ...

            encoded_action_type = 0 # Ex: 0 pour nettoyage, 1 pour sensibilisation
            # ... autres types ...

            encoded_action_impact = 0 # Ex: 0 pour faible, 1 pour moyen
            # ... autres impacts ...

            # Reconstruire features_for_prediction avec les valeurs encodées
            features_for_prediction = [
                history_entry["user_age_at_participation"],
                encoded_role,
                history_entry["user_points_at_participation"],
                encoded_action_type,
                encoded_action_impact,
                history_entry["action_required_participants"],
                history_entry["a_participe"]
            ]

            # Le modèle attend un tableau 2D, même pour une seule prédiction
            predicted_points = ai_model.predict([features_for_prediction])[0]
            predicted_points = max(0, round(predicted_points)) # S'assurer que les points sont positifs et entiers

        user["points"] += predicted_points # Remplacer le +10 fixe par le score de l'IA
        user["historique"].append(history_entry)
        save_data("users.json", users_db)
        return user
        ```

## 5. Considérations Importantes

*   **Cohérence de l'Encodage :** Il est absolument vital que la manière dont les caractéristiques catégorielles (rôle, type d'action, impact) sont encodées en numérique pour l'inférence soit **exactement la même** que celle utilisée lors de l'entraînement du modèle. Des fonctions d'encodage/décodage dédiées sont recommandées.
*   **Gestion des Valeurs Manquantes :** Si certaines caractéristiques peuvent être manquantes (`None`), le modèle d'IA doit être entraîné pour les gérer, ou vous devrez implémenter une stratégie d'imputation avant l'inférence.
*   **Performance :** Pour un prototype, charger le modèle en mémoire au démarrage est suffisant. Pour une application à grande échelle, envisagez des services de prédiction dédiés ou des solutions de mise en cache.
*   **Scalabilité des Données :** Les fichiers JSON sont pratiques pour un prototype. Pour un entraînement d'IA sérieux et une gestion de données volumineuses, une base de données relationnelle (PostgreSQL) ou NoSQL (MongoDB) serait nécessaire.
*   **Mise à Jour du Modèle :** Un modèle d'IA doit être ré-entraîné périodiquement avec de nouvelles données pour maintenir sa pertinence. Prévoyez un pipeline pour cela.
*   **Tests :** Testez rigoureusement l'intégration de l'IA pour vous assurer que les points sont attribués correctement et que le système reste stable.
*   **Sécurité :** Assurez-vous que les données sensibles ne sont pas exposées au modèle d'une manière qui compromettrait la vie privée des utilisateurs.
