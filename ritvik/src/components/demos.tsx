"use client"

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Play, RotateCcw, Sparkles, Timer, CheckCircle2, Printer,
  ShoppingCart, Archive, UtensilsCrossed, Dumbbell, Moon,
  Waves, Bike, Footprints,
} from 'lucide-react'

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

// ─── Reveal on scroll ─────────────────────────────────────────────────────────

export function Reveal({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); obs.disconnect() } },
      { threshold: 0.12 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

// ─── Animated counter ─────────────────────────────────────────────────────────

export function CountUp({ to, suffix = '', decimals = 0, duration = 1400 }: {
  to: number; suffix?: string; decimals?: number; duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [val, setVal] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || started.current) return
      started.current = true
      const t0 = performance.now()
      const tick = (t: number) => {
        const p = Math.min((t - t0) / duration, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        setVal(to * eased)
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [to, duration])

  return <span ref={ref}>{val.toFixed(decimals)}{suffix}</span>
}

// ─── Demo shell ───────────────────────────────────────────────────────────────

export function DemoShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: C.surface2, border: `1px solid ${C.sep}` }}
    >
      <div
        className="flex items-center gap-1.5 px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest"
        style={{ color: C.forest, borderBottom: `1px solid ${C.sep}` }}
      >
        <Sparkles size={12} />
        {title}
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

// ─── 1. SITA: AI log triage simulator ─────────────────────────────────────────

const TRIAGE_LOGS = [
  { t: '09:41:02', level: 'INFO',  msg: 'kiosk-LHR-114 boot sequence complete' },
  { t: '09:41:09', level: 'INFO',  msg: 'CUSS platform handshake OK (v4.2.1)' },
  { t: '09:41:15', level: 'WARN',  msg: 'bagtag printer ATB-2 firmware mismatch (3.0.8 ≠ 3.1.0)' },
  { t: '09:41:18', level: 'ERROR', msg: 'PECTAB download failed: checksum invalid' },
  { t: '09:41:19', level: 'ERROR', msg: 'print job 7741 aborted — passenger flow blocked' },
  { t: '09:41:23', level: 'INFO',  msg: 'retry scheduled… (attempt 3/3)' },
]

export function LogTriageDemo() {
  const [phase, setPhase] = useState<'idle' | 'streaming' | 'analysing' | 'done'>('idle')
  const [lines, setLines] = useState(0)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const reset = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setPhase('idle'); setLines(0)
  }

  const run = () => {
    reset()
    setPhase('streaming')
    TRIAGE_LOGS.forEach((_, i) => {
      timers.current.push(setTimeout(() => setLines(i + 1), 260 * (i + 1)))
    })
    timers.current.push(setTimeout(() => setPhase('analysing'), 260 * TRIAGE_LOGS.length + 300))
    timers.current.push(setTimeout(() => setPhase('done'), 260 * TRIAGE_LOGS.length + 1900))
  }

  useEffect(() => () => { timers.current.forEach(clearTimeout) }, [])

  const levelColor = (l: string) =>
    l === 'ERROR' ? '#ff6b6b' : l === 'WARN' ? '#ffd60a' : '#8e8e93'

  return (
    <DemoShell title="Try it — AI log triage">
      <div className="rounded-xl p-3.5 font-mono text-[11px] leading-relaxed min-h-[180px]"
        style={{ background: '#1A1A1C', color: '#E5E5EA' }}>
        {phase === 'idle' && (
          <p style={{ color: '#8e8e93' }}>
            // A kiosk at Heathrow just failed. Press “Ingest logs” —<br />
            // this is roughly what my pipeline does, minus two weeks of waiting.
          </p>
        )}
        {TRIAGE_LOGS.slice(0, lines).map((l, i) => (
          <p key={i} className="log-line">
            <span style={{ color: '#5e5ce6' }}>{l.t}</span>{' '}
            <span style={{ color: levelColor(l.level), fontWeight: 700 }}>{l.level.padEnd(5)}</span>{' '}
            {l.msg}
          </p>
        ))}
        {phase === 'analysing' && (
          <p className="mt-2" style={{ color: '#30d158' }}>
            <span className="inline-block animate-spin mr-1.5">◐</span>
            Agentic RAG pass: clustering errors → matching known configs → ranking causes…
          </p>
        )}
        {phase === 'done' && (
          <div className="mt-2 rounded-lg p-2.5" style={{ background: 'rgba(48,209,88,0.12)', border: '1px solid rgba(48,209,88,0.3)' }}>
            <p style={{ color: '#30d158', fontWeight: 700 }}>✓ Root cause (94% confidence)</p>
            <p style={{ color: '#E5E5EA' }}>ATB-2 printer firmware 3.0.8 rejects new PECTAB checksum format.</p>
            <p style={{ color: '#8e8e93' }}>Fix: push firmware 3.1.0 via fleet manager · KB-2241 · ETA 4 min</p>
          </div>
        )}
      </div>
      <div className="flex items-center gap-3 mt-3">
        <button onClick={phase === 'idle' || phase === 'done' ? run : reset}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: C.forest }}>
          {phase === 'idle' ? <><Play size={11} /> Ingest logs</>
            : phase === 'done' ? <><RotateCcw size={11} /> Run again</>
            : <><RotateCcw size={11} /> Reset</>}
        </button>
        {phase === 'done' && (
          <span className="text-xs font-semibold" style={{ color: C.forestMid }}>
            Triage: 2 weeks → minutes
          </span>
        )}
      </div>
    </DemoShell>
  )
}

// ─── 2. Blueskeye: eye-gaze tracker ───────────────────────────────────────────

function Eye({ dx, dy }: { dx: number; dy: number }) {
  return (
    <div className="relative rounded-full"
      style={{ width: 64, height: 64, background: '#fff', border: `2px solid ${C.sep}`, boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.08)' }}>
      <div className="absolute rounded-full flex items-center justify-center"
        style={{
          width: 26, height: 26, background: '#3a2a1a',
          left: '50%', top: '50%',
          transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`,
          transition: 'transform 0.05s linear',
        }}>
        <div className="rounded-full" style={{ width: 10, height: 10, background: '#000' }} />
        <div className="absolute rounded-full" style={{ width: 5, height: 5, background: 'rgba(255,255,255,0.85)', top: 4, left: 5 }} />
      </div>
    </div>
  )
}

export function EyeGazeDemo() {
  const boxRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState({ dx: 0, dy: 0 })
  const [speed, setSpeed] = useState(0)
  const last = useRef<{ x: number; y: number; t: number } | null>(null)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const box = boxRef.current
      if (!box) return
      const r = box.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const ang = Math.atan2(e.clientY - cy, e.clientX - cx)
      const dist = Math.min(Math.hypot(e.clientX - cx, e.clientY - cy) / 12, 15)
      setOffset({ dx: Math.cos(ang) * dist, dy: Math.sin(ang) * dist })

      const now = performance.now()
      if (last.current) {
        const dt = now - last.current.t
        if (dt > 0) {
          const v = Math.hypot(e.clientX - last.current.x, e.clientY - last.current.y) / dt
          setSpeed(s => s * 0.8 + v * 0.2)
        }
      }
      last.current = { x: e.clientX, y: e.clientY, t: now }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const saccading = speed > 1.2

  return (
    <DemoShell title="Try it — gaze estimation">
      <div ref={boxRef} className="flex flex-col items-center py-4">
        <div className="flex gap-4 mb-4">
          <Eye dx={offset.dx} dy={offset.dy} />
          <Eye dx={offset.dx} dy={offset.dy} />
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full"
          style={{
            background: saccading ? '#FFF3E0' : C.forestBg,
            color: saccading ? '#B45309' : C.forest,
            transition: 'background 0.2s ease, color 0.2s ease',
          }}>
          <span className="w-1.5 h-1.5 rounded-full"
            style={{ background: saccading ? '#F59E0B' : C.forestMid }} />
          {saccading ? 'Saccade detected — rapid ballistic movement' : 'Fixation — gaze is steady'}
        </div>
        <p className="text-[11px] mt-3 text-center max-w-xs" style={{ color: C.label3 }}>
          Move your cursor — these eyes track it the way my IR-camera model tracked drivers’ gaze.
          Move fast and you’ll trigger a saccade, the eye movement my dissertation measured.
        </p>
      </div>
    </DemoShell>
  )
}

// ─── 3. Wipro: provisioning race ──────────────────────────────────────────────

export function ProvisionRaceDemo() {
  const [running, setRunning] = useState(false)
  const [auto, setAuto] = useState(0)    // 0..1 — finishes fast
  const [manual, setManual] = useState(0) // crawls
  const raf = useRef<number | null>(null)

  const run = () => {
    if (raf.current) cancelAnimationFrame(raf.current)
    setRunning(true); setAuto(0); setManual(0)
    const t0 = performance.now()
    const AUTO_MS = 2200
    const tick = (t: number) => {
      const el = t - t0
      setAuto(Math.min(el / AUTO_MS, 1))
      // manual: 2 days vs 10 min → 288x slower; cap the bar so it visibly crawls
      setManual(Math.min(el / (AUTO_MS * 288), 0.06))
      if (el < AUTO_MS + 600) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
  }

  useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current) }, [])

  const Bar = ({ label, value, time, color, done }: {
    label: string; value: number; time: string; color: string; done: boolean
  }) => (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-semibold" style={{ color: C.label }}>{label}</span>
        <span className="text-[11px] font-mono flex items-center gap-1" style={{ color: done ? C.forestMid : C.label3 }}>
          {done && <CheckCircle2 size={11} />}{time}
        </span>
      </div>
      <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
        <div className="h-full rounded-full" style={{ width: `${value * 100}%`, background: color, transition: 'width 0.1s linear' }} />
      </div>
    </div>
  )

  return (
    <DemoShell title="Try it — environment provisioning race">
      <Bar label="🤖 My Node.js automation" value={auto} time={auto >= 1 ? '10 minutes' : running ? 'provisioning…' : '—'} color={C.forestMid} done={auto >= 1} />
      <Bar label="🧑‍💼 Manual ticket queue" value={manual} time={running || manual > 0 ? '2 days (still going…)' : '—'} color="#AEAEB2" done={false} />
      <div className="flex items-center gap-3 mt-1">
        <button onClick={run}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: C.forest }}>
          <Timer size={11} /> {auto >= 1 ? 'Race again' : 'Provision AWS environment'}
        </button>
        {auto >= 1 && (
          <span className="text-xs font-bold" style={{ color: C.forestMid }}>99% faster ✓</span>
        )}
      </div>
    </DemoShell>
  )
}

// ─── 4. Fracktal: 3D printer ──────────────────────────────────────────────────

const VASE_WIDTHS = [62, 58, 52, 46, 42, 40, 42, 48, 56, 66, 74, 78, 76, 68, 56, 44, 38, 36]

export function PrinterDemo() {
  const [layers, setLayers] = useState(0)
  const [printing, setPrinting] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  const print = () => {
    if (timer.current) clearInterval(timer.current)
    setLayers(0); setPrinting(true)
    timer.current = setInterval(() => {
      setLayers(l => {
        if (l + 1 >= VASE_WIDTHS.length) {
          if (timer.current) clearInterval(timer.current)
          setPrinting(false)
          return VASE_WIDTHS.length
        }
        return l + 1
      })
    }, 180)
  }

  useEffect(() => () => { if (timer.current) clearInterval(timer.current) }, [])

  const pct = Math.round((layers / VASE_WIDTHS.length) * 100)

  return (
    <DemoShell title="Try it — print a vase">
      <div className="flex items-end justify-center gap-8 py-2">
        {/* Print bed + vase, built bottom-up */}
        <div className="flex flex-col items-center">
          <div className="flex flex-col-reverse items-center justify-start"
            style={{ height: VASE_WIDTHS.length * 7 + 4 }}>
            {VASE_WIDTHS.slice(0, layers).map((w, i) => (
              <div key={i} className="layer-pop rounded-sm"
                style={{
                  width: w, height: 6, marginTop: 1,
                  background: `linear-gradient(90deg, ${C.forestMid}, ${C.forest})`,
                  opacity: 0.65 + (i / VASE_WIDTHS.length) * 0.35,
                }} />
            ))}
          </div>
          <div className="rounded-full" style={{ width: 110, height: 8, background: '#D1D1D6', marginTop: 3 }} />
          <p className="text-[10px] font-mono mt-2" style={{ color: C.label3 }}>heated bed · 60°C</p>
        </div>

        <div className="flex flex-col items-start gap-2">
          <p className="font-mono text-2xl font-bold" style={{ color: C.label }}>{pct}%</p>
          <p className="text-[11px]" style={{ color: C.label2 }}>
            layer {layers}/{VASE_WIDTHS.length}<br />0.2mm · PLA
          </p>
          <button onClick={print} disabled={printing}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: C.forest }}>
            <Printer size={11} /> {layers >= VASE_WIDTHS.length ? 'Print again' : printing ? 'Printing…' : 'Start print'}
          </button>
        </div>
      </div>
      <p className="text-[11px] text-center mt-1" style={{ color: C.label3 }}>
        At Fracktal Works I built the Flutter app that talked to printers doing exactly this.
      </p>
    </DemoShell>
  )
}

// ─── 5. FasterFoods: the health loop ──────────────────────────────────────────

const LOOP_NODES = [
  {
    id: 'shop', label: 'Shop', Icon: ShoppingCart,
    detail: 'AI-assisted shopping lists. Tell the chat what your week looks like and a multi-agent pipeline researches and drafts the list — nudged by the in-house recommendation model.',
  },
  {
    id: 'pantry', label: 'Pantry', Icon: Archive,
    detail: 'OCR receipt scanning drops your groceries straight into a live pantry, so the platform knows what’s actually in your kitchen.',
  },
  {
    id: 'eat', label: 'Eat', Icon: UtensilsCrossed,
    detail: 'Log food with instant lookup against reliable nutrition databases, or just scan the barcode. Digestion notes and custom metrics ride along.',
  },
  {
    id: 'train', label: 'Train', Icon: Dumbbell,
    detail: 'Workouts sync from Apple Health (and Android’s equivalent), so the energy you burned is reconciled against the energy you logged.',
  },
  {
    id: 'recover', label: 'Recover', Icon: Moon,
    detail: 'Sleep, blood pressure, sugar — any custom metric you care about. Recovery closes the loop and feeds the next gameplan.',
  },
]

export function HealthLoopDemo() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setActive(a => (a + 1) % LOOP_NODES.length), 3200)
    return () => clearInterval(t)
  }, [paused])

  const R = 92
  const node = LOOP_NODES[active]

  return (
    <div className="grid md:grid-cols-2 gap-6 items-center"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {/* Ring */}
      <div className="relative mx-auto" style={{ width: R * 2 + 72, height: R * 2 + 72 }}>
        <div className="absolute inset-9 rounded-full" style={{ border: `2px dashed ${C.forestBg2}` }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-[11px] font-bold uppercase tracking-widest text-center leading-tight"
            style={{ color: C.forestMid }}>
            the<br />health<br />loop
          </p>
        </div>
        {LOOP_NODES.map(({ id, label, Icon }, i) => {
          const ang = (i / LOOP_NODES.length) * Math.PI * 2 - Math.PI / 2
          const x = R + R * Math.cos(ang)
          const y = R + R * Math.sin(ang)
          const isActive = i === active
          return (
            <button key={id}
              onClick={() => { setActive(i); setPaused(true) }}
              className="absolute flex flex-col items-center gap-1 -translate-x-1/2 -translate-y-1/2"
              style={{ left: x + 36, top: y + 36 }}>
              <span className="flex items-center justify-center rounded-2xl"
                style={{
                  width: isActive ? 54 : 44, height: isActive ? 54 : 44,
                  background: isActive ? C.forest : C.surface,
                  color: isActive ? '#fff' : C.forestMid,
                  border: `1px solid ${isActive ? C.forest : C.sep}`,
                  boxShadow: isActive ? '0 8px 24px rgba(28,56,41,0.3)' : '0 2px 8px rgba(0,0,0,0.06)',
                  transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                }}>
                <Icon size={isActive ? 24 : 19} strokeWidth={1.8} />
              </span>
              <span className="text-[11px] font-semibold"
                style={{ color: isActive ? C.forest : C.label3 }}>{label}</span>
            </button>
          )
        })}
      </div>

      {/* Detail */}
      <div key={node.id} className="loop-detail rounded-2xl p-5"
        style={{ background: C.surface, border: `1px solid ${C.sep}` }}>
        <p className="text-sm font-bold mb-1.5 flex items-center gap-2" style={{ color: C.forest }}>
          <node.Icon size={15} /> {node.label}
        </p>
        <p className="text-sm leading-relaxed" style={{ color: C.label2 }}>{node.detail}</p>
        <p className="text-[10px] mt-3 uppercase tracking-widest font-bold" style={{ color: C.label3 }}>
          tap a node, or hover to pause
        </p>
      </div>
    </div>
  )
}

// ─── 6. Dance Helper: beat trainer ────────────────────────────────────────────

export function BeatTapDemo() {
  const [playing, setPlaying] = useState(false)
  const [bpm, setBpm] = useState(100)
  const [pulse, setPulse] = useState(false)
  const [verdict, setVerdict] = useState<string | null>(null)
  const audioCtx = useRef<AudioContext | null>(null)
  const lastBeat = useRef(0)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const bpmRef = useRef(bpm)
  bpmRef.current = bpm

  const click = useCallback((accent = false) => {
    try {
      audioCtx.current ??= new AudioContext()
      const ctx = audioCtx.current
      if (ctx.state === 'suspended') ctx.resume()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.frequency.value = accent ? 1320 : 880
      gain.gain.setValueAtTime(0.25, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07)
      osc.connect(gain).connect(ctx.destination)
      osc.start(); osc.stop(ctx.currentTime + 0.08)
    } catch { /* no audio available */ }
  }, [])

  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current)
    timer.current = null
    setPlaying(false); setPulse(false)
  }, [])

  const start = useCallback(() => {
    stop()
    setPlaying(true); setVerdict(null)
    const beat = () => {
      lastBeat.current = performance.now()
      setPulse(true)
      click()
      setTimeout(() => setPulse(false), 110)
    }
    beat()
    timer.current = setInterval(beat, 60000 / bpmRef.current)
  }, [click, stop])

  useEffect(() => () => { if (timer.current) clearInterval(timer.current) }, [])

  // restart interval when bpm changes mid-play
  useEffect(() => {
    if (playing) start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bpm])

  const tap = () => {
    if (!playing) return
    const period = 60000 / bpm
    const since = performance.now() - lastBeat.current
    const off = Math.min(since, period - since) // distance to nearest beat
    setVerdict(off < 70 ? '🎯 Perfect!' : off < 140 ? '👍 Close' : since < period / 2 ? '⏪ Late' : '⏩ Early')
  }

  return (
    <DemoShell title="Try it — beat trainer (sound on)">
      <div className="flex flex-col items-center gap-4 py-2">
        <button onClick={tap}
          className="rounded-full flex items-center justify-center font-bold text-white select-none"
          style={{
            width: 96, height: 96,
            background: `radial-gradient(circle at 35% 30%, ${C.forestMid}, ${C.forest})`,
            transform: pulse ? 'scale(1.18)' : 'scale(1)',
            boxShadow: pulse ? '0 0 0 14px rgba(45,106,79,0.18)' : '0 0 0 0 rgba(45,106,79,0)',
            transition: 'transform 0.1s ease, box-shadow 0.25s ease',
            fontSize: 13,
          }}>
          {playing ? 'TAP' : '♪'}
        </button>

        <div className="h-5 text-sm font-bold" style={{ color: C.forestMid }}>
          {verdict ?? (playing ? 'Tap the circle on the beat' : '')}
        </div>

        <div className="flex items-center gap-3 w-full max-w-xs">
          <button onClick={playing ? stop : start}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white flex-shrink-0 transition-opacity hover:opacity-90"
            style={{ background: C.forest }}>
            <Play size={11} /> {playing ? 'Stop' : 'Start'}
          </button>
          <input type="range" min={60} max={160} value={bpm}
            onChange={e => setBpm(Number(e.target.value))}
            className="flex-1 accent-[#2D6A4F]" />
          <span className="text-xs font-mono w-14 text-right" style={{ color: C.label2 }}>{bpm} bpm</span>
        </div>
        <p className="text-[11px] text-center max-w-xs" style={{ color: C.label3 }}>
          Dance Helper does this with real-time audio signal processing on any song — this is the toy version.
        </p>
      </div>
    </DemoShell>
  )
}

// ─── 7. Violin: playable strings ──────────────────────────────────────────────

const STRINGS = [
  { note: 'G', freq: 196.0 },
  { note: 'D', freq: 293.66 },
  { note: 'A', freq: 440.0 },
  { note: 'E', freq: 659.25 },
]

export function ViolinDemo() {
  const audioCtx = useRef<AudioContext | null>(null)
  const [bowing, setBowing] = useState<number | null>(null)

  const bow = (i: number) => {
    setBowing(i)
    setTimeout(() => setBowing(b => (b === i ? null : b)), 600)
    try {
      audioCtx.current ??= new AudioContext()
      const ctx = audioCtx.current
      if (ctx.state === 'suspended') ctx.resume()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.value = STRINGS[i].freq
      // bowed-string-ish envelope: slow attack, gentle release
      gain.gain.setValueAtTime(0.0001, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.09)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.1)
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 2200
      osc.connect(filter).connect(gain).connect(ctx.destination)
      osc.start(); osc.stop(ctx.currentTime + 1.2)
    } catch { /* no audio available */ }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-end gap-7 px-8 pt-5 pb-3 rounded-2xl"
        style={{ background: 'linear-gradient(180deg, #4a2c17, #6b3f20)', boxShadow: 'inset 0 2px 12px rgba(0,0,0,0.4)' }}>
        {STRINGS.map((s, i) => (
          <button key={s.note} onMouseEnter={() => bow(i)} onClick={() => bow(i)}
            className="flex flex-col items-center gap-2 group" aria-label={`Play ${s.note} string`}>
            <span className={bowing === i ? 'string-wiggle' : ''}
              style={{
                display: 'block', width: 2 + (3 - i) * 0.7, height: 120,
                background: bowing === i ? '#ffd60a' : 'linear-gradient(180deg, #d8d8dc, #9a9aa0)',
                borderRadius: 2, transition: 'background 0.15s ease',
              }} />
            <span className="text-[11px] font-bold" style={{ color: bowing === i ? '#ffd60a' : '#c8a47e' }}>
              {s.note}
            </span>
          </button>
        ))}
      </div>
      <p className="text-[11px] mt-3" style={{ color: C.label3 }}>
        Hover or tap the strings · sound on 🎻
      </p>
    </div>
  )
}

// ─── 8. Half-ironman tracker ──────────────────────────────────────────────────

const TRI_LEGS = [
  { Icon: Waves,      label: 'Swim', dist: '1.9 km',  color: '#0a84ff', pct: 0.13 },
  { Icon: Bike,       label: 'Bike', dist: '90 km',   color: '#2D6A4F', pct: 0.62 },
  { Icon: Footprints, label: 'Run',  dist: '21.1 km', color: '#B45309', pct: 0.25 },
]

export function IronmanTracker() {
  const [hovered, setHovered] = useState<number | null>(null)
  // race is in September — count down to the start of the month
  const days = Math.max(0, Math.ceil((new Date(new Date().getFullYear(), 8, 1).getTime() - Date.now()) / 86400000))

  return (
    <div>
      <div className="flex justify-between items-baseline mb-3">
        <p className="text-sm font-bold" style={{ color: C.label }}>Half Ironman 70.3</p>
        <p className="text-xs font-mono" style={{ color: C.forestMid }}>
          September · {days > 0 ? `~${days} days out` : 'race month! 🏁'}
        </p>
      </div>
      <div className="flex h-9 rounded-xl overflow-hidden mb-2.5" style={{ border: `1px solid ${C.sep}` }}>
        {TRI_LEGS.map(({ label, color, pct }, i) => (
          <div key={label}
            onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
            className="flex items-center justify-center cursor-default"
            style={{
              width: `${pct * 100}%`,
              background: color,
              opacity: hovered === null || hovered === i ? 1 : 0.35,
              transition: 'opacity 0.2s ease',
            }}>
            <span className="text-[10px] font-bold text-white tracking-wide">
              {hovered === i ? TRI_LEGS[i].dist : label.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        {TRI_LEGS.map(({ Icon, label, dist, color }) => (
          <span key={label} className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: C.label2 }}>
            <Icon size={12} style={{ color }} /> {dist}
          </span>
        ))}
      </div>
    </div>
  )
}
