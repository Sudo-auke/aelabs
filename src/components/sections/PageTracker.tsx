'use client'

import { useEffect, useRef } from 'react'

interface PageTrackerProps {
  path: string
}

export function PageTracker({ path }: PageTrackerProps) {
  const startTime = useRef(Date.now())
  const maxScroll = useRef(0)
  const beaconsSent = useRef(new Set<number>())
  const pageviewLogged = useRef(false)

  useEffect(() => {
    // Extract UTM params + referrer
    const params = new URLSearchParams(window.location.search)
    const referrer = document.referrer || undefined
    const utmSource = params.get('utm_source') || undefined
    const utmMedium = params.get('utm_medium') || undefined
    const utmCampaign = params.get('utm_campaign') || undefined

    // Log initial pageview
    if (!pageviewLogged.current) {
      pageviewLogged.current = true
      fetch('/api/pageview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, referrer, utmSource, utmMedium, utmCampaign }),
      }).catch(() => {})
    }

    // Track scroll depth
    function handleScroll() {
      const scrolled = Math.round(
        ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
      )
      if (scrolled > maxScroll.current) {
        maxScroll.current = Math.min(scrolled, 100)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Send beacons at 30s, 60s, 120s
    const timers = [30, 60, 120].map(seconds =>
      setTimeout(() => {
        if (beaconsSent.current.has(seconds)) return
        beaconsSent.current.add(seconds)
        fetch('/api/pageview', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            path,
            timeOnPage: seconds,
            scrollDepth: maxScroll.current,
          }),
        }).catch(() => {})
      }, seconds * 1000)
    )

    // Send final beacon on unload
    function handleUnload() {
      const elapsed = Math.round((Date.now() - startTime.current) / 1000)
      navigator.sendBeacon(
        '/api/pageview',
        JSON.stringify({
          path,
          timeOnPage: elapsed,
          scrollDepth: maxScroll.current,
          final: true,
        })
      )
    }
    window.addEventListener('beforeunload', handleUnload)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('beforeunload', handleUnload)
      timers.forEach(clearTimeout)
    }
  }, [path])

  return null
}
