# back

Créer un compte	POST /api/auth/register	publique
Se loguer	POST /api/auth/login	publique
Profil connecté	GET /api/auth/me	protégée
Lister les clients	GET /api/clients	protégée
Créer un client	POST /api/clients	protégée
Modifier un client	PUT /api/clients/:id	protégée
Supprimer un client	DELETE /api/clients/:id	protégée
Consulter un client	GET /api/clients/:id	protégée
Lister les prestations	GET /api/services	protégée
Créer une prestation	POST /api/services	protégée
Modifier une prestation	PUT /api/services/:id	protégée
Supprimer une prestation	DELETE /api/services/:id	protégée
Lister les factures	GET /api/invoices	protégée
Créer une facture	POST /api/invoices	protégée
Modifier une facture	PUT /api/invoices/:id	protégée
Supprimer une facture	DELETE /api/invoices/:id	protégée
Consulter une facture	GET /api/invoices/:id	protégée
Générer/télécharger PDF	GET /api/invoices/:id/pdf	protégée

## Tests de charge (k6)

### Prérequis

- [k6](https://k6.io/docs/get-started/installation/) installé (`brew install k6` sur Mac)
- API démarrée localement (`node server.js`)
- Données de test présentes en base (voir ci-dessous)

### Initialiser les données de test

Ce script crée 10 utilisateurs de test avec clients, services et factures en base.
À exécuter une seule fois avant de lancer les tests :

```bash
node tests/loads/seed.js
```

Pour nettoyer les données de test :

```bash
node tests/loads/seed.js --clean
```

### Lancer les tests

```bash
# Smoke test — 2 VUs, 1 minute (vérification rapide)
k6 run --env PROFILE=smoke --env BASE_URL=http://localhost:3000 tests/loads/main.js

# Load test — montée à 30 VUs sur 8 minutes (charge normale)
k6 run --env PROFILE=load --env BASE_URL=http://localhost:3000 tests/loads/main.js

# Stress test — montée à 80 VUs (recherche du point de rupture)
k6 run --env PROFILE=stress --env BASE_URL=http://localhost:3000 tests/loads/main.js

# Tester un scénario isolément
k6 run --env BASE_URL=http://localhost:3000 tests/loads/scenarios/auth.js
k6 run --env BASE_URL=http://localhost:3000 tests/loads/scenarios/invoices.js
```

### Scénarios couverts

| Scénario | Routes testées |
|---|---|
| `auth` | `POST /api/auth/login`, `POST /api/auth/register` |
| `invoices` | `GET /api/invoices`, `GET /api/invoices/:id/pdf` |

### Thresholds (seuils d'acceptation)

| Métrique | Seuil |
|---|---|
| `p(95)` global | < 500ms |
| `p(95)` routes auth | < 2000ms (bcrypt) |
| `p(95)` génération PDF | < 5000ms |
| Taux d'erreur | < 1% |

Si un seuil est dépassé, k6 termine avec un code d'erreur non nul (la pipeline CI échoue).

### Intégration CI/CD

Le smoke test s'exécute automatiquement à chaque Pull Request vers `develop` ou `main` via le workflow `.github/workflows/load-test.yml`.
