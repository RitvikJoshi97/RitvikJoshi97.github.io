"use client"

import { useState, useRef, useEffect } from 'react'
import {
  Play, RotateCcw, Sparkles, Timer, CheckCircle2, Printer,
  ShoppingCart, Archive, UtensilsCrossed, Dumbbell, Moon,
  Waves, Bike, Footprints, AlertTriangle, Camera, Eye,
} from 'lucide-react'
import { C } from '@/lib/palette'

// ─── Reveal on scroll ─────────────────────────────────────────────────────────

export function Reveal({ children, delay = 0, className = '', style }: {
  children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties
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
        ...style,
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

export function CountUp({ to, prefix = '', suffix = '', decimals = 0, duration = 1400 }: {
  to: number; prefix?: string; suffix?: string; decimals?: number; duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  // Start at the final value so the static HTML (link previews, scrapers, no-JS,
  // screen readers) carries the real number; only animate once JS is running.
  const [val, setVal] = useState(to)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    // Only replay the count if the number is still off-screen; if it's already
    // visible on load, leave the final value in place rather than flashing to 0.
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight && r.bottom > 0) return
    setVal(0)
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

  const shown = val.toLocaleString('en-GB', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  return <span ref={ref}>{prefix}{shown}{suffix}</span>
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
            {'// A kiosk at Heathrow just failed. Press “Ingest logs” —'}<br />
            {'// this is roughly what my pipeline does, minus two weeks of waiting.'}
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

// ─── 2. Blueskeye: gaze logging → drowsiness detection ────────────────────────
// One continuous picture: the road fills the whole frame, dash-cam style, with
// the driver's eyes as a picture-in-picture inset — same two acts as before
// (dissertation monitor, then automotive windshield) but looping on its own.

type GazePhase = 'calibrating' | 'driving' | 'drowsy' | 'alert' | 'resolved'

const GAZE_TARGETS = [
  { x: 58, y: 60, label: 'Road ahead', dx: 0, dy: 2 },
  { x: 50, y: 10, label: 'Rear-view mirror', dx: 0, dy: -8 },
  { x: 88, y: 88, label: 'Speedometer', dx: 8, dy: 8 },
  { x: 58, y: 60, label: 'Road ahead', dx: 0, dy: 2 },
]

// Picture-in-picture eye box sits bottom-left — used to anchor the gaze rays.
const EYE_Y_PCT = 85
const EYE_L_X_PCT = 9
const EYE_R_X_PCT = 17

function FaceEyes({ dx, dy, closed }: { dx: number; dy: number; closed: number }) {
  return (
    <div className="flex gap-1">
      {[0, 1].map(i => (
        <div key={i} className="relative rounded-full overflow-hidden flex-shrink-0"
          style={{ width: 22, height: 22, background: '#fff' }}>
          <div className="absolute rounded-full" style={{
            width: 10, height: 10, background: '#2b2b2e',
            left: '50%', top: '50%',
            transform: `translate(calc(-50% + ${dx * 0.6}px), calc(-50% + ${dy * 0.6}px))`,
            transition: 'transform 0.4s ease',
            opacity: 1 - closed,
          }} />
          <div className="absolute inset-x-0 top-0"
            style={{ height: `${closed * 100}%`, background: C.ink, transition: 'height 0.9s ease' }} />
        </div>
      ))}
    </div>
  )
}

// Dashed rays from each eye to whatever the driver is currently looking at —
// the whole point of a gaze model is the vector, not just where the pupil sits.
function GazeArrows({ target, opacity }: { target: { x: number; y: number }; opacity: number }) {
  return (
    <svg className="absolute inset-0" width="100%" height="100%" style={{ pointerEvents: 'none' }}>
      <defs>
        <marker id="gazeArrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L7,3 L0,6 Z" fill="#FFD60A" />
        </marker>
      </defs>
      {[EYE_L_X_PCT, EYE_R_X_PCT].map(ex => (
        <line key={ex} x1={`${ex}%`} y1={`${EYE_Y_PCT}%`} x2={`${target.x}%`} y2={`${target.y}%`}
          stroke="#FFD60A" strokeWidth={1.5} strokeDasharray="4 3" opacity={opacity}
          markerEnd="url(#gazeArrowhead)" style={{ transition: 'opacity 0.5s ease' }} />
      ))}
    </svg>
  )
}

// Cars ahead on the road, sized/positioned by how far down the (perspective)
// road they sit — f=0 is right at the horizon, f=1 is nearest the camera.
const ROAD_CARS = [
  { f: 0.08, side: -1, color: '#C7443B' },
  { f: 0.24, side: 1, color: '#3E6FA8' },
  { f: 0.52, side: -1, color: '#AEB4BB' },
]

// A simple rear-three-quarter car glyph — body, cabin/rear-window, taillights —
// legible as an actual car even at a few pixels tall, unlike a flat blob.
function RoadCar({ f, side, color }: { f: number; side: number; color: string }) {
  const roadWidthPct = 18 + 82 * f // matches the road's clip-path trapezoid
  const w = 6 + f * 26
  const h = w * 0.85
  const left = 50 + side * roadWidthPct * 0.24
  return (
    <svg className="absolute" viewBox="0 0 20 17" style={{
      left: `${left}%`, top: `${f * 100}%`, width: w, height: h,
      transform: 'translate(-50%,-100%)', filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.35))',
    }}>
      <rect x="1.5" y="4" width="17" height="12" rx="2.5" fill={color} />
      <rect x="4.5" y="0.5" width="11" height="6.5" rx="2" fill={color} />
      <rect x="5.6" y="1.6" width="8.8" height="3.6" rx="1.1" fill="rgba(255,255,255,0.6)" />
      <rect x="2.6" y="13.4" width="2.6" height="1.8" rx="0.6" fill="#ff453a" />
      <rect x="14.8" y="13.4" width="2.6" height="1.8" rx="0.6" fill="#ff453a" />
    </svg>
  )
}

const PHASE_META: Record<GazePhase, { label: string; color: string }> = {
  calibrating: { label: 'Calibrating', color: '#FFD60A' },
  driving: { label: 'Driving', color: '#2D6A4F' },
  drowsy: { label: 'Drowsy', color: '#FF9F0A' },
  alert: { label: 'Alert', color: '#FF453A' },
  resolved: { label: 'Resolved', color: '#30D158' },
}

function ReadoutRow({ label, value, dot }: { label: string; value: string; dot?: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: C.label3 }}>{label}</span>
      <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: C.label }}>
        {dot && <span className="rounded-full flex-shrink-0" style={{ width: 6, height: 6, background: dot }} />}
        {value}
      </span>
    </div>
  )
}

const HORIZON_PCT = 42

function RoadScene({ children }: { children?: React.ReactNode }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{
        background: `linear-gradient(180deg, #BFE0F0 0%, #BFE0F0 ${HORIZON_PCT - 4}%, #E8D9B8 ${HORIZON_PCT}%, #E8D9B8 100%)`,
      }} />
      <div className="absolute inset-x-0 bottom-0" style={{ top: `${HORIZON_PCT}%`, background: '#38383c', clipPath: 'polygon(41% 0%, 59% 0%, 100% 100%, 0% 100%)' }}>
        <div className="road-scroll absolute left-1/2 top-0 bottom-0" style={{
          width: 4, marginLeft: -2,
          backgroundImage: 'repeating-linear-gradient(180deg, #F4F3EE 0 18px, transparent 18px 36px)',
        }} />
        {ROAD_CARS.map((c, i) => <RoadCar key={i} {...c} />)}
      </div>
      {children}
    </div>
  )
}

export function EyeGazeDemo() {
  const [phase, setPhase] = useState<GazePhase>('calibrating')
  const [gazeIndex, setGazeIndex] = useState(0)
  const [closed, setClosed] = useState(0)
  const [tilt, setTilt] = useState(0)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const schedule = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms))
  }

  const play = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setPhase('calibrating'); setGazeIndex(0); setClosed(0); setTilt(0)

    schedule(() => setGazeIndex(1), 900)
    schedule(() => setGazeIndex(2), 1800)
    schedule(() => setGazeIndex(3), 2700)
    schedule(() => setPhase('driving'), 3500)
    schedule(() => { setPhase('drowsy'); setClosed(1); setTilt(9) }, 6200)
    schedule(() => setPhase('alert'), 7900)
    schedule(() => { setPhase('resolved'); setClosed(0); setTilt(0) }, 10200)
    schedule(play, 13000) // loop forever, no button needed
  }

  useEffect(() => {
    play()
    return () => timers.current.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const calibrating = phase === 'calibrating'
  const windshield = !calibrating
  const target = GAZE_TARGETS[gazeIndex]
  const faceDx = calibrating ? target.dx : 0
  const faceDy = calibrating ? target.dy : 0
  const arrowTarget = calibrating ? target : { x: 58, y: 60 }
  const eyesClosed = closed > 0.5

  const statusText = calibrating ? 'Logging gaze fixations on the monitor…'
    : phase === 'driving' ? 'Screen → windshield. Eyes on the road.'
    : phase === 'drowsy' ? 'Eyelids drooping…'
    : phase === 'alert' ? 'Drowsiness detected — eyes closed.'
    : 'Alert sent — driver responded.'

  const gazeTargetText = eyesClosed ? '—' : calibrating ? target.label : 'Road ahead'
  const meta = PHASE_META[phase]

  return (
    <DemoShell title="Try it — gaze & drowsiness detection">
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,340px)_1fr] gap-4 items-center">
        {/* left — one picture: the road fills the frame, eyes as picture-in-picture */}
        <div className="mx-auto w-full" style={{ maxWidth: 340 }}>
          <div className={`relative w-full overflow-hidden transition-all duration-700 ${phase === 'alert' ? 'alert-shake' : ''}`}
            style={{
              aspectRatio: '16/9',
              borderRadius: windshield ? 6 : 18,
              border: `${windshield ? 3 : 10}px solid ${windshield ? '#1c1c1e' : '#3a3a3d'}`,
              boxShadow: phase === 'alert' ? '0 0 0 4px rgba(255,69,58,0.35)' : 'none',
            }}>
            <RoadScene>
              {calibrating && (
                <div className="absolute rounded-full transition-all duration-700 ease-out"
                  style={{
                    left: `${target.x}%`, top: `${target.y}%`, width: 14, height: 14,
                    transform: 'translate(-50%,-50%)',
                    border: '2px solid #FFD60A', boxShadow: '0 0 0 3px rgba(255,214,10,0.25)',
                  }} />
              )}
            </RoadScene>

            <GazeArrows target={arrowTarget} opacity={1 - closed} />

            {/* eyes — picture-in-picture, tight to the frame's bottom-left corner */}
            <div className="absolute rounded-md flex items-center overflow-hidden"
              style={{ left: 6, bottom: 6, padding: '3px 4px', background: 'rgba(20,20,22,0.94)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <div style={{ transform: `rotate(${tilt}deg)`, transition: 'transform 0.6s ease' }}>
                <FaceEyes dx={faceDx} dy={faceDy} closed={closed} />
              </div>
            </div>
            <span className="absolute flex items-center gap-0.5 text-[7px] font-bold uppercase tracking-wide"
              style={{ left: 8, bottom: 34, color: 'rgba(255,255,255,0.75)' }}>
              <Camera size={7} /> {windshield ? 'dash cam' : 'face cam'}
            </span>

            {calibrating && (
              <div className="absolute left-1/2 top-2 -translate-x-1/2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{ background: 'rgba(0,0,0,0.55)', color: '#FFD60A' }}>
                <Eye size={10} /> gaze → {target.label}
              </div>
            )}
            {phase === 'alert' && (
              <div className="absolute inset-x-2 top-2 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] font-bold text-white"
                style={{ background: 'rgba(255,69,58,0.92)' }}>
                <AlertTriangle size={13} /> Drowsiness detected — eyes closed
              </div>
            )}
            {phase === 'resolved' && (
              <div className="absolute inset-x-2 top-2 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] font-bold text-white"
                style={{ background: 'rgba(48,209,88,0.92)' }}>
                <CheckCircle2 size={13} /> Alert sent — driver responded
              </div>
            )}
          </div>
        </div>

        {/* right — structured live readout */}
        <div className="rounded-xl p-3.5 flex flex-col gap-2.5" style={{ background: C.surface, border: `1px solid ${C.sep}` }}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: C.label3 }}>Live readout</span>
            <span className="flex items-center gap-1.5 text-[11px] font-bold" style={{ color: meta.color === '#FFD60A' ? '#B8860B' : meta.color }}>
              <span className="rounded-full flex-shrink-0" style={{ width: 6, height: 6, background: meta.color }} />
              {meta.label}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <ReadoutRow label="Camera" value={windshield ? 'Dash cam' : 'Face cam'} />
            <ReadoutRow label="Gaze target" value={gazeTargetText} />
            <ReadoutRow label="Eye state" value={eyesClosed ? 'Closed' : 'Open'} dot={eyesClosed ? '#FF453A' : '#30D158'} />
          </div>

          <div className="h-px" style={{ background: C.sep }} />

          <p className="text-[11px] font-semibold leading-relaxed" style={{ color: C.forestMid }}>
            {statusText}
          </p>
          <p className="text-[11px] leading-relaxed" style={{ color: C.label3 }}>
            My dissertation logged gaze like this from a monitor; Blueskeye’s automotive SDK runs the
            same IR model on a dashboard camera to catch drowsy drivers in real time.
          </p>
        </div>
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

// ─── 6. Dance Helper: AI pose tracking ────────────────────────────────────────
// Mirrors the real app's Vision-based skeleton: same 17 joints, same bone list
// (see PoseOverlayVideoPlayer.swift) — red joints, green bones, on a dancing figure.

type JointName =
  | 'nose' | 'leftEye' | 'rightEye' | 'leftEar' | 'rightEar'
  | 'leftShoulder' | 'rightShoulder' | 'leftElbow' | 'rightElbow'
  | 'leftWrist' | 'rightWrist' | 'leftHip' | 'rightHip'
  | 'leftKnee' | 'rightKnee' | 'leftAnkle' | 'rightAnkle'

const JOINT_ORDER: JointName[] = [
  'nose', 'leftEye', 'rightEye', 'leftEar', 'rightEar',
  'leftShoulder', 'rightShoulder', 'leftElbow', 'rightElbow',
  'leftWrist', 'rightWrist', 'leftHip', 'rightHip',
  'leftKnee', 'rightKnee', 'leftAnkle', 'rightAnkle',
]

const SKELETON: [JointName, JointName][] = [
  ['nose', 'leftEye'], ['leftEye', 'leftEar'], ['nose', 'rightEye'], ['rightEye', 'rightEar'],
  ['leftShoulder', 'rightShoulder'], ['leftShoulder', 'leftElbow'], ['leftElbow', 'leftWrist'],
  ['rightShoulder', 'rightElbow'], ['rightElbow', 'rightWrist'],
  ['leftShoulder', 'leftHip'], ['rightShoulder', 'rightHip'],
  ['leftHip', 'rightHip'], ['leftHip', 'leftKnee'], ['leftKnee', 'leftAnkle'],
  ['rightHip', 'rightKnee'], ['rightKnee', 'rightAnkle'],
]

const BODY_SEGMENTS: [JointName, JointName][] = [
  ['leftShoulder', 'rightShoulder'], ['leftShoulder', 'leftHip'], ['rightShoulder', 'rightHip'],
  ['leftHip', 'rightHip'], ['leftShoulder', 'leftElbow'], ['leftElbow', 'leftWrist'],
  ['rightShoulder', 'rightElbow'], ['rightElbow', 'rightWrist'],
  ['leftHip', 'leftKnee'], ['leftKnee', 'leftAnkle'], ['rightHip', 'rightKnee'], ['rightKnee', 'rightAnkle'],
]

function polar(cx: number, cy: number, angleDeg: number, len: number) {
  const rad = (angleDeg * Math.PI) / 180
  return { x: cx + Math.cos(rad) * len, y: cy + Math.sin(rad) * len }
}

// Procedural dance loop — bone lengths stay fixed, only joint angles move.
function danceJoints(t: number): Record<JointName, { x: number; y: number }> {
  const sway = Math.sin(t * 1.6) * 7
  const bob = Math.abs(Math.sin(t * 1.6)) * 4

  const leftShoulder = { x: 78 + sway, y: 66 - bob }
  const rightShoulder = { x: 122 + sway, y: 66 - bob }
  const leftHip = { x: 84 + sway * 0.7, y: 138 - bob * 0.5 }
  const rightHip = { x: 116 + sway * 0.7, y: 138 - bob * 0.5 }

  const lUpperAngle = 100 + 55 * Math.sin(t * 2.4)
  const leftElbow = polar(leftShoulder.x, leftShoulder.y, lUpperAngle, 34)
  const leftWrist = polar(leftElbow.x, leftElbow.y, lUpperAngle - 40 + 50 * Math.sin(t * 2.4 + 1.1), 30)

  const rUpperAngle = 80 - 55 * Math.sin(t * 2.4)
  const rightElbow = polar(rightShoulder.x, rightShoulder.y, rUpperAngle, 34)
  const rightWrist = polar(rightElbow.x, rightElbow.y, rUpperAngle + 40 - 50 * Math.sin(t * 2.4 + 1.1), 30)

  const lKneeAngle = 96 + 12 * Math.sin(t * 3.2)
  const leftKnee = polar(leftHip.x, leftHip.y, lKneeAngle, 36)
  const leftAnkle = polar(leftKnee.x, leftKnee.y, lKneeAngle + 6, 36)

  const rKneeAngle = 84 - 12 * Math.sin(t * 3.2)
  const rightKnee = polar(rightHip.x, rightHip.y, rKneeAngle, 36)
  const rightAnkle = polar(rightKnee.x, rightKnee.y, rKneeAngle - 6, 36)

  const nose = { x: (leftShoulder.x + rightShoulder.x) / 2, y: leftShoulder.y - 32 }
  const leftEye = { x: nose.x - 4, y: nose.y - 2 }
  const rightEye = { x: nose.x + 4, y: nose.y - 2 }
  const leftEar = { x: nose.x - 9, y: nose.y }
  const rightEar = { x: nose.x + 9, y: nose.y }

  return {
    nose, leftEye, rightEye, leftEar, rightEar,
    leftShoulder, rightShoulder, leftElbow, rightElbow, leftWrist, rightWrist,
    leftHip, rightHip, leftKnee, rightKnee, leftAnkle, rightAnkle,
  }
}

// Reference dancer is the "ground truth" choreography. The learner drifts away
// from it in cycles (arms/legs mainly — the joints that actually carry a dance
// move) so the sync score has something real to react to.
const DRIFT_WEIGHT: Partial<Record<JointName, number>> = {
  leftWrist: 1.6, rightWrist: 1.6, leftElbow: 1.2, rightElbow: 1.2,
  leftAnkle: 1.3, rightAnkle: 1.3, leftKnee: 1.1, rightKnee: 1.1,
  leftShoulder: 0.8, rightShoulder: 0.8, leftHip: 0.8, rightHip: 0.8,
}

const JOINT_LABEL: Partial<Record<JointName, string>> = {
  leftWrist: 'left arm', rightWrist: 'right arm', leftElbow: 'left arm', rightElbow: 'right arm',
  leftAnkle: 'left leg', rightAnkle: 'right leg', leftKnee: 'left leg', rightKnee: 'right leg',
  leftShoulder: 'left arm', rightShoulder: 'right arm', leftHip: 'hips', rightHip: 'hips',
}

function learnerJoints(t: number): Record<JointName, { x: number; y: number }> {
  const base = danceJoints(t)
  const envelope = (Math.sin(t * 0.5 - 1) + 1) / 2 // 0..1 — drifts in and out of sync
  const jit = (seed: number) => Math.sin(t * 3.7 + seed) * 13 * envelope
  return {
    ...base,
    leftWrist: { x: base.leftWrist.x + jit(1.3), y: base.leftWrist.y + jit(4.1) },
    rightWrist: { x: base.rightWrist.x + jit(2.7), y: base.rightWrist.y + jit(5.9) },
    leftElbow: { x: base.leftElbow.x + jit(0.6) * 0.5, y: base.leftElbow.y + jit(3.2) * 0.5 },
    rightElbow: { x: base.rightElbow.x + jit(1.9) * 0.5, y: base.rightElbow.y + jit(6.4) * 0.5 },
    leftAnkle: { x: base.leftAnkle.x + jit(7.1) * 0.5, y: base.leftAnkle.y },
    rightAnkle: { x: base.rightAnkle.x + jit(8.8) * 0.5, y: base.rightAnkle.y },
  }
}

function computeSync(ref: Record<JointName, { x: number; y: number }>, you: Record<JointName, { x: number; y: number }>) {
  let totalW = 0, weightedErr = 0, worst: JointName = 'leftWrist', worstContribution = -1
  for (const j of JOINT_ORDER) {
    const w = DRIFT_WEIGHT[j] ?? 0.5
    const d = Math.hypot(ref[j].x - you[j].x, ref[j].y - you[j].y)
    weightedErr += d * w
    totalW += w
    if (d * w > worstContribution) { worstContribution = d * w; worst = j }
  }
  const score = Math.max(0, Math.min(100, Math.round(100 - (weightedErr / totalW) * 8)))
  return { score, worst }
}

function PoseFigure({ joints, revealCount }: {
  joints: Record<JointName, { x: number; y: number }>; revealCount: number
}) {
  const shown = new Set(JOINT_ORDER.slice(0, revealCount))
  return (
    <svg viewBox="0 0 200 230" width="100%" height="150" style={{ maxWidth: 130 }}>
      <circle cx={joints.nose.x} cy={joints.nose.y - 13} r="13"
        fill={C.forestBg2} stroke={C.forestMid} strokeWidth="2" opacity="0.9" />
      {BODY_SEGMENTS.map(([a, b], i) => (
        <line key={i} x1={joints[a].x} y1={joints[a].y} x2={joints[b].x} y2={joints[b].y}
          stroke={C.forestBg2} strokeWidth="14" strokeLinecap="round" />
      ))}
      {SKELETON.map(([a, b], i) => (
        shown.has(a) && shown.has(b) &&
        <line key={i} x1={joints[a].x} y1={joints[a].y} x2={joints[b].x} y2={joints[b].y}
          stroke="#30D158" strokeWidth="2" />
      ))}
      {JOINT_ORDER.map((j, i) => (
        i < revealCount &&
        <circle key={j} cx={joints[j].x} cy={joints[j].y} r="3.2" fill="#FF453A" />
      ))}
    </svg>
  )
}

export function PoseDanceDemo() {
  const [refJoints, setRefJoints] = useState(() => danceJoints(0))
  const [youJoints, setYouJoints] = useState(() => learnerJoints(0))
  const [phase, setPhase] = useState<'idle' | 'detecting' | 'comparing'>('idle')
  const [revealed, setRevealed] = useState(0)
  const [sync, setSync] = useState<{ score: number; worst: JointName }>({ score: 100, worst: 'leftWrist' })
  const raf = useRef<number | null>(null)
  const revealTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const phaseRef = useRef(phase)
  phaseRef.current = phase

  useEffect(() => {
    const t0 = performance.now()
    const tick = (now: number) => {
      const t = (now - t0) / 1000
      const ref = danceJoints(t)
      const you = learnerJoints(t)
      setRefJoints(ref)
      setYouJoints(you)
      if (phaseRef.current === 'comparing') setSync(computeSync(ref, you))
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => { if (raf.current) cancelAnimationFrame(raf.current) }
  }, [])

  useEffect(() => () => { if (revealTimer.current) clearInterval(revealTimer.current) }, [])

  const startTracking = () => {
    setPhase('detecting')
    setRevealed(0)
    if (revealTimer.current) clearInterval(revealTimer.current)
    let n = 0
    revealTimer.current = setInterval(() => {
      n += 1
      setRevealed(n)
      if (n >= JOINT_ORDER.length) {
        if (revealTimer.current) clearInterval(revealTimer.current)
        setPhase('comparing')
      }
    }, 60)
  }

  const reset = () => {
    if (revealTimer.current) clearInterval(revealTimer.current)
    setPhase('idle')
    setRevealed(0)
  }

  const tracking = phase !== 'idle'
  const scoreColor = sync.score >= 85 ? '#30D158' : sync.score >= 60 ? '#F59E0B' : '#FF453A'

  return (
    <DemoShell title="Try it — AI pose tracking">
      <div className="flex flex-col items-center py-2">
        <div className="flex items-start justify-center gap-4">
          <div className="flex flex-col items-center">
            <PoseFigure joints={refJoints} revealCount={JOINT_ORDER.length} />
            <span className="text-[10px] font-bold uppercase tracking-wider mt-1" style={{ color: C.label3 }}>Reference</span>
          </div>
          <div className="flex flex-col items-center">
            <PoseFigure joints={youJoints} revealCount={phase === 'idle' ? 0 : revealed} />
            <span className="text-[10px] font-bold uppercase tracking-wider mt-1" style={{ color: C.label3 }}>You</span>
          </div>
        </div>

        <div className="w-full max-w-[280px] mt-3 h-9">
          {phase === 'comparing' ? (
            <>
              <div className="flex items-center justify-between mb-1 gap-2">
                <span className="text-xs font-bold flex-shrink-0" style={{ color: scoreColor }}>{sync.score}% synced</span>
                <span className="text-[11px] text-right truncate" style={{ color: C.label3 }}>
                  {sync.score >= 90 ? '🎯 right on the beat' : `off on your ${JOINT_LABEL[sync.worst] ?? 'timing'}`}
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: C.surface2 }}>
                <div className="h-full rounded-full" style={{ width: `${sync.score}%`, background: scoreColor }} />
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-xs font-semibold" style={{ color: C.forestMid }}>
              {phase === 'detecting' ? `Detecting joints… ${revealed}/${JOINT_ORDER.length}` : ''}
            </div>
          )}
        </div>

        <button onClick={tracking ? reset : startTracking}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white mt-1 transition-opacity hover:opacity-90"
          style={{ background: C.forest }}>
          {tracking ? <><RotateCcw size={11} /> Reset</> : <><Play size={11} /> Compare to reference</>}
        </button>

        <p className="text-[11px] text-center max-w-xs mt-3" style={{ color: C.label3 }}>
          Dance Helper tracks 17 body joints with Apple Vision, then scores your moves against a
          reference video with weighted dynamic time warping — this is the toy version.
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

  return (
    <div>
      <div className="flex justify-between items-baseline mb-3">
        <p className="text-sm font-bold" style={{ color: C.label }}>Half Ironman 70.3</p>
        <p className="text-xs font-mono" style={{ color: C.forestMid }}>
          Sept 2026 🏁
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
