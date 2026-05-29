'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Phone, Mail, MapPin, Shield, Check, Clock, Sparkles,
  ArrowUpRight, ArrowRight, ArrowLeft, FileText, AlertTriangle,
  Star, Send, ShieldCheck, Menu, X, Sun, Award, Zap,
  Quote, Plus, Minus,
} from 'lucide-react';
import { Service, Zone, Realisation, Testimonial, FaqItem, SiteSettings } from '../types';
import { IconRenderer } from './IconRenderer';

interface PublicSiteProps {
  settings: SiteSettings;
  services: Service[];
  zones: Zone[];
  realisations: Realisation[];
  testimonials: Testimonial[];
  faqs: FaqItem[];
  initialPath?: string;
  onNewLead?: (lead: any) => void;
}

const SITE_URL = 'https://ab-couvreur-sud.fr';
const cleanPhone = (p: string) => p.replace(/\s/g, '');
const intlPhone = (p: string) => '+33' + cleanPhone(p).replace(/^0/, '');

const Pill: React.FC<{ children: React.ReactNode; tone?: 'coral' | 'ink' | 'mint' }> = ({ children, tone = 'coral' }) => {
  const styles: Record<string, string> = {
    coral: 'bg-[var(--color-coral)]/10 text-[var(--color-coral-lo)] ring-1 ring-[var(--color-coral)]/20',
    ink: 'bg-[var(--color-ink)]/5 text-[var(--color-ink)] ring-1 ring-[var(--color-ink)]/10',
    mint: 'bg-[var(--color-mint)] text-[var(--color-aqua)] ring-1 ring-[var(--color-aqua)]/20',
  };
  return <span className={`chip ${styles[tone]}`}>{children}</span>;
};

export const PublicSite: React.FC<PublicSiteProps> = ({
  settings, services, zones, realisations, testimonials, faqs,
  initialPath = '/', onNewLead,
}) => {
  const initialService = initialPath.startsWith('/services/')
    ? services.find((s) => `/services/${s.slug}` === initialPath) || null
    : null;
  const initialZone = initialPath.startsWith('/zones/')
    ? zones.find((z) => `/zones/${z.slug}` === initialPath) || null
    : null;

  const [currentPath, setCurrentPath] = useState<string>(initialPath);
  const [selectedService, setSelectedService] = useState<Service | null>(initialService);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(initialZone);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const [quoteForm, setQuoteForm] = useState({
    name: '', phone: '', email: '', city: 'Antibes',
    service: services[0]?.id || 'toiture', urgency: 'normal',
    description: '', gdpr: false,
    website: '', // honeypot — must stay empty
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const phone = settings.phone;
  const phoneClean = cleanPhone(phone);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPath, selectedService, selectedZone]);

  useEffect(() => {
    const onPop = () => {
      const path = window.location.pathname;
      const s = services.find((i) => `/services/${i.slug}` === path) || null;
      const z = zones.find((i) => `/zones/${i.slug}` === path) || null;
      setSelectedService(s);
      setSelectedZone(z);
      setCurrentPath(path);
      setMenuOpen(false);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [services, zones]);

  const navigate = (path: string) => {
    if (path === '/' || path === '/realisations' || path === '/contact') {
      setSelectedService(null);
      setSelectedZone(null);
    }
    setCurrentPath(path);
    setMenuOpen(false);
    if (typeof window !== 'undefined' && window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
  };

  const openService = (s: Service) => {
    setSelectedService(s);
    setSelectedZone(null);
    setCurrentPath(`/services/${s.slug}`);
    setMenuOpen(false);
    if (typeof window !== 'undefined') window.history.pushState(null, '', `/services/${s.slug}`);
  };

  const openZone = (z: Zone) => {
    setSelectedZone(z);
    setSelectedService(null);
    setCurrentPath(`/zones/${z.slug}`);
    setMenuOpen(false);
    if (typeof window !== 'undefined') window.history.pushState(null, '', `/zones/${z.slug}`);
  };

  const notify = (msg: string) => {
    setNotification(msg);
    window.setTimeout(() => setNotification(null), 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!quoteForm.gdpr) {
      notify("Merci de confirmer l'autorisation de rappel avant envoi.");
      return;
    }
    if (!quoteForm.name.trim() || !quoteForm.phone.trim()) {
      notify('Le nom et le téléphone sont obligatoires.');
      return;
    }

    setSubmitting(true);
    const payload = { ...quoteForm, leadDate: new Date().toISOString() };

    if (onNewLead) {
      onNewLead(payload);
      setFormSubmitted(true);
      setSubmitting(false);
      notify('Demande transmise. Nous vous rappelons rapidement.');
      return;
    }

    try {
      const r = await fetch('/api/leads', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      });
      const json = await r.json().catch(() => ({}));
      if (!r.ok) {
        notify(json?.error || `Envoi échoué. Appelez-nous au ${phone}.`);
        setSubmitting(false);
        return;
      }
      setFormSubmitted(true);
      notify('Demande transmise. Nous vous rappelons rapidement.');
    } catch {
      notify(`Envoi échoué. Appelez-nous au ${phone}.`);
    } finally {
      setSubmitting(false);
    }
  };

  // Schemas
  const businessSchema = {
    '@context': 'https://schema.org', '@type': 'RoofingContractor',
    '@id': `${SITE_URL}/#roofingcontractor`,
    name: settings.businessName,
    image: `${SITE_URL}/assets/ab-source/ab-13.webp`,
    logo: `${SITE_URL}/assets/ab-source/ab-13.webp`,
    url: SITE_URL,
    telephone: intlPhone(phone),
    ...(settings.email ? { email: settings.email } : {}),
    priceRange: '€€',
    paymentAccepted: 'Espèces, Virement, Chèque',
    address: {
      '@type': 'PostalAddress', streetAddress: 'Chemin de la Constance',
      addressLocality: 'Antibes', postalCode: '06600',
      addressRegion: 'Alpes-Maritimes', addressCountry: 'FR',
    },
    geo: { '@type': 'GeoCoordinates', latitude: '43.5804', longitude: '7.1251' },
    areaServed: zones.map((z) => ({ '@type': 'City', name: z.city })),
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '07:30', closes: '19:30',
    },
    aggregateRating: {
      '@type': 'AggregateRating', ratingValue: '5.0',
      reviewCount: testimonials.length, bestRating: '5', worstRating: '1',
    },
  };
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question', name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
  const serviceSchema = selectedService && {
    '@context': 'https://schema.org', '@type': 'Service',
    name: selectedService.title, serviceType: selectedService.title,
    provider: { '@id': `${SITE_URL}/#roofingcontractor` },
    areaServed: zones.map((z) => z.city),
    description: selectedService.longDescription,
    offers: { '@type': 'Offer', price: '0.00', priceCurrency: 'EUR', description: 'Devis gratuit' },
  };
  const zoneSchema = selectedZone && {
    '@context': 'https://schema.org', '@type': 'LocalBusiness',
    name: `${settings.businessName} — ${selectedZone.city}`,
    description: selectedZone.seoDescription,
    image: `${SITE_URL}/assets/ab-source/ab-13.webp`,
    telephone: intlPhone(phone),
    address: {
      '@type': 'PostalAddress', addressLocality: selectedZone.city,
      postalCode: selectedZone.postalCode.split(' ')[0],
      addressRegion: 'Alpes-Maritimes', addressCountry: 'FR',
    },
    areaServed: selectedZone.city,
  };

  // -------- Components --------
  const Header = () => {
    const navItems = [
      { l: 'Accueil', p: '/' },
      { l: 'Prestations', menu: true },
      { l: 'Réalisations', p: '/realisations' },
      { l: 'Zones', p: '#zones' },
      { l: 'Contact', p: '/contact' },
    ];
    const isActive = (it: any) => it.p === currentPath || (it.menu && menuOpen);

    return (
      <header className="sticky top-0 z-40 bg-[var(--color-mist)]/95 backdrop-blur-xl border-b border-[var(--color-ink)]/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-[78px] flex items-center justify-between gap-4">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 shrink-0">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-[var(--color-ink)] text-[var(--color-mist)] flex items-center justify-center font-display font-bold text-base">
                AB
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[var(--color-coral)] ring-2 ring-[var(--color-mist)]" />
            </div>
            <div className="text-left leading-tight min-w-0">
              <div className="font-display font-bold text-base text-[var(--color-ink)] whitespace-nowrap">AB Couvreur</div>
              <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.18em] text-[var(--color-ink)]/55 font-semibold whitespace-nowrap">
                <span className="sm:hidden">Antibes · 06</span>
                <span className="hidden sm:inline">Antibes · Côte d'Azur</span>
              </div>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium absolute left-1/2 -translate-x-1/2">
            {navItems.map((it) => (
              <button
                key={it.l}
                onClick={() => {
                  if (it.menu) setMenuOpen(true);
                  else if (it.p?.startsWith('#')) document.getElementById(it.p.slice(1))?.scrollIntoView({ behavior: 'smooth' });
                  else navigate(it.p!);
                }}
                className={`relative px-4 py-2.5 rounded-full transition-colors ${
                  isActive(it)
                    ? 'text-[var(--color-ink)]'
                    : 'text-[var(--color-ink)]/65 hover:text-[var(--color-ink)]'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {it.l}
                  {it.menu && <Menu size={12} className="opacity-60" />}
                </span>
                {isActive(it) && (
                  <span className="absolute left-1/2 -translate-x-1/2 -bottom-0.5 w-1.5 h-1.5 rounded-full bg-[var(--color-coral)]" />
                )}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`tel:${phoneClean}`}
              className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-full text-[var(--color-ink)] font-medium text-sm hover:bg-[var(--color-ink)]/5 transition-colors"
            >
              <Phone size={14} className="text-[var(--color-coral)]" />
              <span className="font-mono tracking-tight">{phone}</span>
            </a>
            <button
              onClick={() => navigate('/contact')}
              className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[var(--color-ink)] text-[var(--color-mist)] font-medium text-sm hover:bg-[var(--color-coral)] transition-colors"
            >
              Devis gratuit <ArrowUpRight size={14} />
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden w-11 h-11 rounded-2xl bg-[var(--color-ink)] text-[var(--color-mist)] flex items-center justify-center"
              aria-label="Menu"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>
    );
  };

  const FullscreenMenu = () => (
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-[var(--color-ink)] text-[var(--color-mist)] overflow-y-auto mesh-bg"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6">
            <div className="flex items-center justify-between mb-10">
              <div className="font-display font-semibold text-2xl text-[var(--color-mist)]">Menu</div>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-11 h-11 rounded-2xl bg-[var(--color-mist)]/10 border border-[var(--color-mist)]/15 flex items-center justify-center hover:bg-[var(--color-coral)] hover:border-[var(--color-coral)]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-4 space-y-1">
                <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-coral-hi)] mb-3 font-semibold">Navigation</div>
                {[
                  { label: 'Accueil', path: '/' },
                  { label: 'Réalisations', path: '/realisations' },
                  { label: 'Contact & devis', path: '/contact' },
                ].map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className="block text-left font-display text-4xl sm:text-5xl font-semibold display-tight hover:text-[var(--color-coral-hi)] transition-all py-1"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="lg:col-span-8">
                <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-coral-hi)] mb-3 font-semibold">Prestations</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                  {services.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => openService(s)}
                      className="text-left py-2.5 border-b border-[var(--color-mist)]/10 hover:border-[var(--color-coral)] flex items-center justify-between group"
                    >
                      <span className="font-display text-base group-hover:text-[var(--color-coral-hi)] transition-colors">{s.title}</span>
                      <ArrowUpRight size={14} className="text-[var(--color-mist)]/40 group-hover:text-[var(--color-coral-hi)]" />
                    </button>
                  ))}
                </div>

                <div className="mt-10 pt-8 border-t border-[var(--color-mist)]/10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                  <div>
                    <div className="text-[var(--color-coral-hi)] text-xs uppercase tracking-wider mb-1">Téléphone</div>
                    <a href={`tel:${phoneClean}`} className="font-display text-xl">{phone}</a>
                  </div>
                  {settings.email && (
                    <div>
                      <div className="text-[var(--color-coral-hi)] text-xs uppercase tracking-wider mb-1">Email</div>
                      <a href={`mailto:${settings.email}`} className="font-display text-base break-all">{settings.email}</a>
                    </div>
                  )}
                  <div>
                    <div className="text-[var(--color-coral-hi)] text-xs uppercase tracking-wider mb-1">Adresse</div>
                    <div className="font-display text-base">{settings.address}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const Footer = () => (
    <footer className="bg-[var(--color-ink)] text-[var(--color-mist)] mt-0 relative overflow-hidden">
      <div className="absolute inset-0 mesh-bg opacity-50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <Pill tone="coral">Antibes · Côte d'Azur</Pill>
            <h3 className="mt-4 font-display font-semibold text-4xl sm:text-5xl display-tight leading-[1.05]">
              On s'occupe<br />
              de votre <span className="text-[var(--color-coral-hi)]">toiture.</span>
            </h3>
            <p className="mt-5 text-[var(--color-mist)]/65 max-w-md">
              Diagnostic et devis gratuits sous 24 h, garantie décennale AXA, intervention rapide d'Antibes à Nice.
            </p>
            <div className="mt-7 flex gap-3">
              <a href={`tel:${phoneClean}`} className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[var(--color-coral)] hover:bg-[var(--color-coral-lo)] text-[var(--color-mist)] font-medium text-sm">
                <Phone size={14} /> {phone}
              </a>
              <button onClick={() => navigate('/contact')} className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[var(--color-mist)]/8 hover:bg-[var(--color-mist)]/15 border border-[var(--color-mist)]/15 font-medium text-sm">
                Devis <ArrowUpRight size={14} />
              </button>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="text-xs uppercase tracking-[0.18em] text-[var(--color-coral-hi)] mb-4 font-semibold">Prestations</div>
            <ul className="space-y-2.5 text-sm text-[var(--color-mist)]/75">
              {services.slice(0, 8).map((s) => (
                <li key={s.id}>
                  <button onClick={() => openService(s)} className="hover:text-[var(--color-coral-hi)] text-left">{s.title}</button>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <div className="text-xs uppercase tracking-[0.18em] text-[var(--color-coral-hi)] mb-4 font-semibold">Zones</div>
            <ul className="space-y-2.5 text-sm text-[var(--color-mist)]/75">
              {zones.map((z) => (
                <li key={z.id}>
                  <button onClick={() => openZone(z)} className="hover:text-[var(--color-coral-hi)] text-left">{z.city}</button>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <div className="text-xs uppercase tracking-[0.18em] text-[var(--color-coral-hi)] mb-4 font-semibold">Contact</div>
            <ul className="space-y-3 text-sm text-[var(--color-mist)]/75">
              <li><a href={`tel:${phoneClean}`} className="font-display text-lg block text-[var(--color-mist)]">{phone}</a></li>
              {settings.email && (
                <li><a href={`mailto:${settings.email}`} className="break-all hover:text-[var(--color-coral-hi)]">{settings.email}</a></li>
              )}
              <li className="text-xs text-[var(--color-mist)]/55">{settings.address}</li>
              <li className="text-[10px] text-[var(--color-mist)]/40">SIRET {settings.siret}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--color-mist)]/10 mt-12 pt-6 flex flex-col lg:flex-row justify-between gap-3 text-xs text-[var(--color-mist)]/50">
          <div>© {new Date().getFullYear()} AB Couvreur · {settings.decennale}</div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a href="/confidentialite" className="hover:text-[var(--color-coral-hi)]">Politique de confidentialité</a>
            <button
              type="button"
              onClick={() => (window as any).__openCookieSettings?.()}
              className="hover:text-[var(--color-coral-hi)] text-left"
            >
              Gérer mes cookies
            </button>
            <span className="text-[var(--color-mist)]/40">L'expertise au service de votre habitat.</span>
          </div>
        </div>
      </div>
    </footer>
  );

  // -------- Home --------
  const HomePage = () => (
    <>
      {/* HERO — mesh gradient with stacked glass cards */}
      <section className="relative mesh-bg text-[var(--color-mist)] overflow-hidden">
        <div className="noise" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-14 pb-28 lg:pt-20 lg:pb-36 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 relative z-10">
              <Pill tone="coral">
                <span className="w-2 h-2 rounded-full bg-[var(--color-coral)]" />
                Couvreur n°1 sur Antibes · Côte d'Azur
              </Pill>
              <h1 className="mt-5 font-display font-bold display-tight text-[2.75rem] sm:text-6xl lg:text-[5rem] leading-[0.98] tracking-tight">
                Toiture impeccable,<br />
                <span className="text-[var(--color-coral)]">zéro</span> mauvaise<br />
                surprise.
              </h1>
              <p className="mt-7 max-w-xl text-base sm:text-lg text-[var(--color-mist)]/75 leading-relaxed">
                Artisan couvreur installé à Antibes, intervention d'Antibes à Nice :
                rénovation, recherche de fuite, Velux, zinguerie, nettoyage et isolation.
                Décennale AXA, devis sous 24 h.
              </p>

              <div className="mt-9 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate('/contact')}
                  className="inline-flex items-center justify-center gap-2 bg-[var(--color-coral)] hover:bg-[var(--color-coral-lo)] text-[var(--color-mist)] px-7 py-4 rounded-2xl font-medium text-base transition-all shadow-[0_18px_48px_-12px_rgba(255,77,54,0.5)]"
                >
                  Demander un devis <ArrowUpRight size={18} />
                </button>
                <a
                  href={`tel:${phoneClean}`}
                  className="inline-flex items-center justify-center gap-2 bg-[var(--color-mist)]/8 hover:bg-[var(--color-mist)]/15 border border-[var(--color-mist)]/20 text-[var(--color-mist)] px-7 py-4 rounded-2xl font-medium text-base transition-all backdrop-blur"
                >
                  <Phone size={16} /> {phone}
                </a>
              </div>

              <div className="mt-12 flex flex-wrap gap-x-6 gap-y-3 text-xs">
                {[
                  { i: <ShieldCheck size={14} />, t: 'Décennale AXA' },
                  { i: <Clock size={14} />, t: 'Devis sous 24h' },
                  { i: <Award size={14} />, t: '15 ans d\'expérience' },
                  { i: <Star size={14} />, t: '5.0 / 5 clients' },
                ].map((b) => (
                  <span key={b.t} className="inline-flex items-center gap-2 text-[var(--color-mist)]/75">
                    <span className="text-[var(--color-coral-hi)]">{b.i}</span> {b.t}
                  </span>
                ))}
              </div>
            </div>

            {/* Stacked image + glass cards */}
            <div className="lg:col-span-5 relative h-[420px] sm:h-[520px] lg:h-[560px]">
              <div className="absolute top-0 right-0 w-[78%] aspect-[4/5] rounded-[2rem] overflow-hidden shadow-[0_28px_80px_-20px_rgba(0,0,0,0.6)] rotate-1">
                <img src="/assets/ab-source/ab-13.webp" alt="Chantier toiture Antibes" className="object-cover w-full h-full" />
              </div>
              <div className="absolute bottom-2 left-0 w-[55%] aspect-[4/3] rounded-[1.5rem] overflow-hidden shadow-[0_28px_60px_-20px_rgba(0,0,0,0.55)] -rotate-3 ring-4 ring-[var(--color-mist)]/15">
                <img src="/assets/ab-source/ab-12.webp" alt="Tuiles canal villa antiboise" className="object-cover w-full h-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Ticker */}
        <div className="border-t border-[var(--color-mist)]/10 bg-[var(--color-ink-2)]/60 backdrop-blur py-3 overflow-hidden relative">
          <div className="flex marquee whitespace-nowrap text-sm">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex shrink-0 items-center gap-10 pr-10">
                {['Antibes', 'Juan-les-Pins', 'Cap d\'Antibes', 'Cannes', 'Le Cannet', 'Nice', 'Cagnes-sur-Mer', 'Biot', 'Vallauris', 'Mougins', 'Valbonne', 'Sophia Antipolis', 'Villeneuve-Loubet'].map((c) => (
                  <span key={c} className="flex items-center gap-3 text-[var(--color-mist)]/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-coral)]" />
                    <span className="font-display font-medium">{c}</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS / TRUST STRIP */}
      <section className="bg-[var(--color-mist)] pt-16 sm:pt-20 lg:pt-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="bg-[var(--color-mist-2)] rounded-[1.75rem] sm:rounded-[2rem] p-5 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 shadow-[0_12px_40px_-22px_rgba(12,22,35,0.25)] overflow-hidden">
            {[
              { n: '15+', l: "ans d'expérience" },
              { n: '06', l: "département" },
              { n: '24h', l: "réponse devis" },
              { n: '10 ans', l: "décennale AXA" },
            ].map((s) => (
              <div key={s.l} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 min-w-0">
                <div className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl display-tight text-[var(--color-ink)] shrink-0">{s.n}</div>
                <div className="text-[10px] sm:text-xs uppercase tracking-wider text-[var(--color-ink)]/55 leading-tight">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="prestations" className="py-24 lg:py-32 bg-[var(--color-mist)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <Pill tone="coral">Nos prestations</Pill>
              <h2 className="mt-4 font-display font-bold display-tight text-4xl sm:text-5xl lg:text-6xl leading-[1.02] text-[var(--color-ink)]">
                Du diagnostic à la <span className="text-[var(--color-coral)]">décennale</span>.
              </h2>
              <p className="mt-5 text-lg text-[var(--color-ink)]/65 leading-relaxed">
                Couverture, zinguerie, étanchéité, Velux, isolation, ravalement : un artisan couvreur,
                des méthodes rigoureuses, adaptées au climat méditerranéen.
              </p>
            </div>
            <button
              onClick={() => setMenuOpen(true)}
              className="self-start inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[var(--color-ink)]/5 hover:bg-[var(--color-ink)] hover:text-[var(--color-mist)] text-[var(--color-ink)] font-medium text-sm transition-colors"
            >
              Voir toutes les prestations <ArrowUpRight size={14} />
            </button>
          </div>

          {/* Featured big card + grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {services[0] && (
              <button
                onClick={() => openService(services[0])}
                className="lg:col-span-7 group relative overflow-hidden rounded-[2.25rem] bg-[var(--color-ink)] text-[var(--color-mist)] text-left card-lift"
                style={{ minHeight: 380 }}
              >
                <img
                  src={services[0].image}
                  alt={services[0].title}
                  className="absolute inset-0 w-full h-full object-cover opacity-55 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)] via-[var(--color-ink)]/65 to-transparent" />
                <div className="relative p-8 lg:p-10 flex flex-col h-full min-h-[380px] justify-end">
                  <Pill tone="coral">À la une</Pill>
                  <h3 className="mt-4 font-display font-bold display-tight text-3xl lg:text-5xl leading-[1.02]">
                    {services[0].title}
                  </h3>
                  <p className="mt-3 max-w-md text-[var(--color-mist)]/80 text-base">{services[0].shortDescription}</p>
                  <div className="mt-6 inline-flex items-center gap-2 font-medium text-sm text-[var(--color-coral-hi)]">
                    Découvrir la prestation <ArrowUpRight size={16} />
                  </div>
                </div>
              </button>
            )}

            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {services.slice(1, 5).map((s) => (
                <button
                  key={s.id}
                  onClick={() => openService(s)}
                  className="group bg-[var(--color-mist-2)] hover:bg-[var(--color-ink)] hover:text-[var(--color-mist)] rounded-[1.5rem] p-5 text-left card-lift flex flex-col gap-3 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-ink)] text-[var(--color-mist)] group-hover:bg-[var(--color-coral)] flex items-center justify-center transition-colors">
                    <IconRenderer name={s.icon} size={16} />
                  </div>
                  <h3 className="font-display font-semibold text-lg leading-tight">{s.title}</h3>
                  <p className="text-xs leading-relaxed text-[var(--color-ink)]/65 group-hover:text-[var(--color-mist)]/75 line-clamp-3">
                    {s.shortDescription}
                  </p>
                  <div className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-[var(--color-coral)] group-hover:text-[var(--color-coral-hi)]">
                    En savoir plus <ArrowUpRight size={12} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Secondary services grid */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {services.slice(5, 13).map((s) => (
              <button
                key={s.id}
                onClick={() => openService(s)}
                className="group bg-[var(--color-mist)] border border-[var(--color-ink)]/8 hover:border-[var(--color-coral)] hover:bg-[var(--color-coral)]/5 rounded-2xl p-4 text-left transition-colors flex items-start gap-3 min-w-0"
              >
                <div className="w-9 h-9 rounded-lg bg-[var(--color-mint)] text-[var(--color-aqua)] group-hover:bg-[var(--color-coral)] group-hover:text-[var(--color-mist)] flex items-center justify-center transition-colors shrink-0">
                  <IconRenderer name={s.icon} size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-display font-semibold text-sm text-[var(--color-ink)] leading-snug break-words">{s.title}</div>
                  <div className="text-[11px] text-[var(--color-ink)]/55 mt-1 leading-snug">{s.priceEstimate}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE / ABOUT */}
      <section className="py-24 lg:py-32 mesh-soft relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="relative bg-[var(--color-ink)] text-[var(--color-mist)] rounded-[2rem] p-8 sm:p-10 overflow-hidden">
                <div className="absolute inset-0 mesh-bg opacity-60" />
                <div className="relative">
                  <Quote size={28} className="text-[var(--color-coral-hi)] mb-4" />
                  <p className="font-display text-2xl sm:text-3xl leading-[1.15] font-light">
                    «&nbsp;Une entreprise <em className="text-[var(--color-coral-hi)] not-italic font-medium">familiale</em>, transmise de père en fils, pensée pour le climat et le bâti de la Côte d'Azur.&nbsp;»
                  </p>
                  <div className="mt-8 pt-6 border-t border-[var(--color-mist)]/15 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs uppercase tracking-widest text-[var(--color-coral-hi)] font-semibold">Engagement</div>
                      <div className="font-display font-bold text-lg">Décennale AXA · NF · CE</div>
                    </div>
                    <ShieldCheck size={32} className="text-[var(--color-coral)] shrink-0" />
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="bg-[var(--color-mist)] rounded-2xl p-5 border border-[var(--color-ink)]/8">
                  <Sun size={20} className="text-[var(--color-coral)] mb-3" />
                  <div className="font-display font-semibold text-sm">Climat méditerranéen</div>
                  <div className="text-xs text-[var(--color-ink)]/55 mt-1">Soleil, embruns, mistral, épisodes cévenols.</div>
                </div>
                <div className="bg-[var(--color-mist)] rounded-2xl p-5 border border-[var(--color-ink)]/8">
                  <Award size={20} className="text-[var(--color-coral)] mb-3" />
                  <div className="font-display font-semibold text-sm">Savoir-faire artisanal</div>
                  <div className="text-xs text-[var(--color-ink)]/55 mt-1">Couvreur traditionnel, méthodes rigoureuses.</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2">
              <Pill tone="ink">Notre histoire</Pill>
              <h2 className="mt-4 font-display font-bold display-tight text-4xl sm:text-5xl lg:text-[3.75rem] leading-[1.02] text-[var(--color-ink)]">
                Une entreprise<br />
                <span className="text-[var(--color-coral)]">artisanale</span> de couverture<br />
                au cœur du 06.
              </h2>
              <p className="mt-6 text-lg text-[var(--color-ink)]/70 leading-relaxed">
                AB Couvreur est une entreprise artisanale spécialisée dans l'entretien, la rénovation et la protection
                des toitures et façades. Forts d'une solide expérience, nous accompagnons particuliers et professionnels
                avec un savoir-faire reconnu et une exigence constante de qualité.
              </p>
              <p className="mt-3 text-base text-[var(--color-ink)]/60 leading-relaxed">
                Matériaux performants, techniques respectueuses des structures existantes, communication transparente
                à chaque étape : votre projet mérite l'excellence.
              </p>

              <div className="mt-8 grid grid-cols-3 gap-3">
                {[
                  { n: '15+', l: "ans d'activité" },
                  { n: '06', l: "département" },
                  { n: '10 ans', l: "décennale" },
                ].map((stat) => (
                  <div key={stat.l} className="bg-[var(--color-mist)] rounded-2xl p-4 border border-[var(--color-ink)]/8">
                    <div className="font-display font-bold display-tight text-2xl sm:text-3xl text-[var(--color-coral)]">{stat.n}</div>
                    <div className="text-[10px] sm:text-xs uppercase tracking-widest text-[var(--color-ink)]/55 mt-1">{stat.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-24 lg:py-32 bg-[var(--color-ink)] text-[var(--color-mist)] mesh-bg relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative">
          <div className="max-w-3xl mb-14">
            <Pill tone="coral">Notre approche</Pill>
            <h2 className="mt-4 font-display font-bold display-tight text-4xl sm:text-5xl lg:text-6xl leading-[1.02]">
              Quatre étapes,<br />
              <span className="text-[var(--color-coral)]">zéro mauvaise surprise.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { n: '01', t: 'Diagnostic gratuit', d: "Visite sur place, inspection complète, photos des points faibles." },
              { n: '02', t: 'Devis détaillé', d: "Chiffrage transparent, matériaux nommés, délai annoncé." },
              { n: '03', t: 'Chantier soigné', d: "Protection des abords, communication quotidienne, photos d'étapes." },
              { n: '04', t: 'Garantie & suivi', d: "Décennale AXA, attestation jointe au PV, suivi à 6 mois." },
            ].map((step, i) => (
              <div key={step.n} className="relative bg-[var(--color-ink-2)]/70 backdrop-blur border border-[var(--color-mist)]/8 rounded-[1.5rem] p-6">
                <div className="absolute -top-3 -left-3 w-12 h-12 rounded-2xl bg-[var(--color-coral)] flex items-center justify-center font-display font-bold text-lg shadow-lg">
                  {step.n}
                </div>
                <h3 className="font-display font-semibold text-xl mt-5 mb-3">{step.t}</h3>
                <p className="text-sm text-[var(--color-mist)]/70 leading-relaxed">{step.d}</p>
                {i < 3 && (
                  <ArrowRight size={18} className="absolute top-1/2 -right-3 hidden lg:block text-[var(--color-coral)]/60" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REALISATIONS PREVIEW */}
      <section className="py-24 lg:py-32 bg-[var(--color-mist)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <Pill tone="mint">Réalisations</Pill>
              <h2 className="mt-4 font-display font-bold display-tight text-4xl sm:text-5xl lg:text-6xl leading-[1.02] text-[var(--color-ink)]">
                Du chantier en <span className="text-[var(--color-coral)]">photos.</span>
              </h2>
            </div>
            <button onClick={() => navigate('/realisations')} className="self-start inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[var(--color-ink)] hover:bg-[var(--color-coral)] text-[var(--color-mist)] font-medium text-sm transition-colors">
              Tout voir <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {realisations.slice(0, 6).map((r) => (
              <div key={r.id} className="group rounded-[1.5rem] overflow-hidden bg-[var(--color-mist-2)] border border-[var(--color-ink)]/8 card-lift flex flex-col">
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img src={r.image} alt={r.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-display font-semibold text-base text-[var(--color-ink)] leading-snug mb-2">{r.title}</h3>
                  <p className="text-sm text-[var(--color-ink)]/65 leading-relaxed line-clamp-3">{r.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ÉTANCHÉITÉ SPOTLIGHT */}
      <section className="py-24 lg:py-32 bg-[var(--color-ink)] text-[var(--color-mist)] relative overflow-hidden">
        <div className="absolute inset-0 mesh-bg opacity-70" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <Pill tone="coral">Étanchéité de toiture</Pill>
              <h2 className="mt-4 font-display font-bold display-tight text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.02]">
                Une protection <span className="text-[var(--color-coral)]">durable</span><br />
                contre la pluie méditerranéenne.
              </h2>
              <p className="mt-6 text-lg text-[var(--color-mist)]/80 leading-relaxed">
                Nous mettons un point d'honneur à garantir une étanchéité parfaite, condition essentielle pour préserver
                votre bâtiment des infiltrations, des moisissures et des pertes thermiques. Bitume élastomère, membranes EPDM,
                complexes multicouches : adaptés à toutes vos toitures.
              </p>
              <button onClick={() => navigate('/contact')} className="mt-7 inline-flex items-center gap-2 bg-[var(--color-coral)] hover:bg-[var(--color-coral-lo)] text-[var(--color-mist)] px-6 py-3.5 rounded-2xl font-medium transition-all">
                Diagnostic d'étanchéité <ArrowUpRight size={16} />
              </button>
            </div>
            <div className="lg:col-span-5 lg:col-start-8">
              <div className="bg-[var(--color-mist)] text-[var(--color-ink)] rounded-[1.75rem] p-7 shadow-2xl">
                <h3 className="font-display font-bold text-2xl mb-5">Pourquoi l'étanchéité&nbsp;?</h3>
                <ul className="space-y-3">
                  {[
                    "Protection renforcée contre les infiltrations",
                    "Excellente isolation thermique conforme aux normes",
                    "Longévité accrue de la toiture",
                    "Économies d'énergie",
                    "Confort intérieur amélioré, été comme hiver",
                  ].map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm text-[var(--color-ink)]/80">
                      <span className="shrink-0 w-5 h-5 mt-0.5 rounded-full bg-[var(--color-coral)]/10 text-[var(--color-coral)] flex items-center justify-center">
                        <Check size={12} />
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ZONES */}
      <section id="zones" className="py-24 lg:py-32 bg-[var(--color-mist)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14 items-end">
            <div className="lg:col-span-7">
              <Pill tone="ink"><MapPin size={11} /> Zones d'intervention · Alpes-Maritimes 06</Pill>
              <h2 className="mt-4 font-display font-bold display-tight text-4xl sm:text-5xl lg:text-6xl leading-[1.02] text-[var(--color-ink)]">
                D'Antibes à Nice,<br />
                en passant par <span className="text-[var(--color-coral)]">Cannes.</span>
              </h2>
              <p className="mt-5 text-lg text-[var(--color-ink)]/65 max-w-xl">
                AB Couvreur intervient quotidiennement dans tout le bassin antibois et sur l'ensemble de la Côte d'Azur.
                Cliquez sur votre commune pour découvrir nos prestations locales.
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="flex flex-wrap gap-2 lg:justify-end">
                {[
                  'Antibes', 'Juan-les-Pins', 'Cap d\'Antibes', 'Cannes', 'Le Cannet', 'Nice',
                  'Biot', 'Vallauris', 'Mougins', 'Valbonne', 'Sophia Antipolis',
                  'Villeneuve-Loubet', 'Cagnes-sur-Mer', 'Saint-Laurent-du-Var',
                ].map((c) => (
                  <span key={c} className="chip bg-[var(--color-mist-2)] text-[var(--color-ink)]/75 border border-[var(--color-ink)]/8">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {zones.map((z, idx) => {
              const featured = idx === 0;
              return (
                <button
                  key={z.id}
                  onClick={() => openZone(z)}
                  className={`group text-left rounded-[1.5rem] p-6 sm:p-7 transition-all card-lift overflow-hidden relative ${
                    featured
                      ? 'bg-[var(--color-ink)] text-[var(--color-mist)] sm:col-span-2 lg:col-span-1 lg:row-span-2 lg:min-h-[420px] flex flex-col justify-between mesh-bg'
                      : 'bg-[var(--color-mist-2)] hover:bg-[var(--color-ink)] hover:text-[var(--color-mist)]'
                  }`}
                >
                  {featured && (
                    <div className="absolute top-4 right-4 chip bg-[var(--color-coral)] text-[var(--color-mist)]">
                      Antenne principale
                    </div>
                  )}
                  <div className={`flex items-center justify-between mb-4 ${featured ? 'mt-2' : ''}`}>
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                      featured
                        ? 'bg-[var(--color-coral)] text-[var(--color-mist)]'
                        : 'bg-[var(--color-ink)] text-[var(--color-mist)] group-hover:bg-[var(--color-coral)]'
                    }`}>
                      <MapPin size={18} />
                    </div>
                    <span className={`text-xs uppercase tracking-wider font-mono ${
                      featured ? 'text-[var(--color-mist)]/60' : 'text-[var(--color-ink)]/55 group-hover:text-[var(--color-mist)]/60'
                    }`}>
                      {z.postalCode}
                    </span>
                  </div>
                  <h3 className={`font-display font-bold leading-tight mb-2 ${featured ? 'text-3xl sm:text-4xl' : 'text-xl sm:text-2xl'}`}>
                    {z.h1}
                  </h3>
                  <p className={`text-sm leading-relaxed ${featured ? 'text-[var(--color-mist)]/80 line-clamp-4' : 'text-[var(--color-ink)]/65 group-hover:text-[var(--color-mist)]/75 line-clamp-3'}`}>
                    {z.localIntro}
                  </p>
                  <div className={`mt-5 inline-flex items-center gap-1 text-sm font-semibold ${
                    featured ? 'text-[var(--color-coral-hi)]' : 'text-[var(--color-coral)] group-hover:text-[var(--color-coral-hi)]'
                  }`}>
                    Voir la zone <ArrowUpRight size={14} />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-10 bg-[var(--color-mist-2)] rounded-[1.5rem] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest text-[var(--color-coral)] font-semibold mb-1">Votre commune n'est pas listée&nbsp;?</div>
              <div className="font-display font-bold text-lg sm:text-xl text-[var(--color-ink)]">Nous intervenons dans tout le 06 sur demande.</div>
            </div>
            <a href={`tel:${phoneClean}`} className="inline-flex shrink-0 items-center gap-2 bg-[var(--color-ink)] hover:bg-[var(--color-coral)] text-[var(--color-mist)] px-5 py-3 rounded-full font-medium text-sm">
              <Phone size={14} /> Appeler {phone}
            </a>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 lg:py-32 bg-[var(--color-mist-2)] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-12">
            <div className="lg:col-span-7">
              <Pill tone="coral"><Star size={11} className="fill-[var(--color-coral)]" /> 5,0/5 · Avis vérifiés</Pill>
              <h2 className="mt-4 font-display font-bold display-tight text-4xl sm:text-5xl lg:text-6xl leading-[1.02] text-[var(--color-ink)]">
                Ce qu'ils en <span className="text-[var(--color-coral)]">disent.</span>
              </h2>
              <p className="mt-5 text-lg text-[var(--color-ink)]/65 max-w-xl">
                La satisfaction de nos clients est notre meilleure publicité. Des chantiers livrés proprement,
                des devis respectés à l'euro près et des explications claires à chaque étape.
              </p>
            </div>
            <div className="lg:col-span-5 lg:pt-12">
              <div className="bg-[var(--color-mist)] rounded-[1.5rem] p-6 border border-[var(--color-ink)]/8 flex items-center gap-5">
                <div>
                  <div className="font-display font-bold display-tight text-5xl text-[var(--color-coral)] leading-none">5,0</div>
                  <div className="flex items-center gap-0.5 mt-1.5">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={13} className="fill-[var(--color-coral)] text-[var(--color-coral)]" />
                    ))}
                  </div>
                </div>
                <div className="border-l border-[var(--color-ink)]/10 pl-5">
                  <div className="text-xs uppercase tracking-widest text-[var(--color-ink)]/55 font-semibold mb-1">Note moyenne</div>
                  <div className="font-display font-semibold text-base text-[var(--color-ink)]">basée sur les retours clients</div>
                  <div className="text-xs text-[var(--color-ink)]/55 mt-1">Antibes · Cannes · Nice · 06</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
            {testimonials.map((t, i) => {
              const dark = i === 0;
              const span = i === 0 ? 'lg:col-span-6' : i === 1 ? 'lg:col-span-3' : i === 2 ? 'lg:col-span-3' : 'lg:col-span-4';
              return (
                <div
                  key={t.id}
                  className={`relative rounded-[1.5rem] p-6 sm:p-7 card-lift overflow-hidden ${span} ${
                    dark
                      ? 'bg-[var(--color-ink)] text-[var(--color-mist)] mesh-bg'
                      : 'bg-[var(--color-mist)] text-[var(--color-ink)] border border-[var(--color-ink)]/8'
                  }`}
                >
                  <div className={`absolute top-5 right-5 font-display font-bold text-7xl leading-none select-none ${dark ? 'text-[var(--color-coral)]/30' : 'text-[var(--color-coral)]/15'}`}>
                    "
                  </div>
                  <div className="relative">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(t.rating)].map((_, j) => (
                        <Star key={j} size={14} className="fill-[var(--color-coral)] text-[var(--color-coral)]" />
                      ))}
                    </div>
                    <p className={`font-display ${dark ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'} leading-[1.3] mb-6 font-light`}>
                      {t.comment}
                    </p>
                    <div className={`flex items-center gap-3 pt-5 border-t ${dark ? 'border-[var(--color-mist)]/15' : 'border-[var(--color-ink)]/8'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm ${dark ? 'bg-[var(--color-coral)] text-[var(--color-mist)]' : 'bg-[var(--color-ink)] text-[var(--color-mist)]'}`}>
                        {t.author.split(' ').map((p) => p[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-display font-semibold text-sm break-words">{t.author}</div>
                        <div className={`text-xs ${dark ? 'text-[var(--color-mist)]/65' : 'text-[var(--color-ink)]/55'} break-words leading-snug`}>
                          <MapPin size={10} className="inline mr-1" />
                          {t.city} · {t.service}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 lg:py-32 bg-[var(--color-mist)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-12">
            <Pill tone="ink">Questions fréquentes</Pill>
            <h2 className="mt-4 font-display font-bold display-tight text-4xl sm:text-5xl lg:text-6xl leading-[1.02] text-[var(--color-ink)]">
              Tout ce qu'il faut <span className="text-[var(--color-coral)]">savoir.</span>
            </h2>
          </div>

          <div className="space-y-2.5">
            {faqs.map((f) => {
              const isOpen = openFaq === f.id;
              return (
                <div key={f.id} className="bg-[var(--color-mist-2)] hover:bg-[var(--color-mist)] border border-[var(--color-ink)]/8 rounded-[1.25rem] overflow-hidden transition-colors">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : f.id)}
                    className="w-full flex items-center justify-between p-5 text-left gap-4"
                  >
                    <span className="font-display font-semibold text-base sm:text-lg text-[var(--color-ink)]">{f.question}</span>
                    <span className={`shrink-0 w-9 h-9 rounded-full ${isOpen ? 'bg-[var(--color-coral)] text-[var(--color-mist)]' : 'bg-[var(--color-ink)] text-[var(--color-mist)]'} flex items-center justify-center transition-colors`}>
                      {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                    </span>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-[var(--color-ink)]/70 leading-relaxed">{f.answer}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 lg:py-32 bg-[var(--color-mist-2)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="relative overflow-hidden rounded-[2rem] bg-[var(--color-coral)] text-[var(--color-mist)] p-10 lg:p-16 text-center">
            <div className="absolute inset-0 noise opacity-50" />
            <div className="relative">
              <Pill tone="ink">Prenons rendez-vous</Pill>
              <h2 className="mt-4 font-display font-bold display-tight text-4xl sm:text-5xl lg:text-[4rem] leading-[1.02] max-w-3xl mx-auto">
                Un projet de toiture<br />
                sur la Côte d'Azur&nbsp;?
              </h2>
              <p className="mt-5 max-w-xl mx-auto text-base sm:text-lg text-[var(--color-mist)]/90">
                Décrivez-nous votre situation. Diagnostic et devis gratuits sous 24h.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={() => navigate('/contact')} className="inline-flex items-center justify-center gap-2 bg-[var(--color-ink)] text-[var(--color-mist)] px-7 py-4 rounded-2xl font-medium hover:bg-[var(--color-mist)] hover:text-[var(--color-ink)] transition-colors">
                  Demander un devis <ArrowUpRight size={18} />
                </button>
                <a href={`tel:${phoneClean}`} className="inline-flex items-center justify-center gap-2 bg-[var(--color-mist)]/15 border border-[var(--color-mist)]/30 text-[var(--color-mist)] px-7 py-4 rounded-2xl font-medium hover:bg-[var(--color-mist)] hover:text-[var(--color-coral)] transition-colors backdrop-blur">
                  <Phone size={16} /> {phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  // -------- Service detail --------
  const ServicePage: React.FC<{ service: Service }> = ({ service }) => {
    const related = services.filter((s) => s.id !== service.id).slice(0, 3);
    return (
      <>
        <section className="relative mesh-bg text-[var(--color-mist)] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-10 pb-20 lg:pt-14 lg:pb-28">
            <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 text-sm text-[var(--color-mist)]/70 hover:text-[var(--color-coral-hi)] mb-8">
              <ArrowLeft size={14} /> Retour à l'accueil
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7">
                <Pill tone="coral">Prestation</Pill>
                <h1 className="mt-4 font-display font-bold display-tight text-4xl sm:text-5xl lg:text-[4.5rem] leading-[1.02]">
                  {service.title}<span className="text-[var(--color-coral)]">.</span>
                </h1>
                <p className="mt-6 text-base sm:text-lg text-[var(--color-mist)]/80 leading-relaxed max-w-2xl">
                  {service.longDescription}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button onClick={() => navigate('/contact')} className="inline-flex items-center gap-2 bg-[var(--color-coral)] hover:bg-[var(--color-coral-lo)] text-[var(--color-mist)] px-6 py-3.5 rounded-2xl font-medium">
                    Devis gratuit <ArrowUpRight size={16} />
                  </button>
                  <a href={`tel:${phoneClean}`} className="inline-flex items-center gap-2 bg-[var(--color-mist)]/10 border border-[var(--color-mist)]/20 text-[var(--color-mist)] px-6 py-3.5 rounded-2xl font-medium hover:bg-[var(--color-mist)]/15">
                    <Phone size={14} /> {phone}
                  </a>
                </div>
              </div>
              <div className="lg:col-span-5">
                <div className="aspect-square rounded-[2rem] overflow-hidden shadow-2xl">
                  <img src={service.image} alt={service.title} className="object-cover w-full h-full" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-[var(--color-mist)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { l: 'Tarif', v: service.priceEstimate || 'Sur devis' },
              { l: 'Durée', v: service.durationEstimate || 'Selon chantier' },
              { l: 'Garantie', v: 'Décennale AXA' },
            ].map((b) => (
              <div key={b.l} className="bg-[var(--color-mist-2)] rounded-2xl p-6">
                <div className="text-xs uppercase tracking-widest text-[var(--color-coral)] font-semibold">{b.l}</div>
                <div className="mt-2 font-display font-bold text-2xl text-[var(--color-ink)]">{b.v}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16 bg-[var(--color-mist)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10">
            <Pill tone="ink">Questions fréquentes</Pill>
            <h2 className="mt-3 font-display font-bold display-tight text-3xl sm:text-4xl text-[var(--color-ink)] leading-tight mb-8">
              À propos de <span className="text-[var(--color-coral)]">{service.title.toLowerCase()}</span>.
            </h2>
            <div className="space-y-3">
              {service.faqs.map((f, i) => (
                <div key={i} className="bg-[var(--color-mist-2)] border border-[var(--color-ink)]/8 rounded-2xl p-5">
                  <div className="font-display font-semibold text-base sm:text-lg text-[var(--color-ink)] mb-2">{f.question}</div>
                  <div className="text-[var(--color-ink)]/70 leading-relaxed text-sm">{f.answer}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ZONES DESSERVIES SEO */}
        <section className="py-16 bg-[var(--color-mist)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
            <div className="bg-[var(--color-ink)] text-[var(--color-mist)] rounded-[1.75rem] p-7 sm:p-10 mesh-bg relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5">
                  <Pill tone="coral"><MapPin size={11} /> Zones desservies</Pill>
                  <h2 className="mt-4 font-display font-bold display-tight text-2xl sm:text-3xl lg:text-4xl leading-[1.05]">
                    {service.title} dans tout le <span className="text-[var(--color-coral-hi)]">06</span>.
                  </h2>
                  <p className="mt-4 text-sm text-[var(--color-mist)]/75 leading-relaxed">
                    AB Couvreur intervient pour {service.title.toLowerCase()} dans toutes les communes du bassin antibois
                    et de la Côte d'Azur. Devis et déplacement gratuits.
                  </p>
                </div>
                <div className="lg:col-span-7">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {zones.map((z) => (
                      <button
                        key={z.id}
                        onClick={() => openZone(z)}
                        className="group flex items-center justify-between gap-2 bg-[var(--color-mist)]/8 hover:bg-[var(--color-coral)] border border-[var(--color-mist)]/12 rounded-xl px-3.5 py-2.5 text-left text-sm transition-colors min-w-0"
                      >
                        <span className="font-display font-medium leading-snug break-words flex-1 min-w-0">{z.city}</span>
                        <ArrowUpRight size={12} className="opacity-50 group-hover:opacity-100 shrink-0" />
                      </button>
                    ))}
                  </div>
                  <p className="mt-4 text-xs text-[var(--color-mist)]/55 leading-relaxed">
                    Également Cap d'Antibes, Sophia Antipolis, Cagnes-sur-Mer, Saint-Laurent-du-Var, Villeneuve-Loubet
                    et toutes les communes alentours dans les Alpes-Maritimes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-[var(--color-mist-2)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
            <Pill tone="coral">Autres prestations</Pill>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map((r) => (
                <button key={r.id} onClick={() => openService(r)} className="group text-left bg-[var(--color-mist)] hover:bg-[var(--color-ink)] hover:text-[var(--color-mist)] border border-[var(--color-ink)]/8 rounded-2xl p-6 transition-colors card-lift">
                  <h3 className="font-display font-semibold text-xl mb-2">{r.title}</h3>
                  <p className="text-sm text-[var(--color-ink)]/65 group-hover:text-[var(--color-mist)]/75 line-clamp-2">{r.shortDescription}</p>
                  <div className="mt-4 text-sm font-medium text-[var(--color-coral)] group-hover:text-[var(--color-coral-hi)] inline-flex items-center gap-1">
                    Découvrir <ArrowUpRight size={14} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  };

  // -------- Zone detail --------
  const ZonePage: React.FC<{ zone: Zone }> = ({ zone }) => {
    const zoneServices = services.filter((s) => zone.keyServices.includes(s.id));
    return (
      <>
        <section className="relative mesh-bg text-[var(--color-mist)] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-10 pb-16 lg:pt-14 lg:pb-24">
            <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 text-sm text-[var(--color-mist)]/70 hover:text-[var(--color-coral-hi)] mb-8">
              <ArrowLeft size={14} /> Retour à l'accueil
            </button>
            <Pill tone="coral"><MapPin size={11} /> Zone d'intervention · {zone.postalCode}</Pill>
            <h1 className="mt-4 font-display font-bold display-tight text-4xl sm:text-5xl lg:text-[4.5rem] leading-[1.02] max-w-3xl">
              {zone.h1}<span className="text-[var(--color-coral)]">.</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-[var(--color-mist)]/80 leading-relaxed max-w-2xl">{zone.localIntro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => navigate('/contact')} className="inline-flex items-center gap-2 bg-[var(--color-coral)] hover:bg-[var(--color-coral-lo)] text-[var(--color-mist)] px-6 py-3.5 rounded-2xl font-medium">
                Devis gratuit pour {zone.city} <ArrowUpRight size={16} />
              </button>
              <a href={`tel:${phoneClean}`} className="inline-flex items-center gap-2 bg-[var(--color-mist)]/10 border border-[var(--color-mist)]/20 px-6 py-3.5 rounded-2xl font-medium hover:bg-[var(--color-mist)]/15">
                <Phone size={14} /> {phone}
              </a>
            </div>
          </div>
        </section>

        <section className="py-16 bg-[var(--color-mist)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
            <Pill tone="ink">Prestations clés à {zone.city}</Pill>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {zoneServices.map((s) => (
                <button key={s.id} onClick={() => openService(s)} className="group text-left bg-[var(--color-mist-2)] hover:bg-[var(--color-ink)] hover:text-[var(--color-mist)] rounded-2xl p-6 transition-colors card-lift">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-ink)] text-[var(--color-mist)] group-hover:bg-[var(--color-coral)] flex items-center justify-center mb-4 transition-colors">
                    <IconRenderer name={s.icon} size={16} />
                  </div>
                  <h3 className="font-display font-semibold text-xl mb-2">{s.title}</h3>
                  <p className="text-sm text-[var(--color-ink)]/65 group-hover:text-[var(--color-mist)]/75 line-clamp-2">{s.shortDescription}</p>
                </button>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  };

  // -------- Realisations --------
  const RealisationsPage = () => (
    <>
      <section className="bg-[var(--color-ink)] text-[var(--color-mist)] mesh-bg relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-14 pb-20 lg:pt-20 lg:pb-28">
          <Pill tone="coral">Galerie chantiers · Côte d'Azur</Pill>
          <h1 className="mt-4 font-display font-bold display-tight text-4xl sm:text-5xl lg:text-[4.5rem] leading-[1.02] max-w-3xl">
            Nos <span className="text-[var(--color-coral)]">chantiers</span> en images.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-[var(--color-mist)]/75">
            Une sélection de chantiers de couverture, zinguerie, charpente, Velux et isolation réalisés à Antibes,
            Juan-les-Pins, Cannes, Mougins, Nice et dans tout le 06.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button onClick={() => navigate('/contact')} className="inline-flex items-center gap-2 bg-[var(--color-coral)] hover:bg-[var(--color-coral-lo)] text-[var(--color-mist)] px-6 py-3.5 rounded-2xl font-medium">
              Lancer mon projet <ArrowUpRight size={16} />
            </button>
            <a href={`tel:${phoneClean}`} className="inline-flex items-center gap-2 bg-[var(--color-mist)]/10 border border-[var(--color-mist)]/20 px-6 py-3.5 rounded-2xl font-medium hover:bg-[var(--color-mist)]/15">
              <Phone size={14} /> {phone}
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-[var(--color-mist)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {realisations.map((r) => (
              <figure key={r.id} className="group rounded-[1.5rem] overflow-hidden bg-[var(--color-mist-2)] border border-[var(--color-ink)]/8 card-lift flex flex-col">
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img src={r.image} alt={r.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" />
                </div>
                <figcaption className="p-5 flex-1">
                  <h3 className="font-display font-semibold text-base text-[var(--color-ink)] leading-snug mb-2">{r.title}</h3>
                  <p className="text-sm text-[var(--color-ink)]/65 leading-relaxed">{r.description}</p>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-10 text-sm text-[var(--color-ink)]/55 text-center max-w-2xl mx-auto leading-relaxed">
            Une sélection de photos prises sur nos chantiers. Couverture, zinguerie, charpente, Velux, isolation,
            nettoyage — autant de prestations réalisées chez nos clients dans le bassin antibois et sur la Côte d'Azur.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-[var(--color-mist-2)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <Pill tone="coral">Votre chantier</Pill>
          <h2 className="mt-4 font-display font-bold display-tight text-3xl sm:text-4xl lg:text-5xl leading-[1.05] text-[var(--color-ink)]">
            Votre projet a sa place dans <span className="text-[var(--color-coral)]">cette galerie.</span>
          </h2>
          <p className="mt-5 text-lg text-[var(--color-ink)]/65">
            Diagnostic et devis gratuits sous 24h, partout entre Antibes, Cannes et Nice.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate('/contact')} className="inline-flex items-center justify-center gap-2 bg-[var(--color-ink)] hover:bg-[var(--color-coral)] text-[var(--color-mist)] px-7 py-4 rounded-2xl font-medium transition-colors">
              Demander un devis <ArrowUpRight size={18} />
            </button>
            <a href={`tel:${phoneClean}`} className="inline-flex items-center justify-center gap-2 border border-[var(--color-ink)] text-[var(--color-ink)] px-7 py-4 rounded-2xl font-medium hover:bg-[var(--color-ink)] hover:text-[var(--color-mist)] transition-colors">
              <Phone size={16} /> {phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );

  // -------- Contact --------
  const ContactPage = () => (
    <section className="py-12 lg:py-20 bg-[var(--color-mist)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <Pill tone="coral">Contact & devis</Pill>
            <h1 className="mt-4 font-display font-bold display-tight text-4xl sm:text-5xl lg:text-6xl leading-[1.02] text-[var(--color-ink)]">
              Parlons de votre <span className="text-[var(--color-coral)]">projet.</span>
            </h1>
            <p className="mt-5 text-lg text-[var(--color-ink)]/65 leading-relaxed">
              Diagnostic et devis gratuits sous 24h sur Antibes, Cannes, Nice et tout le bassin azuréen.
            </p>

            <div className="mt-10 space-y-4">
              <a href={`tel:${phoneClean}`} className="block bg-[var(--color-ink)] text-[var(--color-mist)] rounded-2xl p-5 hover:bg-[var(--color-coral)] transition-colors card-lift">
                <div className="text-xs uppercase tracking-widest text-[var(--color-coral-hi)] font-semibold mb-1">Téléphone</div>
                <div className="font-display font-bold text-2xl">{phone}</div>
              </a>
              {settings.email && (
                <a href={`mailto:${settings.email}`} className="block bg-[var(--color-mist-2)] border border-[var(--color-ink)]/8 rounded-2xl p-5 hover:bg-[var(--color-mist)] card-lift">
                  <div className="text-xs uppercase tracking-widest text-[var(--color-coral)] font-semibold mb-1">Email</div>
                  <div className="font-display font-bold text-lg text-[var(--color-ink)] break-all">{settings.email}</div>
                </a>
              )}
              <div className="bg-[var(--color-mist-2)] border border-[var(--color-ink)]/8 rounded-2xl p-5">
                <div className="text-xs uppercase tracking-widest text-[var(--color-coral)] font-semibold mb-1">Adresse</div>
                <div className="font-display font-semibold text-base text-[var(--color-ink)]">{settings.address}</div>
                <div className="mt-2 text-xs text-[var(--color-ink)]/55">Siège — interventions sur l'ensemble du 06.</div>
              </div>
              <div className="bg-[var(--color-mist-2)] border border-[var(--color-ink)]/8 rounded-2xl p-5">
                <div className="text-xs uppercase tracking-widest text-[var(--color-coral)] font-semibold mb-1">Horaires</div>
                <div className="font-display font-semibold text-sm text-[var(--color-ink)]">Lundi — Samedi · 7h30 — 19h30</div>
                <div className="text-xs text-[var(--color-ink)]/55">Dimanche : urgences uniquement</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-[var(--color-mist-2)] border border-[var(--color-ink)]/8 rounded-[1.75rem] p-7 sm:p-10">
              {formSubmitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--color-coral)] text-[var(--color-mist)] flex items-center justify-center mx-auto mb-5">
                    <Check size={28} />
                  </div>
                  <h2 className="font-display font-bold text-3xl text-[var(--color-ink)] mb-3">Demande transmise.</h2>
                  <p className="text-[var(--color-ink)]/65">Nous vous rappelons sous quelques heures.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  {/* Honeypot — hidden from real users, attractive to bots */}
                  <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
                    <label htmlFor="ab-website">Votre site web (ne pas remplir)</label>
                    <input
                      id="ab-website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={quoteForm.website}
                      onChange={(e) => setQuoteForm({ ...quoteForm, website: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { k: 'name', l: 'Nom', t: 'text', req: true },
                      { k: 'phone', l: 'Téléphone', t: 'tel', req: true },
                    ].map((f) => (
                      <div key={f.k}>
                        <label className="block text-xs uppercase tracking-widest text-[var(--color-coral)] mb-2 font-semibold">{f.l}</label>
                        <input
                          type={f.t}
                          required={f.req}
                          value={(quoteForm as any)[f.k]}
                          onChange={(e) => setQuoteForm({ ...quoteForm, [f.k]: e.target.value })}
                          className="w-full bg-[var(--color-mist)] border border-[var(--color-ink)]/10 rounded-xl px-4 py-3 font-display text-[var(--color-ink)] focus:border-[var(--color-coral)] focus:outline-none focus:ring-2 focus:ring-[var(--color-coral)]/20"
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[var(--color-coral)] mb-2 font-semibold">Email</label>
                    <input
                      type="email"
                      value={quoteForm.email}
                      onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                      className="w-full bg-[var(--color-mist)] border border-[var(--color-ink)]/10 rounded-xl px-4 py-3 font-display text-[var(--color-ink)] focus:border-[var(--color-coral)] focus:outline-none focus:ring-2 focus:ring-[var(--color-coral)]/20"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[var(--color-coral)] mb-2 font-semibold">Ville</label>
                      <select value={quoteForm.city} onChange={(e) => setQuoteForm({ ...quoteForm, city: e.target.value })} className="w-full bg-[var(--color-mist)] border border-[var(--color-ink)]/10 rounded-xl px-4 py-3 font-display text-[var(--color-ink)] focus:border-[var(--color-coral)] focus:outline-none">
                        {['Antibes', 'Juan-les-Pins', 'Cannes', 'Nice', 'Biot', 'Vallauris', 'Mougins', 'Valbonne', 'Cagnes-sur-Mer', 'Autre'].map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[var(--color-coral)] mb-2 font-semibold">Prestation</label>
                      <select value={quoteForm.service} onChange={(e) => setQuoteForm({ ...quoteForm, service: e.target.value })} className="w-full bg-[var(--color-mist)] border border-[var(--color-ink)]/10 rounded-xl px-4 py-3 font-display text-[var(--color-ink)] focus:border-[var(--color-coral)] focus:outline-none">
                        {services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[var(--color-coral)] mb-2 font-semibold">Urgence</label>
                    <div className="flex flex-wrap gap-2">
                      {[{ v: 'urgence', l: "Urgence" }, { v: 'rapide', l: "Sous 7 jours" }, { v: 'normal', l: "Sans urgence" }].map((o) => (
                        <button
                          type="button" key={o.v}
                          onClick={() => setQuoteForm({ ...quoteForm, urgency: o.v })}
                          className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                            quoteForm.urgency === o.v
                              ? 'bg-[var(--color-coral)] text-[var(--color-mist)] border-[var(--color-coral)]'
                              : 'bg-[var(--color-mist)] text-[var(--color-ink)] border-[var(--color-ink)]/10 hover:border-[var(--color-coral)]'
                          }`}
                        >{o.l}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[var(--color-coral)] mb-2 font-semibold">Description du projet</label>
                    <textarea rows={4} value={quoteForm.description}
                      onChange={(e) => setQuoteForm({ ...quoteForm, description: e.target.value })}
                      className="w-full bg-[var(--color-mist)] border border-[var(--color-ink)]/10 rounded-xl px-4 py-3 font-display text-[var(--color-ink)] focus:border-[var(--color-coral)] focus:outline-none focus:ring-2 focus:ring-[var(--color-coral)]/20"
                      placeholder="Décrivez votre toiture, le type de tuiles, le problème observé…"
                    />
                  </div>
                  <label className="flex items-start gap-3 text-sm text-[var(--color-ink)]/65 cursor-pointer">
                    <input type="checkbox" checked={quoteForm.gdpr}
                      onChange={(e) => setQuoteForm({ ...quoteForm, gdpr: e.target.checked })}
                      className="mt-1 accent-[var(--color-coral)]" />
                    <span>J'autorise AB Couvreur à me recontacter pour traiter ma demande de devis.</span>
                  </label>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[var(--color-ink)] hover:bg-[var(--color-coral)] disabled:bg-[var(--color-ink)]/60 disabled:cursor-not-allowed text-[var(--color-mist)] px-6 py-4 rounded-2xl font-medium text-base transition-colors"
                  >
                    {submitting ? 'Envoi en cours…' : (<>Envoyer ma demande <Send size={16} /></>)}
                  </button>
                  <p className="text-[11px] text-[var(--color-ink)]/45 leading-relaxed">
                    Vos données ne sont jamais cédées. Elles servent uniquement à vous recontacter pour traiter votre demande de devis.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="relative min-h-screen flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {serviceSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />}
      {zoneSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(zoneSchema) }} />}

      {/* Top emergency strip */}
      <div className="bg-[var(--color-ink)] text-[var(--color-mist)] text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1 text-center sm:text-left">
          <span className="flex items-center gap-2 text-[var(--color-coral-hi)]">
            <AlertTriangle size={12} /> Urgence intempéries 06 — bâchage & fuite sous 24 h
          </span>
          <a href={`tel:${phoneClean}`} className="flex items-center gap-1 hover:text-[var(--color-coral-hi)] font-medium">
            <Phone size={12} /> {phone}
          </a>
        </div>
      </div>

      <Header />
      <FullscreenMenu />

      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[var(--color-ink)] text-[var(--color-mist)] px-5 py-4 rounded-2xl shadow-xl flex items-center gap-3 max-w-md border border-[var(--color-coral)]/40"
          >
            <Sparkles className="text-[var(--color-coral-hi)] shrink-0" size={18} />
            <p className="text-sm">{notification}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPath}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {selectedService ? <ServicePage service={selectedService} /> :
              selectedZone ? <ZonePage zone={selectedZone} /> :
              currentPath === '/realisations' ? <RealisationsPage /> :
              currentPath === '/contact' ? <ContactPage /> :
              <HomePage />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />

      {/* Mobile floating phone FAB */}
      <a
        href={`tel:${phoneClean}`}
        className="md:hidden fixed bottom-5 right-5 z-40 w-14 h-14 rounded-2xl bg-[var(--color-coral)] text-[var(--color-mist)] flex items-center justify-center shadow-[0_14px_36px_-8px_rgba(255,77,54,0.6)]"
        aria-label="Appeler"
      >
        <Phone size={22} />
      </a>
    </div>
  );
};
