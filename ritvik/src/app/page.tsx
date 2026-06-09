"use client"

import { useState } from 'react'
import Image from 'next/image'
import {
  MapPin, Mail, Phone, Globe, ExternalLink, Linkedin,
  LayoutGrid, Briefcase, Zap, GraduationCap, ChevronDown, ChevronUp,
} from 'lucide-react'
import { FaApple } from 'react-icons/fa'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

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

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = {
  title: string
  period: string
  highlight?: string
  responsibilities: string[]
  skills: string[]
}

type Experience = {
  company: string
  logo: string
  linkedIn?: string
  location: string
  isCurrent?: boolean
  roles: Role[]
}

type Project = {
  name: string
  tagline: string
  description: string[]
  tech: string[]
  url?: string
  appStore?: string
  featured?: boolean
  emoji: string
}

type Education = {
  institution: string
  logo: string
  website?: string
  location: string
  degree: string
  period: string
  grade?: string
  details: string[]
  showSaccades?: boolean
}

// ─── Data ────────────────────────────────────────────────────────────────────

const experiences: Experience[] = [
  {
    company: 'SITA Aero',
    logo: 'https://media.licdn.com/dms/image/v2/D4E0BAQEct2bplOS3Uw/company-logo_100_100/company-logo_100_100/0/1713242143215/sita_logo?e=1741219200&v=beta&t=lb2SDhG6GGfMoBw2d6JFtLyUpSLQG8shUGq1iw6alpE',
    linkedIn: 'https://www.linkedin.com/company/sita/posts/?feedView=all',
    location: 'London, United Kingdom',
    isCurrent: true,
    roles: [
      {
        title: 'Associate Software Engineer, Passenger Portfolio',
        period: "Aug '23 — Present",
        highlight: '🏆 2025 CSKD Geo Award — Best Transformation & Innovation Deal',
        responsibilities: [
          'Designed and developed an AI-powered automated log analysis system to diagnose software issues across products deployed globally. Built a React front-end with an Agentic RAG pipeline (Pydantic, LangChain, Ollama) — reducing triaging times from 2 weeks to minutes.',
          'Contributed to a white-label airline app enabling agents to check in, board passengers, and manage luggage. Developed a natural language rule engine with Angular and .NET — awarded the 2025 CSKD Geo award for Best Transformation & Innovation Deal.',
          'Developed and deployed a white-label Cruise baggage handling and bag-tag printing ReactJS app with custom CI/CD over distributed Kubernetes clusters.',
          'Portfolio AI SPOC — internal AI consultant for 8 teams across Europe and Asia, delivering 10+ training courses and leading hands-on PoC development.',
          'Led UI/UX and front-end development for a product re-certification portal in Figma with Angular, covering user, admin, and superuser interfaces.',
        ],
        skills: ['React', 'Angular', '.NET', 'Azure', 'Kubernetes', 'Python', 'LangChain', 'Ollama', 'CI/CD', 'Figma'],
      },
      {
        title: 'Graduate Software Engineer',
        period: "Sept '22 — Aug '23",
        responsibilities: [
          'Designed and developed a full-stack application for a product-component repository, enabling post-deployment risk minimisation across all SITA products.',
          'Built a C#-based API with SQL database and a React front-end with Azure AD authentication.',
        ],
        skills: ['C#', 'React', 'SQL', 'Azure AD', 'REST APIs'],
      },
    ],
  },
  {
    company: 'Blueskeye AI',
    logo: 'https://media.licdn.com/dms/image/v2/C4D0BAQFNirUlHL4lTg/company-logo_100_100/company-logo_100_100/0/1630543655245/blueskeye_ai_logo?e=1741219200&v=beta&t=oPrI7LVe1qPg84wwrBIw3PyXhjT-Z2WbUdurxd5P_wI',
    linkedIn: 'https://www.linkedin.com/company/blueskeye-ai/posts/?feedView=all',
    location: 'Nottingham, United Kingdom',
    roles: [
      {
        title: 'Machine Learning Engineering Intern',
        period: "May '22 — Aug '22",
        responsibilities: [
          'Developed a Deep Learning model to predict eye gaze utilising Infrared cameras for automotive safety.',
          'Set up a visual data collection and storage pipeline with Python.',
          'Carried out development in TensorFlow and OpenCV using WandB visualisation tools.',
        ],
        skills: ['Python', 'TensorFlow', 'OpenCV', 'Deep Learning', 'Computer Vision', 'WandB'],
      },
    ],
  },
  {
    company: 'Wipro Limited (R&D)',
    logo: 'https://media.licdn.com/dms/image/v2/D4E0BAQEINH3Vf1swig/company-logo_200_200/company-logo_200_200/0/1730379480485/wipro_logo?e=1741219200&v=beta&t=0AvquN8D-4LoocNI8Tx0FFQBVDPtBRu0btereRPSFQQ',
    linkedIn: 'https://www.linkedin.com/company/wipro/posts/?feedView=all',
    location: 'Bangalore, India',
    roles: [
      {
        title: 'Project Engineer, Chief Technology Office',
        period: "Sept '20 — Aug '21",
        responsibilities: [
          'Developed a Node.js application to acquire and setup AWS systems, reducing environment setup time by 99% — from 2 days to 10 minutes.',
          'Worked with AWS APIs (Boto), UNIX automations (Ansible), and NoSQL databases (MongoDB).',
          'Built a full-stack blockchain banking application using Angular, Node.js, and Hyperledger Fabric.',
        ],
        skills: ['Node.js', 'AWS', 'Ansible', 'MongoDB', 'Angular', 'Hyperledger Fabric'],
      },
    ],
  },
  {
    company: 'Fracktal Works',
    logo: 'https://media.licdn.com/dms/image/v2/C560BAQExfAjvXCekyw/company-logo_200_200/company-logo_200_200/0/1630649233643/fracktal_works_logo?e=1741219200&v=beta&t=Cn2-k8XwLrekE9kq3-cctITRrcSvdjBu-6-GkXu4lVs',
    linkedIn: 'https://www.linkedin.com/company/fracktal/posts/?feedView=all',
    location: 'Bangalore, India',
    roles: [
      {
        title: 'Summer Intern, R&D',
        period: "May '19 — July '19",
        responsibilities: [
          'Developed a Flutter-based iOS and Android mobile app to connect to 3D printers.',
          'Worked with Python and FreeCAD to slice 3D models to printable sizes.',
        ],
        skills: ['Flutter', 'Dart', 'Python', 'FreeCAD'],
      },
    ],
  },
]

const projects: Project[] = [
  {
    name: 'FasterFoods',
    tagline: 'Self-Hosted Health Tracking Platform',
    description: [
      'Full-stack health tracking app with food logs, digestion notes, and wearable integration.',
      'Self-hosted on Raspberry Pi with Docker, NGINX, SSL, and GitHub CI/CD — sustained 99.99% uptime.',
      'Configured DNS, email, and firewall rules on GoDaddy; ensured GDPR/data privacy compliance.',
    ],
    tech: ['React', 'Node.js', 'PostgreSQL', 'NGINX', 'Docker', 'Raspberry Pi', 'CI/CD'],
    url: 'https://fasterfoods.co.uk',
    featured: true,
    emoji: '🥗',
  },
  {
    name: 'Dance Helper',
    tagline: 'iOS App · Live on the App Store · 5★',
    description: [
      'Native iPhone app for rhythm training and beat alignment using real-time audio signal processing.',
      'Designed with SwiftUI and deployed globally to the App Store.',
    ],
    tech: ['Swift', 'SwiftUI', 'Core Audio', 'Computer Vision', 'iOS'],
    appStore: 'https://apps.apple.com/dance-helper',
    emoji: '💃',
  },
  {
    name: 'MCP Client for SMEs',
    tagline: 'TypeScript · Node.js · OpenAI',
    description: [
      'MCP client with automatic MongoDB config, real-time Socket.io, and OpenAI integration for dynamic tool orchestration.',
      'RBAC with JWT & OAuth; deployed with 100+ users. Multi-transport (STDIO, HTTP, SSE) with failover.',
    ],
    tech: ['TypeScript', 'Node.js', 'Express', 'MongoDB', 'OpenAI', 'Socket.io', 'Docker'],
    emoji: '🤖',
  },
]

const skillCategories = [
  { name: 'Languages',      skills: ['Python', 'TypeScript', 'JavaScript', 'C#', 'Go', 'Java', 'Swift', 'Dart', 'C/C++', 'SQL', 'R'] },
  { name: 'Frontend',       skills: ['React', 'Angular', 'Next.js', 'SwiftUI', 'Flutter', 'Figma', 'Tailwind CSS'] },
  { name: 'Backend & APIs', skills: ['Node.js', '.NET', 'Express', 'Spring Boot', 'REST APIs', 'Socket.io'] },
  { name: 'AI & ML',        skills: ['LangChain', 'Ollama', 'Pydantic', 'TensorFlow', 'OpenCV', 'OpenAI API', 'RAG Systems', 'WandB'] },
  { name: 'Databases',      skills: ['PostgreSQL', 'MongoDB', 'SQL Server', 'Redis'] },
  { name: 'Cloud & DevOps', skills: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'NGINX', 'CI/CD', 'Ansible', 'GitHub Actions'] },
]

const educationData: Education[] = [
  {
    institution: 'University of Nottingham',
    logo: 'https://media.licdn.com/dms/image/v2/C4E0BAQHO2SMiN1HSMA/company-logo_100_100/company-logo_100_100/0/1675599021016/university_of_nottingham_logo?e=1741219200&v=beta&t=bmBEnmis7znjHNcmYOrV6lyBwNx8jlicb8lPS00pxtk',
    website: 'https://www.nottingham.ac.uk/',
    location: 'Nottingham, UK',
    degree: 'MSc in Computer Science with Artificial Intelligence',
    period: "Sept '21 – Sept '22",
    grade: 'Merit',
    details: [
      'Machine Learning — Regression, Classification, SVM, Decision Trees, ANN, Deep Learning',
      'Data Modelling — Wrangling, Pre-processing, Modelling, Visualisation, Clustering',
      'Dissertation: Eye Gaze Tracking Utilising Infrared Multi-camera Setup',
    ],
    showSaccades: true,
  },
  {
    institution: 'Manipal Institute of Technology',
    logo: 'https://media.licdn.com/dms/image/v2/C510BAQH66KkTTZFJ2A/company-logo_100_100/company-logo_100_100/0/1630615963889/manipal_institute_of_technology_logo?e=1741219200&v=beta&t=8F8GNuxnPYDq1AE3LH1dGm6hukhZ6f6VO-iOSUuzNsc',
    website: 'https://manipal.edu/mit.html',
    location: 'Manipal, India',
    degree: 'BTech in Instrumentation and Control with minor in Data Science',
    period: "Aug '16 – July '20",
    grade: 'CGPA: 6.86/10',
    details: [],
  },
]

// ─── Micro components ─────────────────────────────────────────────────────────

function Chip({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
      style={{ background: C.surface2, color: C.label2 }}
    >
      {label}
    </span>
  )
}

function LiveDot() {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: C.forestBg, color: C.forest }}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
          style={{ background: C.forest }} />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5"
          style={{ background: C.forest }} />
      </span>
      Current
    </span>
  )
}

function SectionLabel({ eyebrow, heading }: { eyebrow: string; heading: string }) {
  return (
    <div className="mb-10">
      <p className="text-xs font-bold tracking-widest uppercase mb-1.5"
        style={{ color: C.forest }}>{eyebrow}</p>
      <h2 className="text-2xl sm:text-3xl font-bold"
        style={{ color: C.label }}>{heading}</h2>
    </div>
  )
}

// ─── Dock ─────────────────────────────────────────────────────────────────────

function Dock() {
  const items = [
    { Icon: LayoutGrid, label: 'Projects',    href: '#projects' },
    { Icon: Briefcase,  label: 'Experience',  href: '#experience' },
    { Icon: Zap,        label: 'Skills',      href: '#skills' },
    { Icon: GraduationCap, label: 'Education', href: '#education' },
  ]
  return (
    <div className="fixed bottom-6 inset-x-0 flex justify-center z-50 pointer-events-none">
      <nav
        className="pointer-events-auto flex items-end gap-1 px-3 py-2.5 rounded-[24px] glass border shadow-xl"
        style={{ borderColor: C.sep, boxShadow: '0 8px 40px rgba(0,0,0,0.12)' }}
      >
        {items.map(({ Icon, label, href }) => (
          <a
            key={label}
            href={href}
            className="dock-item flex flex-col items-center gap-1 px-4 py-2 rounded-2xl"
            style={{ color: C.label2 }}
            onMouseEnter={e => {
              ;(e.currentTarget as HTMLElement).style.color = C.forest
              ;(e.currentTarget as HTMLElement).style.background = C.forestBg
            }}
            onMouseLeave={e => {
              ;(e.currentTarget as HTMLElement).style.color = C.label2
              ;(e.currentTarget as HTMLElement).style.background = 'transparent'
            }}
          >
            <Icon size={22} strokeWidth={1.75} />
            <span className="text-[10px] font-medium">{label}</span>
          </a>
        ))}
      </nav>
    </div>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center px-5 pt-24 pb-36 min-h-screen">
      {/* Avatar */}
      <div className="float mb-7">
        <div
          className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden"
          style={{
            boxShadow: `0 0 0 4px #fff, 0 8px 40px rgba(28,56,41,0.15)`,
          }}
        >
          <Image
            src="https://media.licdn.com/dms/image/v2/D4E03AQGW9SJLrJNrTA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1674829941272?e=1738195200&v=beta&t=PcPHAzCLVwmvO490T4dyZx_Q4bkY-CVQ59OwCusht_4"
            alt="Ritvik Joshi"
            width={128} height={128}
            className="object-cover w-full h-full"
            unoptimized
          />
        </div>
      </div>

      {/* Name */}
      <h1
        className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-4"
        style={{ color: C.label }}
      >
        Ritvik{' '}
        <span className="gradient-text">Joshi</span>
      </h1>

      {/* Role badge */}
      <div
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-3"
        style={{ background: C.forestBg, color: C.forest }}
      >
        <span className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: C.forest }} />
        AI &amp; Full-Stack Engineer
      </div>

      {/* Location */}
      <p className="flex items-center justify-center gap-1.5 text-sm mb-6"
        style={{ color: C.label3 }}>
        <MapPin size={13} style={{ color: C.forest }} />
        London, UK
      </p>

      {/* Bio */}
      <p className="text-base max-w-md leading-relaxed mb-8" style={{ color: C.label2 }}>
        Building intelligent systems at SITA Aero and running{' '}
        <a
          href="https://fasterfoods.co.uk"
          target="_blank" rel="noopener noreferrer"
          className="font-semibold hover:underline"
          style={{ color: C.forest }}
        >
          FasterFoods
        </a>
        {' '}— a self-hosted health tracker running 24/7 on a Raspberry Pi.
      </p>

      {/* CTA buttons */}
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        <a
          href="https://linkedin.com/in/ritvik-joshi-327508ba"
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: C.forest }}
        >
          <Linkedin size={15} /> LinkedIn
        </a>
        <a
          href="https://fasterfoods.co.uk"
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors"
          style={{ background: C.forestBg, color: C.forest }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = C.forestBg2}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = C.forestBg}
        >
          <Globe size={15} /> FasterFoods
        </a>
        <a
          href="mailto:ritvikjoshi97@gmail.com"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-colors hover:bg-black/4"
          style={{
            background: C.surface,
            color: C.label2,
            borderColor: C.sep,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          <Mail size={15} /> Email
        </a>
      </div>

      {/* Contact details */}
      <div className="flex flex-wrap gap-5 justify-center text-xs" style={{ color: C.label3 }}>
        <span className="flex items-center gap-1.5"><Phone size={11} /> +44 (0)7760 917811</span>
        <span className="flex items-center gap-1.5"><Mail size={11} /> ritvikjoshi97@gmail.com</span>
      </div>
    </section>
  )
}

// ─── Projects ─────────────────────────────────────────────────────────────────

function ProjectsSection() {
  return (
    <section id="projects" className="py-20 px-5 pb-8">
      <div className="max-w-4xl mx-auto">
        <SectionLabel eyebrow="What I've built" heading="Projects" />
        <div className="space-y-4">
          <FeaturedProject project={projects[0]} />
          <div className="grid sm:grid-cols-2 gap-4">
            {projects.slice(1).map(p => <SmallProjectCard key={p.name} project={p} />)}
          </div>
        </div>
      </div>
    </section>
  )
}

function FeaturedProject({ project }: { project: Project }) {
  return (
    <div
      className="bg-white rounded-3xl overflow-hidden card-lift"
      style={{
        boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
        border: `1px solid ${C.sep}`,
      }}
    >
      {/* Top accent stripe */}
      <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${C.forest}, ${C.forestMid})` }} />

      <div className="p-7 lg:p-9 grid lg:grid-cols-5 gap-8 items-start">
        {/* Left */}
        <div className="lg:col-span-3">
          <div className="flex items-center gap-3.5 mb-5">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: C.forestBg }}
            >
              {project.emoji}
            </div>
            <div>
              <h3 className="text-xl font-bold" style={{ color: C.label }}>{project.name}</h3>
              <p className="text-sm font-medium" style={{ color: C.forest }}>{project.tagline}</p>
            </div>
          </div>

          <ul className="space-y-2.5 mb-7">
            {project.description.map((d, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed" style={{ color: C.label2 }}>
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: C.forestMid }} />
                {d}
              </li>
            ))}
          </ul>

          {project.url && (
            <a
              href={project.url}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors"
              style={{ background: C.forestBg, color: C.forest }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = C.forestBg2}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = C.forestBg}
            >
              <Globe size={13} />
              fasterfoods.co.uk
              <ExternalLink size={11} />
            </a>
          )}
        </div>

        {/* Right: stack */}
        <div className="lg:col-span-2">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: C.label3 }}>
            Stack
          </p>
          <div className="flex flex-wrap gap-1.5">
            {project.tech.map(t => <Chip key={t} label={t} />)}
          </div>
        </div>
      </div>
    </div>
  )
}

function SmallProjectCard({ project }: { project: Project }) {
  return (
    <div
      className="bg-white rounded-3xl p-6 flex flex-col card-lift"
      style={{
        boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
        border: `1px solid ${C.sep}`,
      }}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 flex-shrink-0"
        style={{ background: C.forestBg }}
      >
        {project.emoji}
      </div>
      <h3 className="text-base font-bold mb-0.5" style={{ color: C.label }}>{project.name}</h3>
      <p className="text-xs font-semibold mb-3" style={{ color: C.forest }}>{project.tagline}</p>
      <ul className="space-y-1.5 mb-5 flex-1">
        {project.description.map((d, i) => (
          <li key={i} className="text-sm leading-relaxed" style={{ color: C.label2 }}>{d}</li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-1.5 mb-5">
        {project.tech.slice(0, 5).map(t => <Chip key={t} label={t} />)}
      </div>
      <div className="flex gap-4">
        {project.url && (
          <a href={project.url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold transition-colors hover:opacity-70"
            style={{ color: C.forest }}>
            <Globe size={12} /> Website
          </a>
        )}
        {project.appStore && (
          <a href={project.appStore} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold transition-colors hover:opacity-70"
            style={{ color: C.forest }}>
            <FaApple size={12} /> App Store
          </a>
        )}
      </div>
    </div>
  )
}

// ─── Experience ───────────────────────────────────────────────────────────────

function ExperienceSection() {
  return (
    <section id="experience" className="py-20 px-5">
      <div className="max-w-4xl mx-auto">
        <SectionLabel eyebrow="Career" heading="Experience" />
        <div className="space-y-4">
          {experiences.map((exp, i) => <ExpCard key={i} exp={exp} />)}
        </div>
      </div>
    </section>
  )
}

function ExpCard({ exp }: { exp: Experience }) {
  const [open, setOpen] = useState(false)
  const totalBullets = exp.roles.reduce((n, r) => n + r.responsibilities.length, 0)

  return (
    <div
      className="bg-white rounded-3xl overflow-hidden card-lift"
      style={{
        boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
        border: `1px solid ${C.sep}`,
      }}
    >
      <div className="p-6">
        {/* Company header */}
        <div className="flex items-start gap-4 mb-5">
          <Image
            src={exp.logo} alt={exp.company}
            width={44} height={44}
            className="rounded-2xl object-cover flex-shrink-0"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
            unoptimized
          />
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

        {/* Roles */}
        <div className="space-y-5">
          {exp.roles.map((role, ri) => {
            if (ri > 0 && !open) return null
            return (
              <div key={ri}
                className={ri > 0 ? 'pt-5' : ''}
                style={ri > 0 ? { borderTop: `1px solid ${C.sep}` } : {}}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="text-sm font-semibold" style={{ color: C.label }}>{role.title}</p>
                  <span className="text-xs font-mono flex-shrink-0" style={{ color: C.label3 }}>{role.period}</span>
                </div>

                {role.highlight && (
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold mb-3"
                    style={{
                      background: '#FFFBEB',
                      border: '1px solid rgba(217,119,6,0.2)',
                      color: '#B45309',
                    }}
                  >
                    {role.highlight}
                  </div>
                )}

                <ul className="space-y-2 mb-3">
                  {(open || ri === 0 ? role.responsibilities : role.responsibilities.slice(0, 2)).map((r, i) => (
                    <li key={i} className="flex gap-2.5 text-sm leading-relaxed" style={{ color: C.label2 }}>
                      <span className="mt-2 w-1 h-1 rounded-full flex-shrink-0"
                        style={{ background: C.forestMid }} />
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

        {totalBullets > 2 && (
          <button
            onClick={() => setOpen(!open)}
            className="mt-4 flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-70"
            style={{ color: C.forest }}
          >
            {open ? <><ChevronUp size={14} /> Show less</> : <><ChevronDown size={14} /> Show more</>}
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Skills ───────────────────────────────────────────────────────────────────

function SkillsSection() {
  return (
    <section id="skills" className="py-20 px-5">
      <div className="max-w-4xl mx-auto">
        <SectionLabel eyebrow="Expertise" heading="Tech Stack" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillCategories.map(cat => (
            <div
              key={cat.name}
              className="bg-white rounded-3xl p-5 card-lift"
              style={{
                boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                border: `1px solid ${C.sep}`,
              }}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest mb-3"
                style={{ color: C.forest }}>{cat.name}</p>
              <div className="flex flex-wrap gap-1.5">
                {cat.skills.map(s => <Chip key={s} label={s} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Education ────────────────────────────────────────────────────────────────

function EducationSection() {
  return (
    <section id="education" className="py-20 px-5 pb-32">
      <div className="max-w-4xl mx-auto">
        <SectionLabel eyebrow="Academic" heading="Education" />
        <div className="space-y-4">
          {educationData.map((edu, i) => <EduCard key={i} education={edu} />)}
        </div>
      </div>
    </section>
  )
}

function EduCard({ education }: { education: Education }) {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div
      className="bg-white rounded-3xl p-6 card-lift"
      style={{
        boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
        border: `1px solid ${C.sep}`,
      }}
    >
      <div className="flex items-start gap-4">
        <Image
          src={education.logo} alt={education.institution}
          width={44} height={44}
          className="rounded-2xl object-cover flex-shrink-0"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          unoptimized
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold" style={{ color: C.label }}>{education.institution}</h3>
              {education.website && (
                <a href={education.website} target="_blank" rel="noopener noreferrer"
                  className="hover:opacity-60 transition-opacity" style={{ color: C.label3 }}>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
            <span className="font-mono text-xs flex-shrink-0" style={{ color: C.label3 }}>{education.period}</span>
          </div>

          <p className="text-sm font-semibold mb-1" style={{ color: C.label2 }}>{education.degree}</p>
          <p className="text-xs mb-2" style={{ color: C.label3 }}>{education.location}</p>

          {education.grade && (
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
              style={{ background: C.forestBg, color: C.forest }}
            >
              {education.grade}
            </span>
          )}

          {education.details.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {education.details.map((d, i) => (
                <li key={i} className="flex gap-2.5 text-sm leading-relaxed" style={{ color: C.label2 }}>
                  <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0"
                    style={{ background: C.forestMid }} />
                  {d}
                </li>
              ))}
            </ul>
          )}

          {education.showSaccades && (
            <>
              <button
                onClick={() => setDialogOpen(true)}
                className="mt-3 text-xs font-semibold hover:opacity-70 transition-opacity"
                style={{ color: C.forest }}
              >
                Demo dissertation →
              </button>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-xl rounded-3xl bg-white border-black/5">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-bold" style={{ color: C.label }}>
                      Understanding Saccades
                    </DialogTitle>
                    <DialogDescription className="pt-3 space-y-3 text-sm leading-relaxed"
                      style={{ color: C.label2 }}>
                      <p>
                        Saccades are rapid, ballistic movements of the eyes that abruptly change the
                        point of fixation. They range from small movements made while reading to
                        large movements made while scanning a room.
                      </p>
                      <p>
                        The brain uses saccades and fixations to gather detailed information about
                        specific areas of interest — crucial for understanding visual perception,
                        attention mechanisms, and neurological conditions.
                      </p>
                      <p className="font-medium" style={{ color: C.label }}>
                        My dissertation focused on analysing saccadic movements using a low-cost
                        single-camera infrared setup.
                      </p>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer
      className="py-8 px-5 text-center text-xs"
      style={{ color: C.label3, borderTop: `1px solid ${C.sep}` }}
    >
      © {new Date().getFullYear()} Ritvik Joshi &nbsp;·&nbsp;
      <a href="https://fasterfoods.co.uk" target="_blank" rel="noopener noreferrer"
        className="hover:underline" style={{ color: C.forest }}>fasterfoods.co.uk</a>
    </footer>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RitvikPage() {
  return (
    <div className="min-h-screen" style={{ background: C.bg, color: C.label }}>
      <Dock />
      <Hero />
      <ProjectsSection />
      <ExperienceSection />
      <SkillsSection />
      <EducationSection />
      <Footer />
    </div>
  )
}
