import type { ReactNode } from 'react'

export const metadata = {
  title: {
    default: 'EMBDX — Solutions Électroniques Automobile',
    template: '%s | EMBDX',
  },
  description:
    "Solutions électroniques et logicielles pour l'industrie automobile. OEM, Tier 1/2, logiciel embarqué, outils d'ingénierie.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return children
}
