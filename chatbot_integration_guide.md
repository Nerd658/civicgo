# Guide d'Intégration du Chatbot avec l'IA

Ce document explique le fonctionnement actuel du chatbot dans l'application CIVIC et fournit des instructions détaillées sur la manière d'intégrer un modèle d'intelligence artificielle (IA) pour améliorer ses capacités.

## 1. Fonctionnement Actuel du Chatbot

Le chatbot est actuellement implémenté comme un *placeholder* fonctionnel, permettant une interaction basique avec l'utilisateur.

### 1.1. Côté Frontend (`frontend/CivicGo/src/components/Chatbot.jsx`)

*   **Interface Utilisateur (UI) :** Le composant `Chatbot.jsx` fournit l'interface complète pour la conversation. Il affiche l'historique des messages (messages de l'utilisateur et réponses du bot) et inclut un champ de saisie pour que l'utilisateur puisse taper ses questions.
*   **Envoi de Messages :** Lorsqu'un utilisateur tape un message et l'envoie, le composant `Chatbot.jsx` envoie ce message (sous forme de requête POST JSON) à l'endpoint `/chatbot` du backend.
*   **Affichage des Réponses :** Il reçoit la réponse du backend et l'ajoute à l'historique de la conversation, qui défile automatiquement pour montrer les derniers messages.
*   **Navigation :** Le chatbot est accessible via un lien dans la barre de navigation inférieure (`BottomNav.jsx`) et sa route (`/chatbot`) est définie dans `App.jsx`.

### 1.2. Côté Backend (`backend/main.py`)

*   **Endpoint `/chatbot` :** Le backend expose un endpoint `/chatbot` (méthode POST) qui est le point de contact pour le frontend.
*   **Modèles de Données :**
    *   `ChatbotQuery` : Définit le format du message entrant de l'utilisateur (actuellement juste un champ `message: str`).
    *   `ChatbotResponse` : Définit le format de la réponse renvoyée au frontend (actuellement juste un champ `response: str`).
*   **Logique Actuelle (Placeholder) :** La logique implémentée dans cet endpoint est très simple et basée sur des mots-clés. Elle vérifie si le message de l'utilisateur contient certains mots (ex: "bonjour", "aide", "points") et renvoie une réponse prédéfinie correspondante. Si aucun mot-clé n'est trouvé, une réponse générique est envoyée. **C'est cette logique qui doit être remplacée par l'intégration de l'IA.**

## 2. Intégration du Chatbot avec un Modèle d'IA

L'intégration d'un modèle d'IA (par exemple, un modèle RAG - Retrieval Augmented Generation - comme mentionné dans le PDF) se fera principalement côté backend, en remplaçant la logique placeholder de l'endpoint `/chatbot`.

### 2.1. Étapes d'Intégration Côté Backend (`backend/main.py`)

1.  **Préparer le Modèle d'IA :**
    *   **Développer/Choisir le Modèle :** Développez ou choisissez un modèle d'IA capable de générer des réponses textuelles (ex: un modèle de langage finetuné, ou un système RAG basé sur des documents de l'application).
    *   **Entraîner le Modèle :** Entraînez votre modèle avec des données pertinentes pour l'application CIVIC (fonctionnement, règles, scoring, etc.).
    *   **Sauvegarder le Modèle :** Sauvegardez le modèle entraîné dans un format qui peut être chargé en Python (ex: `joblib`, `pickle`, ou des formats spécifiques aux bibliothèques ML comme `transformers`).

2.  **Charger le Modèle d'IA dans FastAPI :**
    *   Au démarrage de l'application FastAPI, chargez votre modèle d'IA en mémoire. Cela doit être fait une seule fois pour éviter de recharger le modèle à chaque requête.
    *   ```python
        # Exemple de chargement d'un modèle (à adapter selon votre modèle)
        import joblib # ou d'autres bibliothèques
        # from transformers import pipeline # Exemple pour un modèle de langage

        ai_chatbot_model = None
        try:
            # Si c'est un modèle scikit-learn/custom
            # ai_chatbot_model = joblib.load("chemin/vers/votre_modele_chatbot.pkl")
            
            # Si c'est un modèle de langage (ex: Hugging Face)
            # ai_chatbot_model = pipeline("text-generation", model="gpt2") 
            print("Modèle de chatbot AI chargé avec succès.")
        except Exception as e:
            print(f"Erreur lors du chargement du modèle de chatbot AI : {e}. Le chatbot utilisera la logique par défaut.")
        ```

3.  **Remplacer la Logique Placeholder de l'Endpoint `/chatbot` :**
    *   Modifiez la fonction `chatbot_response` dans `backend/main.py`.
    *   Remplacez la logique conditionnelle actuelle par un appel à votre modèle d'IA chargé.
    *   ```python
        @app.post("/chatbot", response_model=ChatbotResponse)
        def chatbot_response(query: ChatbotQuery):
            if ai_chatbot_model:
                user_message = query.message
                # Ici, appelez votre modèle d'IA avec le user_message
                # La manière d'appeler dépendra de votre modèle
                try:
                    # Exemple pour un modèle simple
                    # ai_response = ai_chatbot_model.predict([user_message])[0] 
                    
                    # Exemple pour un pipeline de génération de texte
                    # response_data = ai_chatbot_model(user_message, max_length=50, num_return_sequences=1)
                    # ai_response = response_data[0]['generated_text']
                    
                    # --- Logique temporaire pour la démo si le modèle n'est pas encore prêt ---
                    # Vous pouvez conserver une logique de fallback ou une réponse générique
                    ai_response = f"Réponse de l'IA (simulée) à : '{user_message}'"
                    if "fonctionnement" in user_message.lower():
                        ai_response = "L'application CIVIC permet de proposer et participer à des actions civiques."
                    elif "points" in user_message.lower():
                        ai_response = "Vous gagnez des points en validant votre participation aux actions."
                    # --- Fin logique temporaire ---

                except Exception as e:
                    print(f"Erreur lors de l'inférence du modèle AI : {e}")
                    ai_response = "Désolé, une erreur est survenue lors du traitement de votre demande par l'IA."
            else:
                ai_response = "Le modèle d'IA n'est pas chargé. Le chatbot utilise une logique par défaut."
                # Fallback à la logique placeholder si le modèle n'est pas disponible
                user_message = query.message.lower()
                if "bonjour" in user_message:
                    ai_response = "Bonjour ! Comment puis-je vous aider aujourd'hui ?"
                elif "aide" in user_message or "question" in user_message:
                    ai_response = "Je suis là pour répondre à vos questions sur l'application CIVIC. N'hésitez pas !"
                # ... autres conditions du placeholder ...
            
            return ChatbotResponse(response=ai_response)
        ```

4.  **Mettre à jour `requirements.txt` :**
    *   Ajoutez toutes les bibliothèques Python nécessaires à votre modèle d'IA (ex: `transformers`, `torch`, `tensorflow`, `scikit-learn`, etc.) au fichier `backend/requirements.txt`.

### 2.2. Considérations Importantes

*   **Gestion du Contexte :** Pour un chatbot conversationnel, le modèle d'IA aura besoin de gérer le contexte de la conversation. Cela signifie que l'historique des messages précédents pourrait devoir être envoyé au modèle à chaque requête, ou que le modèle doit maintenir un état.
*   **Performance :** Les modèles d'IA peuvent être gourmands en ressources. Optimisez le chargement du modèle et les appels d'inférence. Pour des charges importantes, envisagez des services de micro-services dédiés à l'IA.
*   **Gestion des Erreurs :** Implémentez une gestion robuste des erreurs si le modèle d'IA échoue ou renvoie des réponses inattendues.
*   **Sécurité :** Assurez-vous que les données sensibles ne sont pas exposées au modèle d'IA et que les réponses du modèle ne contiennent pas d'informations inappropriées ou dangereuses.
*   **Mise à Jour du Modèle :** Prévoyez un processus pour mettre à jour et ré-entraîner le modèle d'IA à mesure que de nouvelles données ou de nouvelles exigences apparaissent.
*   **Frontend (Pas de Changements Majeurs) :** Le frontend est déjà conçu pour envoyer des messages et afficher des réponses textuelles. Il ne devrait pas nécessiter de changements majeurs, car il interagit avec le même endpoint et les mêmes modèles de données (`ChatbotQuery`, `ChatbotResponse`).
