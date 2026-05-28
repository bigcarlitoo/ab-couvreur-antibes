# AB Couvreur Antibes — Déploiement & opérations

## URLs

| Type | URL |
| --- | --- |
| Site en production | <https://ab-couvreur-antibes.vercel.app> |
| Dashboard Vercel | <https://vercel.com/carlnicolas-outlookfrs-projects/ab-couvreur-antibes> |
| Analytics (cookieless) | <https://vercel.com/carlnicolas-outlookfrs-projects/ab-couvreur-antibes/analytics> |
| Speed Insights (CWV) | <https://vercel.com/carlnicolas-outlookfrs-projects/ab-couvreur-antibes/speed-insights> |
| Repo GitHub | <https://github.com/bigcarlitoo/ab-couvreur-antibes> |

## Pipeline

```
git push origin main  →  GitHub  →  Vercel webhook  →  build  →  deploy production
```

Chaque push sur `main` déploie automatiquement. Pas besoin d'utiliser le CLI `vercel` après le setup initial.

## Variables d'environnement Vercel

Déjà configurées :

| Variable | Valeur |
| --- | --- |
| `PAYLOAD_SECRET` | secret aléatoire 24 hex |
| `DATABASE_URI` | `file:/tmp/payload.db` (SQLite éphémère, ne sert qu'à /admin) |
| `NEXT_PUBLIC_SITE_URL` | `https://ab-couvreur-antibes.vercel.app` |

À ajouter quand le client communique ses infos :

| Variable | Où l'obtenir |
| --- | --- |
| `RESEND_API_KEY` | <https://resend.com> → API Keys |
| `LEAD_NOTIFICATION_EMAIL` | adresse mail du couvreur (boîte de réception) |
| `LEAD_FROM_EMAIL` | adresse expéditrice sur domaine vérifié dans Resend |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | <https://clarity.microsoft.com> → ID projet (facultatif, pour heatmaps) |

Pour ajouter une variable :
1. <https://vercel.com/carlnicolas-outlookfrs-projects/ab-couvreur-antibes/settings/environment-variables>
2. Cliquer "Add Variable", sélectionner les 3 environnements (Production/Preview/Development).
3. Re-déployer (un nouveau push ou bouton "Redeploy" dans Deployments).

## Mise à jour du contenu

Tout le contenu visible vit dans `src/data.ts` (services, zones, réalisations, témoignages, FAQ, settings).

Pour modifier :
```bash
git pull
# Éditer src/data.ts
git add src/data.ts
git commit -m "Update content"
git push
```

Vercel détecte le push et redéploie en ~1 min.

## Domaine personnalisé

Quand le client a son domaine (ex. `ab-couvreur-sud.fr`) :

1. <https://vercel.com/carlnicolas-outlookfrs-projects/ab-couvreur-antibes/settings/domains>
2. Add Domain → entrer le domaine
3. Suivre les instructions DNS (CNAME ou A record)
4. Mettre à jour `NEXT_PUBLIC_SITE_URL` dans les env vars

## Sécurité

- Headers HTTP : `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` (configurés dans `vercel.json`)
- Cookies analytics : conformes CNIL/RGPD (cookieless), Clarity opt-in uniquement
- Lead form : honeypot anti-bot + rate limit 5/min/IP + validation serveur
- Aucune base de données externe = aucune surface d'attaque DB
