# CLAUDE.md — Site Internet Solutions Électroniques Automobile

## 🎯 Vision du projet

Site B2B complet pour une entreprise proposant des **solutions électroniques et logicielles pour l'industrie automobile**. Le site s'adresse aux OEM, constructeurs, équipementiers Tier 1/2, consultants et manufacturers.

**Objectifs principaux :**
- Générer des leads qualifiés (formulaire contact / RFQ)
- Permettre le téléchargement de logiciels via un espace client privé
- Présenter l'offre technique (logiciels embarqués, outils d'ingénierie, hardware)
- Projeter une image d'innovation technologique de pointe

---

## 🏗️ Stack technique

| Couche | Technologie | Notes |
|--------|-------------|-------|
| Framework | **Next.js 14+ (App Router)** | TypeScript strict |
| CMS | **Payload CMS 3.x** | Intégré dans Next.js, gère la DB via Drizzle |
| Base de données | **PostgreSQL** | Géré par Payload, pas d'ORM séparé |
| CSS | **Tailwind CSS 3.x** | Dark mode natif via classe `dark:` |
| Animations | **GSAP** (scroll, timelines) + **Framer Motion** (transitions React) + **Lenis** (smooth scroll) | Toutes gratuites — objectif : effet Apple |
| i18n | **next-intl** (UI/routing) + **Payload i18n** (contenu) | 3 langues : FR, EN, DE |
| Auth | **Custom email/password** | Géré via Payload auth (built-in) |
| Linting | **Biome** | Remplace ESLint + Prettier, ultra-rapide |
| Package manager | **pnpm** |  |
| Hébergement | **VPS** (Hetzner/Scaleway/OVH) + Docker |  |

---

## 🎨 Direction artistique

### Thème & couleurs

Le site est **dark mode first**, inspiré du design Apple : minimaliste, premium, animations fluides.

```
Couleurs principales :
- Background :       #0A0A0F (presque noir, teinte bleutée)
- Background alt :   #12121A (sections alternées)
- Surface :          #1A1A2E (cartes, éléments surélevés)
- Accent primaire :  #0A84FF (bleu électrique — CTA, liens, hover)
- Accent secondaire: #30D5C8 (cyan tech — badges, highlights)
- Texte principal :  #F5F5F7 (blanc cassé Apple)
- Texte secondaire : #8E8E93 (gris moyen)
- Bordures :         #2C2C3E (séparateurs subtils)
- Succès :           #30D158
- Erreur :           #FF453A
```

### Typographie

- **Titres** : Inter (ou Geist) — bold, grandes tailles, letter-spacing serré
- **Corps** : Inter — regular 16px, line-height 1.6
- **Code/technique** : JetBrains Mono

### Principes de design

- Grands espaces négatifs (sombres)
- Sections full-width avec max-width 1280px pour le contenu
- Grille 12 colonnes
- Bordures subtiles `border-white/5` plutôt que des ombres
- Glassmorphism léger sur les cartes (backdrop-blur)
- Gradients subtils pour les fonds de section
- Hover states avec glow effect sur les CTA
- Pas d'emojis dans le contenu visible du site

### Animations (effet Apple)

- **Lenis** : smooth scroll global, lerp 0.1
- **GSAP ScrollTrigger** : fade-in + translate-y au scroll, pin sections pour storytelling
- **Framer Motion** : transitions de page, hover states, layout animations
- Toutes les animations : `duration 0.6-1.2s`, `ease: [0.25, 0.1, 0.25, 1]` (cubic-bezier Apple)
- **Aucune animation au-dessus du fold** (performance First Contentful Paint)
- `prefers-reduced-motion` : désactiver toutes les animations

---

## 📁 Structure du projet

```
/
├── src/
│   ├── app/
│   │   ├── (frontend)/           # Routes publiques du site
│   │   │   ├── [locale]/         # Routing i18n (fr, en, de)
│   │   │   │   ├── page.tsx              # Accueil / Hero
│   │   │   │   ├── solutions/
│   │   │   │   │   ├── page.tsx          # Liste des solutions
│   │   │   │   │   └── [slug]/page.tsx   # Fiche produit détaillée
│   │   │   │   ├── about/page.tsx        # Entreprise, équipe, certifications
│   │   │   │   ├── contact/page.tsx      # Formulaire RFQ / contact
│   │   │   │   └── client/              # Espace client (protégé)
│   │   │   │       ├── page.tsx          # Dashboard client
│   │   │   │       ├── downloads/page.tsx # Téléchargements logiciels
│   │   │   │       └── login/page.tsx    # Connexion
│   │   │   └── layout.tsx
│   │   ├── (payload)/            # Admin Payload CMS
│   │   │   └── admin/[[...segments]]/page.tsx
│   │   └── api/                  # API routes
│   │       └── [...payload]/route.ts
│   ├── collections/              # Collections Payload CMS
│   │   ├── Solutions.ts          # Fiches produits / solutions
│   │   ├── Users.ts              # Utilisateurs (admin + clients)
│   │   ├── Downloads.ts          # Fichiers téléchargeables
│   │   ├── ContactRequests.ts    # Demandes de contact / RFQ
│   │   └── Media.ts              # Images et fichiers
│   ├── components/
│   │   ├── ui/                   # Composants UI réutilisables (Button, Card, Input...)
│   │   ├── layout/               # Header, Footer, Navigation, LanguageSwitcher
│   │   ├── sections/             # Sections de page (Hero, Features, CTA...)
│   │   └── animations/           # Wrappers d'animation (ScrollReveal, ParallaxSection...)
│   ├── lib/
│   │   ├── animations.ts         # Config GSAP, Lenis, variants Framer Motion
│   │   ├── utils.ts              # Helpers (cn, formatDate...)
│   │   └── payload.ts            # Client Payload pour les queries
│   ├── i18n/
│   │   ├── routing.ts            # Config next-intl routing
│   │   └── request.ts            # Config next-intl request
│   ├── messages/                 # Traductions UI (next-intl)
│   │   ├── fr.json
│   │   ├── en.json
│   │   └── de.json
│   └── styles/
│       └── globals.css           # Tailwind imports + variables CSS custom
├── public/
│   ├── fonts/                    # Inter, JetBrains Mono (self-hosted)
│   └── images/
├── payload.config.ts             # Config Payload CMS
├── tailwind.config.ts
├── next.config.mjs
├── biome.json
├── docker-compose.yml            # Next.js + PostgreSQL
├── Dockerfile
└── package.json
```

---

## 📄 Pages du site

### 1. Accueil (`/[locale]`)
- Hero full-screen dark avec headline animée (GSAP text reveal)
- Proposition de valeur en 3 piliers (logiciel embarqué, outils ingénierie, hardware)
- Section "Trusted by" avec logos clients/partenaires (carrousel subtil)
- Section solutions avec cards hover 3D (perspective transform CSS)
- Chiffres clés animés (count-up au scroll)
- CTA final vers contact

### 2. Solutions (`/[locale]/solutions`)
- Grille filtrable par catégorie : Logiciel embarqué | Outils d'ingénierie | Hardware
- Chaque card : image, titre, description courte, tags techniques
- Lien vers fiche détaillée

### 3. Fiche solution (`/[locale]/solutions/[slug]`)
- Hero produit avec visuel plein écran
- Spécifications techniques en tableau
- Fonctionnalités clés (icônes + texte)
- Compatibilités, certifications
- Téléchargement datasheet (PDF, public ou protégé)
- CTA "Demander un devis" et "Télécharger le logiciel" (redirige vers espace client)

### 4. About (`/[locale]/about`)
- Histoire et mission de l'entreprise
- Équipe (photos + rôles)
- Certifications et normes (ASPICE, ISO 26262, etc.)
- Partenaires et clients

### 5. Contact / RFQ (`/[locale]/contact`)
- Formulaire intelligent :
  - Type de demande (devis, information, partenariat, support)
  - Champs contextuels selon le type
  - Upload de cahier des charges
  - Sélection de solutions concernées
- Informations de contact (email, téléphone, adresse)
- Carte interactive (optionnel)

### 6. Espace client (`/[locale]/client`)
- **Login** : email/password, page de connexion dark mode
- **Dashboard** : aperçu des téléchargements récents, notifications
- **Downloads** : liste des logiciels disponibles, gestion des versions, bouton télécharger
- **Protégé** : middleware Next.js pour vérifier l'auth, redirect si non connecté

---

## 🗄️ Collections Payload CMS

### Solutions
```typescript
{
  slug: 'solutions',
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'category', type: 'select', options: ['embedded-software', 'engineering-tools', 'hardware'] },
    { name: 'description', type: 'richText', localized: true },
    { name: 'specifications', type: 'array', fields: [
      { name: 'label', type: 'text', localized: true },
      { name: 'value', type: 'text', localized: true },
    ]},
    { name: 'features', type: 'array', localized: true, fields: [
      { name: 'icon', type: 'text' },
      { name: 'title', type: 'text', localized: true },
      { name: 'description', type: 'text', localized: true },
    ]},
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'datasheet', type: 'upload', relationTo: 'media' },
    { name: 'certifications', type: 'array', fields: [{ name: 'name', type: 'text' }] },
    { name: 'published', type: 'checkbox', defaultValue: false },
  ],
}
```

### Users (Payload built-in, étendu)
```typescript
{
  slug: 'users',
  auth: true, // Payload gère l'auth
  fields: [
    { name: 'role', type: 'select', options: ['admin', 'client'], defaultValue: 'client' },
    { name: 'company', type: 'text' },
    { name: 'phone', type: 'text' },
  ],
}
```

### Downloads
```typescript
{
  slug: 'downloads',
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    { name: 'version', type: 'text', required: true },
    { name: 'file', type: 'upload', relationTo: 'media' },
    { name: 'solution', type: 'relationship', relationTo: 'solutions' },
    { name: 'changelog', type: 'richText', localized: true },
    { name: 'releaseDate', type: 'date' },
  ],
  access: { read: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'client' },
}
```

### ContactRequests
```typescript
{
  slug: 'contact-requests',
  fields: [
    { name: 'type', type: 'select', options: ['quote', 'info', 'partnership', 'support'] },
    { name: 'firstName', type: 'text', required: true },
    { name: 'lastName', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'company', type: 'text' },
    { name: 'message', type: 'textarea', required: true },
    { name: 'solutions', type: 'relationship', relationTo: 'solutions', hasMany: true },
    { name: 'attachment', type: 'upload', relationTo: 'media' },
    { name: 'status', type: 'select', options: ['new', 'in-progress', 'closed'], defaultValue: 'new' },
  ],
}
```

---

## 🔐 Authentification

- Utiliser le **système auth intégré de Payload CMS**
- Rôles : `admin` (accès CMS + tout) et `client` (accès espace téléchargement)
- Login custom via page Next.js (pas l'admin Payload)
- Session via cookies HTTP-only
- Middleware Next.js sur `/[locale]/client/*` pour protéger les routes
- Page login : `/[locale]/client/login`

---

## 🌐 Internationalisation

- **Langues** : `fr` (défaut), `en`, `de`
- **Routing** : `/fr/solutions`, `/en/solutions`, `/de/solutions`
- **next-intl** pour : navigation, composants UI, labels, messages d'erreur, métadonnées SEO
- **Payload i18n** pour : contenu des fiches produits, descriptions, spécifications
- Détection automatique de la langue navigateur avec fallback `fr`
- Sélecteur de langue visible dans le header (drapeaux ou codes FR/EN/DE)
- Balises `hreflang` sur toutes les pages pour le SEO

---

## 🚀 Environnement de développement & déploiement

### Développement local (priorité)

- **OS** : Windows (chemin projet : `C:\Users\Auke\Documents\aelabs`)
- **GitHub** : `Sudo-auke`
- **Repo** : `aelabs` (à créer ou existant)
- Le site doit tourner en **localhost** d'abord, le VPS viendra plus tard
- **Docker Compose** local avec 2 services :
  - `app` : Next.js + Payload (Node.js 20)
  - `db` : PostgreSQL 16
- Commande de dev : `pnpm dev` (Next.js + Payload en un seul process)
- Seed de données : prévoir un script `pnpm seed` pour peupler la DB avec du contenu de démo

### Production (plus tard)
- VPS (Hetzner/Scaleway/OVH), minimum 2 vCPU / 4GB RAM
- Reverse proxy : **Caddy** (auto-SSL via Let's Encrypt)
- Même Docker Compose que local avec variables d'environnement adaptées
- Variables d'environnement :
  ```
  DATABASE_URL=postgresql://user:pass@db:5432/site
  PAYLOAD_SECRET=<random-64-chars>
  NEXT_PUBLIC_SITE_URL=https://yourdomain.com
  NEXT_PUBLIC_DEFAULT_LOCALE=fr
  ```

---

## 📏 Conventions de code

### Général
- **TypeScript strict** : `strict: true`, pas de `any`
- **Biome** pour lint + format (exécuter avant chaque commit)
- Nommage : `PascalCase` composants, `camelCase` fonctions/variables, `kebab-case` fichiers
- Un composant par fichier
- Imports absolus via `@/` (alias `src/`)

### Composants React
- Functional components uniquement (pas de classes)
- Props typées via `interface` (pas `type` pour les props)
- Utiliser `cn()` (clsx + tailwind-merge) pour les classes conditionnelles
- Server Components par défaut, `"use client"` uniquement si nécessaire
- Pas de `useEffect` pour le data fetching (utiliser Server Components ou Payload queries)

### Tailwind
- Dark mode : toujours appliquer, c'est le thème par défaut (pas de toggle light/dark)
- Utiliser les couleurs custom définies dans `tailwind.config.ts` (pas de hex en dur)
- Responsive : mobile-first (`sm:`, `md:`, `lg:`, `xl:`)
- Max-width conteneur : `max-w-7xl` (1280px)

### Animations
- GSAP : initialiser dans `useEffect` avec cleanup `return () => ctx.revert()`
- GSAP ScrollTrigger : toujours `scrub: true` ou `scrub: 0.5` pour le smooth
- Framer Motion : utiliser des `variants` réutilisables depuis `lib/animations.ts`
- Lenis : initialiser une seule fois dans le layout racine
- Toujours respecter `prefers-reduced-motion`

### Git
- **GitHub** : organisation/compte `Sudo-auke`
- Branches : `feature/nom`, `fix/nom`, `refactor/nom`
- Commits conventionnels : `feat:`, `fix:`, `refactor:`, `docs:`, `style:`, `chore:`

### Pas de tests
- Pas de tests unitaires ni E2E pour le moment
- Ne pas installer Vitest, Jest, Playwright ou tout framework de test
- On ajoutera les tests plus tard si besoin

---

## ⚠️ Règles importantes pour Claude Code

1. **Ne jamais installer de dépendance sans que ce soit listé dans ce document** — demander confirmation
2. **Dark mode est le SEUL thème** — pas de toggle light/dark, tout est dark
3. **Toujours localiser le contenu visible** — aucun texte en dur dans les composants, tout passe par `next-intl` ou Payload
4. **Server Components par défaut** — `"use client"` uniquement pour interactivité (formulaires, animations, state)
5. **Pas de console.log en production** — utiliser un logger structuré si besoin
6. **Accessibilité** : aria-labels, focus states visibles, contraste suffisant sur dark mode
7. **Performance** : images en WebP/AVIF via next/image, lazy loading, code splitting automatique
8. **SEO** : metadata sur chaque page, sitemap.xml, robots.txt, données structurées (JSON-LD)
9. **Sécurité** : sanitiser tous les inputs, CSRF sur les formulaires, rate limiting sur les API
10. **Responsive** : le site doit être parfait de 375px (mobile) à 2560px (ultra-wide)
