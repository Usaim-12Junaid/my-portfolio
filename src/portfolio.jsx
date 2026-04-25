import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────
// GLOBAL STYLES
// ─────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@300;400;500;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#080c18;--surface:#0d1425;--border:#1a2540;
  --cyan:#00d4ff;--violet:#7c3aed;--green:#00ff9f;--red:#ff4757;
  --text:#e2e8f0;--muted:#475569;
  --mono:'JetBrains Mono',monospace;--display:'Syne',sans-serif;
}
.lm{--bg:#f1f5f9;--surface:#ffffff;--border:#e2e8f0;--text:#0f172a;--muted:#64748b;}
html{scroll-behavior:smooth;}
::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-track{background:var(--bg);}
::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px;}

@keyframes fadeUp{from{opacity:0;transform:translateY(36px);}to{opacity:1;transform:translateY(0);}}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
@keyframes blink{0%,49%{opacity:1;}50%,100%{opacity:0;}}
@keyframes ping{0%{transform:scale(1);opacity:0.8;}100%{transform:scale(2.6);opacity:0;}}
@keyframes slideRight{from{opacity:0;transform:translateX(10px);}to{opacity:1;transform:translateX(0);}}

.project-card{transition:transform .3s ease,border-color .3s ease,box-shadow .3s ease;cursor:default;}
.project-card:hover{
  transform:translateY(-6px);
  border-color:rgba(0,212,255,.45)!important;
  box-shadow:0 0 40px rgba(0,212,255,.12),0 24px 48px rgba(0,0,0,.3);
}
.exp-card{transition:transform .3s ease,box-shadow .3s ease;}
.exp-card:hover{transform:translateY(-3px);box-shadow:0 16px 48px rgba(0,0,0,.2);}

.cert-card{transition:transform .3s ease,border-color .3s ease,box-shadow .3s ease;cursor:default;}
.cert-card:hover{
  transform:translateY(-5px);
  box-shadow:0 0 32px rgba(0,212,255,.1),0 20px 40px rgba(0,0,0,.25);
}

.nav-link{position:relative;transition:color .2s;}
.nav-link::after{content:'';position:absolute;bottom:-3px;left:0;width:0;height:1px;background:var(--cyan);transition:width .25s ease;}
.nav-link:hover{color:var(--cyan)!important;}
.nav-link:hover::after{width:100%;}

.btn-scan{position:relative;overflow:hidden;transition:box-shadow .3s ease,background .3s ease;}
.btn-scan::before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(0,212,255,.12),transparent);transform:translateX(-100%);transition:transform .4s ease;}
.btn-scan:hover::before{transform:translateX(100%);}
.btn-scan:hover{background:rgba(0,212,255,.12)!important;box-shadow:0 0 28px rgba(0,212,255,.35);}
.btn-proj:hover{background:rgba(124,58,237,.14)!important;box-shadow:0 0 24px rgba(124,58,237,.3);}

.skill-fill{height:100%;background:linear-gradient(90deg,var(--cyan),var(--violet));border-radius:2px;width:0;transition:width 1.5s cubic-bezier(.4,0,.2,1);}

.contact-link{text-decoration:none;transition:transform .3s ease,border-color .3s ease,box-shadow .3s ease;}
.contact-link:hover{transform:translateY(-3px);}

.gradient-text{background:linear-gradient(135deg,var(--cyan),var(--violet));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}

.term-scroll::-webkit-scrollbar{width:3px;}
.term-scroll::-webkit-scrollbar-thumb{background:#1e3a5f;}

@media(max-width:800px){
  .about-grid{grid-template-columns:1fr!important;}
  .skills-grid{grid-template-columns:1fr!important;}
  .projects-grid{grid-template-columns:1fr!important;}
  .desktop-nav{display:none!important;}
  .hero-h1{font-size:48px!important;}
  .stats-row{grid-template-columns:1fr!important;}
  .hero-btns{flex-direction:column!important;align-items:flex-start!important;}
}
@media(max-width:500px){
  .certs-grid{grid-template-columns:1fr!important;}
}
`;

// ─────────────────────────────────────────────────────────────
// MATRIX RAIN
// ─────────────────────────────────────────────────────────────
function MatrixRain({ lm }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let raf, last = 0;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const chars = '01アイウエオカキクケコ10101サシスセソタチ';
    const fs = 12;
    let drops = Array(Math.ceil(window.innerWidth / fs)).fill(1);
    const draw = t => {
      if (t - last < 55) { raf = requestAnimationFrame(draw); return; }
      last = t;
      ctx.fillStyle = lm ? 'rgba(241,245,249,.07)' : 'rgba(8,12,24,.07)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = lm ? 'rgba(0,180,255,.04)' : 'rgba(0,212,255,.045)';
      ctx.font = `${fs}px "JetBrains Mono",monospace`;
      const cols = Math.ceil(canvas.width / fs);
      while (drops.length < cols) drops.push(1);
      drops.forEach((y, i) => {
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * fs, y * fs);
        if (y * fs > canvas.height && Math.random() > .977) drops[i] = 0;
        drops[i]++;
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [lm]);
  return <canvas ref={ref} style={{ position:'fixed',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:0,opacity:.5 }} />;
}

// ─────────────────────────────────────────────────────────────
// TYPING ANIMATION
// ─────────────────────────────────────────────────────────────
function TypingHero() {
  const LINES = [
    { t:'Initializing system...', c:'#475569' },
    { t:'Loading profile: Syed Usaiym Junaid', c:'#475569' },
    { t:'Role: Cybersecurity Enthusiast', c:'#475569' },
    { t:'Status: Access Granted ✓', c:'#00ff9f' },
  ];
  const [done, setDone] = useState([]);
  const [cur, setCur] = useState('');
  const [li, setLi] = useState(0);
  const [ci, setCi] = useState(0);
  useEffect(() => {
    if (li >= LINES.length) return;
    const line = LINES[li];
    if (ci < line.t.length) {
      const tid = setTimeout(() => { setCur(p => p + line.t[ci]); setCi(c => c + 1); }, 36);
      return () => clearTimeout(tid);
    } else {
      const tid = setTimeout(() => {
        setDone(p => [...p, { text: cur, clr: line.c }]);
        setCur(''); setCi(0); setLi(l => l + 1);
      }, 240);
      return () => clearTimeout(tid);
    }
  }, [li, ci, cur]);
  return (
    <div style={{ fontFamily:'var(--mono)',fontSize:'12px',marginBottom:'24px',lineHeight:'2' }}>
      {done.map((l, i) => (
        <div key={i} style={{ color:l.clr,animation:'fadeIn .3s ease' }}>
          <span style={{ color:'var(--cyan)',marginRight:'8px' }}>❯</span>{l.text}
        </div>
      ))}
      {li < LINES.length && (
        <div style={{ color:'#475569' }}>
          <span style={{ color:'var(--cyan)',marginRight:'8px' }}>❯</span>
          {cur}<span style={{ animation:'blink 1s step-end infinite',color:'var(--cyan)' }}>█</span>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DASHBOARD WIDGETS
// ─────────────────────────────────────────────────────────────
function Widgets({ lm }) {
  const items = [
    { k:'THREAT LEVEL', v:'LOW', c:'#00ff9f', pulse:true },
    { k:'SYSTEM', v:'SECURE', c:'#00d4ff' },
    { k:'LAST SCAN', v:'Just now', c:'#a78bfa' },
    { k:'MODE', v:'ANALYST', c:'#fbbf24' },
  ];
  return (
    <div style={{ display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'28px' }}>
      {items.map((w, i) => (
        <div key={i} style={{
          background: lm ? 'rgba(0,0,0,.05)' : 'rgba(13,20,37,.55)',
          border:`1px solid ${w.c}25`, borderRadius:'4px',
          padding:'7px 14px', display:'flex', alignItems:'center', gap:'7px',
          fontFamily:'var(--mono)', fontSize:'11px',
        }}>
          <span style={{ color:'var(--muted)' }}>{w.k}:</span>
          <span style={{ color:w.c,fontWeight:700,display:'flex',alignItems:'center',gap:'5px' }}>
            {w.pulse && (
              <span style={{ position:'relative',display:'inline-flex',alignItems:'center',justifyContent:'center',width:'8px',height:'8px' }}>
                <span style={{ position:'absolute',inset:0,borderRadius:'50%',background:w.c }} />
                <span style={{ position:'absolute',inset:0,borderRadius:'50%',background:w.c,animation:'ping 1.8s ease-out infinite' }} />
              </span>
            )}
            {w.v}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCAN SIMULATION MODAL
// ─────────────────────────────────────────────────────────────
function ScanModal({ onClose, lm }) {
  const [logs, setLogs] = useState([]);
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  const logRef = useRef(null);
  const LOGS = [
    { t:'[INFO]  Initializing scan engine v2.4.1...', c:'var(--muted)', d:180 },
    { t:'[INFO]  Resolving target scope...', c:'var(--muted)', d:650 },
    { t:'[SCAN]  Enumerating HTTP/HTTPS endpoints...', c:'var(--cyan)', d:1200 },
    { t:'[SCAN]  Probing TLS/SSL configuration...', c:'var(--cyan)', d:1850 },
    { t:'[SCAN]  Running subdomain enumeration...', c:'var(--cyan)', d:2450 },
    { t:'[CHECK] Analyzing HTTP response headers...', c:'#fbbf24', d:3050 },
    { t:'[CHECK] Testing for common misconfigurations...', c:'#fbbf24', d:3650 },
    { t:'[CHECK] Evaluating CSP & CORS policies...', c:'#fbbf24', d:4200 },
    { t:'[INFO]  Cross-referencing CVE database...', c:'var(--muted)', d:4750 },
    { t:'[DONE]  Scan complete. Generating report...', c:'var(--green)', d:5350 },
  ];
  useEffect(() => {
    LOGS.forEach((log, i) => {
      setTimeout(() => {
        setLogs(p => [...p, log]);
        setPct(Math.round(((i + 1) / LOGS.length) * 100));
        if (i === LOGS.length - 1) setTimeout(() => setDone(true), 500);
        setTimeout(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, 30);
      }, log.d);
    });
  }, []);
  const ts = new Date().toISOString().slice(0,16).replace('T','_').replace(':','-');
  return (
    <div style={{
      position:'fixed',inset:0,zIndex:1000,background:'rgba(0,0,0,.78)',
      backdropFilter:'blur(6px)',display:'flex',alignItems:'center',
      justifyContent:'center',padding:'20px',animation:'fadeIn .2s ease'
    }}>
      <div style={{
        background: lm ? '#fff' : '#080c18',
        border:'1px solid var(--border)',borderRadius:'10px',
        width:'100%',maxWidth:'580px',overflow:'hidden',
        boxShadow:'0 0 60px rgba(0,212,255,.08),0 30px 80px rgba(0,0,0,.5)'
      }}>
        <div style={{
          background: lm ? '#f8fafc' : '#0d1425',
          borderBottom:'1px solid var(--border)',padding:'12px 20px',
          display:'flex',alignItems:'center',justifyContent:'space-between'
        }}>
          <div style={{ display:'flex',alignItems:'center',gap:'10px' }}>
            <span style={{
              background:'rgba(251,191,36,.1)',border:'1px solid rgba(251,191,36,.35)',
              borderRadius:'4px',padding:'2px 8px',fontSize:'10px',
              fontFamily:'var(--mono)',color:'#fbbf24'
            }}>⚠ SIMULATION MODE</span>
            <span style={{ fontFamily:'var(--mono)',fontSize:'11px',color:'var(--muted)' }}>Educational demo only</span>
          </div>
          <button onClick={onClose} style={{
            background:'none',border:'none',cursor:'pointer',
            color:'var(--muted)',fontSize:'22px',lineHeight:1,padding:'2px'
          }}>×</button>
        </div>
        <div style={{ padding:'16px 20px',borderBottom:'1px solid var(--border)' }}>
          <div style={{ fontFamily:'var(--mono)',color:'var(--cyan)',fontSize:'13px',marginBottom:'12px' }}>
            $ webscan --target demo.local --mode full
          </div>
          <div style={{
            background: lm ? '#e2e8f0' : '#1a2540',
            borderRadius:'2px',height:'4px',overflow:'hidden',marginBottom:'6px'
          }}>
            <div style={{
              height:'100%',width:`${pct}%`,
              background:'linear-gradient(90deg,var(--cyan),var(--violet))',
              transition:'width .3s ease',boxShadow:'0 0 8px rgba(0,212,255,.5)'
            }} />
          </div>
          <span style={{ fontFamily:'var(--mono)',fontSize:'11px',color:'var(--muted)' }}>{pct}% complete</span>
        </div>
        <div ref={logRef} className="term-scroll" style={{
          height:'185px',overflowY:'auto',padding:'14px 20px',
          fontFamily:'var(--mono)',fontSize:'12px',lineHeight:'1.85'
        }}>
          {logs.map((l, i) => (
            <div key={i} style={{ color:l.c,animation:'slideRight .25s ease' }}>{l.t}</div>
          ))}
        </div>
        {done && (
          <div style={{
            padding:'20px',borderTop:'1px solid var(--border)',
            background: lm ? '#f8fafc' : 'rgba(13,20,37,.4)',
            animation:'fadeUp .4s ease'
          }}>
            <div style={{ fontFamily:'var(--mono)',fontSize:'10px',color:'var(--muted)',letterSpacing:'2.5px',marginBottom:'12px' }}>SCAN RESULTS</div>
            <div style={{ display:'flex',flexDirection:'column',gap:'8px',marginBottom:'16px' }}>
              <div style={{ color:'var(--green)',fontSize:'13px' }}>✓  No critical vulnerabilities detected</div>
              <div style={{ color:'#fbbf24',fontSize:'13px' }}>⚠  2 informational findings (missing security headers)</div>
              <div style={{ color:'var(--muted)',fontFamily:'var(--mono)',fontSize:'11px' }}>📋 scan_demo_{ts}.txt</div>
            </div>
            <button onClick={onClose} style={{
              background:'rgba(0,212,255,.08)',border:'1px solid rgba(0,212,255,.35)',
              color:'var(--cyan)',padding:'8px 20px',borderRadius:'4px',
              fontFamily:'var(--mono)',fontSize:'12px',cursor:'pointer',
              transition:'background .2s ease'
            }}>Close Report</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// FLOATING TERMINAL
// ─────────────────────────────────────────────────────────────
function FloatTerminal({ lm, onScan }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [hist, setHist] = useState([]);
  const [cmdHist, setCmdHist] = useState([]);
  const [hi, setHi] = useState(-1);
  const outRef = useRef(null);
  const inRef = useRef(null);

  const CMDS = {
    help: () => [
      { t:'Available commands:', c:'var(--cyan)' },
      { t:'  help           → This menu', c:'var(--muted)' },
      { t:'  whoami         → Identity', c:'var(--muted)' },
      { t:'  about          → Bio & background', c:'var(--muted)' },
      { t:'  projects       → Security tools built', c:'var(--muted)' },
      { t:'  skills         → Skill set', c:'var(--muted)' },
      { t:'  certifications → Earned credentials', c:'var(--muted)' },
      { t:'  experience     → Leadership & community', c:'var(--muted)' },
      { t:'  contact        → Reach out', c:'var(--muted)' },
      { t:'  scan           → Launch scan simulation', c:'var(--muted)' },
      { t:'  clear          → Clear terminal', c:'var(--muted)' },
    ],
    whoami: () => [
      { t:'Syed Usaiym Junaid', c:'var(--cyan)' },
      { t:'BSCY | Cybersecurity Enthusiast | Security Tool Developer', c:'var(--muted)' },
      { t:'Community Manager — WLWJ (2024-2025)', c:'#00d4ff' },
      { t:'General Secretary — ACM SIGSAC DUET', c:'#a78bfa' },
    ],
    about: () => [
      { t:'BSCY student passionate about offensive security and automation.', c:'var(--text)' },
      { t:'I build tools that simulate attacks, automate recon workflows,', c:'var(--text)' },
      { t:'and surface real vulnerabilities in web applications.', c:'var(--text)' },
      { t:'' },
      { t:'Focus: Pentesting · OSINT · Security Automation', c:'var(--cyan)' },
    ],
    projects: () => [
      { t:'01. Sentinel OSINT Tool', c:'var(--cyan)' },
      { t:'    Passive recon: WHOIS, DNS, subdomains, Shodan, geoIP', c:'var(--muted)' },
      { t:'    Stack: Python · Requests · Shodan API · Rich', c:'var(--muted)' },
      { t:'' },
      { t:'02. WebHound Vulnerability Scanner', c:'var(--cyan)' },
      { t:'    Crawls apps, tests SQLi + XSS via payload injection', c:'var(--muted)' },
      { t:'    Stack: Python · Requests · BeautifulSoup4 · termcolor', c:'var(--muted)' },
    ],
    skills: () => [
      { t:'OFFENSIVE', c:'var(--cyan)' }, { t:'  Web Pentesting, OSINT, Recon, Vuln Assessment', c:'var(--muted)' },
      { t:'CODE', c:'var(--cyan)' }, { t:'  Python, Bash scripting', c:'var(--muted)' },
      { t:'TOOLS', c:'var(--cyan)' }, { t:'  Kali Linux, Burp Suite, Nmap, Shodan, GitHub', c:'var(--muted)' },
    ],
    certifications: () => [
      { t:'EARNED CREDENTIALS', c:'var(--cyan)' },
      { t:'  ◈ Cisco — Networking Basics (Verified)', c:'#00d4ff' },
      { t:'  ◈ Cisco — Introduction to Cybersecurity (Verified)', c:'#00d4ff' },
      { t:'  ◈ Google/Coursera — Bits and Bytes of Computer Networking', c:'#4ade80' },
      { t:'  ◈ IBM/Coursera — Databases and SQL for Data Science with Python', c:'#a78bfa' },
    ],
    experience: () => [
      { t:'WLWJ — Community Manager (2024-2025)', c:'#00d4ff' },
      { t:'  3 national-scale CTFs organized across Pakistan', c:'var(--muted)' },
      { t:'  Tech Tayari initiative     → 1,500+ participants', c:'var(--green)' },
      { t:'  NetAcad Cyber Cup          → 2,300+ participants', c:'var(--green)' },
      { t:'' },
      { t:'ACM SIGSAC DUET — General Secretary (2024)', c:'#a78bfa' },
      { t:'  Directed Cyber Week (CTFs, workshops, seminars)', c:'var(--muted)' },
    ],
    contact: () => [
      { t:'Email:    usaiymjunaid6677@gmail.com', c:'var(--text)' },
      { t:'GitHub:   github.com/Usaim-12Junaid', c:'var(--cyan)' },
      { t:'LinkedIn: linkedin.com/in/syed-usaiym-junaid-062a0129a', c:'var(--cyan)' },
    ],
    scan: () => { setTimeout(() => onScan(), 80); return [{ t:'Launching scan simulation...', c:'var(--green)' }]; },
    clear: () => 'CLEAR',
  };

  const run = cmd => {
    const c = cmd.trim().toLowerCase();
    const entry = { type:'in', text:cmd };
    if (!c) { setHist(h => [...h, entry]); setInput(''); return; }
    const result = CMDS[c] ? CMDS[c]() : [{ t:`Command not found: '${c}'. Try 'help'.`, c:'var(--red)' }];
    if (result === 'CLEAR') { setHist([]); }
    else { setHist(h => [...h, entry, { type:'out', lines:result }]); }
    if (c) setCmdHist(h => [c, ...h]);
    setInput(''); setHi(-1);
    setTimeout(() => { if (outRef.current) outRef.current.scrollTop = outRef.current.scrollHeight; }, 50);
  };

  const onKey = e => {
    if (e.key === 'Enter') { run(input); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); const n = Math.min(hi+1, cmdHist.length-1); setHi(n); setInput(cmdHist[n]||''); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); const n = Math.max(hi-1,-1); setHi(n); setInput(n===-1?'':cmdHist[n]); }
  };

  useEffect(() => {
    if (open && hist.length === 0) {
      setHist([{ type:'out', lines:[
        { t:'╔══════════════════════════════════════╗', c:'var(--cyan)' },
        { t:'║    USAIYM SECURITY TERMINAL  v1.0    ║', c:'var(--cyan)' },
        { t:'╚══════════════════════════════════════╝', c:'var(--cyan)' },
        { t:"Type 'help' to see all commands.", c:'var(--muted)' },
      ]}]);
    }
    if (open) setTimeout(() => inRef.current?.focus(), 80);
  }, [open]);

  return (
    <>
      <button onClick={() => setOpen(o => !o)} title="Open Terminal" style={{
        position:'fixed',bottom:'24px',right:'24px',zIndex:900,
        width:'48px',height:'48px',borderRadius:'50%',
        background: open ? 'rgba(0,212,255,.14)' : 'rgba(6,10,20,.92)',
        border:'1px solid var(--cyan)',color:'var(--cyan)',
        fontFamily:'var(--mono)',fontSize:'13px',cursor:'pointer',
        display:'flex',alignItems:'center',justifyContent:'center',
        boxShadow:'0 0 22px rgba(0,212,255,.25)',transition:'all .3s ease'
      }}>{open ? '✕' : '>_'}</button>

      {open && (
        <div style={{
          position:'fixed',bottom:'84px',right:'24px',zIndex:899,
          width:'500px',maxWidth:'calc(100vw - 48px)',
          background:'#050810',border:'1px solid var(--cyan)',
          borderRadius:'8px',overflow:'hidden',
          boxShadow:'0 0 40px rgba(0,212,255,.1),0 20px 60px rgba(0,0,0,.5)',
          animation:'fadeUp .25s ease'
        }}>
          <div style={{
            background:'#080c18',borderBottom:'1px solid var(--border)',
            padding:'9px 16px',display:'flex',alignItems:'center',gap:'8px',
            fontFamily:'var(--mono)',fontSize:'12px',color:'var(--muted)'
          }}>
            {['#ff5f56','#ffbd2e','#27c93f'].map((c,i) => (
              <span key={i} style={{ width:'10px',height:'10px',borderRadius:'50%',background:c,display:'inline-block' }} />
            ))}
            <span style={{ marginLeft:'8px' }}>usaiym@security:~</span>
          </div>
          <div ref={outRef} className="term-scroll" style={{
            height:'268px',overflowY:'auto',padding:'12px 16px',
            fontFamily:'var(--mono)',fontSize:'12px',lineHeight:'1.8'
          }}>
            {hist.map((item, i) => (
              <div key={i}>
                {item.type === 'in' ? (
                  <div style={{ color:'var(--green)' }}>
                    <span style={{ color:'var(--cyan)' }}>❯ </span>{item.text}
                  </div>
                ) : item.lines.map((l, j) => (
                  <div key={j} style={{ color:l.c||'var(--text)' }}>{l.t}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={{
            borderTop:'1px solid var(--border)',padding:'9px 16px',
            display:'flex',gap:'8px',background:'#050810'
          }}>
            <span style={{ color:'var(--cyan)',fontFamily:'var(--mono)',fontSize:'12px' }}>❯</span>
            <input ref={inRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKey}
              placeholder="type a command..." style={{
                flex:1,background:'none',border:'none',outline:'none',
                color:'var(--green)',fontFamily:'var(--mono)',fontSize:'12px',
                caretColor:'var(--cyan)'
              }} />
          </div>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// SCROLL REVEAL HOOK
// ─────────────────────────────────────────────────────────────
function useReveal(threshold = 0.08) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.unobserve(el); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

// ─────────────────────────────────────────────────────────────
// PROJECT CARD
// ─────────────────────────────────────────────────────────────
function ProjectCard({ p, lm }) {
  return (
    <div className="project-card" style={{
      background: lm ? 'rgba(255,255,255,.92)' : 'rgba(13,20,37,.65)',
      border:`1px solid ${lm ? '#e2e8f0' : 'var(--border)'}`,
      borderRadius:'8px',padding:'28px',
      backdropFilter:'blur(14px)',position:'relative',overflow:'hidden'
    }}>
      <div style={{
        display:'inline-flex',alignItems:'center',gap:'5px',
        background:'rgba(0,212,255,.07)',border:'1px solid rgba(0,212,255,.2)',
        borderRadius:'4px',padding:'2px 10px',marginBottom:'14px',
        fontFamily:'var(--mono)',fontSize:'10px',color:'var(--cyan)'
      }}>◈ {p.cat}</div>
      <h3 style={{ fontSize:'17px',fontWeight:700,marginBottom:'10px',color: lm ? '#0f172a' : 'var(--text)' }}>{p.name}</h3>
      <p style={{ fontSize:'13px',lineHeight:'1.8',color:'var(--muted)',marginBottom:'18px' }}>{p.desc}</p>
      <div style={{ display:'flex',flexWrap:'wrap',gap:'5px',marginBottom:'22px' }}>
        {p.tech.map((t, i) => (
          <span key={i} style={{
            background: lm ? '#f1f5f9' : 'rgba(124,58,237,.08)',
            border:`1px solid ${lm ? '#e2e8f0' : 'rgba(124,58,237,.25)'}`,
            borderRadius:'3px',padding:'2px 8px',
            fontFamily:'var(--mono)',fontSize:'10px',
            color: lm ? '#7c3aed' : '#a78bfa'
          }}>{t}</span>
        ))}
      </div>
      <div style={{ display:'flex',gap:'8px' }}>
        <a href={p.gh} target="_blank" rel="noreferrer"
          onMouseEnter={e => e.currentTarget.style.background='rgba(0,212,255,.15)'}
          onMouseLeave={e => e.currentTarget.style.background='rgba(0,212,255,.07)'}
          style={{
            flex:1,textAlign:'center',
            background:'rgba(0,212,255,.07)',border:'1px solid rgba(0,212,255,.25)',
            borderRadius:'4px',padding:'8px',fontFamily:'var(--mono)',fontSize:'11px',
            color:'var(--cyan)',textDecoration:'none',
            display:'flex',alignItems:'center',justifyContent:'center',gap:'5px',
            transition:'background .2s ease'
          }}>⬡ GitHub</a>
        <span style={{
          flex:1,textAlign:'center',
          background: lm ? 'rgba(0,0,0,.04)' : 'rgba(100,116,139,.06)',
          border:'1px solid rgba(100,116,139,.18)',
          borderRadius:'4px',padding:'8px',fontFamily:'var(--mono)',fontSize:'11px',
          color:'var(--muted)',display:'flex',alignItems:'center',justifyContent:'center'
        }}>◎ CLI Tool</span>
      </div>
      <div style={{
        position:'absolute',top:0,right:0,width:'64px',height:'64px',
        background:'linear-gradient(225deg,rgba(0,212,255,.07) 0%,transparent 70%)',
        borderRadius:'0 8px 0 0'
      }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CERTIFICATION CARD
// ─────────────────────────────────────────────────────────────
function CertCard({ cert, lm }) {
  const accentMap = {
    cisco:  { color:'#00d4ff', bg:'rgba(0,212,255,.07)', border:'rgba(0,212,255,.25)', icon:'🛡️' },
    google: { color:'#4ade80', bg:'rgba(74,222,128,.07)', border:'rgba(74,222,128,.25)', icon:'🌐' },
    ibm:    { color:'#a78bfa', bg:'rgba(167,139,250,.07)', border:'rgba(167,139,250,.25)', icon:'🗄️' },
  };
  const a = accentMap[cert.brand] || accentMap.cisco;

  return (
    <div className="cert-card" style={{
      background: lm ? 'rgba(255,255,255,.92)' : 'rgba(13,20,37,.65)',
      border:`1px solid ${lm ? '#e2e8f0' : 'var(--border)'}`,
      borderRadius:'8px',padding:'22px',
      backdropFilter:'blur(14px)',position:'relative',overflow:'hidden',
      display:'flex',flexDirection:'column',gap:'12px',
    }}>
      {/* Top accent line */}
      <div style={{ position:'absolute',top:0,left:0,right:0,height:'2px',background:`linear-gradient(90deg,${a.color},transparent)` }} />

      {/* Issuer badge + verified */}
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'6px' }}>
        <div style={{
          display:'inline-flex',alignItems:'center',gap:'6px',
          background:a.bg,border:`1px solid ${a.border}`,
          borderRadius:'4px',padding:'3px 10px',
          fontFamily:'var(--mono)',fontSize:'10px',color:a.color,fontWeight:600,
          letterSpacing:'1px'
        }}>
          {a.icon} {cert.issuer}
        </div>
        {cert.verified && (
          <span style={{
            fontFamily:'var(--mono)',fontSize:'9px',color:'#00ff9f',
            background:'rgba(0,255,159,.08)',border:'1px solid rgba(0,255,159,.25)',
            borderRadius:'3px',padding:'2px 7px',letterSpacing:'1px'
          }}>✓ VERIFIED</span>
        )}
      </div>

      {/* Title */}
      <div>
        <div style={{
          fontSize:'14px',fontWeight:700,lineHeight:1.35,
          color: lm ? '#0f172a' : 'var(--text)',marginBottom:'4px'
        }}>{cert.title}</div>
        <div style={{ fontFamily:'var(--mono)',fontSize:'10px',color:'var(--muted)' }}>{cert.platform}</div>
      </div>

      {/* Date & category */}
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'6px',marginTop:'auto' }}>
        <span style={{ fontFamily:'var(--mono)',fontSize:'10px',color:'var(--muted)' }}>{cert.date}</span>
        <span style={{
          background: lm ? '#f1f5f9' : 'rgba(255,255,255,.04)',
          border:`1px solid ${lm ? '#e2e8f0' : 'rgba(255,255,255,.08)'}`,
          borderRadius:'3px',padding:'2px 8px',
          fontFamily:'var(--mono)',fontSize:'10px',color:'var(--muted)'
        }}>{cert.category}</span>
      </div>

      {/* Verify link */}
      {cert.verifyUrl && (
        <a href={cert.verifyUrl} target="_blank" rel="noreferrer"
          onMouseEnter={e => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.color = a.color; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(100,116,139,.2)'; e.currentTarget.style.color = 'var(--muted)'; }}
          style={{
            display:'flex',alignItems:'center',justifyContent:'center',gap:'5px',
            background:'transparent',border:'1px solid rgba(100,116,139,.2)',
            borderRadius:'4px',padding:'7px',
            fontFamily:'var(--mono)',fontSize:'10px',color:'var(--muted)',
            textDecoration:'none',transition:'border-color .2s ease,color .2s ease'
          }}>
          ↗ Verify Certificate
        </a>
      )}

      {/* Corner glow */}
      <div style={{
        position:'absolute',top:0,right:0,width:'56px',height:'56px',
        background:`linear-gradient(225deg,${a.color}12 0%,transparent 70%)`,
        borderRadius:'0 8px 0 0'
      }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const SLabel = ({ t }) => (
  <div style={{ fontFamily:'var(--mono)',fontSize:'11px',color:'var(--cyan)',letterSpacing:'3px',marginBottom:'8px' }}>{t}</div>
);
const SHead = ({ children, lm }) => (
  <h2 style={{ fontSize:'clamp(22px,4vw,38px)',fontWeight:700,marginBottom:'36px',color: lm ? '#0f172a' : 'var(--text)',lineHeight:1.15 }}>{children}</h2>
);

// ─────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────
 export function Portfolio() {
  const [lm, setLm] = useState(false);
  const [showScan, setShowScan] = useState(false);

  const [heroRef, heroVis] = useReveal();
  const [projRef, projVis] = useReveal();
  const [skillRef, skillVis] = useReveal();
  const [certRef, certVis] = useReveal();
  const [expRef,  expVis]  = useReveal();
  const [conRef,  conVis]  = useReveal();

  const PROJECTS = [
    {
      name:'Sentinel OSINT Tool',
      cat:'Reconnaissance & Intelligence',
      desc:'Automated passive OSINT tool that aggregates intelligence from multiple public data sources. Performs WHOIS lookups, DNS enumeration, subdomain discovery, IP geolocation, and Shodan-based exposed service mapping — structured into clean JSON reports for further analysis.',
      tech:['Python 3','Requests','Shodan API','WHOIS','DNS Resolver','Rich','JSON'],
      gh:'https://github.com/Usaim-12Junaid',
    },
    {
      name:'WebHound Vulnerability Scanner',
      cat:'Web Application Security',
      desc:'Autonomous web vulnerability scanner that crawls target applications, extracts input vectors, and tests for SQL Injection and Reflected XSS via custom payload dictionaries. Mirrors real pentester workflows from form extraction through response analysis.',
      tech:['Python 3','Requests','BeautifulSoup4','Regex','SQLi Payloads','XSS Payloads','termcolor'],
      gh:'https://github.com/Usaim-12Junaid',
    },
  ];

  // All skills in beginner range 45–60%
  const SKILLS = [
    { n:'OSINT & Reconnaissance',       v:58 },
    { n:'Web Penetration Testing',       v:50 },
    { n:'Python & Security Automation',  v:53 },
    { n:'Kali Linux & Tools',            v:55 },
    { n:'Burp Suite',                    v:46 },
    { n:'Network Fundamentals',          v:60 },
  ];

  // Certifications from uploaded images
  const CERTS = [
    {
      brand:'cisco',
      issuer:'CISCO',
      platform:'Cisco Networking Academy',
      title:'Networking Basics',
      category:'Networking',
      date:'2024',
      verified:true,
      verifyUrl:null,
    },
    {
      brand:'cisco',
      issuer:'CISCO',
      platform:'Cisco Networking Academy',
      title:'Introduction to Cybersecurity',
      category:'Cybersecurity',
      date:'2024',
      verified:true,
      verifyUrl:null,
    },
    {
      brand:'google',
      issuer:'GOOGLE',
      platform:'Google via Coursera',
      title:'The Bits and Bytes of Computer Networking',
      category:'Networking',
      date:'Mar 19, 2025',
      verified:true,
      verifyUrl:'https://coursera.org/verify/R0LG7IP0801M',
    },
    {
      brand:'ibm',
      issuer:'IBM',
      platform:'IBM via Coursera',
      title:'Databases and SQL for Data Science with Python',
      category:'Data & SQL',
      date:'Mar 20, 2025',
      verified:true,
      verifyUrl:'https://coursera.org/verify/EC13Q9H5JW0C',
    },
  ];

  const go = id => document.getElementById(id)?.scrollIntoView({ behavior:'smooth' });
  const pad = 'max(24px, calc((100vw - 1100px) / 2))';
  const surf = lm ? 'rgba(255,255,255,.9)' : 'rgba(13,20,37,.6)';
  const bord = lm ? '#e2e8f0' : 'var(--border)';

  return (
    <div style={{ minHeight:'100vh',background:'var(--bg)',fontFamily:'Syne,sans-serif' }} className={lm ? 'lm' : ''}>
      <style>{CSS}</style>
      <MatrixRain lm={lm} />

      {/* ── NAVBAR ── */}
      <nav style={{
        position:'fixed',top:0,left:0,right:0,zIndex:800,
        background: lm ? 'rgba(241,245,249,.9)' : 'rgba(8,12,24,.9)',
        backdropFilter:'blur(24px)',
        borderBottom:`1px solid ${lm ? 'rgba(226,232,240,.7)' : 'rgba(26,37,64,.7)'}`,
        padding:`0 ${pad}`,
      }}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',height:'62px' }}>
          <div onClick={() => go('hero')} style={{
            fontFamily:'var(--mono)',fontSize:'14px',color:'var(--cyan)',
            cursor:'pointer',display:'flex',alignItems:'center',gap:'9px'
          }}>
            <span style={{
              width:'28px',height:'28px',border:'1px solid var(--cyan)',
              borderRadius:'4px',display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:'11px',fontWeight:700,flexShrink:0
            }}>SJ</span>
            usaiym.sec
          </div>
          <div className="desktop-nav" style={{ display:'flex',alignItems:'center',gap:'20px' }}>
            {['about','projects','skills','certifications','experience','contact'].map(n => (
              <button key={n} onClick={() => go(n)} className="nav-link" style={{
                background:'none',border:'none',cursor:'pointer',
                fontFamily:'var(--mono)',fontSize:'12px',
                color:'var(--muted)',padding:'3px 0',textTransform:'capitalize'
              }}>{n}</button>
            ))}
            <button onClick={() => setLm(l => !l)} style={{
              background: lm ? 'rgba(0,0,0,.06)' : 'rgba(255,255,255,.05)',
              border:`1px solid ${bord}`,borderRadius:'5px',padding:'5px 12px',
              cursor:'pointer',color:'var(--muted)',fontFamily:'var(--mono)',
              fontSize:'11px',transition:'all .2s ease'
            }}>{lm ? '◐ Dark' : '○ Light'}</button>
          </div>
        </div>
      </nav>

      <main style={{ position:'relative',zIndex:1 }}>

        {/* ── HERO ── */}
        <section id="hero" style={{
          minHeight:'100vh',display:'flex',flexDirection:'column',justifyContent:'center',
          padding:`max(120px,14vh) ${pad} 80px`
        }}>
          <div ref={heroRef} style={{
            maxWidth:'800px',
            opacity: heroVis ? 1 : 0,
            transform: heroVis ? 'none' : 'translateY(36px)',
            transition:'all .9s ease'
          }}>
            <TypingHero />
            <h1 className="hero-h1" style={{
              fontSize:'clamp(40px,6.5vw,78px)',fontWeight:800,
              lineHeight:1.02,letterSpacing:'-2.5px',marginBottom:'14px',
              color: lm ? '#0f172a' : 'var(--text)'
            }}>
              Syed Usaiym<br />
              <span className="gradient-text">Junaid</span>
            </h1>
            <p style={{
              fontSize:'13px',color:'var(--muted)',marginBottom:'26px',
              fontFamily:'var(--mono)',lineHeight:1.9
            }}>
              Cybersecurity Enthusiast · Offensive Security Learner<br />
              Security Tool Developer
            </p>
            <Widgets lm={lm} />
            <div className="hero-btns" style={{ display:'flex',gap:'10px',flexWrap:'wrap' }}>
              <button className="btn-scan" onClick={() => setShowScan(true)} style={{
                background:'rgba(0,212,255,.07)',border:'1px solid rgba(0,212,255,.45)',
                color:'var(--cyan)',padding:'11px 26px',borderRadius:'4px',
                fontFamily:'var(--mono)',fontSize:'12px',cursor:'pointer',
              }}>⟩ Run Security Scan</button>
              <button className="btn-proj" onClick={() => go('projects')} style={{
                background:'rgba(124,58,237,.07)',border:'1px solid rgba(124,58,237,.45)',
                color:'#a78bfa',padding:'11px 26px',borderRadius:'4px',
                fontFamily:'var(--mono)',fontSize:'12px',cursor:'pointer',
                transition:'all .3s ease'
              }}>⟩ View Projects</button>
            </div>
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section id="about" style={{ padding:`60px ${pad}` }}>
          <div className="about-grid" style={{
            display:'grid',gridTemplateColumns:'1fr 1fr',gap:'40px',
            background:surf,border:`1px solid ${bord}`,
            borderRadius:'10px',padding:'36px',backdropFilter:'blur(14px)'
          }}>
            <div>
              <SLabel t="// ABOUT" />
              <h2 style={{
                fontSize:'clamp(20px,3vw,30px)',fontWeight:700,lineHeight:1.25,
                marginBottom:'18px',color: lm ? '#0f172a' : 'var(--text)'
              }}>
                Building tools that<br />think like an attacker
              </h2>
              <p style={{ fontSize:'14px',lineHeight:1.9,color:'var(--muted)' }}>
                I'm a BSCY student with a passion for offensive security and automation.
                I build real-world tools that simulate attack scenarios, automate recon
                workflows, and surface vulnerabilities in web applications — bridging the
                gap between theory and practical security engineering.
              </p>
            </div>
            <div style={{ display:'flex',flexDirection:'column',justifyContent:'center' }}>
              {[
                ['Focus','Web Pentesting + OSINT'],
                ['Degree','BSCY — Cybersecurity'],
                ['Location','Pakistan'],
                ['Available','Open to opportunities'],
              ].map(([k, v], i) => (
                <div key={i} style={{
                  display:'flex',gap:'16px',fontFamily:'var(--mono)',fontSize:'12px',
                  padding:'10px 0',
                  borderBottom:`1px solid ${lm ? '#f1f5f9' : 'rgba(26,37,64,.5)'}`,
                }}>
                  <span style={{ color:'var(--muted)',minWidth:'76px' }}>{k}</span>
                  <span style={{ color: lm ? '#0f172a' : 'var(--text)' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROJECTS ── */}
        <section id="projects" style={{ padding:`60px ${pad}` }}>
          <div ref={projRef} style={{
            opacity: projVis ? 1 : 0,transform: projVis ? 'none' : 'translateY(36px)',
            transition:'all .8s ease'
          }}>
            <SLabel t="// PROJECTS" />
            <SHead lm={lm}>Security Tools Built from Scratch</SHead>
            <div className="projects-grid" style={{
              display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(340px, 1fr))',gap:'22px'
            }}>
              {PROJECTS.map((p, i) => <ProjectCard key={i} p={p} lm={lm} />)}
            </div>
          </div>
        </section>

        {/* ── SKILLS ── */}
        <section id="skills" style={{ padding:`60px ${pad}` }}>
          <div ref={skillRef} style={{
            opacity: skillVis ? 1 : 0,transform: skillVis ? 'none' : 'translateY(36px)',
            transition:'all .8s ease'
          }}>
            <SLabel t="// SKILLS" />
            <SHead lm={lm}>Technical Capabilities</SHead>
            <div className="skills-grid" style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'40px' }}>
              <div style={{ display:'flex',flexDirection:'column',gap:'22px' }}>
                {SKILLS.map((s, i) => (
                  <div key={i}>
                    <div style={{ display:'flex',justifyContent:'space-between',marginBottom:'7px' }}>
                      <span style={{ fontFamily:'var(--mono)',fontSize:'12px',color: lm ? '#0f172a' : 'var(--text)' }}>{s.n}</span>
                      <span style={{ fontFamily:'var(--mono)',fontSize:'11px',color:'var(--cyan)' }}>{s.v}%</span>
                    </div>
                    <div style={{
                      height:'3px',borderRadius:'2px',overflow:'hidden',
                      background: lm ? '#e2e8f0' : '#1a2540'
                    }}>
                      <div className="skill-fill" style={{ width: skillVis ? `${s.v}%` : '0%' }} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex',flexDirection:'column',gap:'16px' }}>
                {[
                  {
                    title:'CURRENTLY LEARNING',
                    items:['Advanced Web AppSec','ML in Cybersecurity','GRC & Compliance','Kali Linux Advanced','Security Automation']
                  },
                  {
                    title:'TOOLS & PLATFORMS',
                    tools:['Kali Linux','Burp Suite','Nmap','Shodan','GitHub','Python','Bash','Wireshark']
                  }
                ].map((card, ci) => (
                  <div key={ci} style={{
                    background: lm ? 'rgba(0,0,0,.04)' : 'rgba(13,20,37,.5)',
                    border:`1px solid ${bord}`,borderRadius:'8px',padding:'20px'
                  }}>
                    <div style={{ fontFamily:'var(--mono)',fontSize:'10px',color:'var(--cyan)',letterSpacing:'2px',marginBottom:'12px' }}>
                      {card.title}
                    </div>
                    {card.items && card.items.map((item, ii) => (
                      <div key={ii} style={{
                        fontFamily:'var(--mono)',fontSize:'12px',color:'var(--muted)',
                        padding:'5px 0',
                        borderBottom: ii < card.items.length-1 ? `1px solid ${lm ? '#f8fafc' : 'rgba(26,37,64,.4)'}` : 'none',
                        display:'flex',alignItems:'center',gap:'8px'
                      }}>
                        <span style={{ color:'var(--violet)',fontSize:'10px' }}>→</span>{item}
                      </div>
                    ))}
                    {card.tools && (
                      <div style={{ display:'flex',flexWrap:'wrap',gap:'6px' }}>
                        {card.tools.map((t, ti) => (
                          <span key={ti} style={{
                            background:'rgba(0,212,255,.06)',border:'1px solid rgba(0,212,255,.18)',
                            borderRadius:'3px',padding:'3px 9px',
                            fontFamily:'var(--mono)',fontSize:'10px',color:'var(--cyan)'
                          }}>{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CERTIFICATIONS ── */}
        <section id="certifications" style={{ padding:`60px ${pad}` }}>
          <div ref={certRef} style={{
            opacity: certVis ? 1 : 0,transform: certVis ? 'none' : 'translateY(36px)',
            transition:'all .8s ease'
          }}>
            <SLabel t="// CERTIFICATIONS" />
            <SHead lm={lm}>Earned Credentials</SHead>

            {/* Quick stats */}
            <div style={{ display:'flex',gap:'12px',flexWrap:'wrap',marginBottom:'32px' }}>
              {[
                { v:'4', l:'Total Certificates', c:'var(--cyan)' },
                { v:'2', l:'Cisco Verified Badges', c:'#00d4ff' },
                { v:'2', l:'Coursera Completions', c:'#fbbf24' },
              ].map((s, i) => (
                <div key={i} style={{
                  background: lm ? 'rgba(0,0,0,.04)' : 'rgba(13,20,37,.5)',
                  border:`1px solid ${bord}`,borderRadius:'6px',
                  padding:'12px 22px',display:'flex',alignItems:'center',gap:'12px'
                }}>
                  <span style={{ fontFamily:'var(--mono)',fontSize:'24px',fontWeight:800,color:s.c,lineHeight:1 }}>{s.v}</span>
                  <span style={{ fontFamily:'var(--mono)',fontSize:'11px',color:'var(--muted)' }}>{s.l}</span>
                </div>
              ))}
            </div>

            <div className="certs-grid" style={{
              display:'grid',
              gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))',
              gap:'18px'
            }}>
              {CERTS.map((cert, i) => <CertCard key={i} cert={cert} lm={lm} />)}
            </div>
          </div>
        </section>

        {/* ── EXPERIENCE ── */}
        <section id="experience" style={{ padding:`60px ${pad}` }}>
          <div ref={expRef} style={{
            opacity: expVis ? 1 : 0,transform: expVis ? 'none' : 'translateY(36px)',
            transition:'all .8s ease'
          }}>
            <SLabel t="// EXPERIENCE & LEADERSHIP" />
            <SHead lm={lm}>Community Impact & Leadership</SHead>
            <div style={{ display:'flex',flexDirection:'column',gap:'20px' }}>

              {/* WLWJ */}
              <div className="exp-card" style={{
                background:surf,border:`1px solid ${bord}`,
                borderLeft:'3px solid #00d4ff',borderRadius:'8px',
                padding:'30px',backdropFilter:'blur(14px)'
              }}>
                <div style={{ display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:'10px',marginBottom:'20px' }}>
                  <div>
                    <h3 style={{ fontSize:'18px',fontWeight:700,color: lm ? '#0f172a' : 'var(--text)',marginBottom:'4px' }}>
                      Community Manager
                    </h3>
                    <div style={{ fontFamily:'var(--mono)',fontSize:'12px',color:'#00d4ff' }}>WLWJ</div>
                  </div>
                  {/* Fixed date — past role */}
                  <span style={{
                    background:'rgba(100,116,139,.08)',border:'1px solid rgba(100,116,139,.25)',
                    borderRadius:'4px',padding:'3px 12px',fontFamily:'var(--mono)',
                    fontSize:'10px',color:'var(--muted)',height:'fit-content',alignSelf:'flex-start'
                  }}>2024 – 2025</span>
                </div>

                <div className="stats-row" style={{
                  display:'grid',gridTemplateColumns:'repeat(3, 1fr)',
                  background: lm ? 'rgba(0,0,0,.04)' : 'rgba(0,212,255,.03)',
                  border:`1px solid ${lm ? '#f1f5f9' : 'rgba(0,212,255,.1)'}`,
                  borderRadius:'6px',marginBottom:'20px',overflow:'hidden'
                }}>
                  {[
                    { v:'3', l:'National CTFs', sub:'Organized' },
                    { v:'1,500+', l:'Tech Tayari', sub:'Participants' },
                    { v:'2,300+', l:'NetAcad Cyber Cup', sub:'Participants' },
                  ].map((s, i, arr) => (
                    <div key={i} style={{
                      textAlign:'center',padding:'18px 12px',
                      borderRight: i < arr.length-1 ? `1px solid ${lm ? '#f1f5f9' : 'rgba(0,212,255,.08)'}` : 'none'
                    }}>
                      <div style={{
                        fontSize:'clamp(22px,3vw,30px)',fontWeight:800,
                        fontFamily:'var(--mono)',color:'#00d4ff',lineHeight:1
                      }}>{s.v}</div>
                      <div style={{ fontSize:'11px',fontFamily:'var(--mono)',color: lm ? '#334155' : 'var(--text)',marginTop:'5px' }}>{s.l}</div>
                      <div style={{ fontSize:'10px',fontFamily:'var(--mono)',color:'var(--muted)' }}>{s.sub}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display:'flex',flexDirection:'column',gap:'9px' }}>
                  {[
                    'Organized 3 national-scale CTF competitions, driving competitive cybersecurity engagement across Pakistan',
                    'Led Tech Tayari — a nationwide tech readiness initiative with 1,500+ active student participants',
                    'Directed NetAcad Cyber Cup — a Cisco Networking Academy-aligned competition with 2,300+ active participants',
                    'Built and managed cross-functional teams for event planning, outreach, and community operations nationwide',
                  ].map((a, i) => (
                    <div key={i} style={{ display:'flex',gap:'10px',fontSize:'13px',lineHeight:1.75,color:'var(--muted)' }}>
                      <span style={{ color:'#00d4ff',flexShrink:0,marginTop:'3px' }}>▸</span>{a}
                    </div>
                  ))}
                </div>
              </div>

              {/* ACM SIGSAC */}
              <div className="exp-card" style={{
                background:surf,border:`1px solid ${bord}`,
                borderLeft:'3px solid #7c3aed',borderRadius:'8px',
                padding:'30px',backdropFilter:'blur(14px)'
              }}>
                <div style={{ display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:'10px',marginBottom:'20px' }}>
                  <div>
                    <h3 style={{ fontSize:'18px',fontWeight:700,color: lm ? '#0f172a' : 'var(--text)',marginBottom:'4px' }}>
                      General Secretary
                    </h3>
                    <div style={{ fontFamily:'var(--mono)',fontSize:'12px',color:'#a78bfa' }}>ACM SIGSAC — DUET</div>
                  </div>
                  <span style={{
                    background:'rgba(124,58,237,.08)',border:'1px solid rgba(124,58,237,.25)',
                    borderRadius:'4px',padding:'3px 12px',fontFamily:'var(--mono)',
                    fontSize:'10px',color:'#a78bfa',height:'fit-content',alignSelf:'flex-start'
                  }}>2024</span>
                </div>
                <div style={{ display:'flex',flexDirection:'column',gap:'9px' }}>
                  {[
                    'Directed Cyber Week — a multi-day event featuring CTF competitions, hands-on workshops, and industry seminars',
                    'Coordinated cross-functional teams and managed full event logistics end-to-end',
                    'Drove cybersecurity awareness initiatives across the university student community',
                    'Served as primary liaison between the ACM chapter and university administration',
                  ].map((a, i) => (
                    <div key={i} style={{ display:'flex',gap:'10px',fontSize:'13px',lineHeight:1.75,color:'var(--muted)' }}>
                      <span style={{ color:'#7c3aed',flexShrink:0,marginTop:'3px' }}>▸</span>{a}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section id="contact" style={{ padding:`60px ${pad} 100px` }}>
          <div ref={conRef} style={{
            opacity: conVis ? 1 : 0,transform: conVis ? 'none' : 'translateY(36px)',
            transition:'all .8s ease'
          }}>
            <SLabel t="// CONTACT" />
            <SHead lm={lm}>Let's Connect</SHead>
            <p style={{ fontSize:'14px',color:'var(--muted)',marginBottom:'32px',maxWidth:'420px',lineHeight:1.85 }}>
              Open to internships, collaborations, and cybersecurity conversations.
            </p>
            <div style={{ display:'flex',flexWrap:'wrap',gap:'14px' }}>
              {[
                { label:'Email', value:'usaiymjunaid6677@gmail.com', href:'mailto:usaiymjunaid6677@gmail.com', c:'#00d4ff' },
                { label:'GitHub', value:'Usaim-12Junaid', href:'https://github.com/Usaim-12Junaid', c:'#a78bfa' },
                { label:'LinkedIn', value:'syed-usaiym-junaid', href:'https://www.linkedin.com/in/syed-usaiym-junaid-062a0129a/', c:'#60a5fa' },
              ].map((link, i) => (
                <a key={i} href={link.href} target="_blank" rel="noreferrer" className="contact-link"
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = link.c;
                    e.currentTarget.style.boxShadow = `0 0 24px ${link.c}20`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = bord;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  style={{
                    background:surf,border:`1px solid ${bord}`,
                    borderRadius:'8px',padding:'18px 24px',
                    display:'flex',flexDirection:'column',gap:'4px',
                    minWidth:'190px',transition:'all .3s ease'
                  }}>
                  <span style={{ fontFamily:'var(--mono)',fontSize:'10px',color:'var(--muted)',letterSpacing:'2px' }}>{link.label}</span>
                  <span style={{ fontFamily:'var(--mono)',fontSize:'12px',color:link.c }}>{link.value}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          borderTop:`1px solid ${bord}`,padding:`20px ${pad}`,
          display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:'10px'
        }}>
          <span style={{ fontFamily:'var(--mono)',fontSize:'11px',color:'var(--muted)' }}>© 2025 Syed Usaiym Junaid</span>
          <span style={{ fontFamily:'var(--mono)',fontSize:'11px',color:'var(--muted)' }}>All scan simulations are educational demos only</span>
        </footer>
      </main>

      <FloatTerminal lm={lm} onScan={() => setShowScan(true)} />
      {showScan && <ScanModal onClose={() => setShowScan(false)} lm={lm} />}
    </div>
  );
}
export default Portfolio;