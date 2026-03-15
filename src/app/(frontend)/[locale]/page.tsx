import { CtaSection } from '@/components/sections/CtaSection'
import { Hero } from '@/components/sections/Hero'
import { Pillars } from '@/components/sections/Pillars'
import { SolutionsPreview } from '@/components/sections/SolutionsPreview'
import { Stats } from '@/components/sections/Stats'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params

  return (
    <main>
      <Hero locale={locale} />
      <Pillars />
      <Stats />
      <SolutionsPreview locale={locale} />
      <CtaSection locale={locale} />
    </main>
  )
}
