import { useState, useEffect, useRef } from "react";

const TIMELINE_COLORS = [
  { bg: "#0ff", accent: "#00ffcc", glow: "0 0 30px #0ff8", label: "Timeline A" },
  { bg: "#f0f", accent: "#ff44cc", glow: "0 0 30px #f0f8", label: "Timeline B" },
  { bg: "#ff0", accent: "#ffcc00", glow: "0 0 30px #ff08", label: "Timeline C" },
];

const CITY_GROUPS = [
  { region: "🇺🇸 North America", cities: ["New York", "San Francisco", "Los Angeles", "Chicago", "Austin", "Seattle", "Boston", "Miami", "Toronto", "Vancouver", "Mexico City"] },
  { region: "🇬🇧 Europe", cities: ["London", "Paris", "Berlin", "Amsterdam", "Barcelona", "Madrid", "Lisbon", "Dublin", "Zurich", "Stockholm", "Copenhagen", "Milan", "Vienna", "Warsaw"] },
  { region: "🌏 Asia Pacific", cities: ["Tokyo", "Singapore", "Seoul", "Shanghai", "Hong Kong", "Beijing", "Bangalore", "Mumbai", "Sydney", "Melbourne", "Auckland", "Taipei", "Bangkok", "Jakarta"] },
  { region: "🌍 Middle East & Africa", cities: ["Dubai", "Abu Dhabi", "Riyadh", "Tel Aviv", "Cairo", "Nairobi", "Lagos", "Cape Town", "Johannesburg", "Casablanca"] },
  { region: "🌎 Latin America", cities: ["São Paulo", "Buenos Aires", "Bogotá", "Santiago", "Lima", "Medellín"] },
  { region: "🌐 Remote", cities: ["Remote / Digital Nomad"] },
];
const MAJORS = ["Computer Science", "Finance", "Design / Arts", "Business", "Engineering", "Psychology", "Biology / Pre-Med", "Law", "Communications"];
const GOALS = ["Startup Founder", "Corporate Executive", "Freelancer / Creative", "Academic / Researcher", "Non-profit Leader", "Investor / Wealth", "Artist / Writer"];
const LIFESTYLES = ["Work Hard, Earn More", "Work-Life Balance", "Maximize Freedom", "Build Meaningful Impact", "Travel & Explore"];

function AnimatedNumber({ target, duration = 1500, prefix = "", suffix = "" }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCurrent(target); clearInterval(timer); }
      else setCurrent(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{prefix}{current.toLocaleString()}{suffix}</span>;
}

function SalaryBar({ value, max, color }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { setTimeout(() => setWidth((value / max) * 100), 100); }, [value, max]);
  return (
    <div style={{ background: "#ffffff12", borderRadius: 4, height: 8, overflow: "hidden", marginTop: 6 }}>
      <div style={{ height: "100%", width: `${width}%`, background: color, boxShadow: `0 0 8px ${color}`, transition: "width 1.2s cubic-bezier(0.23,1,0.32,1)", borderRadius: 4 }} />
    </div>
  );
}

function TimelineCard({ path, color, index, visible }) {
  const [show, setShow] = useState(false);
  useEffect(() => { if (visible) setTimeout(() => setShow(true), index * 200); }, [visible]);

  const maxSalary = 400;

  return (
    <div style={{
      opacity: show ? 1 : 0,
      transform: show ? "translateY(0) scale(1)" : "translateY(40px) scale(0.95)",
      transition: "all 0.6s cubic-bezier(0.23,1,0.32,1)",
      background: "linear-gradient(135deg, #0a0a0f 0%, #12121a 100%)",
      border: `1px solid ${color.bg}44`,
      borderRadius: 16,
      padding: 28,
      position: "relative",
      overflow: "hidden",
      flex: "1 1 280px",
      minWidth: 260,
    }}>
      {/* Glow corner */}
      <div style={{ position: "absolute", top: -40, right: -40, width: 120, height: 120, borderRadius: "50%", background: color.bg, opacity: 0.08, filter: "blur(30px)" }} />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: color.bg, letterSpacing: 3, textTransform: "uppercase" }}>{color.label}</span>
        <span style={{ background: `${color.bg}22`, border: `1px solid ${color.bg}55`, borderRadius: 20, padding: "3px 12px", fontSize: 11, color: color.bg, fontFamily: "'Space Mono', monospace" }}>
          {path.probability}% likely
        </span>
      </div>

      {/* Path name */}
      <div style={{ fontFamily: "'Clash Display', 'Bebas Neue', sans-serif", fontSize: 22, color: "#fff", marginBottom: 6, letterSpacing: 0.5 }}>{path.title}</div>
      <div style={{ color: "#ffffff66", fontSize: 13, marginBottom: 22, fontFamily: "'DM Sans', sans-serif" }}>{path.subtitle}</div>

      {/* Metrics */}
      {path.metrics.map((m, i) => (
        <div key={i} style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "#ffffff55", fontFamily: "'Space Mono', monospace", textTransform: "uppercase", letterSpacing: 1 }}>{m.label}</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#fff", fontFamily: "'Space Mono', monospace" }}>
              {show && m.type === "salary" ? <AnimatedNumber target={m.value} prefix="$" suffix="k" /> : m.display}
            </span>
          </div>
          {m.type === "salary" && <SalaryBar value={m.value} max={maxSalary} color={color.bg} />}
          {m.type === "bar" && <SalaryBar value={m.value} max={10} color={color.accent} />}
        </div>
      ))}

      {/* AI Insight */}
      <div style={{ marginTop: 20, padding: "12px 16px", background: `${color.bg}0d`, borderLeft: `3px solid ${color.bg}`, borderRadius: "0 8px 8px 0" }}>
        <div style={{ fontSize: 11, color: color.bg, fontFamily: "'Space Mono', monospace", letterSpacing: 1, marginBottom: 4 }}>AI INSIGHT</div>
        <div style={{ fontSize: 13, color: "#ffffffaa", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }}>{path.insight}</div>
      </div>
    </div>
  );
}

function SalaryChart({ paths, colors }) {
  const years = [1, 3, 5, 10, 15, 20];
  const maxVal = Math.max(...paths.flatMap(p => p.salaryProgression));
  const W = 100, H = 60;
  const pad = { l: 8, r: 8, t: 8, b: 8 };
  const chartW = W - pad.l - pad.r;
  const chartH = H - pad.t - pad.b;

  const getPoints = (progression) =>
    progression.map((v, i) => {
      const x = pad.l + (i / (progression.length - 1)) * chartW;
      const y = pad.t + (1 - v / maxVal) * chartH;
      return `${x},${y}`;
    }).join(" ");

  return (
    <div style={{ background: "#0a0a0f", border: "1px solid #ffffff15", borderRadius: 16, padding: 24, marginTop: 32 }}>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#ffffff44", letterSpacing: 3, marginBottom: 16, textTransform: "uppercase" }}>Salary Progression (USD thousands)</div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 180 }}>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map(t => (
          <line key={t} x1={pad.l} x2={W - pad.r} y1={pad.t + (1 - t) * chartH} y2={pad.t + (1 - t) * chartH} stroke="#ffffff08" strokeWidth={0.5} />
        ))}
        {paths.map((path, pi) => (
          <g key={pi}>
            <polyline points={getPoints(path.salaryProgression)} fill="none" stroke={colors[pi].bg} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 3px ${colors[pi].bg})` }} />
            {path.salaryProgression.map((v, i) => {
              const x = pad.l + (i / (path.salaryProgression.length - 1)) * chartW;
              const y = pad.t + (1 - v / maxVal) * chartH;
              return <circle key={i} cx={x} cy={y} r={1.2} fill={colors[pi].bg} />;
            })}
          </g>
        ))}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
        {years.map(y => <span key={y} style={{ fontSize: 10, color: "#ffffff33", fontFamily: "'Space Mono', monospace" }}>Yr {y}</span>)}
      </div>
      <div style={{ display: "flex", gap: 20, marginTop: 16 }}>
        {paths.map((p, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 20, height: 2, background: colors[i].bg, boxShadow: `0 0 6px ${colors[i].bg}` }} />
            <span style={{ fontSize: 11, color: "#ffffff66", fontFamily: "'DM Sans', sans-serif" }}>{p.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const generatePrompt = (inputs) => `
You are a life path simulator AI. Given a user's inputs, generate 3 distinct life timelines.
User inputs:
- Major: ${inputs.major}
- City: ${inputs.city}  
- Career Goal: ${inputs.goal}
- Lifestyle: ${inputs.lifestyle}
- Risk Tolerance: ${inputs.risk}/10

Return ONLY a valid JSON object (no markdown, no explanation) with this exact structure:
{
  "paths": [
    {
      "title": "short job title",
      "subtitle": "one-line description of this path",
      "probability": 35,
      "insight": "2-3 sentence AI insight about tradeoffs and outlook for this path",
      "salaryProgression": [45, 70, 100, 160, 200, 230],
      "metrics": [
        {"label": "Salary @ 10yr", "type": "salary", "value": 160, "display": "$160k"},
        {"label": "Work Hours", "type": "bar", "value": 8, "display": "High"},
        {"label": "Job Satisfaction", "type": "bar", "value": 7, "display": "7/10"},
        {"label": "Burnout Risk", "type": "text", "value": 0, "display": "Medium"},
        {"label": "Location", "type": "text", "value": 0, "display": "${inputs.city}"}
      ]
    }
  ]
}
salaryProgression must be 6 numbers (year 1,3,5,10,15,20 in $k). Make 3 genuinely different paths, not just variations. Probabilities should add up to 100.
`;

export default function ParallelYou() {
  const [step, setStep] = useState(0); // 0=landing, 1=form, 2=loading, 3=results
  const [inputs, setInputs] = useState({ major: "", city: "", goal: "", lifestyle: "", risk: 5 });
  const [paths, setPaths] = useState(null);
  const [loadingText, setLoadingText] = useState("Simulating your parallel lives...");
  const [glitch, setGlitch] = useState(false);

  const loadingMessages = [
    "Simulating your parallel lives...",
    "Modeling career trajectories...",
    "Calculating life satisfaction curves...",
    "Consulting the multiverse...",
    "Rendering your alternate selves...",
  ];

  useEffect(() => {
    if (step === 2) {
      let i = 0;
      const t = setInterval(() => { i = (i + 1) % loadingMessages.length; setLoadingText(loadingMessages[i]); }, 900);
      return () => clearInterval(t);
    }
  }, [step]);

  useEffect(() => {
    const t = setInterval(() => { setGlitch(true); setTimeout(() => setGlitch(false), 120); }, 4000);
    return () => clearInterval(t);
  }, []);

  const handleGenerate = async () => {
    setStep(2);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: generatePrompt(inputs) }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setPaths(parsed.paths);
      setStep(3);
    } catch (e) {
      console.error(e);
      setStep(1);
    }
  };

  const isFormValid = inputs.major && inputs.city && inputs.goal && inputs.lifestyle;

  const inputStyle = {
    width: "100%", background: "#0a0a0f", border: "1px solid #ffffff20", borderRadius: 10,
    color: "#fff", padding: "12px 16px", fontSize: 14, fontFamily: "'DM Sans', sans-serif",
    outline: "none", appearance: "none", WebkitAppearance: "none", cursor: "pointer",
    boxSizing: "border-box",
  };

  const selectStyle = { ...inputStyle, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23ffffff44' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" };

  return (
    <div style={{
      minHeight: "100vh", background: "#050508",
      fontFamily: "'DM Sans', sans-serif", color: "#fff",
      position: "relative", overflow: "hidden",
    }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&family=Bebas+Neue&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        select option { background: #0a0a0f; color: #fff; }
        .input-focus:focus { border-color: #0ff8 !important; box-shadow: 0 0 0 2px #0ff2 !important; }
        @keyframes scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
        @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes glitch1 { 0%{clip-path:inset(0 0 95% 0)} 100%{clip-path:inset(0 0 0 0)} }
      `}</style>

      {/* Ambient orbs */}
      <div style={{ position: "fixed", top: "10%", left: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, #0ff2 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "10%", right: "5%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, #f0f2 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, #ff02 0%, transparent 70%)", filter: "blur(40px)", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />

      {/* Scan line */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, #0ff3, transparent)", animation: "scanline 6s linear infinite", pointerEvents: "none", zIndex: 100 }} />

      {/* LANDING */}
      {step === 0 && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#0ff", letterSpacing: 4, marginBottom: 24, opacity: 0.7 }}>MULTIVERSE SIMULATOR v2.0</div>

          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(60px, 12vw, 120px)",
            letterSpacing: 4, margin: 0, lineHeight: 1,
            background: glitch
              ? "linear-gradient(90deg, #f0f, #0ff)"
              : "linear-gradient(135deg, #fff 0%, #ffffff88 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            transition: "all 0.1s",
            filter: glitch ? "blur(1px)" : "none",
          }}>PARALLEL<br />YOU</h1>

          <p style={{ fontSize: "clamp(16px, 3vw, 22px)", color: "#ffffff66", maxWidth: 520, lineHeight: 1.7, margin: "32px auto", fontWeight: 300 }}>
            What would your life look like if you made <em style={{ color: "#0ff", fontStyle: "normal" }}>different choices</em>?
          </p>

          <div style={{ display: "flex", gap: 40, margin: "32px 0", flexWrap: "wrap", justifyContent: "center" }}>
            {[["Timeline A", "#0ff"], ["Timeline B", "#f0f"], ["Timeline C", "#ff0"]].map(([label, c]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, animation: "float 3s ease-in-out infinite", animationDelay: label === "Timeline B" ? "1s" : label === "Timeline C" ? "2s" : "0s" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: c, boxShadow: `0 0 12px ${c}`, animation: "pulse-dot 2s ease-in-out infinite" }} />
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#ffffff66" }}>{label}</span>
              </div>
            ))}
          </div>

          <button onClick={() => setStep(1)} style={{
            marginTop: 16, padding: "18px 52px", background: "transparent",
            border: "1px solid #0ff", borderRadius: 50, color: "#0ff",
            fontSize: 14, fontFamily: "'Space Mono', monospace", letterSpacing: 2,
            cursor: "pointer", textTransform: "uppercase",
            boxShadow: "0 0 20px #0ff4, inset 0 0 20px #0ff1",
            transition: "all 0.3s",
          }}
            onMouseEnter={e => { e.target.style.background = "#0ff1"; e.target.style.boxShadow = "0 0 40px #0ff8, inset 0 0 20px #0ff2"; }}
            onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.boxShadow = "0 0 20px #0ff4, inset 0 0 20px #0ff1"; }}
          >
            Begin Simulation →
          </button>

          <div style={{ position: "absolute", bottom: 30, fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#ffffff22", letterSpacing: 2 }}>POWERED BY AI · ANTHROPIC</div>
        </div>
      )}

      {/* FORM */}
      {step === 1 && (
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "60px 24px" }}>
          <button onClick={() => setStep(0)} style={{ background: "none", border: "none", color: "#ffffff44", cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 2, marginBottom: 40, padding: 0 }}>← BACK</button>

          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#0ff", letterSpacing: 4, marginBottom: 12 }}>CONFIGURE YOUR SIMULATION</div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, margin: "0 0 8px", letterSpacing: 2 }}>Your Inputs</h2>
          <p style={{ color: "#ffffff44", fontSize: 14, marginBottom: 40, lineHeight: 1.6 }}>Tell us about yourself. The AI will generate 3 distinct life trajectories.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[
              { label: "Your Major / Field of Study", key: "major", opts: MAJORS },
              { label: "Target City", key: "city", opts: null, isCity: true },
              { label: "Career Goal", key: "goal", opts: GOALS },
              { label: "Lifestyle Priority", key: "lifestyle", opts: LIFESTYLES },
            ].map(({ label, key, opts, isCity }) => (
              <div key={key}>
                <label style={{ display: "block", fontSize: 11, fontFamily: "'Space Mono', monospace", color: "#ffffff55", letterSpacing: 2, marginBottom: 8, textTransform: "uppercase" }}>{label}</label>
                {isCity ? (
                  <select className="input-focus" style={selectStyle} value={inputs[key]} onChange={e => setInputs(p => ({ ...p, [key]: e.target.value }))}>
                    <option value="">Select city...</option>
                    {CITY_GROUPS.map(g => (
                      <optgroup key={g.region} label={g.region} style={{ background: "#0a0a0f", color: "#ffffff88" }}>
                        {g.cities.map(c => <option key={c} value={c}>{c}</option>)}
                      </optgroup>
                    ))}
                  </select>
                ) : (
                  <select className="input-focus" style={selectStyle} value={inputs[key]} onChange={e => setInputs(p => ({ ...p, [key]: e.target.value }))}>
                    <option value="">Select...</option>
                    {opts.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                )}
              </div>
            ))}

            <div>
              <label style={{ display: "block", fontSize: 11, fontFamily: "'Space Mono', monospace", color: "#ffffff55", letterSpacing: 2, marginBottom: 8, textTransform: "uppercase" }}>
                Risk Tolerance: <span style={{ color: "#0ff" }}>{inputs.risk}/10</span>
              </label>
              <input type="range" min={1} max={10} value={inputs.risk} onChange={e => setInputs(p => ({ ...p, risk: +e.target.value }))}
                style={{ width: "100%", accentColor: "#0ff", cursor: "pointer" }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ fontSize: 10, color: "#ffffff33", fontFamily: "'Space Mono', monospace" }}>Conservative</span>
                <span style={{ fontSize: 10, color: "#ffffff33", fontFamily: "'Space Mono', monospace" }}>High Risk</span>
              </div>
            </div>

            <button onClick={handleGenerate} disabled={!isFormValid} style={{
              marginTop: 12, padding: "18px", background: isFormValid ? "#0ff" : "#ffffff11",
              border: "none", borderRadius: 12, color: isFormValid ? "#050508" : "#ffffff33",
              fontSize: 14, fontFamily: "'Space Mono', monospace", letterSpacing: 2,
              cursor: isFormValid ? "pointer" : "not-allowed", textTransform: "uppercase",
              fontWeight: 700, transition: "all 0.3s",
              boxShadow: isFormValid ? "0 0 30px #0ff6" : "none",
            }}>
              Generate My Timelines →
            </button>
          </div>
        </div>
      )}

      {/* LOADING */}
      {step === 2 && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: 32 }}>
          <div style={{ display: "flex", gap: 12 }}>
            {["A", "B", "C"].map((l, i) => (
              <div key={l} style={{ width: 48, height: 48, border: `2px solid ${TIMELINE_COLORS[i].bg}`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Mono', monospace", color: TIMELINE_COLORS[i].bg, fontSize: 18, fontWeight: 700, animation: `pulse-dot 1.2s ease-in-out ${i * 0.3}s infinite`, boxShadow: TIMELINE_COLORS[i].glow }} >{l}</div>
            ))}
          </div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: "#0ff", letterSpacing: 2, textAlign: "center" }}>{loadingText}</div>
          <div style={{ display: "flex", gap: 6 }}>
            {[0, 1, 2, 3, 4].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#0ff", animation: `pulse-dot 1s ease-in-out ${i * 0.15}s infinite` }} />)}
          </div>
        </div>
      )}

      {/* RESULTS */}
      {step === 3 && paths && (
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px" }}>
          <button onClick={() => setStep(1)} style={{ background: "none", border: "none", color: "#ffffff44", cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 2, marginBottom: 40, padding: 0 }}>← RECONFIGURE</button>

          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#0ff", letterSpacing: 4, marginBottom: 12 }}>SIMULATION COMPLETE</div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(40px, 7vw, 72px)", margin: "0 0 8px", letterSpacing: 2, lineHeight: 1 }}>Your Parallel Lives</h2>
          <p style={{ color: "#ffffff44", fontSize: 14, marginBottom: 40, lineHeight: 1.6 }}>
            Based on: <span style={{ color: "#ffffff88" }}>{inputs.major} · {inputs.city} · {inputs.goal} · {inputs.lifestyle}</span>
          </p>

          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {paths.map((path, i) => (
              <TimelineCard key={i} path={path} color={TIMELINE_COLORS[i]} index={i} visible={true} />
            ))}
          </div>

          <SalaryChart paths={paths} colors={TIMELINE_COLORS} />

          <div style={{ marginTop: 40, textAlign: "center" }}>
            <button onClick={() => { setStep(1); setPaths(null); }} style={{
              padding: "14px 40px", background: "transparent", border: "1px solid #ffffff33", borderRadius: 50,
              color: "#ffffff66", fontSize: 13, fontFamily: "'Space Mono', monospace", letterSpacing: 2, cursor: "pointer",
              transition: "all 0.3s", textTransform: "uppercase",
            }}
              onMouseEnter={e => { e.target.style.borderColor = "#0ff"; e.target.style.color = "#0ff"; }}
              onMouseLeave={e => { e.target.style.borderColor = "#ffffff33"; e.target.style.color = "#ffffff66"; }}
            >↺ Run New Simulation</button>
          </div>
        </div>
      )}
    </div>
  );
}
