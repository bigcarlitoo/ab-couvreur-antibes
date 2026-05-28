'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Cookie, Settings, Check, X, BarChart3, Eye, ShieldCheck } from 'lucide-react'

/**
 * AB Couvreur — Cookie consent banner (CNIL / RGPD compliant).
 *
 * Strategy:
 *  - Always-on cookieless analytics (Vercel Analytics + Speed Insights) require
 *    no consent: they don't drop cookies and don't identify users individually.
 *  - Heatmaps (Microsoft Clarity) DO drop cookies and require explicit opt-in.
 *
 * Consent is stored in localStorage under `ab-cookie-consent` as:
 *    { version: 1, ts: <ISO date>, analytics: true, heatmap: boolean }
 *
 * The banner re-appears if the schema version changes (consent re-collection).
 */

const STORAGE_KEY = 'ab-cookie-consent'
const CURRENT_VERSION = 1
const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || ''

type Consent = {
  version: number
  ts: string
  analytics: true // always on, cookieless
  heatmap: boolean
}

function loadConsent(): Consent | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed?.version !== CURRENT_VERSION) return null
    return parsed
  } catch {
    return null
  }
}

function saveConsent(c: Consent) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(c))
  } catch {
    // ignore quota / disabled storage
  }
}

function loadClarity() {
  if (typeof window === 'undefined') return
  if (!CLARITY_PROJECT_ID) return
  if ((window as any).clarity) return
  ;(function (c: any, l: Document, a: string, r: string, i: string) {
    c[a] = c[a] || function (...args: any[]) { (c[a].q = c[a].q || []).push(args) }
    const t = l.createElement(r) as HTMLScriptElement
    t.async = true
    t.src = 'https://www.clarity.ms/tag/' + i
    const y = l.getElementsByTagName(r)[0]
    y.parentNode?.insertBefore(t, y)
  })(window, document, 'clarity', 'script', CLARITY_PROJECT_ID)
}

export const CookieConsent: React.FC = () => {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [settings, setSettings] = useState(false)
  const [heatmap, setHeatmap] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = loadConsent()
    if (!stored) {
      // Defer the banner so it doesn't compete with the hero render.
      const t = window.setTimeout(() => setOpen(true), 800)
      return () => window.clearTimeout(t)
    }
    setHeatmap(stored.heatmap)
    if (stored.heatmap) loadClarity()
  }, [])

  const persist = (heatmapOn: boolean) => {
    const c: Consent = {
      version: CURRENT_VERSION,
      ts: new Date().toISOString(),
      analytics: true,
      heatmap: heatmapOn,
    }
    saveConsent(c)
    setHeatmap(heatmapOn)
    if (heatmapOn) loadClarity()
    setOpen(false)
    setSettings(false)
  }

  // Expose a programmatic re-open hook for the footer link.
  useEffect(() => {
    ;(window as any).__openCookieSettings = () => {
      setOpen(true)
      setSettings(true)
    }
    return () => {
      delete (window as any).__openCookieSettings
    }
  }, [])

  if (!mounted) return null

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop only when in settings mode for emphasis */}
          {settings && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[80] bg-[var(--color-ink)]/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
          )}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-4 left-4 right-4 sm:right-auto sm:bottom-6 sm:left-6 z-[81] max-w-md"
          >
            <div className="bg-[var(--color-mist)] rounded-2xl shadow-[0_24px_60px_-20px_rgba(12,22,35,0.45)] border border-[var(--color-ink)]/10 overflow-hidden">
              {!settings ? (
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-coral)]/10 text-[var(--color-coral)] flex items-center justify-center shrink-0">
                      <Cookie size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-bold text-base text-[var(--color-ink)]">Cookies & confidentialité</div>
                      <div className="text-xs text-[var(--color-ink)]/55 mt-0.5">Conformité CNIL / RGPD</div>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--color-ink)]/75 leading-relaxed mb-4">
                    Nous utilisons une mesure d'audience anonyme (sans cookie) pour comprendre comment nos visiteurs trouvent le site.
                    Avec votre accord, nous activons aussi des outils de heatmap pour améliorer la lisibilité des pages.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => persist(true)}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-[var(--color-coral)] hover:bg-[var(--color-coral-lo)] text-[var(--color-mist)] px-4 py-3 rounded-xl font-medium text-sm transition-colors"
                    >
                      <Check size={14} /> Tout accepter
                    </button>
                    <button
                      onClick={() => persist(false)}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-[var(--color-mist-2)] hover:bg-[var(--color-mist)] border border-[var(--color-ink)]/10 text-[var(--color-ink)] px-4 py-3 rounded-xl font-medium text-sm transition-colors"
                    >
                      Refuser
                    </button>
                  </div>
                  <button
                    onClick={() => setSettings(true)}
                    className="mt-3 w-full inline-flex items-center justify-center gap-1.5 text-xs text-[var(--color-ink)]/60 hover:text-[var(--color-coral)] font-medium"
                  >
                    <Settings size={12} /> Personnaliser
                  </button>
                </div>
              ) : (
                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div>
                      <div className="font-display font-bold text-lg text-[var(--color-ink)]">Préférences cookies</div>
                      <div className="text-xs text-[var(--color-ink)]/55 mt-0.5">Activez seulement ce que vous souhaitez.</div>
                    </div>
                    <button
                      onClick={() => setOpen(false)}
                      aria-label="Fermer"
                      className="w-9 h-9 rounded-xl bg-[var(--color-mist-2)] hover:bg-[var(--color-ink)]/10 flex items-center justify-center text-[var(--color-ink)]/60"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-[var(--color-mist-2)] rounded-xl p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-lg bg-[var(--color-aqua)]/10 text-[var(--color-aqua)] flex items-center justify-center shrink-0">
                            <ShieldCheck size={16} />
                          </div>
                          <div>
                            <div className="font-display font-semibold text-sm text-[var(--color-ink)]">Strictement nécessaires</div>
                            <div className="text-xs text-[var(--color-ink)]/55 mt-1 leading-relaxed">
                              Sécurité, mémorisation de vos préférences cookies. Indispensables au fonctionnement du site.
                            </div>
                          </div>
                        </div>
                        <div className="chip bg-[var(--color-ink)]/8 text-[var(--color-ink)]/70 shrink-0 text-[10px]">Toujours actif</div>
                      </div>
                    </div>

                    <div className="bg-[var(--color-mist-2)] rounded-xl p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-lg bg-[var(--color-coral)]/10 text-[var(--color-coral)] flex items-center justify-center shrink-0">
                            <BarChart3 size={16} />
                          </div>
                          <div>
                            <div className="font-display font-semibold text-sm text-[var(--color-ink)]">Mesure d'audience anonyme</div>
                            <div className="text-xs text-[var(--color-ink)]/55 mt-1 leading-relaxed">
                              Compteur de pages vues sans cookie ni identifiant individuel. Conforme à l'exemption CNIL — aucune donnée personnelle.
                            </div>
                          </div>
                        </div>
                        <div className="chip bg-[var(--color-ink)]/8 text-[var(--color-ink)]/70 shrink-0 text-[10px]">Toujours actif</div>
                      </div>
                    </div>

                    <button
                      onClick={() => setHeatmap((h) => !h)}
                      className="w-full text-left bg-[var(--color-mist-2)] hover:bg-[var(--color-mist)] border border-transparent hover:border-[var(--color-ink)]/10 rounded-xl p-4 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-lg bg-[var(--color-coral)]/10 text-[var(--color-coral)] flex items-center justify-center shrink-0">
                            <Eye size={16} />
                          </div>
                          <div>
                            <div className="font-display font-semibold text-sm text-[var(--color-ink)]">Heatmaps & sessions</div>
                            <div className="text-xs text-[var(--color-ink)]/55 mt-1 leading-relaxed">
                              Microsoft Clarity : enregistrement anonymisé des interactions (clics, scroll, mouvements de souris) pour améliorer l'ergonomie.
                            </div>
                          </div>
                        </div>
                        <div
                          role="switch"
                          aria-checked={heatmap}
                          className={`relative shrink-0 w-11 h-6 rounded-full transition-colors ${heatmap ? 'bg-[var(--color-coral)]' : 'bg-[var(--color-ink)]/15'}`}
                        >
                          <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${heatmap ? 'left-[22px]' : 'left-0.5'}`} />
                        </div>
                      </div>
                    </button>
                  </div>

                  <div className="mt-5 flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => persist(heatmap)}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-[var(--color-ink)] hover:bg-[var(--color-coral)] text-[var(--color-mist)] px-4 py-3 rounded-xl font-medium text-sm transition-colors"
                    >
                      Enregistrer mes choix
                    </button>
                    <button
                      onClick={() => persist(true)}
                      className="inline-flex items-center justify-center gap-2 bg-[var(--color-coral)] hover:bg-[var(--color-coral-lo)] text-[var(--color-mist)] px-4 py-3 rounded-xl font-medium text-sm transition-colors"
                    >
                      Tout accepter
                    </button>
                  </div>
                  <p className="mt-3 text-[11px] text-[var(--color-ink)]/45">
                    Vous pouvez modifier vos préférences à tout moment depuis le pied de page.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
