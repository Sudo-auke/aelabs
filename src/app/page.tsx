import { redirect } from 'next/navigation'

// Fallback redirect to default locale
export default function RootPage() {
  redirect('/fr')
}
