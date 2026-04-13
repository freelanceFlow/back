# FreelanceFlow — Backend API

DOC POSTMAN : https://documenter.getpostman.com/view/24740089/2sBXitDo3R


API REST pour la gestion d'activité freelance : clients, prestations, factures et génération de PDF.

## Stack technique

- **Runtime** : Node.js >= 18
- **Framework** : Express
- **ORM** : Sequelize (PostgreSQL)
- **Auth** : JWT (bcrypt + jsonwebtoken)
- **PDF** : PDFKit
- **Tests** : Jest + Supertest
- **Qualité** : ESLint, Prettier, Husky, lint-staged
- **CI/CD** : GitHub Actions (lint, tests, build Docker, déploiement)

## Installation

```bash
# Cloner le dépôt
git clone <url-du-repo>
cd back

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs (DATABASE_URL, JWT_SECRET, etc.)
```

## Scripts disponibles

| Commande             | Description                          |
|----------------------|--------------------------------------|
| `npm start`          | Lancer le serveur en production      |
| `npm run dev`        | Lancer avec nodemon (hot reload)     |
| `npm test`           | Lancer les tests avec couverture     |
| `npm run test:watch` | Tests en mode watch                  |
| `npm run lint`       | Vérifier le code avec ESLint         |
| `npm run lint:fix`   | Corriger automatiquement le linting  |
| `npm run format`     | Formater le code avec Prettier       |
| `npm run format:check` | Vérifier le formatage              |

## Variables d'environnement

| Variable       | Description                        | Défaut        |
|----------------|------------------------------------|---------------|
| `PORT`         | Port du serveur                    | `3000`        |
| `NODE_ENV`     | Environnement (development/production) | `development` |
| `DATABASE_URL` | URL de connexion PostgreSQL        | —             |
| `JWT_SECRET`   | Clé secrète pour les tokens JWT    | —             |
| `JWT_EXPIRES_IN` | Durée de validité des tokens     | `24h`         |

## Endpoints API

### Authentification

| Action             | Méthode | Route               | Accès    |
|--------------------|---------|----------------------|----------|
| Créer un compte    | POST    | `/api/auth/register` | publique |
| Se connecter       | POST    | `/api/auth/login`    | publique |
| Profil connecté    | GET     | `/api/auth/me`       | protégée |

### Clients

| Action             | Méthode | Route               | Accès    |
|--------------------|---------|----------------------|----------|
| Lister les clients | GET     | `/api/clients`       | protégée |
| Créer un client    | POST    | `/api/clients`       | protégée |
| Consulter un client| GET     | `/api/clients/:id`   | protégée |
| Modifier un client | PUT     | `/api/clients/:id`   | protégée |
| Supprimer un client| DELETE  | `/api/clients/:id`   | protégée |

### Prestations

| Action                 | Méthode | Route               | Accès    |
|------------------------|---------|----------------------|----------|
| Lister les prestations | GET     | `/api/services`      | protégée |
| Créer une prestation   | POST    | `/api/services`      | protégée |
| Modifier une prestation| PUT     | `/api/services/:id`  | protégée |
| Supprimer une prestation| DELETE | `/api/services/:id`  | protégée |

### Factures

| Action                  | Méthode | Route                     | Accès    |
|-------------------------|---------|---------------------------|----------|
| Lister les factures     | GET     | `/api/invoices`           | protégée |
| Créer une facture       | POST    | `/api/invoices`           | protégée |
| Consulter une facture   | GET     | `/api/invoices/:id`       | protégée |
| Modifier une facture    | PUT     | `/api/invoices/:id`       | protégée |
| Supprimer une facture   | DELETE  | `/api/invoices/:id`       | protégée |
| Télécharger le PDF      | GET     | `/api/invoices/:id/pdf`   | protégée |

### Santé

| Action       | Méthode | Route     | Accès    |
|--------------|---------|-----------|----------|
| Health check | GET     | `/health` | publique |

## Docker

```bash
# Build
docker build -t freelanceflow-back .

# Run
docker run -p 3000:3000 --env-file .env freelanceflow-back
```

## Structure du projet

```
├── src/
│   ├── __tests__/        # Tests unitaires et d'intégration
│   ├── config/           # Configuration (base de données)
│   ├── controllers/      # Logique des contrôleurs
│   ├── middlewares/       # Middlewares (auth JWT, etc.)
│   ├── models/           # Modèles Sequelize
│   ├── routes/           # Définition des routes
│   ├── services/         # Logique métier
│   └── app.js            # Configuration Express
├── migrations/           # Migrations Sequelize
├── seeders/              # Seeds de données
├── .github/workflows/    # Pipelines CI/CD
├── server.js             # Point d'entrée
├── Dockerfile            # Image Docker
└── package.json
```

## CI/CD

Le pipeline GitHub Actions exécute sur chaque pull request :

1. **Lint & Format** — ESLint + Prettier
2. **Tests** — Jest avec couverture de code
3. **Docker Build** — Vérification du build de l'image
