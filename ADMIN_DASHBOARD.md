# Dashboard Admin YassAuto - Documentation

## 📊 Vue d'ensemble

Un tableau de bord sécurisé pour gérer vos réservations en temps réel. Accès simple par mot de passe, responsive sur mobile.

## 🚀 Accès

- **URL locale (dev)**: `http://localhost:5173/#/admin`
- **URL production (IONOS)**: `https://your-domain.com/#/admin`

## 🔐 Authentification

### Mot de passe par défaut
```
YassAuto2025
```

**IMPORTANT POUR LA PRODUCTION :**
1. Avant le déploiement, change le mot de passe dans `pages/AdminDashboard.tsx` (ligne 12):
```typescript
const ADMIN_PASSWORD = 'YassAuto2025'; // ← À remplacer
```

2. Utilise une variable d'environnement en production :
```typescript
const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || 'default-password';
```

3. Configure la variable dans `.env.production` ou dans les variables du serveur:
```
REACT_APP_ADMIN_PASSWORD=VotreMotDePasseSecurisé2025
```

## ✨ Fonctionnalités

### 1. **Vue Liste des Réservations**
Tableau avec colonnes:
- **Date RDV** — Date du rendez-vous
- **Heure** — Heure du rendez-vous
- **Client** — Nom du client
- **Contact** — Téléphone (cliquable `tel:`) et email (cliquable `mailto:`)
- **Type** — Accompagnement Achat ou Devis Mécanique
- **Statut** — Badge coloré (En attente/Confirmée/Annulée)
- **Actions** — Bouton "Détails"

### 2. **Filtres et Tri**
- **Statut** : Tous / En attente / Confirmées / Annulées
- **Période** :
  - Toutes les dates
  - Aujourd'hui
  - Cette semaine
  - Ce mois
  - Plage personnalisée (du / au)
- **Tri** : Plus proche d'abord / Plus lointain d'abord

### 3. **Vue Détail d'une Réservation**
Clic sur "Détails" → modale avec:
- ID réservation (copie facile)
- Dates de création et confirmation
- Informations complètes du client
- Détails du rendez-vous
- Description du véhicule
- Montant de l'acompte et solde estimé
- **Actions rapides** :
  - Appeler (ouverture `tel:`)
  - Envoyer email (ouverture `mailto:`)
  - Marquer comme confirmée
  - Annuler

### 4. **Statistiques Rapides**
Cards affichant:
- Total réservations (tous statuts)
- Nombre de réservations confirmées
- Nombre en attente

## 🔌 API Backend

Trois routes utilisées par le dashboard:

### GET `/api/reservations`
**Paramètres (optionnels)**:
```
?status=pending                    # Filter by status
?dateFrom=2025-12-01              # Filter from date
?dateTo=2025-12-31                # Filter to date
?sortBy=bookingDate               # 'bookingDate' or 'createdAt'
?sortOrder=asc                    # 'asc' or 'desc'
```

**Réponse** : Array de réservations
```json
[
  {
    "id": "1764627176141-6819",
    "status": "confirmed",
    "amount_cents": 2000,
    "currency": "eur",
    "createdAt": "2025-12-01T22:12:56.141Z",
    "confirmedAt": "2025-12-01T22:30:00.000Z",
    "form": {
      "clientName": "John Doe",
      "clientEmail": "john@example.com",
      "clientPhone": "0612345678",
      "bookingDate": "2025-12-15",
      "bookingTime": "14:00",
      "bookingType": "accompagnement",
      "description": "Véhicule: Mercedes C-Class | Ville: Paris | ..."
    }
  }
]
```

### PATCH `/api/reservations/:id`
**Body**:
```json
{
  "status": "confirmed"  // ou "cancelled"
}
```

**Réponse** : Réservation mise à jour

## 📱 Responsive Design

Le dashboard s'adapte automatiquement:
- **Desktop** : Tableau multi-colonnes
- **Tablette** : Colonnes ajustées, scroll horizontal
- **Mobile** : Modale fullscreen pour les détails

## 🛠️ Configuration pour la Production (IONOS)

### 1. **Mot de passe admin**
Mets à jour dans `.env.production`:
```
REACT_APP_ADMIN_PASSWORD=UnMotDePasseComplexe2025
```

Ou code-en-dur dans `pages/AdminDashboard.tsx` avant le déploiement.

### 2. **URL du backend**
Le dashboard appelle `http://localhost:4000/api/reservations` en dev. En production, tu peux utiliser une variable:

**Optionnel** - Modifier `pages/AdminDashboard.tsx`:
```typescript
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000';

// Dans fetchReservations():
const response = await fetch(`${API_BASE}/api/reservations?${params.toString()}`);
```

Configurer dans `.env.production`:
```
REACT_APP_API_URL=https://your-domain.com
```

### 3. **HTTPS / SSL**
Le dashboard stocke l'authentification en localStorage. En production, utilise HTTPS pour protéger la transmission.

### 4. **Déploiement**
```bash
# Build the frontend with the admin dashboard
npm run build

# Deploy the dist/ folder to your web server (Nginx)
# The dashboard will be accessible at /index.html#/admin
```

## 📝 Notes pour les mises à jour futures (Phase 2)

- **Stats avancées** : Graphiques CA, taux de conversion
- **Export CSV** : Exporter les réservations filtrées
- **Email rappel** : Envoyer un email 24h avant le RDV
- **Notifications push** : Alerter sur nouveau RDV
- **Sauvegardes** : Basculer vers une vraie base de données (SQLite, PostgreSQL)

## 🆘 Troubleshooting

### Le dashboard affiche "Erreur lors du chargement"
- Vérifie que le backend est en cours d'exécution: `node server/index.js`
- Vérifie que le CORS est activé dans `server/index.js` (déjà fait ✅)
- Vérifie l'URL du backend (localhost:4000 en dev, domaine en prod)

### Les mails ne s'envoient pas depuis le dashboard
**Note** : Le dashboard affiche les réservations et permet de changer leur statut. L'envoi d'emails est déclenché par le webhook Stripe (automatique une fois confirmé).

Pour ajouter un bouton "Envoyer rappel" en Phase 2, créer une route:
```javascript
POST /api/send-reminder/:reservationId
```

### Mot de passe oublié
Réinitialise en modifiant la valeur dans `pages/AdminDashboard.tsx` ou redéploie avec une nouvelle variable d'environnement.

---

**Dernier mise à jour** : Décembre 2025
