"use client"

import { useState } from 'react'
import Image from 'next/image'
import {
  FaPhone, FaEnvelope, FaLinkedin, FaGlobe, FaMapMarkerAlt,
  FaExternalLinkAlt, FaApple,
} from 'react-icons/fa'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

// ─── Types ───────────────────────────────────────────────────────────────────

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
  accentClass: string
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
          'Designed and developed an AI-powered automated log analysis system to diagnose software issues in products deployed globally. Built a React front-end with an AI pipeline using a custom-trained model and Agentic RAG system leveraging Pydantic, LangChain and Ollama — reducing triaging times from 2 weeks to minutes.',
          'Contributed to a white-label airline app enabling agents to check in, board passengers, and manage luggage. Developed a natural language rule engine with Angular and .NET. Awarded the 2025 CSKD Geo award for Best Transformation & Innovation Deal.',
          'Developed and deployed a white-label Cruise baggage handling and bag-tag printing ReactJS app with a custom CI/CD pipeline over distributed Kubernetes clusters.',
          'Portfolio AI SPOC — internal AI consultant for 8 teams across Europe and Asia, delivering 10+ training courses. Led AI adoption through workshops, ideation sessions, and hands-on PoC development.',
          'Led UI/UX and front-end development for a product re-certification portal in Figma with Angular, covering user, admin, and superuser interfaces.',
        ],
        skills: ['React', 'Angular', '.NET', 'Azure', 'Kubernetes', 'Python', 'LangChain', 'Ollama', 'Pydantic', 'CI/CD', 'Figma'],
      },
      {
        title: 'Graduate Software Engineer',
        period: "Sept '22 — Aug '23",
        responsibilities: [
          'Designed and developed a full-stack application for a product-component repository, enabling post-deployment risk minimisation across all SITA products.',
          'Built a C#-based API with SQL database and a React front-end with Azure AD authentication, complete with comprehensive documentation.',
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
    accentClass: 'emerald',
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
    accentClass: 'pink',
  },
  {
    name: 'MCP Client for SMEs',
    tagline: 'TypeScript · Node.js · OpenAI',
    description: [
      'MCP client with automatic MongoDB config, real-time Socket.io, and OpenAI integration for dynamic tool orchestration.',
      'RBAC with JWT & OAuth, granular permissions; deployed with 100+ users. Multi-transport (STDIO, HTTP, SSE) with failover.',
    ],
    tech: ['TypeScript', 'Node.js', 'Express', 'MongoDB', 'OpenAI', 'Socket.io', 'JWT', 'Docker'],
    emoji: '🤖',
    accentClass: 'violet',
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SKILL_COLORS: Record<string, string> = {
  Python:       'bg-yellow-500/10 text-yellow-300 border-yellow-500/20',
  TypeScript:   'bg-blue-500/10 text-blue-300 border-blue-500/20',
  JavaScript:   'bg-yellow-400/10 text-yellow-200 border-yellow-400/20',
  'C#':         'bg-purple-500/10 text-purple-300 border-purple-500/20',
  Go:           'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
  Swift:        'bg-orange-500/10 text-orange-300 border-orange-500/20',
  React:        'bg-cyan-400/10 text-cyan-200 border-cyan-400/20',
  Angular:      'bg-red-500/10 text-red-300 border-red-500/20',
  'Node.js':    'bg-green-500/10 text-green-300 border-green-500/20',
  Docker:       'bg-blue-400/10 text-blue-200 border-blue-400/20',
  AWS:          'bg-orange-400/10 text-orange-200 border-orange-400/20',
  Azure:        'bg-blue-600/10 text-blue-300 border-blue-600/20',
  Kubernetes:   'bg-blue-500/10 text-blue-200 border-blue-500/20',
  PostgreSQL:   'bg-sky-500/10 text-sky-300 border-sky-500/20',
  MongoDB:      'bg-green-400/10 text-green-200 border-green-400/20',
  TensorFlow:   'bg-orange-500/10 text-orange-200 border-orange-500/20',
  LangChain:    'bg-teal-500/10 text-teal-300 border-teal-500/20',
  '.NET':       'bg-purple-400/10 text-purple-200 border-purple-400/20',
}

function Chip({ label }: { label: string }) {
  const cls = SKILL_COLORS[label] ?? 'bg-slate-500/10 text-slate-300 border-slate-500/20'
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${cls}`}>
      {label}
    </span>
  )
}

function LiveDot() {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
      </span>
      Current
    </span>
  )
}

function SectionLabel({ eyebrow, heading }: { eyebrow: string; heading: string }) {
  return (
    <div className="mb-12">
      <p className="text-cyan-400 text-xs font-bold tracking-widest uppercase mb-2">{eyebrow}</p>
      <h2 className="text-3xl sm:text-4xl font-black text-white">{heading}</h2>
    </div>
  )
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

function Nav() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-[#060b14]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
        <span className="text-lg font-black tracking-tight text-white">
          RJ<span className="text-cyan-400">.</span>
        </span>
        <div className="hidden sm:flex gap-6 text-sm text-slate-400">
          {['projects', 'experience', 'skills', 'education'].map(s => (
            <a key={s} href={`#${s}`} className="hover:text-white transition-colors capitalize">{s}</a>
          ))}
        </div>
        <a
          href="mailto:ritvikjoshi97@gmail.com"
          className="text-xs font-semibold px-4 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-all"
        >
          Hire me
        </a>
      </div>
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-5 pt-20 pb-16 overflow-hidden hero-grid">
      <div className="pointer-events-none absolute -top-32 -left-40 w-[520px] h-[520px] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)' }} />
      <div className="pointer-events-none absolute bottom-0 -right-40 w-[480px] h-[480px] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)' }} />

      <div className="relative max-w-5xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12">
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/25 bg-cyan-500/5 text-cyan-400 text-xs font-semibold mb-7 tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              AI &amp; Full-Stack Engineer · London
            </div>

            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black leading-none mb-5 tracking-tight">
              <span className="text-white">Ritvik</span>{' '}
              <span className="gradient-text">Joshi</span>
            </h1>

            <p className="text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed mb-10">
              I build intelligent systems and production-grade applications —
              from{' '}
              <span className="text-slate-200 font-medium">Agentic RAG pipelines</span>{' '}
              at SITA Aero to a{' '}
              <a href="https://fasterfoods.co.uk" target="_blank" rel="noopener noreferrer"
                className="text-emerald-400 font-medium hover:underline">
                self-hosted health platform
              </a>{' '}
              running 24/7 on a Raspberry Pi.
            </p>

            <div className="flex flex-wrap gap-3">
              <a href="https://linkedin.com/in/ritvik-joshi-327508ba" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 hover:bg-cyan-500/20 transition-all text-sm font-semibold">
                <FaLinkedin /> LinkedIn
              </a>
              <a href="https://fasterfoods.co.uk" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20 transition-all text-sm font-semibold">
                <FaGlobe /> FasterFoods
              </a>
              <a href="mailto:ritvikjoshi97@gmail.com"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-700/40 border border-white/8 text-slate-300 hover:bg-slate-700/60 transition-all text-sm font-semibold">
                <FaEnvelope /> Email
              </a>
            </div>

            <div className="flex flex-wrap gap-5 mt-8 text-slate-500 text-sm">
              <span className="flex items-center gap-1.5"><FaMapMarkerAlt className="text-cyan-600" /> London, UK</span>
              <span className="flex items-center gap-1.5"><FaPhone className="text-cyan-600" /> +44 (0)7760 917811</span>
            </div>
          </div>

          <div className="flex-shrink-0 float">
            <div className="w-44 h-44 lg:w-52 lg:h-52 rounded-2xl p-0.5"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6)' }}>
              <div className="w-full h-full rounded-[14px] overflow-hidden bg-slate-900">
                <Image
                  src="https://media.licdn.com/dms/image/v2/D4E03AQGW9SJLrJNrTA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1674829941272?e=1738195200&v=beta&t=PcPHAzCLVwmvO490T4dyZx_Q4bkY-CVQ59OwCusht_4"
                  alt="Ritvik Joshi" width={208} height={208}
                  className="object-cover w-full h-full" unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-600 text-xs select-none">
        <span>scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-slate-600 to-transparent" />
      </div>
    </section>
  )
}

// ─── Projects ─────────────────────────────────────────────────────────────────

function ProjectsSection() {
  return (
    <section id="projects" className="py-24 px-5">
      <div className="max-w-5xl mx-auto">
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
    <div className="group relative rounded-2xl border border-white/5 featured-glow hover:border-emerald-500/20 transition-all duration-300 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0d1f15 0%, #0a1a10 100%)' }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top right, rgba(16,185,129,0.07) 0%, transparent 60%)' }} />
      <div className="relative p-8 lg:p-10 grid lg:grid-cols-5 gap-10 items-center">
        <div className="lg:col-span-3">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-4xl">{project.emoji}</span>
            <div>
              <h3 className="text-2xl font-black text-white leading-tight">{project.name}</h3>
              <p className="text-emerald-400 text-sm font-semibold">{project.tagline}</p>
            </div>
          </div>
          <ul className="space-y-2 mb-7">
            {project.description.map((d, i) => (
              <li key={i} className="flex items-start gap-2.5 text-slate-400 text-sm leading-relaxed">
                <span className="text-emerald-500 mt-1 flex-shrink-0 text-xs">▸</span>{d}
              </li>
            ))}
          </ul>
          {project.url && (
            <a href={project.url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20 transition-all text-sm font-semibold">
              <FaGlobe className="text-sm" />fasterfoods.co.uk<FaExternalLinkAlt className="text-xs" />
            </a>
          )}
        </div>
        <div className="lg:col-span-2">
          <p className="text-[11px] uppercase tracking-widest text-slate-500 mb-3 font-semibold">Stack</p>
          <div className="flex flex-wrap gap-2">
            {project.tech.map(t => <Chip key={t} label={t} />)}
          </div>
        </div>
      </div>
    </div>
  )
}

function SmallProjectCard({ project }: { project: Project }) {
  const bgMap: Record<string, string> = {
    pink:   'linear-gradient(135deg, #1a0d14 0%, #130a10 100%)',
    violet: 'linear-gradient(135deg, #12091a 0%, #0d0715 100%)',
  }
  const borderMap: Record<string, string> = {
    pink:   'hover:border-pink-500/25',
    violet: 'hover:border-violet-500/25',
  }
  const iconMap: Record<string, string> = {
    pink:   'linear-gradient(135deg, #ec4899, #f43f5e)',
    violet: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
  }
  return (
    <div className={`group relative rounded-2xl border border-white/5 card-glow ${borderMap[project.accentClass] ?? 'hover:border-white/10'} transition-all duration-300 p-6 flex flex-col`}
      style={{ background: bgMap[project.accentClass] ?? '#0d1626' }}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl mb-4 shadow-lg"
        style={{ background: iconMap[project.accentClass] ?? '#334155' }}>
        {project.emoji}
      </div>
      <h3 className="text-base font-bold text-white mb-0.5">{project.name}</h3>
      <p className="text-xs font-semibold text-slate-400 mb-3">{project.tagline}</p>
      <ul className="space-y-1.5 mb-5 flex-1">
        {project.description.map((d, i) => (
          <li key={i} className="text-slate-500 text-sm leading-relaxed">{d}</li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.tech.slice(0, 5).map(t => <Chip key={t} label={t} />)}
      </div>
      <div className="flex gap-4">
        {project.url && (
          <a href={project.url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-cyan-400 transition-colors font-medium">
            <FaGlobe /> Website
          </a>
        )}
        {project.appStore && (
          <a href={project.appStore} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-cyan-400 transition-colors font-medium">
            <FaApple /> App Store
          </a>
        )}
      </div>
    </div>
  )
}

// ─── Experience ───────────────────────────────────────────────────────────────

function ExperienceSection() {
  return (
    <section id="experience" className="py-24 px-5">
      <div className="max-w-5xl mx-auto">
        <SectionLabel eyebrow="Career" heading="Experience" />
        <div className="relative">
          <div className="absolute left-6 top-2 bottom-2 w-px hidden sm:block"
            style={{ background: 'linear-gradient(to bottom, rgba(6,182,212,0.4), rgba(139,92,246,0.2), transparent)' }} />
          <div className="space-y-8">
            {experiences.map((exp, i) => <ExpCard key={i} exp={exp} />)}
          </div>
        </div>
      </div>
    </section>
  )
}

function ExpCard({ exp }: { exp: Experience }) {
  const [open, setOpen] = useState(false)
  const totalBullets = exp.roles.reduce((n, r) => n + r.responsibilities.length, 0)

  return (
    <div className="relative sm:pl-16">
      <div className="absolute left-[17px] top-6 w-4 h-4 rounded-full border-2 border-cyan-500/40 bg-[#060b14] hidden sm:flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
      </div>

      <div className="rounded-2xl border border-white/5 card-glow hover:border-white/10 transition-all duration-300"
        style={{ background: 'rgba(13,22,38,0.6)' }}>
        <div className="p-6">
          <div className="flex items-start gap-4 mb-5">
            <Image src={exp.logo} alt={exp.company} width={44} height={44}
              className="rounded-xl object-cover flex-shrink-0" unoptimized />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <h3 className="text-lg font-black text-white">{exp.company}</h3>
                {exp.isCurrent && <LiveDot />}
                {exp.linkedIn && (
                  <a href={exp.linkedIn} target="_blank" rel="noopener noreferrer"
                    className="text-slate-600 hover:text-slate-300 transition-colors">
                    <FaExternalLinkAlt className="w-3 h-3" />
                  </a>
                )}
              </div>
              <p className="text-slate-500 text-sm">{exp.location}</p>
            </div>
          </div>

          <div className="space-y-5">
            {exp.roles.map((role, ri) => {
              if (ri > 0 && !open) return null
              return (
                <div key={ri} className={ri > 0 ? 'border-t border-white/5 pt-5' : ''}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="font-semibold text-slate-200 text-sm">{role.title}</p>
                    <span className="font-mono text-xs text-slate-600 flex-shrink-0">{role.period}</span>
                  </div>
                  {role.highlight && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-yellow-500/20 text-yellow-400 text-xs font-semibold mb-3"
                      style={{ background: 'rgba(234,179,8,0.08)' }}>
                      {role.highlight}
                    </div>
                  )}
                  <ul className="space-y-2 mb-3">
                    {(open || ri === 0 ? role.responsibilities : role.responsibilities.slice(0, 2)).map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-400 text-sm leading-relaxed">
                        <span className="text-cyan-600 mt-1 flex-shrink-0 text-[10px]">▸</span>{r}
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
            <button onClick={() => setOpen(!open)}
              className="mt-4 text-xs font-semibold text-cyan-500 hover:text-cyan-300 transition-colors">
              {open ? 'Show less ↑' : 'Show more ↓'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Skills ───────────────────────────────────────────────────────────────────

function SkillsSection() {
  return (
    <section id="skills" className="py-24 px-5">
      <div className="max-w-5xl mx-auto">
        <SectionLabel eyebrow="Expertise" heading="Tech Stack" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillCategories.map(cat => (
            <div key={cat.name} className="rounded-2xl border border-white/5 p-5"
              style={{ background: 'rgba(13,22,38,0.5)' }}>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-3">{cat.name}</p>
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
    <section id="education" className="py-24 px-5">
      <div className="max-w-5xl mx-auto">
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
    <div className="rounded-2xl border border-white/5 card-glow hover:border-white/10 transition-all duration-300 p-6"
      style={{ background: 'rgba(13,22,38,0.5)' }}>
      <div className="flex items-start gap-4">
        <Image src={education.logo} alt={education.institution} width={44} height={44}
          className="rounded-xl object-cover flex-shrink-0" unoptimized />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-black text-white text-base">{education.institution}</h3>
              {education.website && (
                <a href={education.website} target="_blank" rel="noopener noreferrer"
                  className="text-slate-600 hover:text-slate-300 transition-colors">
                  <FaExternalLinkAlt className="w-3 h-3" />
                </a>
              )}
            </div>
            <span className="font-mono text-xs text-slate-600 flex-shrink-0">{education.period}</span>
          </div>
          <p className="text-slate-300 text-sm font-semibold mb-1">{education.degree}</p>
          <p className="text-slate-500 text-sm mb-2">{education.location}</p>
          {education.grade && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              {education.grade}
            </span>
          )}
          {education.details.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {education.details.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-500 text-sm leading-relaxed">
                  <span className="text-cyan-700 mt-0.5 flex-shrink-0 text-[10px]">▸</span>{d}
                </li>
              ))}
            </ul>
          )}
          {education.showSaccades && (
            <>
              <button onClick={() => setDialogOpen(true)}
                className="mt-3 text-xs font-semibold text-cyan-500 hover:text-cyan-300 transition-colors">
                Demo dissertation →
              </button>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-xl"
                  style={{ background: '#0d1626', borderColor: 'rgba(255,255,255,0.1)', color: '#e2e8f0' }}>
                  <DialogHeader>
                    <DialogTitle style={{ color: '#fff' }}>Understanding Saccades</DialogTitle>
                    <DialogDescription className="pt-3 space-y-3 text-sm leading-relaxed"
                      style={{ color: '#94a3b8' }}>
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
                      <p style={{ color: '#cbd5e1' }}>
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
    <footer className="py-10 px-5 border-t border-white/5">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-600">
        <span>© {new Date().getFullYear()} Ritvik Joshi</span>
        <div className="flex gap-6">
          <a href="https://linkedin.com/in/ritvik-joshi-327508ba" target="_blank" rel="noopener noreferrer"
            className="hover:text-slate-300 transition-colors">LinkedIn</a>
          <a href="https://fasterfoods.co.uk" target="_blank" rel="noopener noreferrer"
            className="hover:text-slate-300 transition-colors">FasterFoods</a>
          <a href="mailto:ritvikjoshi97@gmail.com" className="hover:text-slate-300 transition-colors">Email</a>
        </div>
      </div>
    </footer>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RitvikPage() {
  return (
    <div className="min-h-screen bg-[#060b14] text-slate-100">
      <Nav />
      <Hero />
      <ProjectsSection />
      <ExperienceSection />
      <SkillsSection />
      <EducationSection />
      <Footer />
    </div>
  )
}
