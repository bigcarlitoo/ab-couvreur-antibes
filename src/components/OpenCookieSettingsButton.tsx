'use client'

import React from 'react'

export const OpenCookieSettingsButton: React.FC<{ className?: string; children?: React.ReactNode }> = ({
  className,
  children,
}) => (
  <button
    type="button"
    onClick={() => (window as any).__openCookieSettings?.()}
    className={
      className ||
      'inline-flex items-center gap-2 bg-[var(--color-ink)] hover:bg-[var(--color-coral)] text-[var(--color-mist)] px-5 py-3 rounded-xl font-medium text-sm transition-colors'
    }
  >
    {children || 'Gérer mes cookies'}
  </button>
)
