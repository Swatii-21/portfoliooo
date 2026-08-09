import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Mail, MapPin, Menu, X } from "lucide-react";

const NAV = [
  ["home", "Home"],
  ["work", "Work"],
  ["services", "Services"],
  ["skills", "Skills"],
  ["contact", "Contact"],
];

const PROJECTS = [
  {
    file: "bloodsync.tsx",
    name: "BloodSync",
    tagline: "Blood donation & emergency matching platform",
    stack: ["Node.js", "MongoDB", "EJS"],
    metric: "80% faster emergency donor search",
    detail:
      "Connects blood banks with donors in real time. Load-tested to 1,000+ concurrent users and validated against 200+ mock donor records for matching accuracy.",
    github: "https://github.com/Swatii-21/Lifesync",
  },
  {
    file: "gigcred.tsx",
    name: "GigCred",
    tagline: "Credit scoring for gig-economy freelancers",
    stack: ["React", "Node.js", "MongoDB"],
    metric: "35% lift in loan-eligibility accuracy",
    detail:
      "Scores freelancers on work history and verified skills instead of payslips — cutting default risk by 20% and opening fair credit access to 1,000+ workers.",
    github: "https://github.com/yashi2606/Fintech",
  },
  {
    file: "saarthiai.tsx",
    name: "Saarthi AI",
    tagline: "Offline-first multilingual AI assistant",
    stack: ["React", "FastAPI", "Whisper"],
    metric: "Voice + text assistance",
    detail:
      "An offline-first multilingual AI assistant designed for rural and low-literacy users, supporting voice and text interaction across health, fire, disaster and awareness categories.",
    github: "https://github.com/Swatii-21/Saarthi-AI",
  },
];
const SERVICES = [
  {
    key: "01",
    title: "Frontend development",
    detail: "Responsive, pixel-accurate interfaces in HTML, CSS, JavaScript and React.",
  },
  {
    key: "02",
    title: "UI implementation",
    detail: "Figma files turned into clean, production-ready markup — spacing and states included.",
  },
  {
    key: "03",
    title: "Full-stack support",
    detail: "Wiring frontend to MongoDB and REST APIs so the whole app actually ships.",
  },
  {
    key: "04",
    title: "Web app optimization",
    detail: "Performance and structure passes grounded in DSA and system-design fundamentals.",
  },
];

const SKILLS = {
  Languages: ["C++", "C", "JavaScript"],
  Frontend: ["HTML", "CSS", "React.js", "Figma"],
  "Backend & data": ["MongoDB", "DBMS", "System design"],
  Tooling: ["Git", "GitHub", "Canva", "Google Colab", "DSA", "OS"],
};

export default function Portfolio() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const sections = root.querySelectorAll("[data-section]");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("sw-in");
            if (entry.intersectionRatio > 0.35) setActive(entry.target.dataset.section);
          }
        });
      },
      { threshold: [0.15, 0.35, 0.6] }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const goTo = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
  };

  const updateField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Enter a valid email.";
    if (!form.message.trim()) next.message = "Add a short message.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setStatus({ type: "error", text: "Fix the highlighted fields." });
      return;
    }
    setSubmitting(true);
    setStatus({ type: "pending", text: "Sending…" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Something went wrong.");
      }
      setStatus({ type: "ok", text: "Message sent — I'll get back to you soon." });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus({ type: "error", text: err.message || "Couldn't send. Try again in a moment." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="sw-root" ref={rootRef}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');

        .sw-root{
          --paper:#E8ECE8;
          --panel:#FFFFFF;
          --ink:#141F26;
          --ink-soft:#57666C;
          --grid:#C8D2CD;
          --accent:#E4552B;
          --teal:#1C6B72;
          --danger:#C13B2A;
          --radius:10px;
          font-family:'Inter',sans-serif;
          color:var(--ink);
          background:var(--paper);
          background-image:
            linear-gradient(var(--grid) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid) 1px, transparent 1px);
          background-size:32px 32px;
          background-position:-1px -1px;
          min-height:100vh;
          position:relative;
          overflow-x:hidden;
          line-height:1.5;
        }
        .sw-root *{box-sizing:border-box;}
        .sw-mono{font-family:'JetBrains Mono',monospace;}
        .sw-container{max-width:1180px;margin:0 auto;padding:0 6vw;}

        /* ---------- NAV ---------- */
        .sw-nav{
          position:sticky;top:0;z-index:50;
          background:rgba(232,236,232,0.86);
          backdrop-filter:blur(10px);
          border-bottom:1px solid var(--grid);
        }
        .sw-nav-inner{
          max-width:1180px;margin:0 auto;padding:18px 6vw;
          display:flex;align-items:center;justify-content:space-between;gap:1rem;
        }
        .sw-logo{font-size:0.92rem;font-weight:600;letter-spacing:-0.01em;}
        .sw-logo .sw-dim{color:var(--ink-soft);}
        .sw-navlinks{display:flex;align-items:center;gap:1.9rem;list-style:none;margin:0;padding:0;}
        .sw-navlinks a{
          font-family:'JetBrains Mono',monospace;font-size:0.82rem;color:var(--ink-soft);
          text-decoration:none;position:relative;padding-bottom:4px;transition:color .2s ease;
        }
        .sw-navlinks a:hover{color:var(--ink);}
        .sw-navlinks li.active a{color:var(--ink);}
        .sw-navlinks li.active a::after{
          content:'';position:absolute;left:0;right:0;bottom:-6px;height:2px;background:var(--accent);
        }
        .sw-status{
          display:flex;align-items:center;gap:0.5rem;font-family:'JetBrains Mono',monospace;
          font-size:0.78rem;color:var(--ink-soft);border:1px solid var(--grid);
          padding:0.4rem 0.75rem;border-radius:999px;background:var(--panel);
        }
        .sw-dot{width:7px;height:7px;border-radius:50%;background:#2E9E5B;flex:none;
          box-shadow:0 0 0 0 rgba(46,158,91,0.5);animation:sw-pulse 2s infinite;}
        @keyframes sw-pulse{
          0%{box-shadow:0 0 0 0 rgba(46,158,91,0.45);}
          70%{box-shadow:0 0 0 7px rgba(46,158,91,0);}
          100%{box-shadow:0 0 0 0 rgba(46,158,91,0);}
        }
        .sw-menu-btn{display:none;background:var(--panel);border:1px solid var(--grid);border-radius:8px;
          width:38px;height:38px;align-items:center;justify-content:center;cursor:pointer;}
        .sw-resume-btn{padding:0.55rem 1rem;font-size:0.8rem;}
        @media (max-width:860px){.sw-resume-btn{display:none;}}
        .sw-mobile-panel{display:none;}

        @media (max-width:860px){
          .sw-navlinks, .sw-status{display:none;}
          .sw-menu-btn{display:flex;}
          .sw-mobile-panel.open{
            display:flex;flex-direction:column;gap:0.2rem;
            padding:0 6vw 1.2rem;border-bottom:1px solid var(--grid);background:var(--paper);
          }
          .sw-mobile-panel a{
            font-family:'JetBrains Mono',monospace;padding:0.7rem 0;color:var(--ink);
            text-decoration:none;border-bottom:1px solid var(--grid);font-size:0.9rem;
          }
          .sw-mobile-panel a:last-child{border-bottom:none;}
        }

        /* ---------- reveal ---------- */
        [data-section]{opacity:0;transform:translateY(18px);transition:opacity .6s ease, transform .6s ease;}
        [data-section].sw-in{opacity:1;transform:translateY(0);}
        @media (prefers-reduced-motion: reduce){
          [data-section]{opacity:1;transform:none;transition:none;}
          .sw-dot{animation:none;}
        }

        /* ---------- HERO ---------- */
        .sw-hero{padding:8vh 0 9vh;}
        .sw-hero-grid{
          display:grid;grid-template-columns:1.05fr 0.95fr;gap:4vw;align-items:center;
        }
        .sw-eyebrow{
          font-family:'JetBrains Mono',monospace;font-size:0.82rem;color:var(--teal);
          display:flex;align-items:center;gap:0.5rem;margin-bottom:1.4rem;
        }
        .sw-eyebrow::before{content:'//';color:var(--ink-soft);}
        .sw-h1{
          font-family:'JetBrains Mono',monospace;font-weight:700;
          font-size:clamp(2.1rem,4.6vw,3.6rem);line-height:1.08;letter-spacing:-0.01em;
          margin:0 0 1.4rem;
        }
        .sw-cursor{display:inline-block;width:3px;height:0.85em;background:var(--accent);margin-left:4px;
          animation:sw-blink 1s steps(2) infinite;vertical-align:-0.1em;}
        @keyframes sw-blink{50%{opacity:0;}}
        .sw-sub{color:var(--ink-soft);font-size:1.05rem;max-width:480px;margin-bottom:2.1rem;}
        .sw-cta-row{display:flex;gap:0.9rem;flex-wrap:wrap;}
        .sw-btn{
          font-family:'JetBrains Mono',monospace;font-size:0.88rem;font-weight:600;
          border-radius:8px;padding:0.85rem 1.4rem;display:inline-flex;align-items:center;gap:0.5rem;
          cursor:pointer;text-decoration:none;transition:transform .2s ease, box-shadow .2s ease;border:1px solid transparent;
        }
        .sw-btn:hover{transform:translateY(-2px);}
        .sw-btn:disabled{opacity:0.6;cursor:not-allowed;transform:none;}
        .sw-btn-primary{background:var(--ink);color:var(--paper);}
        .sw-btn-primary:hover{box-shadow:0 10px 22px -10px rgba(20,31,38,0.55);}
        .sw-btn-ghost{background:var(--panel);color:var(--ink);border-color:var(--grid);}
        .sw-btn-ghost:hover{border-color:var(--ink);}

        /* ---------- inspector signature visual ---------- */
        .sw-inspector{position:relative;padding:34px 0 0 34px;}
        .sw-ruler-x{
          position:absolute;top:0;left:34px;right:0;height:20px;
          background-image:repeating-linear-gradient(90deg, var(--ink-soft) 0 1px, transparent 1px 8px);
          background-position:0 bottom;background-size:100% 6px;background-repeat:repeat-x;opacity:0.35;
        }
        .sw-ruler-y{
          position:absolute;top:20px;left:0;bottom:0;width:20px;
          background-image:repeating-linear-gradient(0deg, var(--ink-soft) 0 1px, transparent 1px 8px);
          background-position:right 0;background-size:6px 100%;background-repeat:repeat-y;opacity:0.35;
        }
        .sw-box-margin{
          position:relative;background:rgba(228,85,43,0.10);border:1px dashed rgba(228,85,43,0.5);
          border-radius:12px;padding:22px;
        }
        .sw-box-padding{
          position:relative;background:rgba(28,107,114,0.10);border:1px solid rgba(28,107,114,0.35);
          border-radius:9px;padding:16px;
        }
        .sw-box-content{
          position:relative;background:var(--panel);border:1px solid var(--grid);border-radius:7px;
          padding:18px;box-shadow:0 18px 40px -24px rgba(20,31,38,0.35);
        }
        .sw-dim-label{
          position:absolute;top:-11px;left:14px;background:var(--paper);
          font-family:'JetBrains Mono',monospace;font-size:0.68rem;color:var(--accent);
          padding:0 6px;letter-spacing:0.02em;
        }
        .sw-dim-label--pad{color:var(--teal);}
        .sw-mock-nav{display:flex;gap:6px;margin-bottom:14px;}
        .sw-mock-nav span{width:9px;height:9px;border-radius:50%;background:var(--grid);}
        .sw-mock-lines div{height:9px;border-radius:4px;background:var(--grid);margin-bottom:8px;}
        .sw-mock-lines div:nth-child(1){width:88%;}
        .sw-mock-lines div:nth-child(2){width:72%;}
        .sw-mock-lines div:nth-child(3){width:45%;margin-bottom:16px;}
        .sw-mock-btn{
          display:inline-block;font-family:'JetBrains Mono',monospace;font-size:0.72rem;
          background:var(--ink);color:var(--paper);padding:0.5rem 0.9rem;border-radius:6px;
        }
        .sw-dim-tag{
          position:absolute;right:-8px;bottom:-14px;background:var(--ink);color:var(--paper);
          font-family:'JetBrains Mono',monospace;font-size:0.72rem;padding:0.35rem 0.6rem;border-radius:6px;
        }

        /* ---------- SECTIONS ---------- */
        .sw-section{padding:9vh 0;scroll-margin-top:88px;}
        .sw-section-head{display:flex;justify-content:space-between;align-items:flex-end;
          margin-bottom:2.6rem;flex-wrap:wrap;gap:0.6rem;}
        .sw-title{font-family:'JetBrains Mono',monospace;font-weight:700;
          font-size:clamp(1.5rem,2.6vw,2.1rem);margin-top:0;}
        .sw-count{font-family:'JetBrains Mono',monospace;font-size:0.82rem;color:var(--ink-soft);}

        /* ---------- WORK ---------- */
        .sw-work-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1.4rem;}
        .sw-card{
          position:relative;background:var(--panel);border:1px solid var(--grid);
          border-radius:var(--radius);padding:1.7rem;transition:transform .25s ease, box-shadow .25s ease;
        }
        .sw-card:hover{transform:translateY(-4px);box-shadow:0 20px 40px -26px rgba(20,31,38,0.4);}
        .sw-crop{position:absolute;width:12px;height:12px;pointer-events:none;}
        .sw-crop::before,.sw-crop::after{content:'';position:absolute;background:var(--grid);}
        .sw-crop::before{width:12px;height:1px;top:0;left:0;}
        .sw-crop::after{width:1px;height:12px;top:0;left:0;}
        .sw-crop.tl{top:-1px;left:-1px;}
        .sw-crop.tr{top:-1px;right:-1px;transform:scaleX(-1);}
        .sw-crop.bl{bottom:-1px;left:-1px;transform:scaleY(-1);}
        .sw-crop.br{bottom:-1px;right:-1px;transform:scale(-1,-1);}
        .sw-file-tab{
          display:inline-flex;align-items:center;gap:0.4rem;font-family:'JetBrains Mono',monospace;
          font-size:0.75rem;color:var(--ink-soft);background:var(--paper);border:1px solid var(--grid);
          border-radius:6px;padding:0.25rem 0.55rem;margin-bottom:1rem;
        }
        .sw-card h3{font-family:'JetBrains Mono',monospace;font-size:1.12rem;margin:0 0 0.35rem;}
        .sw-card-tagline{color:var(--ink-soft);font-size:0.88rem;margin-bottom:0.9rem;}
        .sw-stack{display:flex;flex-wrap:wrap;gap:0.4rem;margin-bottom:1rem;}
        .sw-chip{
          font-family:'JetBrains Mono',monospace;font-size:0.7rem;color:var(--teal);
          background:rgba(28,107,114,0.08);border:1px solid rgba(28,107,114,0.25);
          padding:0.2rem 0.5rem;border-radius:999px;
        }
        .sw-card-detail{font-size:0.9rem;color:var(--ink-soft);margin-bottom:1rem;}
        .sw-metric{
          display:flex;align-items:center;gap:0.4rem;font-family:'JetBrains Mono',monospace;
          font-size:0.82rem;color:var(--accent);font-weight:600;
        }
        .sw-card-bottom{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:1rem;
  margin-top:1rem;
}

.sw-github-link{
  font-family:'JetBrains Mono',monospace;
  font-size:0.78rem;
  font-weight:600;
  color:var(--ink);
  text-decoration:none;
  border:1px solid var(--grid);
  background:var(--paper);
  padding:0.45rem 0.7rem;
  border-radius:6px;
  transition:all .2s ease;
  white-space:nowrap;
}

.sw-github-link:hover{
  color:var(--accent);
  border-color:var(--accent);
  transform:translateY(-2px);
}

        /* ---------- SERVICES ---------- */
        .sw-services{border:1px solid var(--grid);border-radius:var(--radius);overflow:hidden;background:var(--panel);}
        .sw-service-row{
          display:grid;grid-template-columns:64px 1fr 1.4fr;gap:1.4rem;padding:1.4rem 1.6rem;
          border-bottom:1px solid var(--grid);align-items:start;
        }
        .sw-service-row:last-child{border-bottom:none;}
        .sw-service-key{font-family:'JetBrains Mono',monospace;color:var(--grid);font-size:1.3rem;font-weight:700;}
        .sw-service-row h3{margin:0;font-family:'JetBrains Mono',monospace;font-size:1rem;}
        .sw-service-row p{margin:0;color:var(--ink-soft);font-size:0.9rem;}
        @media (max-width:640px){
          .sw-service-row{grid-template-columns:36px 1fr;}
          .sw-service-row p{grid-column:2;}
        }

        /* ---------- SKILLS ---------- */
        .sw-skills-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.4rem;}
        .sw-skill-group{background:var(--panel);border:1px solid var(--grid);border-radius:var(--radius);padding:1.4rem;}
        .sw-skill-group h4{
          font-family:'JetBrains Mono',monospace;font-size:0.78rem;color:var(--ink-soft);
          text-transform:uppercase;letter-spacing:0.06em;margin:0 0 0.9rem;
        }
        .sw-skill-tags{display:flex;flex-wrap:wrap;gap:0.5rem;}
        .sw-skill-tag{
          font-family:'JetBrains Mono',monospace;font-size:0.8rem;border:1px solid var(--grid);
          border-radius:7px;padding:0.35rem 0.65rem;transition:border-color .2s ease, color .2s ease;
        }
        .sw-skill-tag:hover{border-color:var(--accent);color:var(--accent);}

        /* ---------- CONTACT ---------- */
        .sw-contact-grid{display:grid;grid-template-columns:0.9fr 1.1fr;gap:3rem;align-items:start;}
        .sw-contact-info h2{
          font-family:'JetBrains Mono',monospace;font-weight:700;
          font-size:clamp(1.6rem,3vw,2.3rem);line-height:1.2;margin:0.6rem 0 1.4rem;
        }
        .sw-contact-line{display:flex;align-items:center;gap:0.6rem;color:var(--ink-soft);
          font-size:0.92rem;margin-bottom:0.7rem;}
        .sw-form{display:flex;flex-direction:column;gap:1rem;background:var(--panel);
          border:1px solid var(--grid);border-radius:var(--radius);padding:1.6rem;}
        .sw-row2{display:grid;grid-template-columns:1fr 1fr;gap:1rem;}
        .sw-field label{display:block;font-family:'JetBrains Mono',monospace;font-size:0.72rem;
          color:var(--ink-soft);margin-bottom:0.4rem;}
        .sw-field input, .sw-field textarea{
          width:100%;background:var(--paper);border:1px solid var(--grid);border-radius:8px;
          padding:0.7rem 0.85rem;color:var(--ink);font-family:'Inter',sans-serif;font-size:0.92rem;
          outline:none;transition:border-color .2s ease;resize:vertical;
        }
        .sw-field input:focus, .sw-field textarea:focus{border-color:var(--teal);}
        .sw-field.invalid input, .sw-field.invalid textarea{border-color:var(--danger);}
        .sw-field-err{color:var(--danger);font-size:0.76rem;min-height:1em;margin-top:0.3rem;font-family:'JetBrains Mono',monospace;}
        .sw-form-status{font-family:'JetBrains Mono',monospace;font-size:0.82rem;min-height:1.2em;color:var(--teal);}
        .sw-form-status.error{color:var(--danger);}
        @media (max-width:900px){
          .sw-contact-grid{grid-template-columns:1fr;}
        }
        @media (max-width:520px){
          .sw-row2{grid-template-columns:1fr;}
        }

        /* ---------- HERO responsive ---------- */
        @media (max-width:900px){
          .sw-hero-grid{grid-template-columns:1fr;gap:3rem;}
          .sw-inspector{max-width:420px;}
        }

        /* ---------- FOOTER ---------- */
        .sw-footer{border-top:1px solid var(--grid);padding:2rem 0 3rem;}
        .sw-footer-inner{display:flex;justify-content:space-between;flex-wrap:wrap;gap:0.8rem;
          font-family:'JetBrains Mono',monospace;font-size:0.8rem;color:var(--ink-soft);}
        a.sw-link{color:var(--ink);}

        /* focus visibility */
        .sw-root a:focus-visible, .sw-root button:focus-visible, .sw-root input:focus-visible, .sw-root textarea:focus-visible{
          outline:2px solid var(--accent);outline-offset:2px;
        }
      `}</style>

      {/* NAV */}
      <nav className="sw-nav">
        <div className="sw-nav-inner">
          <div className="sw-logo sw-mono">
            swati-singh<span className="sw-dim">/portfolio.jsx</span>
          </div>
          <ul className="sw-navlinks">
            {NAV.map(([id, label]) => (
              <li key={id} className={active === id ? "active" : ""}>
                <a href={`#${id}`} onClick={goTo(id)}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <a href="https://drive.google.com/file/d/10Q5V4p26KorWTMNwecsbeQOqzGL2Lj-a/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="sw-btn sw-btn-ghost sw-resume-btn">
            Resume
          </a>
          <div className="sw-status">
            <span className="sw-dot" />
            available for work
          </div>
          <button
            className="sw-menu-btn"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        <div className={`sw-mobile-panel ${mobileOpen ? "open" : ""}`}>
          {NAV.map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={goTo(id)}>
              {label}
            </a>
          ))}
          <a href="https://drive.google.com/file/d/10Q5V4p26KorWTMNwecsbeQOqzGL2Lj-a/view?usp=sharing" target="_blank" rel="noopener noreferrer">
            Resume ↗
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" data-section="home" className="sw-hero">
        <div className="sw-container sw-hero-grid">
          <div>
            <div className="sw-eyebrow">frontend engineer, based in India</div>
            <h1 className="sw-h1">
              Swati Singh
              <span className="sw-cursor" aria-hidden="true" />
              <br />
              builds interfaces that measure up.
            </h1>
            <p className="sw-sub">
              Pixel by pixel, commit by commit — I turn Figma files and rough ideas into
              full-stack products people can actually rely on.
            </p>
            <div className="sw-cta-row">
              <a href="#work" onClick={goTo("work")} className="sw-btn sw-btn-primary">
                View work <ArrowRight size={16} />
              </a>
              <a href="#contact" onClick={goTo("contact")} className="sw-btn sw-btn-ghost">
                Say hello
              </a>
              <a href="https://drive.google.com/file/d/10Q5V4p26KorWTMNwecsbeQOqzGL2Lj-a/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="sw-btn sw-btn-ghost">
                Download resume
              </a>
            </div>
          </div>

          <div className="sw-inspector" aria-hidden="true">
            <div className="sw-ruler-x" />
            <div className="sw-ruler-y" />
            <div className="sw-box-margin">
              <span className="sw-dim-label">margin 24</span>
              <div className="sw-box-padding">
                <span className="sw-dim-label sw-dim-label--pad">padding 16</span>
                <div className="sw-box-content">
                  <div className="sw-mock-nav">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="sw-mock-lines">
                    <div />
                    <div />
                    <div />
                  </div>
                  <div className="sw-mock-btn">Deploy</div>
                </div>
              </div>
              <div className="sw-dim-tag">392 × 512</div>
            </div>
          </div>
        </div>
      </section>

      {/* WORK */}
      <section id="work" data-section="work" className="sw-section">
        <div className="sw-container">
          <div className="sw-section-head">
            <div>
              <div className="sw-title">Recent projects</div>
            </div>
            <div className="sw-count">{PROJECTS.length} shipped</div>
          </div>
          <div className="sw-work-grid">
            {PROJECTS.map((p) => (
              <div className="sw-card" key={p.file}>
                <span className="sw-crop tl" />
                <span className="sw-crop tr" />
                <span className="sw-crop bl" />
                <span className="sw-crop br" />
                <div className="sw-file-tab">{p.file}</div>
                <h3>{p.name}</h3>
                <div className="sw-card-tagline">{p.tagline}</div>
                <div className="sw-stack">
                  {p.stack.map((s) => (
                    <span className="sw-chip" key={s}>
                      {s}
                    </span>
                  ))}
                </div>
                <p className="sw-card-detail">{p.detail}</p>
                <div className="sw-card-bottom">
  <div className="sw-metric">
    <ArrowUpRight size={15} />
    {p.metric}
  </div>

  <a
    href={p.github}
    target="_blank"
    rel="noopener noreferrer"
    className="sw-github-link"
  >
    GitHub ↗
  </a>
</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" data-section="services" className="sw-section">
        <div className="sw-container">
          <div className="sw-section-head">
            <div>
              <div className="sw-title">Services</div>
            </div>
          </div>
          <div className="sw-services">
            {SERVICES.map((s) => (
              <div className="sw-service-row" key={s.key}>
                <div className="sw-service-key">{s.key}</div>
                <h3>{s.title}</h3>
                <p>{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" data-section="skills" className="sw-section">
        <div className="sw-container">
          <div className="sw-section-head">
            <div>
              <div className="sw-title">Skills</div>
            </div>
          </div>
          <div className="sw-skills-grid">
            {Object.entries(SKILLS).map(([group, items]) => (
              <div className="sw-skill-group" key={group}>
                <h4>{group}</h4>
                <div className="sw-skill-tags">
                  {items.map((i) => (
                    <span className="sw-skill-tag" key={i}>
                      {i}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" data-section="contact" className="sw-section">
        <div className="sw-container">
          <div className="sw-contact-grid">
            <div className="sw-contact-info">
              <h2>Have a project in mind? Let's build something people remember.</h2>
              <div className="sw-contact-line">
                <Mail size={16} /> swati.singh.0064@gmail.com
              </div>
              <div className="sw-contact-line">
                <MapPin size={16} /> India · open to remote work
              </div>
            </div>

            <form className="sw-form" onSubmit={handleSubmit} noValidate>
              <div className="sw-row2">
                <div className={`sw-field ${errors.name ? "invalid" : ""}`}>
                  <label htmlFor="sw-name">Name</label>
                  <input id="sw-name" value={form.name} onChange={updateField("name")} placeholder="Your name" />
                  <div className="sw-field-err">{errors.name}</div>
                </div>
                <div className={`sw-field ${errors.email ? "invalid" : ""}`}>
                  <label htmlFor="sw-email">Email</label>
                  <input id="sw-email" value={form.email} onChange={updateField("email")} placeholder="you@example.com" />
                  <div className="sw-field-err">{errors.email}</div>
                </div>
              </div>
              <div className={`sw-field ${errors.message ? "invalid" : ""}`}>
                <label htmlFor="sw-message">Message</label>
                <textarea
                  id="sw-message"
                  rows={4}
                  value={form.message}
                  onChange={updateField("message")}
                  placeholder="Tell me about your project..."
                />
                <div className="sw-field-err">{errors.message}</div>
              </div>
              <button type="submit" className="sw-btn sw-btn-primary" style={{ alignSelf: "flex-start" }} disabled={submitting}>
                {submitting ? "Sending…" : "Send message"} <ArrowRight size={16} />
              </button>
              <div className={`sw-form-status ${status?.type === "error" ? "error" : ""}`} role="status" aria-live="polite">
                {status?.text}
              </div>
            </form>
          </div>
        </div>
      </section>

      <footer className="sw-footer">
        <div className="sw-container sw-footer-inner">
          <div>© 2026 Swati Singh. All rights reserved.</div>
          <a className="sw-link" href="#home" onClick={goTo("home")}>
            back to top ↑
          </a>
        </div>
      </footer>
    </div>
  );
}
