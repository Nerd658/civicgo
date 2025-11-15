# Explication de l'Implémentation de la "Base de Données" (Fichiers JSON)

Ce document explique comment la persistance des données est gérée dans le projet CIVIC pour les besoins du prototype.

## 1. Vue d'ensemble

Pour simplifier le développement et accélérer le prototypage, le projet CIVIC n'utilise pas de système de gestion de base de données (SGBD) traditionnel (comme PostgreSQL, MySQL, MongoDB, etc.). Au lieu de cela, toutes les données de l'application sont stockées et gérées directement via des **fichiers JSON** sur le système de fichiers du serveur backend.

## 2. Fichiers de Données Utilisés

Trois fichiers JSON principaux sont utilisés pour stocker les différentes entités de l'application :

*   **`users.json` :** Contient une liste de tous les utilisateurs enregistrés dans l'application. Chaque objet utilisateur inclut des informations comme l'ID, le nom d'utilisateur, l'email, le mot de passe (non haché pour le prototype), les points, l'historique des participations, l'âge et les actions "aimées".
*   **`actions.json` :** Contient une liste de toutes les actions civiques proposées. Chaque objet action inclut des détails comme l'ID, le proposant, le titre, la description, le type, l'impact, l'URL de l'image, le nombre de "j'aime", le nombre de participants requis et la date limite.
*   **`participations.json` :** Contient une liste de toutes les participations enregistrées. Chaque objet participation lie un utilisateur à une action via un code unique (UUID) et indique si ce code a été utilisé.

## 3. Mécanisme de Chargement et de Sauvegarde des Données

La gestion de ces fichiers JSON est centralisée dans les fonctions `load_data` et `save_data` définies dans `backend/main.py`.

*   **`load_data(filename)` :**
    *   Cette fonction est appelée au démarrage de l'application FastAPI pour lire le contenu d'un fichier JSON spécifié (par exemple, `users.json`).
    *   Elle parse le contenu JSON et le charge en mémoire dans une variable Python (par exemple, `users_db`).
    *   Si le fichier n'existe pas (par exemple, lors du premier démarrage), elle renvoie une liste vide pour éviter les erreurs.

*   **`save_data(filename, data)` :**
    *   Cette fonction est appelée chaque fois qu'une modification est apportée aux données en mémoire (par exemple, ajout d'un nouvel utilisateur, mise à jour des points d'un utilisateur, ajout d'une nouvelle action, etc.).
    *   Elle prend les données Python en mémoire et les sérialise au format JSON.
    *   Elle écrit ensuite ces données sérialisées dans le fichier JSON correspondant, écrasant l'ancien contenu. Le paramètre `indent=4` est utilisé pour formater le JSON de manière lisible.

**Exemple de Flux :**

1.  Au démarrage de l'application, `users_db`, `actions_db`, et `participations_db` sont initialisés en chargeant le contenu de leurs fichiers JSON respectifs.
2.  Lorsqu'un utilisateur s'inscrit, un nouvel objet utilisateur est ajouté à la liste `users_db` en mémoire.
3.  La fonction `save_data("users.json", users_db)` est ensuite appelée pour écrire la liste `users_db` mise à jour dans le fichier `users.json`, rendant la modification persistante.

## 4. Avantages de cette Approche (pour le Prototype)

*   **Simplicité :** Très facile à mettre en place et à comprendre, sans nécessiter l'installation et la configuration d'un SGBD externe.
*   **Rapidité de Développement :** Permet de se concentrer rapidement sur la logique métier de l'application sans se soucier des complexités d'une base de données.
*   **Portabilité :** Les fichiers JSON sont facilement transférables et lisibles.

## 5. Limitations et Considérations pour la Production

Il est crucial de comprendre que cette approche n'est **pas adaptée à une application en production** et présente plusieurs limitations majeures :

*   **Scalabilité :** Ne gère pas efficacement de grands volumes de données ou un grand nombre d'utilisateurs simultanés. Chaque opération de lecture/écriture implique de charger/sauvegarder l'intégralité du fichier.
*   **Concurrence :** Très faible gestion des accès concurrents. Si plusieurs requêtes tentent de modifier le même fichier JSON simultanément, cela peut entraîner des corruptions de données ou des pertes de données.
*   **Intégrité des Données :** Aucune garantie d'intégrité référentielle (pas de clés étrangères, de contraintes, etc.). Les relations entre les données (par exemple, un `action_id` dans `participations.json` doit exister dans `actions.json`) doivent être gérées manuellement par le code.
*   **Performance des Requêtes :** La recherche, le filtrage ou le tri des données nécessitent de parcourir manuellement les listes en mémoire, ce qui est inefficace pour de grands ensembles de données.
*   **Sécurité :** Les données sensibles (comme les mots de passe) sont stockées en clair dans les fichiers, ce qui est inacceptable pour une application réelle.
*   **Transactions :** Pas de support pour les transactions atomiques, ce qui signifie qu'une série d'opérations ne peut pas être garantie comme étant entièrement réussie ou entièrement annulée en cas d'échec.

**Recommandation pour la Production :**

Pour une application réelle, il serait impératif de migrer vers un SGBD approprié, tel que :
*   **Bases de données relationnelles :** PostgreSQL, MySQL (pour une structure de données bien définie et des relations complexes).
*   **Bases de données NoSQL :** MongoDB, Cassandra (pour une flexibilité de schéma et une scalabilité horizontale).

Cette migration impliquerait de réécrire la couche d'accès aux données du backend pour interagir avec le SGBD choisi.
