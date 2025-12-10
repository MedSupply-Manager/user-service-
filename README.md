whyMedSupply Manager - Service Utilisateur
MedSupply Manager - User Service est un service backend pour la gestion des utilisateurs dans le système MedSupply. Il gère l'inscription, l'authentification et les rôles des utilisateurs (Admin, Fournisseur, Pharmacies, Hôpitaux), ainsi que l'accès basé sur les permissions pour sécuriser les actions sensibles (produits sensibles, commandes, gestion des fournisseurs, etc.).

Ce service est conçu sur l'authentification, l'autorisation, et la qualité du code.

 Sprint 1 - Fonctionnalités Réalisées
 Inscription utilisateur avec validation des données
 Authentification JWT
 Hachage des mots de passe avec bcrypt
 Rate limiting 
 Intégration MongoDB pour la persistance des données
 Tests automatisés avec Jest et Supertest
 Pipeline CI/CD avec GitHub Actions
 Analyse de qualité du code avec SonarQube

 Rôles et Use Cases
Le service gère plusieurs types d'utilisateurs :

1. Administrateur Système (admin)
Gérer tous les comptes et rôles
Supervision des fournisseurs et commandes
Accès complet au système
2. Admin Fournisseur (admin_fournisseur)
Passer des commandes auprès des fabricants
Suivre l'état des commandes
Gérer les informations des fournisseurs
3. Pharmacie Autorisée (pharmacie_autorisee)
Accès aux produits sensibles
Passer des commandes normales et sensibles
Consulter le catalogue et l'historique
4. Pharmacie Standard (pharmacie_standard)
Passer des commandes produits normaux uniquement
Consulter le catalogue et l'historique de commandes
5. Hôpital (hopital)
Gérer les commandes hospitalières
Accès aux produits médicaux spécialisés
Consulter le catalogue et l'historique
Chaque utilisateur doit s'authentifier via le service utilisateur avant d'accéder aux fonctionnalités.

Dépôt https://github.com/MedSupply-Manager/user-service-

 Structure du Projet
users/
├── .github/
│   └── workflows/
        └── build.yml           #GitHub Actions workflow for SonarQube scan
│       └── ci.yml              # Pipeline CI/CD
├── src/
│   ├── config/                 # Configuration (DB, JWT, etc.)
│   │   ├── db.js              # Connexion MongoDB
│   │   ├── jwt.js             # Utilitaires JWT
│   │   └── index.js           # Exports de configuration
│   ├── controllers/            # Contrôleurs de routes
│   │   └── userController.js  # Logique métier utilisateurs
│   ├── middlewares/            # Middlewares Express
│   │   ├── authMiddleware.js  # Vérification JWT
│   │   ├── errorMiddleware.js # Gestion des erreurs
│   │   ├── rateLimit.js       # Limitation de taux
│   │   └── roleMiddleware.js  # Vérification des rôles
│   ├── models/                 # Modèles Mongoose
│   │   ├── userModel.js       # Schéma utilisateur
│   │   └── sessionModel.js    # Schéma session
│   ├── routes/                 # Routes API
│   │   └── userRoutes.js      # Endpoints utilisateurs
│   ├── services/               # Logique métier
│   │   └── userService.js     # Services utilisateurs
│   ├── utils/                  # Fonctions utilitaires
│   │   └── logger.js          # Journalisation Winston
│   ├── validations/            # Validation des données
│   │   └── userValidation.js  # Schémas Joi
│   └── server.js               # Point d'entrée
├── Test/
│   └── users.test.js           # Tests Jest
├── logs/                       # Logs applicatifs
├── .env                        # Variables d'environnement
├── .gitignore                  # Fichiers ignorés par Git
├── jest.config.js              # Configuration Jest
├── package.json                # Dépendances npm
├── sonar-project.properties    # Configuration SonarCloud
└── README.md                   # Documentation
 Installation et Configuration
Prérequis
Node.js v18+ installé
MongoDB v6+ installé et en cours d'exécution
Git installé
1. Cloner le dépôt
bash
git clone https://github.com/MedSupply-Manager/user-service-.git
cd user-service-
2. Installer les dépendances
bash
npm install
3. Configurer les variables d'environnement
Créer un fichier .env à la racine du projet :

env
# Serveur
PORT=5001
NODE_ENV=development

# Frontend
FRONTEND_URL=http://localhost:5173

# MongoDB
MONGO_URI=mongodb://localhost:27017/users_db

# JWT Secrets (Générer des secrets sécurisés pour production)
JWT_ACCESS_SECRET=votre_secret_access_jwt_ici
JWT_REFRESH_SECRET=votre_secret_refresh_jwt_ici

# Configuration JWT
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# Sécurité
BCRYPT_ROUNDS=12
4. Démarrer MongoDB
bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
5. Lancer le serveur
bash
node server.js
Le serveur démarre sur : http://localhost:5001

 Tests
Exécuter les tests
bash
# Tous les tests
npm test
#test avec postman 
https://silmihadjer.postman.co/workspace/mma-project~619205f2-5832-49f8-a093-7034090113c1/request/45178617-a5cd2457-1c74-4d1f-9b63-96fd821aa178?action=share&creator=45178617&ctx=documentation
