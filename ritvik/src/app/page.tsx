"use client"

import { useState, useRef, useEffect } from 'react'
import {
  MapPin, Mail, Globe, ExternalLink, Linkedin,
  LayoutGrid, Briefcase, Zap, GraduationCap, ChevronDown, ChevronUp,
  Salad, Activity, Music, Sparkles, Trophy, Medal, Users, Package,
  Smartphone, MonitorSmartphone, Server, Terminal, BookOpen, KeyRound,
  Watch, Disc3, ChefHat, Palette, HeartHandshake, ArrowUpRight,
} from 'lucide-react'
import { FaApple } from 'react-icons/fa'
import {
  Reveal, CountUp,
  LogTriageDemo, EyeGazeDemo, ProvisionRaceDemo, PrinterDemo,
  HealthLoopDemo, BeatTapDemo, ViolinDemo, IronmanTracker,
} from '@/components/demos'

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  bg:        '#F5F5F7',
  surface:   '#FFFFFF',
  surface2:  '#F2F2F7',
  label:     '#1D1D1F',
  label2:    '#6E6E73',
  label3:    '#AEAEB2',
  sep:       'rgba(60,60,67,0.10)',
  forest:    '#1C3829',
  forestMid: '#2D6A4F',
  forestBg:  '#E8F2EC',
  forestBg2: '#D4E8DB',
}

// ─── Dock constants ───────────────────────────────────────────────────────────
const DOCK_BASE = 48
const DOCK_MAX_SCALE = 1.65
const DOCK_RADIUS = 120
const DOCK_EXTRA_PAD = Math.ceil(DOCK_BASE * (DOCK_MAX_SCALE - 1)) + 8

// ─── Hello constants ──────────────────────────────────────────────────────────
const HELLOS = ['Hello.', 'Hola.', 'Bonjour.', 'नमस्ते।', 'Ciao.', 'こんにちは。', 'Hello.']
const RAINBOW = 'linear-gradient(90deg, #bf5af2 0%, #0a84ff 20%, #30d158 40%, #ffd60a 60%, #ff9f0a 80%, #ff375f 100%)'

// ─── Shared bits ──────────────────────────────────────────────────────────────

function Chip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
      style={{ background: C.surface2, color: C.label2 }}>
      {label}
    </span>
  )
}

function LiveDot({ text = 'Current' }: { text?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: C.forestBg, color: C.forest }}>
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
          style={{ background: C.forest }} />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: C.forest }} />
      </span>
      {text}
    </span>
  )
}

function SectionLabel({ eyebrow, heading, sub }: { eyebrow: string; heading: string; sub?: string }) {
  return (
    <Reveal className="mb-10">
      <p className="text-xs font-bold tracking-widest uppercase mb-1.5" style={{ color: C.forest }}>{eyebrow}</p>
      <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: C.label }}>{heading}</h2>
      {sub && <p className="text-sm mt-2 max-w-xl leading-relaxed" style={{ color: C.label2 }}>{sub}</p>}
    </Reveal>
  )
}

function LogoTile({ text, bg = C.forestBg, color = C.forest }: { text: string; bg?: string; color?: string }) {
  return (
    <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-black flex-shrink-0"
      style={{ background: bg, color, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      {text}
    </div>
  )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-3xl card-lift ${className}`}
      style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.05)', border: `1px solid ${C.sep}` }}>
      {children}
    </div>
  )
}

// ─── Dock ─────────────────────────────────────────────────────────────────────

function Dock() {
  const items = [
    { Icon: Briefcase,     label: 'Work',        href: '#work' },
    { Icon: Salad,         label: 'FasterFoods', href: '#fasterfoods' },
    { Icon: LayoutGrid,    label: 'Projects',    href: '#projects' },
    { Icon: Activity,      label: 'Sport',       href: '#sport' },
    { Icon: Music,         label: 'Beyond',      href: '#beyond' },
    { Icon: Zap,           label: 'Skills',      href: '#skills' },
    { Icon: GraduationCap, label: 'Education',   href: '#education' },
    { Icon: Mail,          label: 'Contact',     href: '#contact' },
  ]

  const itemRefs = useRef<(HTMLDivElement | null)[]>(items.map(() => null))
  const [mouseX, setMouseX] = useState<number | null>(null)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  function getScale(i: number): number {
    if (mouseX === null) return 1
    const el = itemRefs.current[i]
    if (!el) return 1
    const { left, width } = el.getBoundingClientRect()
    const d = Math.abs(mouseX - (left + width / 2))
    if (d >= DOCK_RADIUS) return 1
    return 1 + (DOCK_MAX_SCALE - 1) * Math.cos((d / DOCK_RADIUS) * (Math.PI / 2))
  }

  const isHovering = mouseX !== null
  const slotHeight = Math.ceil(DOCK_BASE * DOCK_MAX_SCALE)

  return (
    <div className="fixed bottom-4 sm:bottom-6 inset-x-0 flex justify-center z-50 pointer-events-none px-2">
      <nav
        className="pointer-events-auto flex items-end px-2.5 pb-2.5 rounded-[26px] glass border shadow-xl max-w-full overflow-x-auto"
        style={{
          borderColor: C.sep,
          boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
          paddingTop: DOCK_EXTRA_PAD,
          gap: 6,
        }}
        onMouseMove={e => setMouseX(e.clientX)}
        onMouseLeave={() => { setMouseX(null); setHoveredIdx(null) }}
      >
        {items.map(({ Icon, label, href }, i) => {
          const scale = getScale(i)
          const sz = Math.round(DOCK_BASE * scale)
          const isHov = hoveredIdx === i
          return (
            <a key={label} href={href}
              className="relative flex flex-col items-center justify-end"
              style={{ height: slotHeight }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}>
              <div className="absolute left-1/2 pointer-events-none px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap"
                style={{
                  bottom: 'calc(100% + 8px)', transform: 'translateX(-50%)',
                  background: C.surface, color: C.label,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.12)', border: `1px solid ${C.sep}`,
                  opacity: isHov ? 1 : 0, transition: 'opacity 0.12s ease',
                }}>
                {label}
              </div>
              <div ref={el => { itemRefs.current[i] = el }}
                className="flex items-center justify-center rounded-[16px]"
                style={{
                  width: sz, height: sz,
                  background: isHov ? C.forestBg2 : C.forestBg,
                  color: C.forest,
                  transition: isHovering
                    ? 'width 0.08s ease, height 0.08s ease, background 0.12s ease'
                    : 'width 0.42s cubic-bezier(0.34,1.56,0.64,1), height 0.42s cubic-bezier(0.34,1.56,0.64,1), background 0.12s ease',
                  boxShadow: isHov ? '0 4px 16px rgba(28,56,41,0.18)' : 'none',
                }}>
                <Icon size={Math.round(22 * scale)} strokeWidth={1.75} />
              </div>
            </a>
          )
        })}
      </nav>
    </div>
  )
}

// ─── Hello Effect ─────────────────────────────────────────────────────────────

function HelloEffect() {
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)
  const isDone = idx === HELLOS.length - 1

  useEffect(() => {
    if (isDone) return
    const delay = idx === 0 ? 2800 : 380
    const t = setTimeout(() => setVisible(false), delay)
    return () => clearTimeout(t)
  }, [idx, isDone])

  useEffect(() => {
    if (!visible && !isDone) {
      const t = setTimeout(() => { setIdx(i => i + 1); setVisible(true) }, 160)
      return () => clearTimeout(t)
    }
  }, [visible, isDone])

  return (
    <div className="mb-5 select-none" style={{ lineHeight: 1 }}>
      <span key={idx} className={idx === 0 ? 'hello-animate' : ''}
        style={{
          display: 'inline-block',
          fontSize: 'clamp(3rem, 9vw, 5.5rem)',
          fontFamily: 'var(--font-dancing)',
          fontWeight: 700,
          background: RAINBOW,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(-8px)',
          transition: idx > 0 ? 'opacity 0.14s ease, transform 0.14s ease' : undefined,
        }}>
        {HELLOS[idx]}
      </span>
    </div>
  )
}

// ─── Rotating identity ────────────────────────────────────────────────────────

const IDENTITIES = [
  'I build AI systems.',
  'I run ultramarathons.',
  'I ship full-stack products.',
  'I play the violin.',
  'I cook. A lot.',
  'I geek out on big ideas.',
]

function RotatingIdentity() {
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false)
      setTimeout(() => { setIdx(i => (i + 1) % IDENTITIES.length); setVisible(true) }, 260)
    }, 2600)
    return () => clearInterval(t)
  }, [])

  return (
    <p className="text-lg sm:text-xl font-semibold h-7 mb-6"
      style={{
        color: C.forestMid,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(6px)',
        transition: 'opacity 0.25s ease, transform 0.25s ease',
      }}>
      {IDENTITIES[idx]}
    </p>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center px-5 pt-24 pb-32 min-h-screen relative overflow-hidden">
      <HelloEffect />

      {/* Monogram avatar */}
      <div className="float mb-7">
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center text-4xl font-black text-white"
          style={{
            background: `linear-gradient(140deg, ${C.forestMid}, ${C.forest})`,
            boxShadow: '0 0 0 4px #fff, 0 8px 40px rgba(28,56,41,0.25)',
          }}>
          RJ
        </div>
      </div>

      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-4"
        style={{ color: C.label }}>
        Ritvik <span className="gradient-text">Joshi</span>
      </h1>

      <RotatingIdentity />

      <p className="flex items-center justify-center gap-1.5 text-sm mb-6" style={{ color: C.label3 }}>
        <MapPin size={13} style={{ color: C.forest }} />
        London, UK
      </p>

      <p className="text-base max-w-lg leading-relaxed mb-8" style={{ color: C.label2 }}>
        Tinkering with technology since I was 12 — now building AI systems for global aviation at{' '}
        <span className="font-semibold" style={{ color: C.label }}>SITA</span>, and{' '}
        <a href="https://fasterfoods.co.uk" target="_blank" rel="noopener noreferrer"
          className="font-semibold hover:underline" style={{ color: C.forest }}>FasterFoods</a>
        {' '}after hours. I love collaborating, big ideas, and geeking out — scroll down and you can{' '}
        <span className="font-semibold" style={{ color: C.label }}>play with little working demos</span>{' '}
        of almost everything I&apos;ve done.
      </p>

      <div className="flex flex-wrap gap-3 justify-center mb-6">
        <a href="https://linkedin.com/in/ritvik-joshi-327508ba" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: C.forest }}>
          <Linkedin size={15} /> LinkedIn
        </a>
        <a href="https://fasterfoods.co.uk" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors"
          style={{ background: C.forestBg, color: C.forest }}>
          <Globe size={15} /> FasterFoods
        </a>
        <a href="mailto:ritvikjoshi97@gmail.com"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border"
          style={{ background: C.surface, color: C.label2, borderColor: C.sep, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <Mail size={15} /> Email
        </a>
      </div>

      <div className="animate-bounce mt-6" style={{ color: C.label3 }}>
        <ChevronDown size={20} />
      </div>
    </section>
  )
}

// ─── Stats strip ──────────────────────────────────────────────────────────────

const STATS = [
  { value: 16,    suffix: '',   label: 'years tinkering with tech' },
  { value: 99.99, suffix: '%',  label: 'FasterFoods uptime, on a Raspberry Pi', decimals: 2 },
  { value: 8,     suffix: '',   label: 'teams I consult on AI across Europe & Asia' },
  { value: 5,     suffix: '★',  label: 'Dance Helper on the App Store' },
]

function StatsStrip() {
  return (
    <section className="px-5 pb-4">
      <div className="max-w-4xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 90}>
            <div className="bg-white rounded-3xl p-5 text-center h-full"
              style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.05)', border: `1px solid ${C.sep}` }}>
              <p className="text-3xl font-black mb-1" style={{ color: C.forest }}>
                <CountUp to={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} />
              </p>
              <p className="text-xs leading-snug" style={{ color: C.label2 }}>{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

// ─── Work ─────────────────────────────────────────────────────────────────────

type Role = {
  title: string
  period: string
  highlight?: string
  responsibilities: string[]
  skills: string[]
}

type Experience = {
  company: string
  monogram: string
  linkedIn?: string
  location: string
  isCurrent?: boolean
  roles: Role[]
  demo?: React.ReactNode
  demoHook?: string
}

const experiences: Experience[] = [
  {
    company: 'SITA',
    monogram: 'SA',
    linkedIn: 'https://www.linkedin.com/company/sita/',
    location: 'London, United Kingdom',
    isCurrent: true,
    demo: <LogTriageDemo />,
    demoHook: 'See the AI triage in action',
    roles: [
      {
        title: 'Associate Software Engineer, Passenger Portfolio',
        period: "Aug '23 — Present",
        highlight: '🏆 2025 CSKO Euro Geo Award — Best Transformation & Innovation Deal',
        responsibilities: [
          'Designed and built an AI-powered log analysis system that diagnoses issues in software deployed at airports worldwide — an Agentic RAG pipeline (Pydantic, LangChain, Ollama) with a custom-trained model and React front-end. Triaging went from 2 weeks to minutes.',
          'Built a natural-language rule engine (Angular + .NET) inside a white-label airline app that agents use to check in, board passengers, and manage luggage — part of the award-winning deal.',
          'Shipped a white-label cruise baggage-handling and bag-tag printing React app with custom CI/CD over distributed Kubernetes clusters.',
          'Portfolio AI SPOC: internal AI consultant for 8 teams across Europe & Asia — 10+ training courses, ideation workshops, PoC development, and company-wide AI governance, evaluations, and risk assessments.',
          'Led UI/UX and front-end for a product re-certification portal — designed in Figma, built in Angular, covering user, admin, and superuser flows.',
        ],
        skills: ['React', 'Angular', '.NET', 'Python', 'LangChain', 'Ollama', 'Pydantic', 'Kubernetes', 'CI/CD', 'Figma'],
      },
      {
        title: 'Graduate Software Engineer',
        period: "Sept '22 — Aug '23",
        responsibilities: [
          'Built a full-stack product-component repository enabling post-deployment risk minimisation across all SITA products — C# API, SQL database, React front-end with Azure AD auth.',
        ],
        skills: ['C#', 'React', 'SQL', 'Azure AD'],
      },
    ],
  },
  {
    company: 'Blueskeye AI',
    monogram: 'B',
    linkedIn: 'https://www.linkedin.com/company/blueskeye-ai/',
    location: 'Nottingham, United Kingdom',
    demo: <EyeGazeDemo />,
    demoHook: 'Let these eyes follow your cursor',
    roles: [
      {
        title: 'Machine Learning Engineering Intern',
        period: "May '22 — Aug '22",
        responsibilities: [
          'Developed a deep learning model to predict eye gaze from infrared cameras for automotive safety — TensorFlow, OpenCV, WandB.',
          'Built the visual data collection and storage pipeline in Python.',
        ],
        skills: ['Python', 'TensorFlow', 'OpenCV', 'Deep Learning', 'WandB'],
      },
    ],
  },
  {
    company: 'Wipro Limited (R&D)',
    monogram: 'W',
    linkedIn: 'https://www.linkedin.com/company/wipro/',
    location: 'Bangalore, India',
    demo: <ProvisionRaceDemo />,
    demoHook: 'Race my automation against the ticket queue',
    roles: [
      {
        title: 'Project Engineer, Chief Technology Office',
        period: "Sept '20 — Aug '21",
        responsibilities: [
          'Built a Node.js application that acquires and sets up AWS environments — cutting setup time by 99%, from 2 days to 10 minutes.',
          'Built a full-stack blockchain banking application with Angular, Node.js, and Hyperledger Fabric.',
        ],
        skills: ['Node.js', 'AWS', 'Angular', 'Hyperledger Fabric', 'MongoDB'],
      },
    ],
  },
  {
    company: 'Fracktal Works',
    monogram: 'F',
    linkedIn: 'https://www.linkedin.com/company/fracktal/',
    location: 'Bangalore, India',
    demo: <PrinterDemo />,
    demoHook: 'Print a vase, layer by layer',
    roles: [
      {
        title: 'Summer Intern, R&D',
        period: "May '19 — July '19",
        responsibilities: [
          'Built a Flutter iOS/Android app to connect to and control 3D printers.',
        ],
        skills: ['Flutter', 'Dart', 'Python'],
      },
    ],
  },
]

function ExpCard({ exp, delay }: { exp: Experience; delay: number }) {
  const [open, setOpen] = useState(false)
  const [demoOpen, setDemoOpen] = useState(false)
  const totalBullets = exp.roles.reduce((n, r) => n + r.responsibilities.length, 0)

  return (
    <Reveal delay={delay}>
      <Card className="overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-4 mb-5">
            <LogoTile text={exp.monogram} />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <h3 className="text-base font-bold" style={{ color: C.label }}>{exp.company}</h3>
                {exp.isCurrent && <LiveDot />}
                {exp.linkedIn && (
                  <a href={exp.linkedIn} target="_blank" rel="noopener noreferrer"
                    className="transition-colors hover:opacity-60" style={{ color: C.label3 }}>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
              <p className="text-sm" style={{ color: C.label3 }}>{exp.location}</p>
            </div>
          </div>

          <div className="space-y-5">
            {exp.roles.map((role, ri) => {
              if (ri > 0 && !open) return null
              return (
                <div key={ri} className={ri > 0 ? 'pt-5' : ''}
                  style={ri > 0 ? { borderTop: `1px solid ${C.sep}` } : {}}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-sm font-semibold" style={{ color: C.label }}>{role.title}</p>
                    <span className="text-xs font-mono flex-shrink-0" style={{ color: C.label3 }}>{role.period}</span>
                  </div>

                  {role.highlight && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold mb-3"
                      style={{ background: '#FFFBEB', border: '1px solid rgba(217,119,6,0.2)', color: '#B45309' }}>
                      {role.highlight}
                    </div>
                  )}

                  <ul className="space-y-2 mb-3">
                    {(open || ri > 0 ? role.responsibilities : role.responsibilities.slice(0, 2)).map((r, i) => (
                      <li key={i} className="flex gap-2.5 text-sm leading-relaxed" style={{ color: C.label2 }}>
                        <span className="mt-2 w-1 h-1 rounded-full flex-shrink-0" style={{ background: C.forestMid }} />
                        {r}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-1.5">
                    {role.skills.map(s => <Chip key={s} label={s} />)}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-4">
            {totalBullets > 2 && (
              <button onClick={() => setOpen(!open)}
                className="flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-70"
                style={{ color: C.label2 }}>
                {open ? <><ChevronUp size={14} /> Show less</> : <><ChevronDown size={14} /> Full story</>}
              </button>
            )}
            {exp.demo && (
              <button onClick={() => setDemoOpen(!demoOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all hover:opacity-85"
                style={{ background: demoOpen ? C.forest : C.forestBg, color: demoOpen ? '#fff' : C.forest }}>
                <Sparkles size={12} />
                {demoOpen ? 'Hide demo' : exp.demoHook}
              </button>
            )}
          </div>
        </div>

        {exp.demo && demoOpen && (
          <div className="px-6 pb-6 demo-enter">{exp.demo}</div>
        )}
      </Card>
    </Reveal>
  )
}

function WorkSection() {
  return (
    <section id="work" className="py-20 px-5">
      <div className="max-w-4xl mx-auto">
        <SectionLabel eyebrow="Career" heading="Work"
          sub="Every job below has a tiny interactive demo — a toy version of the real thing I built. Press the green buttons." />
        <div className="space-y-4">
          {experiences.map((exp, i) => <ExpCard key={exp.company} exp={exp} delay={i * 60} />)}
        </div>
      </div>
    </section>
  )
}

// ─── FasterFoods ──────────────────────────────────────────────────────────────

const FF_STACK = [
  { Icon: Smartphone,        name: 'iOS app',            note: 'Swift, Apple Health sync' },
  { Icon: MonitorSmartphone, name: 'Web + React apps',   note: 'logging, dashboards' },
  { Icon: Server,            name: 'Go backend',         note: '+ supporting services' },
  { Icon: Terminal,          name: 'Python & Go libs',   note: 'for building rec models' },
  { Icon: KeyRound,          name: 'Dev portal',         note: 'web + API, token-scoped data' },
  { Icon: Package,           name: 'PyPI',               note: 'fasterfoodsstack' },
]

function FasterFoodsSection() {
  return (
    <section id="fasterfoods" className="py-20 px-5">
      <div className="max-w-4xl mx-auto">
        <SectionLabel eyebrow="Pet project · months in the making" heading="FasterFoods"
          sub="A complete personal health & fitness platform, built on one idea: your health starts from what you buy, what's in your kitchen, what you actually ate, how you trained with that energy — and how you recovered." />

        <Reveal>
          <Card className="overflow-hidden">
            <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${C.forest}, ${C.forestMid})` }} />
            <div className="p-7 lg:p-9">
              <div className="flex flex-wrap items-center gap-3 mb-7">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                  style={{ background: C.forestBg }}>🥗</div>
                <div className="flex-1 min-w-[200px]">
                  <h3 className="text-xl font-bold" style={{ color: C.label }}>The Health Loop</h3>
                  <p className="text-sm font-medium" style={{ color: C.forest }}>
                    Self-hosted on a Raspberry Pi · 99.99% uptime · GDPR-compliant
                  </p>
                </div>
                <a href="https://fasterfoods.co.uk" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: C.forest }}>
                  <Globe size={13} /> fasterfoods.co.uk <ExternalLink size={11} />
                </a>
              </div>

              <HealthLoopDemo />

              <div className="mt-8 pt-7" style={{ borderTop: `1px solid ${C.sep}` }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: C.label3 }}>
                  One platform, many moving parts
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {FF_STACK.map(({ Icon, name, note }) => (
                    <div key={name} className="flex items-center gap-3 rounded-2xl p-3"
                      style={{ background: C.surface2 }}>
                      <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: '#fff', color: C.forestMid, border: `1px solid ${C.sep}` }}>
                        <Icon size={16} strokeWidth={1.8} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate" style={{ color: C.label }}>{name}</p>
                        <p className="text-[11px] truncate" style={{ color: C.label2 }}>{note}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-5 text-sm" style={{ color: C.label2 }}>
                  <span>Personalised AI gameplans built by a multi-agent research pipeline.</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {['Go', 'Python', 'React', 'Swift', 'PostgreSQL', 'Docker', 'NGINX', 'Recommendation models', 'Multi-agent AI', 'OCR', 'Barcode scanning', 'Apple Health'].map(t =>
                    <Chip key={t} label={t} />)}
                </div>
                <a href="https://pypi.org/project/fasterfoodsstack/" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-5 text-xs font-semibold hover:opacity-70 transition-opacity"
                  style={{ color: C.forest }}>
                  <Package size={13} /> pip install fasterfoodsstack <ArrowUpRight size={11} />
                </a>
              </div>
            </div>
          </Card>
        </Reveal>
      </div>
    </section>
  )
}

// ─── Projects ─────────────────────────────────────────────────────────────────

function ProjectsSection() {
  return (
    <section id="projects" className="py-20 px-5">
      <div className="max-w-4xl mx-auto">
        <SectionLabel eyebrow="Shipped" heading="Projects" />
        <div className="grid lg:grid-cols-2 gap-4 items-start">
          {/* Dance Helper with live demo */}
          <Reveal>
            <Card className="p-6">
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ background: C.forestBg }}>💃</div>
                <div>
                  <h3 className="text-base font-bold" style={{ color: C.label }}>Dance Helper</h3>
                  <p className="text-xs font-semibold" style={{ color: C.forest }}>iOS · Live on the App Store · 5★</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: C.label2 }}>
                Native iPhone app for rhythm training and beat alignment using real-time audio
                signal processing — SwiftUI, deployed globally.
              </p>
              <BeatTapDemo />
              <div className="flex flex-wrap gap-1.5 mt-4 mb-4">
                {['Swift', 'SwiftUI', 'Core Audio', 'DSP'].map(t => <Chip key={t} label={t} />)}
              </div>
              <a href="https://apps.apple.com/dance-helper" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold hover:opacity-70 transition-opacity"
                style={{ color: C.forest }}>
                <FaApple size={13} /> App Store <ArrowUpRight size={11} />
              </a>
            </Card>
          </Reveal>

          <div className="space-y-4">
            <Reveal delay={80}>
              <Card className="p-6">
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ background: C.forestBg }}>🤖</div>
                  <div>
                    <h3 className="text-base font-bold" style={{ color: C.label }}>MCP Client for SMEs</h3>
                    <p className="text-xs font-semibold" style={{ color: C.forest }}>100+ users in production</p>
                  </div>
                </div>
                <ul className="space-y-1.5 text-sm leading-relaxed mb-4" style={{ color: C.label2 }}>
                  <li>MCP client with dynamic tool orchestration, real-time Socket.io, and automatic MongoDB configuration.</li>
                  <li>RBAC with JWT & OAuth, multi-transport (STDIO, HTTP, SSE) with failover, rate limiting, Zod validation.</li>
                </ul>
                <div className="flex flex-wrap gap-1.5">
                  {['TypeScript', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'OpenAI'].map(t => <Chip key={t} label={t} />)}
                </div>
              </Card>
            </Reveal>

            <Reveal delay={160}>
              <Card className="p-6">
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ background: C.forestBg }}>🛠</div>
                  <div>
                    <h3 className="text-base font-bold" style={{ color: C.label }}>The Maker Pile</h3>
                    <p className="text-xs font-semibold" style={{ color: C.forest }}>Hardware itch, regularly scratched</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { Icon: Watch, text: 'Custom mechanical watches — assembled by hand' },
                    { Icon: Disc3, text: 'Modded iPod Classics — flash storage, new batteries, custom shells' },
                  ].map(({ Icon, text }) => (
                    <div key={text} className="flex items-center gap-3 text-sm" style={{ color: C.label2 }}>
                      <span className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: C.surface2, color: C.forestMid }}>
                        <Icon size={15} />
                      </span>
                      {text}
                    </div>
                  ))}
                </div>
              </Card>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Sport & Nutrition ────────────────────────────────────────────────────────

function SportSection() {
  return (
    <section id="sport" className="py-20 px-5">
      <div className="max-w-4xl mx-auto">
        <SectionLabel eyebrow="Engine maintenance" heading="Sport & Nutrition"
          sub="The other half of the FasterFoods origin story. Six years of consistent training, and a calendar that always has a start line on it." />

        <div className="grid lg:grid-cols-2 gap-4">
          <Reveal>
            <Card className="p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ background: C.forestBg }}>🏃</div>
                  <div>
                    <h3 className="text-base font-bold" style={{ color: C.label }}>Long-distance running</h3>
                    <p className="text-xs font-semibold" style={{ color: C.forest }}>National-level athlete (India)</p>
                  </div>
                </div>
              </div>
              <ul className="space-y-2.5 text-sm leading-relaxed mb-6" style={{ color: C.label2 }}>
                <li className="flex gap-2.5">
                  <Medal size={15} className="flex-shrink-0 mt-0.5" style={{ color: C.forestMid }} />
                  Represented long-distance running at the national level; many marathons and ultramarathons since.
                </li>
                <li className="flex gap-2.5">
                  <Users size={15} className="flex-shrink-0 mt-0.5" style={{ color: C.forestMid }} />
                  Organised the <span className="font-semibold" style={{ color: C.label }}>Manipal Marathon</span> — the other side of the start line.
                </li>
              </ul>
              <div className="rounded-2xl p-4" style={{ background: C.surface2 }}>
                <div className="flex items-center gap-2 mb-3">
                  <LiveDot text="In training" />
                </div>
                <IronmanTracker />
              </div>
            </Card>
          </Reveal>

          <div className="space-y-4">
            <Reveal delay={80}>
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ background: C.forestBg }}>🏸</div>
                  <div>
                    <h3 className="text-base font-bold" style={{ color: C.label }}>Badminton & Football</h3>
                    <p className="text-xs font-semibold" style={{ color: C.forest }}>Played semi-professionally · now in London</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: C.label2 }}>
                  Still playing every week in London. If you fancy a match — singles, doubles, or a
                  kickabout — I will absolutely take you up on it.
                </p>
                <a href="mailto:ritvikjoshi97@gmail.com?subject=Let's%20play!"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: C.forest }}>
                  <HeartHandshake size={14} /> Set up a session
                </a>
              </Card>
            </Reveal>

            <Reveal delay={160}>
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ background: C.forestBg }}>🏋️</div>
                  <div>
                    <h3 className="text-base font-bold" style={{ color: C.label }}>Six years under the bar</h3>
                    <p className="text-xs font-semibold" style={{ color: C.forest }}>Where FasterFoods came from</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: C.label2 }}>
                  A six-year gym routine taught me that the hard part of fitness isn&apos;t the workout —
                  it&apos;s tracking everything around it. That itch became{' '}
                  <a href="#fasterfoods" className="font-semibold hover:underline" style={{ color: C.forest }}>FasterFoods</a>.
                </p>
              </Card>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Beyond the keyboard ──────────────────────────────────────────────────────

function BeyondSection() {
  return (
    <section id="beyond" className="py-20 px-5">
      <div className="max-w-4xl mx-auto">
        <SectionLabel eyebrow="Off the clock" heading="Beyond the keyboard" />
        <div className="grid lg:grid-cols-2 gap-4 items-start">
          <Reveal>
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ background: C.forestBg }}>🎻</div>
                <div>
                  <h3 className="text-base font-bold" style={{ color: C.label }}>Violin</h3>
                  <p className="text-xs font-semibold" style={{ color: C.forest }}>Playing since I was 16</p>
                </div>
              </div>
              <ViolinDemo />
            </Card>
          </Reveal>

          <div className="space-y-4">
            <Reveal delay={80}>
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ background: C.forestBg }}><ChefHat size={22} style={{ color: C.forestMid }} /></div>
                  <div>
                    <h3 className="text-base font-bold" style={{ color: C.label }}>Cooking</h3>
                    <p className="text-xs font-semibold" style={{ color: C.forest }}>Since I was 9</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: C.label2 }}>
                  Nineteen years in the kitchen — long before the nutrition tracking, there was just
                  good food. It&apos;s also why FasterFoods starts at the shopping list, not the gym.
                </p>
              </Card>
            </Reveal>

            <Reveal delay={160}>
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ background: C.forestBg }}><Palette size={22} style={{ color: C.forestMid }} /></div>
                  <div>
                    <h3 className="text-base font-bold" style={{ color: C.label }}>Art</h3>
                    <p className="text-xs font-semibold" style={{ color: C.forest }}>Occasional, unhurried</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: C.label2 }}>
                  Sketches and the odd painting. Different muscle to engineering — same urge to make things.
                </p>
              </Card>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Skills ───────────────────────────────────────────────────────────────────

const skillCategories = [
  { name: 'Languages',      skills: ['Python', 'TypeScript', 'Go', 'C#', 'Swift', 'Dart', 'SQL'] },
  { name: 'Frontend',       skills: ['React', 'Angular', 'Next.js', 'SwiftUI', 'Flutter', 'Figma', 'Tailwind CSS'] },
  { name: 'Backend & APIs', skills: ['Node.js', '.NET', 'Express', 'Go services', 'REST APIs', 'Socket.io'] },
  { name: 'AI & ML',        skills: ['LangChain', 'Ollama', 'Pydantic', 'TensorFlow', 'OpenCV', 'RAG systems', 'Multi-agent systems', 'Recommendation models'] },
  { name: 'Databases',      skills: ['PostgreSQL', 'MongoDB', 'SQL Server', 'Redis'] },
  { name: 'Cloud & DevOps', skills: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'NGINX', 'CI/CD', 'GitHub Actions'] },
]

function SkillsSection() {
  return (
    <section id="skills" className="py-20 px-5">
      <div className="max-w-4xl mx-auto">
        <SectionLabel eyebrow="Expertise" heading="Tech Stack" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillCategories.map((cat, i) => (
            <Reveal key={cat.name} delay={i * 60}>
              <Card className="p-5 h-full">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: C.forest }}>
                  {cat.name}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {cat.skills.map(s => <Chip key={s} label={s} />)}
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Education ────────────────────────────────────────────────────────────────

function EducationSection() {
  return (
    <section id="education" className="py-20 px-5">
      <div className="max-w-4xl mx-auto">
        <SectionLabel eyebrow="Academic" heading="Education" />
        <div className="space-y-4">
          <Reveal>
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <LogoTile text="UoN" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold" style={{ color: C.label }}>University of Nottingham</h3>
                      <a href="https://www.nottingham.ac.uk/" target="_blank" rel="noopener noreferrer"
                        className="hover:opacity-60 transition-opacity" style={{ color: C.label3 }}>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                    <span className="font-mono text-xs flex-shrink-0" style={{ color: C.label3 }}>Sept &apos;21 – Sept &apos;22</span>
                  </div>
                  <p className="text-sm font-semibold mb-1" style={{ color: C.label2 }}>
                    MSc in Computer Science with Artificial Intelligence
                  </p>
                  <p className="text-xs mb-3" style={{ color: C.label3 }}>Nottingham, UK · Merit</p>
                  <ul className="space-y-1.5 text-sm leading-relaxed" style={{ color: C.label2 }}>
                    <li className="flex gap-2.5">
                      <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: C.forestMid }} />
                      Machine Learning, Advanced Algorithms & Data Structures, Data Modelling and Analysis
                    </li>
                    <li className="flex gap-2.5">
                      <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: C.forestMid }} />
                      Dissertation: Eye Gaze Tracking Utilising an Infrared Multi-camera Setup — the gaze
                      demo up in the Blueskeye card is its spiritual toy version. 👀
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </Reveal>

          <Reveal delay={80}>
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <LogoTile text="MIT" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold" style={{ color: C.label }}>Manipal Institute of Technology</h3>
                      <a href="https://manipal.edu/mit.html" target="_blank" rel="noopener noreferrer"
                        className="hover:opacity-60 transition-opacity" style={{ color: C.label3 }}>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                    <span className="font-mono text-xs flex-shrink-0" style={{ color: C.label3 }}>Aug &apos;16 – July &apos;20</span>
                  </div>
                  <p className="text-sm font-semibold mb-1" style={{ color: C.label2 }}>
                    BTech in Instrumentation and Control, minor in Data Science
                  </p>
                  <p className="text-xs mb-2" style={{ color: C.label3 }}>Manipal, India</p>
                  <div className="flex items-center gap-2 text-sm" style={{ color: C.label2 }}>
                    <Trophy size={14} style={{ color: C.forestMid }} />
                    Also where I organised the Manipal Marathon.
                  </div>
                </div>
              </div>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function ContactSection() {
  return (
    <section id="contact" className="py-20 px-5 pb-36">
      <div className="max-w-4xl mx-auto">
        <Reveal>
          <div className="rounded-3xl p-9 sm:p-12 text-center overflow-hidden relative"
            style={{ background: `linear-gradient(140deg, ${C.forest}, ${C.forestMid})` }}>
            <h2 className="text-2xl sm:text-4xl font-black text-white mb-3">
              Big idea? Let&apos;s geek out.
            </h2>
            <p className="text-sm sm:text-base max-w-lg mx-auto mb-7 leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.85)' }}>
              I love collaborating — on AI systems, on side projects, or on a badminton court.
              Whichever it is, my inbox is open.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="mailto:ritvikjoshi97@gmail.com"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-transform hover:scale-105"
                style={{ background: '#fff', color: C.forest }}>
                <Mail size={15} /> ritvikjoshi97@gmail.com
              </a>
              <a href="https://linkedin.com/in/ritvik-joshi-327508ba" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-transform hover:scale-105"
                style={{ background: 'rgba(255,255,255,0.16)', border: '1px solid rgba(255,255,255,0.3)' }}>
                <Linkedin size={15} /> LinkedIn
              </a>
            </div>
            <p className="text-xs mt-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
              <BookOpen size={11} className="inline mr-1" />
              London, UK · +44 (0)7760 917811
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="py-8 px-5 pb-28 text-center text-xs"
      style={{ color: C.label3, borderTop: `1px solid ${C.sep}` }}>
      © {new Date().getFullYear()} Ritvik Joshi &nbsp;·&nbsp;
      <a href="https://fasterfoods.co.uk" target="_blank" rel="noopener noreferrer"
        className="hover:underline" style={{ color: C.forest }}>fasterfoods.co.uk</a>
      &nbsp;·&nbsp; built with too many tiny demos
    </footer>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RitvikPage() {
  return (
    <div className="min-h-screen" style={{ background: C.bg, color: C.label }}>
      <Dock />
      <Hero />
      <StatsStrip />
      <WorkSection />
      <FasterFoodsSection />
      <ProjectsSection />
      <SportSection />
      <BeyondSection />
      <SkillsSection />
      <EducationSection />
      <ContactSection />
      <Footer />
    </div>
  )
}
