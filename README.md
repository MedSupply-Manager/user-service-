MedSupply Manager - Service Utilisateur

   MedSupply Manager - User Service est un service backend pour la gestion des utilisateurs dans le système MedSupply.
Il gère l’inscription, l’authentification et les rôles des utilisateurs (Admin, Fournisseur, Médecins, Patients/Pharmacies), ainsi que l’accès basé sur les permissions pour sécuriser les actions sensibles (produits sensibles, commandes, gestion des fournisseurs, etc.).

Ce service est conçu pour le Sprint 0 de l’application, avec une attention particulière sur l’authentification et l’autorisation.

* Rôles et Use Case

Le service gère plusieurs types d’utilisateurs :

1.Administrateur Système

Gérer tous les comptes et rôles

Supervision des fournisseurs et commandes

2.Admin Fournisseur

Passer des commandes auprès des fabricants

Suivre l’état des commandes

Gérer les informations des fournisseurs

3.Client (Pharmacies / Hôpitaux)

Passer commandes produits normaux et sensibles (selon autorisation)

Consulter le catalogue et l’historique de commandes

4.Utilisateur standard

Gérer son profil et ses informations

Chaque utilisateur doit s’authentifier via le service utilisateur avant d’accéder aux fonctionnalités.

*Use Case principal :

(Inclure l’image du use case que tu as uploadée.)

Diagramme de séquence pour l’authentification et l'autorization 

Ce diagramme montre le processus d’authentification et les interactions entre l’utilisateur et le service utilisateur :

/ Structure du projet
src/
├─ config/          # Configuration de la base de données et variables d'environnement
├─ controllers/     # Gestion des requêtes et logique métier
├─ logs/            # Journaux d’activité
├─ middlewares/     # Authentification & autorisation
├─ models/          # Schémas de base de données
├─ routes/          # Points d’accès API
├─ services/        # Services internes
├─ utils/           # Fonctions utilitaires
├─ validations/     # Validation des entrées
server.js           # Point d’entrée de l’application
.env                # Variables d'environnement
package.json        # Dépendances et scripts

*Installation et configuration

Cloner le dépôt

git clone https://github.com/MedSupply-Manager/user-service-.git
cd MMAproject


Installer les dépendances

npm install


Créer le fichier .env
# Server
PORT=5001
NODE_ENV=development

# Frontend
FRONTEND_URL=http://localhost:5173

Démarrer le serveur

node server.js


Le service sera disponible à l’adresse : http://localhost:5001/api/users