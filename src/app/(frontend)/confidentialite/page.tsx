import type { Metadata } from 'next'

import { OpenCookieSettingsButton } from '@/components/OpenCookieSettingsButton'
import { defaultSiteSettings } from '@/data'

export const metadata: Metadata = {
  title: 'Politique de confidentialité & cookies',
  description:
    "Politique de confidentialité, gestion des cookies et données personnelles d'AB Couvreur Antibes. Conformité RGPD / CNIL.",
  robots: { index: false, follow: true },
}

const updated = new Date().toLocaleDateString('fr-FR', {
  year: 'numeric', month: 'long', day: 'numeric',
})

export default function PrivacyPage() {
  return (
    <main className="bg-[var(--color-mist)] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 py-16 lg:py-24">
        <a href="/" className="inline-flex items-center gap-2 text-sm text-[var(--color-coral)] hover:text-[var(--color-coral-lo)] mb-8 font-medium">← Retour à l'accueil</a>

        <h1 className="font-display font-bold display-tight text-4xl sm:text-5xl text-[var(--color-ink)] leading-[1.05] mb-3">
          Politique de confidentialité <span className="text-[var(--color-coral)]">& cookies.</span>
        </h1>
        <p className="text-sm text-[var(--color-ink)]/55 mb-12">Dernière mise à jour : {updated}</p>

        <div className="prose prose-sm sm:prose-base max-w-none text-[var(--color-ink)]/80 space-y-8 leading-relaxed">
          <section>
            <h2 className="font-display font-bold text-2xl text-[var(--color-ink)] mb-3">1. Responsable du traitement</h2>
            <p>
              Le présent site est édité par <strong>{defaultSiteSettings.businessName}</strong>, dont les coordonnées sont affichées
              en page Contact. Les données collectées via les formulaires sont utilisées uniquement pour répondre aux demandes
              de devis ou de renseignement.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-[var(--color-ink)] mb-3">2. Données collectées</h2>
            <p>Via le formulaire de devis :</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Nom, téléphone (obligatoires)</li>
              <li>Email (facultatif)</li>
              <li>Ville d'intervention, prestation souhaitée, niveau d'urgence</li>
              <li>Description libre du projet</li>
            </ul>
            <p className="mt-3">
              Aucune donnée bancaire n'est collectée. Les données du formulaire sont transmises par email à l'artisan et ne sont
              <strong> jamais cédées ni revendues</strong> à un tiers commercial. Elles sont conservées le temps nécessaire au
              traitement de votre demande (12 mois maximum après le dernier échange).
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-[var(--color-ink)] mb-3">3. Cookies & mesure d'audience</h2>
            <p>
              Le site distingue plusieurs catégories de traceurs, gérés via le bandeau de consentement affiché lors de votre
              première visite.
            </p>
            <div className="mt-4 space-y-4">
              <div className="bg-[var(--color-mist-2)] rounded-xl p-5">
                <div className="font-display font-semibold text-base text-[var(--color-ink)] mb-1">Strictement nécessaires</div>
                <p className="text-sm">
                  Cookies techniques (sécurité, mémorisation de votre choix de cookies). Aucun consentement requis, conformément
                  à l'article 82 de la loi Informatique et Libertés.
                </p>
              </div>
              <div className="bg-[var(--color-mist-2)] rounded-xl p-5">
                <div className="font-display font-semibold text-base text-[var(--color-ink)] mb-1">Mesure d'audience anonyme</div>
                <p className="text-sm">
                  Nous utilisons <strong>Vercel Analytics</strong> et <strong>Vercel Speed Insights</strong> pour mesurer la
                  fréquentation et la performance technique du site. Ces outils ne déposent aucun cookie, n'identifient pas
                  l'utilisateur individuellement et entrent dans le périmètre des exemptions de consentement de la CNIL.
                </p>
              </div>
              <div className="bg-[var(--color-mist-2)] rounded-xl p-5">
                <div className="font-display font-semibold text-base text-[var(--color-ink)] mb-1">Heatmaps & enregistrements de sessions</div>
                <p className="text-sm">
                  Avec votre accord explicite, nous chargeons <strong>Microsoft Clarity</strong> pour générer des heatmaps de
                  clic et de défilement, et enregistrer de façon anonyme les interactions, afin d'améliorer l'ergonomie du site.
                  Ces traceurs ne sont activés <strong>qu'après votre consentement</strong> et peuvent être désactivés à tout
                  moment depuis le pied de page.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-[var(--color-ink)] mb-3">4. Vos droits</h2>
            <p>
              Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, de portabilité
              et d'opposition concernant vos données. Pour exercer ces droits, contactez-nous via les coordonnées affichées en page
              Contact. Vous pouvez également introduire une réclamation auprès de la CNIL (<a href="https://www.cnil.fr/" target="_blank" rel="noopener noreferrer" className="text-[var(--color-coral)] underline">cnil.fr</a>).
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-[var(--color-ink)] mb-3">5. Modifier vos préférences cookies</h2>
            <p>
              Vous pouvez à tout moment réafficher le bandeau de gestion des cookies en cliquant ci-dessous :
            </p>
            <div className="mt-4">
              <OpenCookieSettingsButton />
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
