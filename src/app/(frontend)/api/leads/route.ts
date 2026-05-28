import { Resend } from 'resend'

import { defaultServices, defaultSiteSettings } from '@/data'

/**
 * AB Couvreur · Lead submission endpoint
 *
 * The email IS the persistence layer. A new lead triggers:
 *   1. An HTML notification to the business inbox (LEAD_NOTIFICATION_EMAIL)
 *   2. A confirmation email back to the prospect (if they provided one)
 *
 * No database dependency — the route works identically on serverless
 * (Vercel, Netlify) where the local SQLite file is read-only / ephemeral.
 *
 * If RESEND_API_KEY is missing (e.g. local dev), the lead is logged to the
 * server stdout and the user still receives a friendly success response so
 * the form is never broken.
 */

const BUSINESS_EMAIL = process.env.LEAD_NOTIFICATION_EMAIL || ''
const FROM_EMAIL = process.env.LEAD_FROM_EMAIL || ''
const RESEND_API_KEY = process.env.RESEND_API_KEY

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null
const emailReady = Boolean(resend && BUSINESS_EMAIL && FROM_EMAIL)

function escape(s: unknown) {
  return String(s ?? '').replace(/[<>&"]/g, (c) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c] ?? c),
  )
}

function urgencyLabel(u: string) {
  if (u === 'urgence') return '🚨 URGENCE (fuite, sinistre)'
  if (u === 'rapide') return '⏱️ Sous 7 jours'
  return 'Sans urgence'
}

function buildBusinessHtml(data: any, serviceTitle: string) {
  return `<!doctype html>
<html lang="fr"><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#fafaf8;padding:24px;color:#0c1623;margin:0;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(12,22,35,0.08);">
    <div style="background:#0c1623;color:#fafaf8;padding:24px 28px;">
      <div style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#ff6e5a;font-weight:600;">Nouveau devis · AB Couvreur Antibes</div>
      <h1 style="margin:10px 0 4px;font-size:24px;font-weight:700;">${escape(data.name)}</h1>
      <div style="color:rgba(250,250,248,0.7);font-size:14px;">${escape(serviceTitle)} · ${escape(data.city)}</div>
    </div>
    <div style="padding:28px;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:8px 0;color:#ff4d36;font-weight:600;width:130px;vertical-align:top;">Téléphone</td><td style="padding:8px 0;"><a href="tel:${escape(data.phone)}" style="color:#0c1623;font-weight:600;text-decoration:none;">${escape(data.phone)}</a></td></tr>
        ${data.email ? `<tr><td style="padding:8px 0;color:#ff4d36;font-weight:600;vertical-align:top;">Email</td><td style="padding:8px 0;"><a href="mailto:${escape(data.email)}" style="color:#0c1623;">${escape(data.email)}</a></td></tr>` : ''}
        <tr><td style="padding:8px 0;color:#ff4d36;font-weight:600;vertical-align:top;">Ville</td><td style="padding:8px 0;">${escape(data.city)}</td></tr>
        <tr><td style="padding:8px 0;color:#ff4d36;font-weight:600;vertical-align:top;">Prestation</td><td style="padding:8px 0;">${escape(serviceTitle)}</td></tr>
        <tr><td style="padding:8px 0;color:#ff4d36;font-weight:600;vertical-align:top;">Urgence</td><td style="padding:8px 0;">${escape(urgencyLabel(data.urgency))}</td></tr>
      </table>
      ${data.description ? `<div style="margin-top:20px;padding:16px;background:#f0efe9;border-radius:12px;"><div style="font-size:11px;color:#ff4d36;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:6px;">Description du projet</div><div style="font-size:14px;line-height:1.6;white-space:pre-wrap;">${escape(data.description)}</div></div>` : ''}
      <div style="margin-top:24px;padding-top:20px;border-top:1px solid #e5e5e0;">
        <a href="tel:${escape(data.phone)}" style="display:inline-block;background:#ff4d36;color:#ffffff;padding:12px 20px;border-radius:999px;text-decoration:none;font-size:14px;font-weight:600;">Rappeler ${escape(data.name)}</a>
        ${data.email ? `<a href="mailto:${escape(data.email)}" style="display:inline-block;background:#0c1623;color:#ffffff;padding:12px 20px;border-radius:999px;text-decoration:none;font-size:14px;font-weight:600;margin-left:8px;">Répondre par email</a>` : ''}
      </div>
    </div>
    <div style="padding:14px 28px;background:#f0efe9;font-size:11px;color:rgba(12,22,35,0.55);text-align:center;">
      Reçu le ${new Date().toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Europe/Paris' })} via le formulaire de devis
    </div>
  </div>
</body></html>`
}

function buildBusinessText(data: any, serviceTitle: string) {
  return [
    `Nouveau devis — AB Couvreur Antibes`,
    `=================================`,
    ``,
    `Nom        : ${data.name}`,
    `Téléphone  : ${data.phone}`,
    data.email ? `Email      : ${data.email}` : null,
    `Ville      : ${data.city}`,
    `Prestation : ${serviceTitle}`,
    `Urgence    : ${urgencyLabel(data.urgency)}`,
    ``,
    data.description ? `Description :\n${data.description}` : null,
    ``,
    `Reçu le ${new Date().toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Europe/Paris' })}`,
  ]
    .filter(Boolean)
    .join('\n')
}

function buildClientHtml(data: any, serviceTitle: string) {
  return `<!doctype html>
<html lang="fr"><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#fafaf8;padding:24px;color:#0c1623;margin:0;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;">
    <div style="background:#0c1623;color:#fafaf8;padding:28px;">
      <h1 style="margin:0 0 6px;font-size:22px;">Merci ${escape(data.name)} 🙏</h1>
      <p style="margin:0;color:rgba(250,250,248,0.75);font-size:15px;">Votre demande a bien été reçue.</p>
    </div>
    <div style="padding:28px;font-size:14px;line-height:1.6;">
      <p>Nous avons bien reçu votre demande de devis pour <strong>${escape(serviceTitle)}</strong> à <strong>${escape(data.city)}</strong>.</p>
      <p>Nous vous recontactons sous quelques heures (jours ouvrés) pour planifier un diagnostic gratuit sur place.</p>
      <p style="margin-top:24px;">Besoin d'une intervention urgente&nbsp;?<br/><a href="tel:${escape(defaultSiteSettings.phone)}" style="color:#ff4d36;font-weight:600;">${escape(defaultSiteSettings.phone)}</a></p>
      <p style="margin-top:28px;padding-top:20px;border-top:1px solid #e5e5e0;color:rgba(12,22,35,0.6);font-size:12px;">— L'équipe AB Couvreur · Antibes · Côte d'Azur</p>
    </div>
  </div>
</body></html>`
}

function isValidEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
}

function isPlausiblePhone(s: string) {
  const digits = s.replace(/[^\d]/g, '')
  return digits.length >= 9 && digits.length <= 15
}

// In-memory rate limit per IP — simple, effective on a single instance.
// On serverless (Vercel), each invocation may have a fresh memory so this is
// best-effort. For stronger protection, set up Vercel Edge KV / Upstash.
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 5
const rateMap = new Map<string, { count: number; until: number }>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || entry.until < now) {
    rateMap.set(ip, { count: 1, until: now + RATE_LIMIT_WINDOW_MS })
    return false
  }
  if (entry.count >= RATE_LIMIT_MAX) return true
  entry.count++
  return false
}

export async function POST(request: Request) {
  // --- 1. Parse & validate input -------------------------------------------------
  let data: any
  try {
    data = await request.json()
  } catch {
    return Response.json({ ok: false, error: 'Requête invalide.' }, { status: 400 })
  }

  // Honeypot — bots fill every field. Real users never see this one.
  if (data?.website) {
    // Silently accept to avoid telling the bot it was caught.
    return Response.json({ ok: true })
  }

  if (!data?.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    return Response.json({ ok: false, error: 'Nom requis.' }, { status: 400 })
  }
  if (!data?.phone || typeof data.phone !== 'string' || !isPlausiblePhone(data.phone)) {
    return Response.json({ ok: false, error: 'Numéro de téléphone invalide.' }, { status: 400 })
  }
  if (data.email && typeof data.email === 'string' && data.email.length > 0 && !isValidEmail(data.email)) {
    return Response.json({ ok: false, error: 'Email invalide.' }, { status: 400 })
  }
  if (!data?.gdpr) {
    return Response.json({ ok: false, error: 'Le consentement RGPD est requis.' }, { status: 400 })
  }

  // --- 2. Rate limit -------------------------------------------------------------
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  if (rateLimited(ip)) {
    return Response.json(
      { ok: false, error: 'Trop de demandes. Réessayez dans une minute ou appelez-nous directement.' },
      { status: 429 },
    )
  }

  const serviceTitle =
    defaultServices.find((s) => s.id === data.service)?.title || data.service || 'Toiture'

  // --- 3. Send notification email (the actual "persistence") ---------------------
  if (emailReady && resend) {
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: BUSINESS_EMAIL,
        replyTo: data.email || undefined,
        subject: `Nouveau devis · ${serviceTitle} à ${data.city} · ${data.name}`,
        html: buildBusinessHtml(data, serviceTitle),
        text: buildBusinessText(data, serviceTitle),
      })

      if (data.email && isValidEmail(data.email)) {
        // Confirmation to prospect — best-effort, never fail the request on this.
        resend.emails
          .send({
            from: FROM_EMAIL,
            to: data.email,
            subject: 'Votre demande de devis · AB Couvreur Antibes',
            html: buildClientHtml(data, serviceTitle),
          })
          .catch((err) => console.error('[leads] Client confirmation email failed:', err))
      }
    } catch (err) {
      console.error('[leads] CRITICAL: business notification failed:', err)
      // Surface a clear error so the user knows to call instead.
      return Response.json(
        {
          ok: false,
          error:
            "Nous n'avons pas pu envoyer votre demande. Merci de nous appeler directement au " +
            defaultSiteSettings.phone,
        },
        { status: 502 },
      )
    }
  } else {
    // Email not configured (missing RESEND_API_KEY, LEAD_NOTIFICATION_EMAIL or
    // LEAD_FROM_EMAIL). Log the lead so nothing is lost in local testing and
    // still return success to the client.
    console.warn('[leads] Email notification not configured — lead logged only:')
    console.warn(JSON.stringify({ ...data, ip, serviceTitle, ts: new Date().toISOString() }, null, 2))
  }

  return Response.json({ ok: true })
}

export async function GET() {
  return Response.json(
    { ok: true, message: 'POST a JSON body to submit a lead.' },
    { status: 200 },
  )
}
