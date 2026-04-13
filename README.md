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
