# Propulse

Une application moderne de suivi et de gestion de candidatures professionnelles.

## 📋 Description

Propulse est une plateforme complète conçue pour simplifier et optimiser la gestion de vos candidatures professionnelles. L'application offre une interface intuitive avec plusieurs vues et fonctionnalités pour suivre vos opportunités de carrière.

## ✨ Fonctionnalités principales

- **📊 Tableau Kanban** - Visualisez et gérez vos candidatures par étapes (À postuler, En cours, Entretiens, Offres)
- **📅 Calendrier** - Planifiez et suivez vos entretiens et événements importants
- **✅ Actions quotidiennes** - Organisez vos tâches quotidiennes liées aux candidatures
- **📄 Gestion de documents** - Centralisez vos CV, lettres de motivation et autres documents
- **📈 Analyses et statistiques** - Suivez vos progrès avec des rapports détaillés et des insights
- **📝 Modèles** - Utilisez des modèles prédéfinis pour accélérer vos candidatures
- **🔔 Notifications** - Recevez des rappels pour ne manquer aucune opportunité
- **⚙️ Paramètres personnalisables** - Adaptez l'application à vos besoins (thème, objectifs, notifications)

## 🛠 Technologies utilisées

### Frontend
- **Next.js 15** - Framework React avec App Router
- **React 19** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utility-first
- **Radix UI** - Composants UI accessibles
- **Lucide React** - Icônes

### Backend & Base de données
- **Supabase** - Backend as a Service (authentification, base de données, storage)
- **PostgreSQL** - Base de données relationnelle

### Outils de développement
- **React Hook Form** - Gestion de formulaires
- **Zod** - Validation de schémas
- **DnD Kit** - Fonctionnalité drag-and-drop
- **ESLint** - Linting du code

## 🚀 Installation

### Prérequis

- Node.js 20.x ou supérieur
- npm, yarn, pnpm ou bun
- Un compte Supabase

### Configuration

1. **Cloner le dépôt**
```bash
git clone <url-du-repo>
cd propulse
```

2. **Installer les dépendances**
```bash
cd client
npm install
```

3. **Configurer les variables d'environnement**

Créez un fichier `.env.local` dans le dossier `client` :

```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_supabase
```

4. **Lancer le serveur de développement**
```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📁 Structure du projet

```
/workspace
├── client/                  # Application frontend
│   ├── src/
│   │   ├── app/            # Pages et routes Next.js (App Router)
│   │   │   ├── (auth)/     # Routes protégées
│   │   │   │   └── dashboard/
│   │   │   ├── api/        # Routes API
│   │   │   └── auth/       # Pages d'authentification
│   │   ├── components/     # Composants React
│   │   │   ├── dashboard/  # Composants du tableau de bord
│   │   │   ├── ui/         # Composants UI réutilisables
│   │   │   ├── design-system/
│   │   │   └── landing-page/
│   │   ├── contexts/       # Contextes React
│   │   ├── hooks/          # Hooks personnalisés
│   │   └── lib/            # Utilitaires et configuration
│   ├── public/             # Assets statiques
│   └── package.json
└── README.md
```

## 🎨 Vues principales

### Dashboard
Le tableau de bord principal offre plusieurs vues :
- **Kanban** - Gestion visuelle des candidatures
- **Calendrier** - Vue des événements et entretiens
- **Actions quotidiennes** - Liste des tâches du jour
- **Documents** - Gestionnaire de fichiers
- **Analyses** - Statistiques et insights
- **Modèles** - Bibliothèque de modèles

## 🔐 Authentification

L'application utilise Supabase Auth pour gérer :
- Inscription et connexion
- Réinitialisation de mot de passe
- Sessions sécurisées
- Protection des routes

## 🚢 Déploiement

### Vercel (recommandé)

L'application est optimisée pour le déploiement sur Vercel :

```bash
cd client
npm run build
```

Suivez la [documentation Vercel](https://vercel.com/docs) pour déployer votre application.

### Variables d'environnement de production

Assurez-vous de configurer les variables d'environnement suivantes :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📝 Scripts disponibles

```bash
# Développement avec Turbopack
npm run dev

# Build de production
npm run build

# Démarrer en production
npm run start

# Linter
npm run lint
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

Ce projet est privé.

## 📧 Contact

Pour toute question ou suggestion, n'hésitez pas à nous contacter.
