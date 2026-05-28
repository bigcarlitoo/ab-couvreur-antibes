# AB Couvreur Antibes — Site V2

Next.js 15 (App Router) + Tailwind v4. Contenu éditorial localisé pour la Côte d'Azur, design moderne distinct du site Nice (palette coral + ink, Bricolage Grotesque).

## Architecture

- **Contenu** : tout vit dans `src/data.ts` (services, zones, réalisations, témoignages, FAQ, paramètres).
- **Composant unique** : `src/components/PublicSite.tsx` rend le site complet (home, service détail, zone détail, réalisations, contact).
- **Routes Next** : `src/app/(frontend)/...` — chaque route nourrit le même composant via `initialPath` et expose ses propres metadata SEO.
- **Pas de base de données runtime** côté visiteur : la persistance des leads passe **uniquement par email** (Resend).

## Démarrage local

```bash
cp .env.example .env
# Renseigner RESEND_API_KEY si vous voulez recevoir les emails de devis en local.
npm install
npm run dev
```

Site public : <http://127.0.0.1:3002>

## Lead form — comment ça marche

Le formulaire `/contact` POST vers `/api/leads`. La route :

1. Valide le payload (nom, téléphone plausible, email si fourni, RGPD)
2. Détecte les bots via un **honeypot invisible** (champ `website`)
3. Applique un **rate limit** par IP (5 envois / minute)
4. Envoie un **email HTML stylé** au business via **Resend** :
   - vers `LEAD_NOTIFICATION_EMAIL` (notification artisan)
   - vers le prospect (confirmation, en best-effort)
5. Retourne `{ ok: true }` ou un message d'erreur clair

**Pas de base de données.** L'email est la source de vérité, ce qui rend le site portable (Vercel, Netlify, OVH…) sans infra additionnelle.

## Variables d'environnement requises pour la production

| Variable | Obligatoire | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | ✅ | URL canonique du site une fois le domaine choisi par le client. Sert au sitemap, robots, Open Graph, schema. |
| `PAYLOAD_SECRET` | ✅ | Secret aléatoire (64 chars) — Payload refusera de démarrer sans. |
| `DATABASE_URI` | ✅ | Chaîne de connexion SQLite locale (ex. `file:./payload.db`). Utilisée uniquement par Payload pour le démarrage. Aucun lead n'y est écrit en production. |
| `RESEND_API_KEY` | ⚠️ Obligatoire en prod | Sans cette clé, les leads sont loggés mais aucun email n'est envoyé. |
| `LEAD_NOTIFICATION_EMAIL` | ⚠️ Obligatoire en prod | Adresse qui reçoit les notifications de devis (boîte du couvreur). À renseigner dès que le client communique son adresse. |
| `LEAD_FROM_EMAIL` | ⚠️ Obligatoire en prod | Adresse expéditrice, **doit être sur un domaine vérifié dans Resend**. |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | Optionnel | ID Microsoft Clarity pour activer heatmaps + session recording (consentement utilisateur requis). |

## Mise en route Resend (5 min, gratuit jusqu'à 3 000 emails/mois)

1. Créer un compte sur <https://resend.com>.
2. Aller dans **Domains** → **Add domain** → entrer le domaine du client.
3. Ajouter les enregistrements DNS (TXT, MX, DKIM) fournis chez votre registrar.
4. Une fois le domaine validé (statut "Verified"), créer une **API key** depuis **API Keys**.
5. Coller la clé dans `RESEND_API_KEY` chez votre hébergeur (Vercel : *Settings → Environment Variables*).
6. Régler `LEAD_FROM_EMAIL` sur `devis@<domaine-du-client>` (ou une autre adresse du domaine vérifié).
7. Régler `LEAD_NOTIFICATION_EMAIL` sur l'adresse personnelle du couvreur.
8. Tester le formulaire `/contact` — l'email arrive dans la boîte business sous quelques secondes.

> Tant que ces variables ne sont pas renseignées, le formulaire fonctionne mais aucun email n'est envoyé : les leads sont visibles dans les logs serveur uniquement. **Ne mettez jamais le site en production sans avoir vérifié l'envoi.**

## Sécurité du formulaire

- **Honeypot** (`website`) — invisible aux humains, attire les bots, qui sont silencieusement ignorés.
- **Rate limit** — max 5 envois/min/IP (in-memory). Pour un trafic élevé, brancher Upstash Redis ou Vercel KV.
- **Validation serveur** — chaque champ est vérifié côté API ; jamais de 500 leaké au visiteur.
- **Anti-CSRF** — la route n'accepte que des `POST` `Content-Type: application/json` ; les cookies de session ne sont pas utilisés.

## Analytics & heatmaps

Le site embarque une stack analytics **CNIL/RGPD-compliant** :

| Outil | Type | Consentement | Données |
| --- | --- | --- | --- |
| **Vercel Analytics** | Cookieless (toujours actif) | ❌ Non requis (CNIL-exempt) | Visites, pages vues, sources, pays, device, durée |
| **Vercel Speed Insights** | Cookieless (toujours actif) | ❌ Non requis | Core Web Vitals réels (LCP, INP, CLS) |
| **Microsoft Clarity** | Cookies, opt-in | ✅ Bandeau de consentement | Heatmaps, scroll maps, rage clicks, enregistrements de sessions anonymisés |

- **Vercel Analytics & Speed Insights** : automatiquement activés sur Vercel. Pour les voir, ouvrir l'onglet "Analytics" du dashboard Vercel après déploiement.
- **Microsoft Clarity** : créer un projet gratuit sur <https://clarity.microsoft.com>, copier l'ID du projet dans `NEXT_PUBLIC_CLARITY_PROJECT_ID`. Le script ne se charge qu'**après** consentement utilisateur via le bandeau.

Le bandeau de cookies est rendu par `src/components/CookieConsent.tsx`. L'utilisateur peut :
- **Tout accepter** → Clarity activé
- **Refuser** → seules les analytics cookieless tournent
- **Personnaliser** → toggle Clarity à la carte
- Modifier ses choix à tout moment depuis le pied de page (lien "Gérer mes cookies") ou la page `/confidentialite`.

La conformité CNIL est garantie par :
1. Analytics cookieless toujours actifs (exempts de consentement)
2. Clarity bloqué par défaut tant que l'utilisateur n'a pas accepté
3. Page `/confidentialite` listant clairement chaque traceur, sa finalité et sa durée de conservation
4. Option de retrait en un clic depuis le footer

## SEO

- `src/app/sitemap.ts` génère le sitemap.xml de toutes les routes
- `src/app/robots.ts` autorise les bots dont GPTBot, ClaudeBot, PerplexityBot
- Schema JSON-LD : `RoofingContractor`, `Service`, `LocalBusiness`, `FAQPage`
- Open Graph + Twitter Card configurés dans `layout.tsx`
- Meta géolocalisation (`geo.region`, `geo.position`) pour le SEO local

## Build production

```bash
npm run build
npm start
```

## Déploiement Vercel

```bash
vercel --prod
```

Ajouter les variables d'environnement dans le dashboard Vercel avant le premier déploiement.

## Admin Payload

Le panneau d'admin Payload reste disponible localement sur `/admin` pour visualiser les soumissions historiques (SQLite local). Il **n'est pas conçu pour un usage en production sans base de données persistante** — sur Vercel, le fichier `payload.db` est éphémère. Le site public est totalement indépendant du CMS : tout le contenu vit dans `src/data.ts`.
