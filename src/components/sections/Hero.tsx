'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Activity, ArrowRight, Cpu, Database, Terminal } from 'lucide-react'

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay },
})

export function Hero({ locale }: { locale: string }) {
  const t = useTranslations('home.hero')

  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center pt-32 pb-20 px-6">
      {/* Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="perspective-grid" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent-primary/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-accent-secondary/15 blur-[100px] rounded-full pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div {...fade(0)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] mb-8">
          <span className="flex h-2 w-2 rounded-full bg-accent-secondary" />
          <span className="text-xs font-medium text-content-secondary">{t('badge')}</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          {...fade(0.1)}
          className="tracking-tightest text-5xl md:text-7xl font-bold text-content-primary max-w-4xl mb-6 leading-[1.1]"
        >
          {t('title_start')}{' '}
          <span className="gradient-text">{t('title_highlight')}</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p {...fade(0.2)} className="text-lg md:text-xl text-content-secondary max-w-2xl mb-10">
          {t('subtitle')}
        </motion.p>

        {/* CTAs */}
        <motion.div {...fade(0.3)} className="flex flex-col sm:flex-row items-center gap-4 mb-20">
          <Link
            href={`/${locale}/solutions`}
            className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-content-primary text-background font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            {t('cta_primary')} <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="w-full sm:w-auto px-8 py-3.5 rounded-lg border border-white/[0.08] bg-surface text-content-primary font-semibold hover:bg-background-alt transition-colors"
          >
            {t('cta_secondary')}
          </Link>
        </motion.div>

        {/* CAN Bus Analyzer Product Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-5xl rounded-xl border border-white/[0.08] bg-surface shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Mockup Header */}
          <div className="h-12 border-b border-white/[0.06] flex items-center px-4 justify-between bg-background-alt/50">
            <div className="flex items-center gap-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-content-secondary bg-background px-2 py-1 rounded border border-white/[0.06]">
                <Terminal className="w-3 h-3" /> AE_BusAnalyzer_Pro
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-content-secondary">
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3 text-accent-secondary" /> CAN1: Online
              </span>
              <span className="flex items-center gap-1">
                <Database className="w-3 h-3 text-accent-primary" /> Logging
              </span>
            </div>
          </div>

          {/* Mockup Body */}
          <div className="flex flex-col md:flex-row h-[360px] bg-background text-left">
            {/* Sidebar */}
            <div className="w-full md:w-64 border-r border-white/[0.06] p-3 flex flex-col gap-1 text-xs font-mono text-content-secondary bg-surface/30 overflow-y-auto">
              <div className="text-content-primary font-medium mb-2 px-2 flex items-center gap-2">
                <Cpu className="w-3 h-3" /> Network Topology
              </div>
              <div className="text-content-primary bg-accent-primary/10 px-2 py-1.5 rounded border border-accent-primary/20">
                ▼ CAN_Powertrain
              </div>
              {['ECU_EngineControl', 'ECU_Transmission', 'ECU_BrakeSystem'].map((name, i) => (
                <div key={name} className="pl-4 py-1 hover:text-content-primary cursor-pointer" style={{ color: i === 1 ? 'var(--accent-secondary)' : undefined }}>
                  {i < 2 ? '├─' : '└─'} {name}
                </div>
              ))}
              <div className="mt-2 text-content-primary px-2 py-1.5 rounded hover:bg-surface cursor-pointer">▶ CAN_Infotainment</div>
              <div className="text-content-primary px-2 py-1.5 rounded hover:bg-surface cursor-pointer">▶ LIN_BodyControl</div>
            </div>

            {/* Main Panel */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* Tabs */}
              <div className="flex border-b border-white/[0.06] bg-surface/50 text-xs font-mono">
                {['Trace', 'Signals', 'Graphics', 'Diagnostics'].map((tab, i) => (
                  <div
                    key={tab}
                    className={`px-4 py-2 cursor-pointer ${i === 0 ? 'border-b-2 border-accent-primary text-content-primary' : 'text-content-secondary hover:text-content-primary'}`}
                  >
                    {tab}
                  </div>
                ))}
              </div>

              {/* Table Header */}
              <div className="grid grid-cols-6 border-b border-white/[0.06] px-4 py-2 text-xs font-mono text-content-secondary bg-background-alt/30">
                <div>Time</div>
                <div>ID (Hex)</div>
                <div className="col-span-2">Name</div>
                <div>DLC</div>
                <div>Data (Hex)</div>
              </div>

              {/* Table Rows */}
              <div className="flex flex-col text-xs font-mono overflow-y-auto">
                {[
                  { time: '12.0041', id: '0x0C1', name: 'Engine_Data_Fast',  dlc: '8', data: 'FF 00 A1 2B 00 00 00 00', hi: false },
                  { time: '12.0052', id: '0x1A4', name: 'Trans_Status',       dlc: '8', data: '01 4A 00 00 00 00 00 00', hi: true  },
                  { time: '12.0089', id: '0x2B0', name: 'Wheel_Speeds',       dlc: '8', data: '1A 2B 1A 2C 1A 2A 1A 2B', hi: false },
                  { time: '12.0101', id: '0x0C1', name: 'Engine_Data_Fast',   dlc: '8', data: 'FF 00 A2 2B 00 00 00 00', hi: false },
                  { time: '12.0150', id: '0x3C2', name: 'Brake_Pressure',     dlc: '4', data: '0A 14 00 00',             hi: false },
                  { time: '12.0182', id: '0x1A4', name: 'Trans_Status',       dlc: '8', data: '01 4B 00 00 00 00 00 00', hi: true  },
                  { time: '12.0205', id: '0x4F0', name: 'Steering_Angle',     dlc: '6', data: '00 12 00 00 00 00',       hi: false },
                ].map((row, i) => (
                  <div
                    key={i}
                    className={`grid grid-cols-6 px-4 py-2 border-b border-white/[0.04] hover:bg-surface/50 cursor-pointer ${row.hi ? 'bg-accent-secondary/5 text-content-primary' : 'text-content-secondary'}`}
                  >
                    <div className="text-content-secondary/60">{row.time}</div>
                    <div className={row.hi ? 'text-accent-secondary' : 'text-accent-primary'}>{row.id}</div>
                    <div className="col-span-2">{row.name}</div>
                    <div>{row.dlc}</div>
                    <div className="tracking-widest">{row.data}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
