---
theme: default
background: none
class: text-center
highlighter: shiki
lineNumbers: false
drawings:
  persist: false
transition: none
title: Medi-Track
fonts:
  sans: 'DM Sans'
  serif: 'DM Serif Display'
  mono: 'JetBrains Mono'
css: unocss
---

<style>
  /* ═══════════════════════════════════════════
     MEDI-TRACK — "Vital Signs" Design System
     Dark clinical aesthetic. Electric teal on deep navy.
     ═══════════════════════════════════════════ */

  :root {
    --mt-navy:     #030B1A;
    --mt-dark:     #060F22;
    --mt-card:     #0A1830;
    --mt-border:   rgba(45, 212, 191, 0.18);
    --mt-teal:     #2DD4BF;
    --mt-teal-dim: rgba(45, 212, 191, 0.12);
    --mt-amber:    #F59E0B;
    --mt-red:      #F43F5E;
    --mt-white:    #EEF6FF;
    --mt-muted:    rgba(180, 210, 240, 0.55);
    --mt-glow:     0 0 32px rgba(45, 212, 191, 0.25), 0 0 64px rgba(45, 212, 191, 0.08);
  }

  .slidev-layout {
    background: var(--mt-navy) !important;
    color: var(--mt-white) !important;
    font-family: 'DM Sans', sans-serif !important;
  }

  /* ── Grid Overlay ── */
  .slidev-layout::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(45,212,191,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(45,212,191,0.04) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 0;
  }

  .slidev-layout > * { position: relative; z-index: 1; }

  /* ── Typography ── */
  h1, h2, h3 {
    font-family: 'DM Serif Display', serif !important;
    color: var(--mt-white) !important;
    letter-spacing: -0.02em;
  }

  h1 { font-size: 3.6rem !important; line-height: 1.05 !important; }
  h2 { font-size: 2.4rem !important; line-height: 1.1 !important; }
  h3 { font-size: 1.4rem !important; }

  p, li { color: var(--mt-muted) !important; font-size: 1rem !important; line-height: 1.65 !important; }
  strong { color: var(--mt-white) !important; font-weight: 700 !important; }
  code {
    font-family: 'JetBrains Mono', monospace !important;
    background: var(--mt-teal-dim) !important;
    color: var(--mt-teal) !important;
    padding: 0.1em 0.45em !important;
    border-radius: 3px !important;
    font-size: 0.85em !important;
  }

  /* ── Teal Accent Glowing Text ── */
  .teal { color: var(--mt-teal) !important; }
  .amber { color: var(--mt-amber) !important; }
  .danger { color: var(--mt-red) !important; }

  /* ── Cards ── */
  .mt-card {
    background: var(--mt-card);
    border: 1px solid var(--mt-border);
    border-radius: 8px;
    padding: 1.5rem 1.75rem;
    position: relative;
    overflow: hidden;
  }

  .mt-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--mt-teal), transparent);
  }

  /* ── Tags / Badges ── */
  .mt-tag {
    display: inline-block;
    padding: 0.25rem 0.8rem;
    border-radius: 4px;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  .mt-tag-teal  { background: var(--mt-teal-dim); color: var(--mt-teal); border: 1px solid rgba(45,212,191,0.3); }
  .mt-tag-amber { background: rgba(245,158,11,0.12); color: var(--mt-amber); border: 1px solid rgba(245,158,11,0.3); }
  .mt-tag-red   { background: rgba(244,63,94,0.12);  color: var(--mt-red);   border: 1px solid rgba(244,63,94,0.3); }

  /* ── Stat Pill ── */
  .mt-stat {
    text-align: center;
    padding: 1.75rem 1rem;
    background: var(--mt-card);
    border: 1px solid var(--mt-border);
    border-radius: 8px;
  }

  .mt-stat .num {
    display: block;
    font-family: 'DM Serif Display', serif;
    font-size: 2.8rem;
    color: var(--mt-teal);
    line-height: 1;
    margin-bottom: 0.35rem;
    text-shadow: var(--mt-glow);
  }

  .mt-stat .label {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--mt-muted);
  }

  /* ── Timeline Dot ── */
  .timeline-item {
    display: flex;
    gap: 1.25rem;
    align-items: flex-start;
    padding-bottom: 1.5rem;
    position: relative;
  }

  .timeline-item:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 1.25rem;
    top: 2.8rem;
    bottom: 0;
    width: 1px;
    background: var(--mt-border);
  }

  .tl-dot {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background: var(--mt-teal-dim);
    border: 1.5px solid var(--mt-teal);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Serif Display', serif;
    font-size: 0.9rem;
    color: var(--mt-teal);
    flex-shrink: 0;
    box-shadow: 0 0 14px rgba(45,212,191,0.3);
  }

  .tl-dot.emergency {
    background: rgba(244,63,94,0.12);
    border-color: var(--mt-red);
    color: var(--mt-red);
    box-shadow: 0 0 14px rgba(244,63,94,0.3);
  }

  /* ── Tech Pill ── */
  .tech-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--mt-teal-dim);
    border: 1px solid rgba(45,212,191,0.25);
    border-radius: 100px;
    font-size: 0.82rem;
    color: var(--mt-teal);
    font-weight: 600;
  }

  /* ── Glow Divider ── */
  .glow-line {
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--mt-teal), transparent);
    margin: 0.75rem 0;
    opacity: 0.5;
  }

  /* ── Page Label (top-left corner) ── */
  .slide-label {
    position: absolute;
    top: 1.75rem;
    left: 2rem;
    font-size: 0.65rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--mt-teal);
    opacity: 0.7;
    font-weight: 700;
  }

  /* ── Slide counter (bottom-right) ── */
  .slide-num {
    position: absolute;
    bottom: 1.5rem;
    right: 2rem;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.68rem;
    color: var(--mt-muted);
    opacity: 0.6;
  }

  /* ── Fingerprint SVG glow animation ── */
  @keyframes fp-breathe {
    0%,100% { filter: drop-shadow(0 0 8px rgba(45,212,191,0.4)); }
    50%      { filter: drop-shadow(0 0 24px rgba(45,212,191,0.9)); }
  }

  .fp-glow { animation: fp-breathe 2.5s ease-in-out infinite; }

  /* ── Arch decoration ── */
  .arch-deco {
    position: absolute;
    width: 480px;
    height: 480px;
    border-radius: 50%;
    border: 1px solid rgba(45,212,191,0.06);
    pointer-events: none;
  }
</style>

<!-- ══════════════════════════════════════════════════
     SLIDE 1 — COVER
     ══════════════════════════════════════════════════ -->

<div class="arch-deco" style="top:-180px;right:-140px;border-width:1px;"></div>
<div class="arch-deco" style="top:-100px;right:-60px;width:300px;height:300px;border-color:rgba(45,212,191,0.08)"></div>

<div style="display:flex;flex-direction:column;align-items:flex-start;justify-content:center;height:100%;padding:0 3rem;">

  <div class="mt-tag mt-tag-teal" style="margin-bottom:1.5rem;">Healthcare Platform · 2026</div>

  <h1 style="text-align:left;margin-bottom:0.6rem;">
    Medi<span class="teal">Track</span>
  </h1>

  <p style="font-size:1.25rem !important;max-width:520px;text-align:left;margin-bottom:2.5rem;color:rgba(180,210,240,0.65) !important;">
    Unified healthcare appointments, medical records &amp; biometric emergency access — powered by ESP32 hardware.
  </p>

  <div style="display:flex;gap:1rem;flex-wrap:wrap;">
    <a href="https://medi-track-sable.vercel.app/" style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.65rem 1.4rem;background:var(--mt-teal);color:#030B1A;border-radius:5px;font-weight:700;font-size:0.85rem;letter-spacing:0.5px;text-decoration:none;">
      ↗ Live Demo
    </a>
    <a href="https://github.com/hrithik18k/Hack-a-Thon" style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.65rem 1.4rem;background:transparent;color:var(--mt-teal);border:1.5px solid var(--mt-teal);border-radius:5px;font-weight:700;font-size:0.85rem;letter-spacing:0.5px;text-decoration:none;">
      ⌥ Source Code
    </a>
  </div>

  <div class="glow-line" style="position:absolute;bottom:3rem;left:2rem;right:2rem;"></div>

  <div style="position:absolute;bottom:1.5rem;left:2rem;font-family:'JetBrains Mono',monospace;font-size:0.68rem;color:var(--mt-muted);opacity:0.6;">
    MEDI-TRACK · HACKATHON 2026
  </div>
</div>

---

<!-- ══════════════════════════════════════════════════
     SLIDE 2 — PROBLEM STATEMENT
     ══════════════════════════════════════════════════ -->

<div class="slide-label">01 — Problem</div>
<div class="slide-num">02 / 10</div>

<div style="padding:2rem 3rem;height:100%;display:flex;flex-direction:column;justify-content:center;">

<h2 style="margin-bottom:0.5rem;">The Problem</h2>
<div class="glow-line" style="margin-bottom:2.5rem;"></div>

<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1.25rem;">

  <div class="mt-card">
    <div style="font-size:2rem;margin-bottom:0.85rem;">🧩</div>
    <div class="mt-tag mt-tag-amber" style="margin-bottom:0.75rem;">Fragmented Systems</div>
    <p style="font-size:0.88rem !important;margin:0;">Managing appointments, reports, and records across disconnected platforms is slow and error-prone.</p>
  </div>

  <div class="mt-card">
    <div style="font-size:2rem;margin-bottom:0.85rem;">🚨</div>
    <div class="mt-tag mt-tag-red" style="margin-bottom:0.75rem;">Emergency Delays</div>
    <p style="font-size:0.88rem !important;margin:0;">Identifying an unconscious or unresponsive patient in critical care can cost precious minutes.</p>
  </div>

  <div class="mt-card">
    <div style="font-size:2rem;margin-bottom:0.85rem;">🔒</div>
    <div class="mt-tag mt-tag-amber" style="margin-bottom:0.75rem;">Data Silos</div>
    <p style="font-size:0.88rem !important;margin:0;">Doctors lack immediate, holistic access to a patient's medical history at the point of care.</p>
  </div>

</div>

<div class="mt-card" style="margin-top:1.5rem;display:flex;align-items:center;gap:1.25rem;padding:1rem 1.5rem;">
  <div style="font-size:1.5rem;">💡</div>
  <p style="margin:0;font-size:0.92rem !important;">
    <strong>The gap:</strong> No single platform bridges software healthcare workflows with hardware-level emergency identification.
  </p>
</div>

</div>

---

<!-- ══════════════════════════════════════════════════
     SLIDE 3 — PROPOSED SOLUTION
     ══════════════════════════════════════════════════ -->

<div class="slide-label">02 — Solution</div>
<div class="slide-num">03 / 10</div>

<div style="padding:2rem 3rem;height:100%;display:flex;align-items:center;gap:3rem;">

  <!-- Left: text -->
  <div style="flex:1.1;">
    <h2 style="margin-bottom:0.5rem;">Our Solution</h2>
    <div class="glow-line" style="margin-bottom:1.75rem;"></div>
    <p style="font-size:1rem !important;max-width:400px;margin-bottom:1.75rem;">
      MediTrack is an <strong>integrated ecosystem</strong> that connects patients, doctors, and administrators — augmented by real biometric hardware for life-critical moments.
    </p>

    <div style="display:flex;flex-direction:column;gap:0.65rem;">
      <div style="display:flex;align-items:center;gap:0.85rem;">
        <div class="mt-tag mt-tag-teal">●</div>
        <span style="color:var(--mt-white);font-size:0.9rem;"><strong>Patient booking</strong> &amp; profile management</span>
      </div>
      <div style="display:flex;align-items:center;gap:0.85rem;">
        <div class="mt-tag mt-tag-teal">●</div>
        <span style="color:var(--mt-white);font-size:0.9rem;"><strong>Doctor report</strong> management &amp; publication</span>
      </div>
      <div style="display:flex;align-items:center;gap:0.85rem;">
        <div class="mt-tag mt-tag-teal">●</div>
        <span style="color:var(--mt-white);font-size:0.9rem;"><strong>Admin dashboard</strong> for full system oversight</span>
      </div>
      <div style="display:flex;align-items:center;gap:0.85rem;">
        <div class="mt-tag mt-tag-teal">●</div>
        <span style="color:var(--mt-white);font-size:0.9rem;"><strong>Real-time notifications</strong> via Socket.io</span>
      </div>
      <div style="display:flex;align-items:center;gap:0.85rem;">
        <div class="mt-tag mt-tag-red">★</div>
        <span style="color:var(--mt-white);font-size:0.9rem;"><strong>ESP32 fingerprint</strong> emergency patient lookup</span>
      </div>
    </div>
  </div>

  <!-- Right: visual callout -->
  <div style="flex:0.9;display:flex;flex-direction:column;gap:1rem;">
    <div class="mt-card" style="text-align:center;padding:2.5rem 1.5rem;">
      <svg class="fp-glow" width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#2DD4BF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin:0 auto 1rem;">
        <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"/>
        <path d="M14 13.12c0 2.38 0 6.38-1 8.88"/>
        <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02"/>
        <path d="M2 12a10 10 0 0 1 18-6"/>
        <path d="M2 17.5a14.5 14.5 0 0 0 4.24 5.5"/>
        <path d="M6 10a8 8 0 0 1 14.7-2.4"/>
        <path d="M6 14a6 6 0 0 1 11.94-1.5"/>
        <path d="M6.18 17A14 14 0 0 0 7 22"/>
      </svg>
      <div class="mt-tag mt-tag-red" style="margin-bottom:0.75rem;">Hardware-First</div>
      <p style="font-size:0.85rem !important;margin:0;">A fingerprint scan in an emergency instantly surfaces blood type, allergies, and full medical history.</p>
    </div>
  </div>

</div>

---

<!-- ══════════════════════════════════════════════════
     SLIDE 4 — USER ROLES
     ══════════════════════════════════════════════════ -->

<div class="slide-label">03 — Users</div>
<div class="slide-num">04 / 10</div>

<div style="padding:2rem 3rem;height:100%;display:flex;flex-direction:column;justify-content:center;">

<h2 style="margin-bottom:0.5rem;">Who Uses MediTrack?</h2>
<div class="glow-line" style="margin-bottom:2.5rem;"></div>

<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1.5rem;">

  <div class="mt-card" style="border-top:2px solid var(--mt-teal);padding:2rem;">
    <div style="font-size:2.75rem;margin-bottom:1rem;">🧑‍⚕️</div>
    <h3 style="color:var(--mt-teal) !important;margin-bottom:0.5rem;font-size:1.3rem !important;">Patients</h3>
    <div class="glow-line"></div>
    <ul style="list-style:none;padding:0;margin:0.75rem 0 0;display:flex;flex-direction:column;gap:0.45rem;">
      <li style="color:var(--mt-muted);font-size:0.85rem;">→ Register &amp; sign in securely</li>
      <li style="color:var(--mt-muted);font-size:0.85rem;">→ Search &amp; book doctors</li>
      <li style="color:var(--mt-muted);font-size:0.85rem;">→ View full medical history</li>
      <li style="color:var(--mt-muted);font-size:0.85rem;">→ Enroll fingerprint biometrics</li>
    </ul>
  </div>

  <div class="mt-card" style="border-top:2px solid var(--mt-amber);padding:2rem;">
    <div style="font-size:2.75rem;margin-bottom:1rem;">👨‍💼</div>
    <h3 style="color:var(--mt-amber) !important;margin-bottom:0.5rem;font-size:1.3rem !important;">Doctors</h3>
    <div class="glow-line" style="background:linear-gradient(90deg,transparent,var(--mt-amber),transparent);"></div>
    <ul style="list-style:none;padding:0;margin:0.75rem 0 0;display:flex;flex-direction:column;gap:0.45rem;">
      <li style="color:var(--mt-muted);font-size:0.85rem;">→ Apply for &amp; get verified</li>
      <li style="color:var(--mt-muted);font-size:0.85rem;">→ Manage appointment slots</li>
      <li style="color:var(--mt-muted);font-size:0.85rem;">→ Publish medical reports</li>
      <li style="color:var(--mt-muted);font-size:0.85rem;">→ Control ESP32 scanner device</li>
    </ul>
  </div>

  <div class="mt-card" style="border-top:2px solid var(--mt-red);padding:2rem;">
    <div style="font-size:2.75rem;margin-bottom:1rem;">🛡️</div>
    <h3 style="color:var(--mt-red) !important;margin-bottom:0.5rem;font-size:1.3rem !important;">Admins</h3>
    <div class="glow-line" style="background:linear-gradient(90deg,transparent,var(--mt-red),transparent);"></div>
    <ul style="list-style:none;padding:0;margin:0.75rem 0 0;display:flex;flex-direction:column;gap:0.45rem;">
      <li style="color:var(--mt-muted);font-size:0.85rem;">→ Platform-wide statistics</li>
      <li style="color:var(--mt-muted);font-size:0.85rem;">→ Approve / reject doctors</li>
      <li style="color:var(--mt-muted);font-size:0.85rem;">→ Manage users &amp; data</li>
      <li style="color:var(--mt-muted);font-size:0.85rem;">→ Full oversight dashboard</li>
    </ul>
  </div>

</div>

</div>

---

<!-- ══════════════════════════════════════════════════
     SLIDE 5 — CORE FEATURES
     ══════════════════════════════════════════════════ -->

<div class="slide-label">04 — Features</div>
<div class="slide-num">05 / 10</div>

<div style="padding:2rem 3rem;height:100%;display:flex;flex-direction:column;justify-content:center;">

<h2 style="margin-bottom:0.5rem;">Core Features</h2>
<div class="glow-line" style="margin-bottom:2rem;"></div>

<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;">

  <div class="mt-card" style="padding:1.25rem;text-align:center;">
    <div style="font-size:1.6rem;margin-bottom:0.5rem;">🔐</div>
    <strong style="font-size:0.82rem;display:block;margin-bottom:0.3rem;">Auth &amp; Roles</strong>
    <p style="font-size:0.75rem !important;margin:0;">JWT + httpOnly cookie sessions with RBAC</p>
  </div>

  <div class="mt-card" style="padding:1.25rem;text-align:center;">
    <div style="font-size:1.6rem;margin-bottom:0.5rem;">🔍</div>
    <strong style="font-size:0.82rem;display:block;margin-bottom:0.3rem;">Doctor Search</strong>
    <p style="font-size:0.75rem !important;margin:0;">Filter by city &amp; specialization with live results</p>
  </div>

  <div class="mt-card" style="padding:1.25rem;text-align:center;">
    <div style="font-size:1.6rem;margin-bottom:0.5rem;">📅</div>
    <strong style="font-size:0.82rem;display:block;margin-bottom:0.3rem;">Smart Booking</strong>
    <p style="font-size:0.75rem !important;margin:0;">Dynamic slot generation based on doctor config</p>
  </div>

  <div class="mt-card" style="padding:1.25rem;text-align:center;">
    <div style="font-size:1.6rem;margin-bottom:0.5rem;">📋</div>
    <strong style="font-size:0.82rem;display:block;margin-bottom:0.3rem;">Medical Reports</strong>
    <p style="font-size:0.75rem !important;margin:0;">Rich reports with medications, images &amp; follow-up</p>
  </div>

  <div class="mt-card" style="padding:1.25rem;text-align:center;">
    <div style="font-size:1.6rem;margin-bottom:0.5rem;">🔔</div>
    <strong style="font-size:0.82rem;display:block;margin-bottom:0.3rem;">Notifications</strong>
    <p style="font-size:0.75rem !important;margin:0;">Real-time Socket.io alerts with unread badge counts</p>
  </div>

  <div class="mt-card" style="padding:1.25rem;text-align:center;">
    <div style="font-size:1.6rem;margin-bottom:0.5rem;">🗂️</div>
    <strong style="font-size:0.82rem;display:block;margin-bottom:0.3rem;">Medical History</strong>
    <p style="font-size:0.75rem !important;margin:0;">Collapsible timeline with Critical / Routine filters</p>
  </div>

  <div class="mt-card" style="padding:1.25rem;text-align:center;">
    <div style="font-size:1.6rem;margin-bottom:0.5rem;">⚙️</div>
    <strong style="font-size:0.82rem;display:block;margin-bottom:0.3rem;">Device Setup</strong>
    <p style="font-size:0.75rem !important;margin:0;">One-click ESP32 registration with secure token flow</p>
  </div>

  <div class="mt-card" style="padding:1.25rem;text-align:center;border-color:rgba(244,63,94,0.4);">
    <div style="font-size:1.6rem;margin-bottom:0.5rem;">🆘</div>
    <strong style="font-size:0.82rem;display:block;margin-bottom:0.3rem;color:var(--mt-red) !important;">Emergency Scan</strong>
    <p style="font-size:0.75rem !important;margin:0;">Fingerprint → instant patient ID &amp; full medical record</p>
  </div>

</div>

</div>

---

<!-- ══════════════════════════════════════════════════
     SLIDE 6 — UNIQUE FEATURE: ESP32
     ══════════════════════════════════════════════════ -->

<div class="slide-label">05 — Unique Feature</div>
<div class="slide-num">06 / 10</div>

<div style="padding:2rem 3rem;height:100%;display:flex;align-items:center;gap:3.5rem;">

  <!-- Left -->
  <div style="flex:1.1;">
    <div class="mt-tag mt-tag-red" style="margin-bottom:1.25rem;">★ Hardware Integration</div>
    <h2 style="margin-bottom:0.75rem;">ESP32 Fingerprint<br/>Emergency Lookup</h2>
    <div class="glow-line" style="margin-bottom:1.5rem;"></div>
    <p style="font-size:0.95rem !important;margin-bottom:1.75rem;">In critical situations where a patient is unresponsive, medical staff can scan their fingerprint to <strong>instantly retrieve vital records</strong> — blood type, allergies, medications, emergency contacts — directly on screen.</p>

    <div style="display:flex;flex-direction:column;gap:0.75rem;">
      <div class="mt-card" style="padding:0.85rem 1.25rem;flex-direction:row;display:flex;align-items:center;gap:0.85rem;">
        <span style="color:var(--mt-teal);font-size:1.1rem;">①</span>
        <span style="font-size:0.88rem;"><strong>Doctor registers</strong> the ESP32 device and gets a secure token</span>
      </div>
      <div class="mt-card" style="padding:0.85rem 1.25rem;flex-direction:row;display:flex;align-items:center;gap:0.85rem;">
        <span style="color:var(--mt-teal);font-size:1.1rem;">②</span>
        <span style="font-size:0.88rem;">ESP32 polls <code>/api/device/esp/mode</code> every <strong>3 seconds</strong></span>
      </div>
      <div class="mt-card" style="padding:0.85rem 1.25rem;flex-direction:row;display:flex;align-items:center;gap:0.85rem;">
        <span style="color:var(--mt-teal);font-size:1.1rem;">③</span>
        <span style="font-size:0.88rem;">On match, POSTs result → web UI <strong>polls &amp; renders</strong> patient instantly</span>
      </div>
    </div>
  </div>

  <!-- Right: animated fingerprint -->
  <div style="flex:0.9;display:flex;justify-content:center;align-items:center;">
    <div style="position:relative;width:220px;height:220px;display:flex;align-items:center;justify-content:center;">
      <!-- Rings -->
      <div style="position:absolute;width:100%;height:100%;border-radius:50%;border:1px solid rgba(45,212,191,0.15);animation:fp-breathe 3s ease-in-out infinite;"></div>
      <div style="position:absolute;width:76%;height:76%;border-radius:50%;border:1px solid rgba(45,212,191,0.25);animation:fp-breathe 3s ease-in-out infinite 0.5s;"></div>
      <div style="position:absolute;width:54%;height:54%;border-radius:50%;border:1px solid rgba(45,212,191,0.4);animation:fp-breathe 3s ease-in-out infinite 1s;"></div>
      <!-- Icon -->
      <svg class="fp-glow" width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#2DD4BF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"/>
        <path d="M14 13.12c0 2.38 0 6.38-1 8.88"/>
        <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02"/>
        <path d="M2 12a10 10 0 0 1 18-6"/>
        <path d="M2 17.5a14.5 14.5 0 0 0 4.24 5.5"/>
        <path d="M6 10a8 8 0 0 1 14.7-2.4"/>
        <path d="M6 14a6 6 0 0 1 11.94-1.5"/>
        <path d="M6.18 17A14 14 0 0 0 7 22"/>
      </svg>
    </div>
  </div>

</div>

---

<!-- ══════════════════════════════════════════════════
     SLIDE 7 — TECH STACK
     ══════════════════════════════════════════════════ -->

<div class="slide-label">06 — Tech Stack</div>
<div class="slide-num">07 / 10</div>

<div style="padding:2rem 3rem;height:100%;display:flex;flex-direction:column;justify-content:center;">

<h2 style="margin-bottom:0.5rem;">Built With</h2>
<div class="glow-line" style="margin-bottom:2rem;"></div>

<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1.25rem;">

  <!-- Frontend -->
  <div class="mt-card">
    <div class="mt-tag mt-tag-teal" style="margin-bottom:1rem;">Frontend</div>
    <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
      <span class="tech-pill">Next.js 14</span>
      <span class="tech-pill">React 18</span>
      <span class="tech-pill">Redux Toolkit</span>
      <span class="tech-pill">Vanilla CSS</span>
    </div>
  </div>

  <!-- Backend -->
  <div class="mt-card">
    <div class="mt-tag mt-tag-amber" style="margin-bottom:1rem;">Backend</div>
    <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
      <span class="tech-pill" style="background:rgba(245,158,11,0.1);color:var(--mt-amber);border-color:rgba(245,158,11,0.25);">Node.js</span>
      <span class="tech-pill" style="background:rgba(245,158,11,0.1);color:var(--mt-amber);border-color:rgba(245,158,11,0.25);">MongoDB</span>
      <span class="tech-pill" style="background:rgba(245,158,11,0.1);color:var(--mt-amber);border-color:rgba(245,158,11,0.25);">Mongoose</span>
      <span class="tech-pill" style="background:rgba(245,158,11,0.1);color:var(--mt-amber);border-color:rgba(245,158,11,0.25);">JWT</span>
      <span class="tech-pill" style="background:rgba(245,158,11,0.1);color:var(--mt-amber);border-color:rgba(245,158,11,0.25);">Socket.io</span>
      <span class="tech-pill" style="background:rgba(245,158,11,0.1);color:var(--mt-amber);border-color:rgba(245,158,11,0.25);">Nodemailer</span>
    </div>
  </div>

  <!-- Hardware -->
  <div class="mt-card" style="border-color:rgba(244,63,94,0.3);">
    <div class="mt-tag mt-tag-red" style="margin-bottom:1rem;">Hardware</div>
    <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
      <span class="tech-pill" style="background:rgba(244,63,94,0.1);color:var(--mt-red);border-color:rgba(244,63,94,0.25);">ESP32</span>
      <span class="tech-pill" style="background:rgba(244,63,94,0.1);color:var(--mt-red);border-color:rgba(244,63,94,0.25);">Adafruit FP Sensor</span>
      <span class="tech-pill" style="background:rgba(244,63,94,0.1);color:var(--mt-red);border-color:rgba(244,63,94,0.25);">Arduino C++</span>
      <span class="tech-pill" style="background:rgba(244,63,94,0.1);color:var(--mt-red);border-color:rgba(244,63,94,0.25);">WiFi HTTP</span>
    </div>
  </div>

</div>

<div class="mt-card" style="margin-top:1.25rem;display:flex;gap:3rem;justify-content:center;padding:1.25rem 2rem;">
  <div class="mt-stat" style="background:transparent;border:none;padding:0;">
    <span class="num" style="font-size:2rem;">14</span>
    <span class="label">Next.js Version</span>
  </div>
  <div style="width:1px;background:var(--mt-border);"></div>
  <div class="mt-stat" style="background:transparent;border:none;padding:0;">
    <span class="num" style="font-size:2rem;">18</span>
    <span class="label">React Version</span>
  </div>
  <div style="width:1px;background:var(--mt-border);"></div>
  <div class="mt-stat" style="background:transparent;border:none;padding:0;">
    <span class="num" style="font-size:2rem;">3s</span>
    <span class="label">ESP32 Poll Interval</span>
  </div>
  <div style="width:1px;background:var(--mt-border);"></div>
  <div class="mt-stat" style="background:transparent;border:none;padding:0;">
    <span class="num" style="font-size:2rem;">JWT</span>
    <span class="label">+ httpOnly Cookie Auth</span>
  </div>
</div>

</div>

---

<!-- ══════════════════════════════════════════════════
     SLIDE 8 — ARCHITECTURE
     ══════════════════════════════════════════════════ -->

<div class="slide-label">07 — Architecture</div>
<div class="slide-num">08 / 10</div>

<div style="padding:2rem 3rem;height:100%;display:flex;flex-direction:column;justify-content:center;">

<h2 style="margin-bottom:0.5rem;">System Architecture</h2>
<div class="glow-line" style="margin-bottom:2rem;"></div>

```mermaid
flowchart LR
    classDef fe   fill:#0A1830,stroke:#2DD4BF,stroke-width:2px,color:#2DD4BF
    classDef be   fill:#0A1830,stroke:#F59E0B,stroke-width:2px,color:#F59E0B
    classDef db   fill:#0A1830,stroke:#7C3AED,stroke-width:2px,color:#A78BFA
    classDef hw   fill:#0A1830,stroke:#F43F5E,stroke-width:2px,color:#F43F5E

    U(["👤 Users\n(Browser)"]):::fe
    FE(["Next.js 14\nApp Router"]):::fe
    API(["Node.js\nAPI Routes"]):::be
    BL(["Controllers\n& Services"]):::be
    DB[("MongoDB\n+ Mongoose")]:::db
    ESP(["🔬 ESP32\nScanner"]):::hw
    UI(["Emergency\nDashboard"]):::fe

    U -->|HTTPS| FE
    FE -->|REST / WS| API
    API -->|Business Logic| BL
    BL -->|Mongoose ODM| DB
    ESP -->|WiFi · HTTP poll| API
    API -->|Result payload| UI
```

<p style="text-align:center;font-size:0.82rem !important;margin-top:1rem;">The ESP32 communicates directly with the Next.js API over WiFi — no intermediary required.</p>

</div>

---

<!-- ══════════════════════════════════════════════════
     SLIDE 9 — DEMO FLOW
     ══════════════════════════════════════════════════ -->

<div class="slide-label">08 — Demo</div>
<div class="slide-num">09 / 10</div>

<div style="padding:2rem 3rem;height:100%;display:flex;flex-direction:column;justify-content:center;">

<h2 style="margin-bottom:0.5rem;">Demo Flow</h2>
<div class="glow-line" style="margin-bottom:2rem;"></div>

<div style="display:flex;flex-direction:column;gap:0;max-width:720px;">

  <div class="timeline-item">
    <div class="tl-dot">1</div>
    <div>
      <h3 style="margin-bottom:0.2rem;font-size:1rem !important;">Patient Onboarding</h3>
      <p style="font-size:0.85rem !important;margin:0;">Patient registers with blood group, emergency contacts, and profile picture. Logs in securely via JWT cookie session.</p>
    </div>
  </div>

  <div class="timeline-item">
    <div class="tl-dot">2</div>
    <div>
      <h3 style="margin-bottom:0.2rem;font-size:1rem !important;">Appointment Booking</h3>
      <p style="font-size:0.85rem !important;margin:0;">Searches for a doctor by city &amp; specialization, selects an available slot from dynamic time grid, and books with reason.</p>
    </div>
  </div>

  <div class="timeline-item">
    <div class="tl-dot">3</div>
    <div>
      <h3 style="margin-bottom:0.2rem;font-size:1rem !important;">Doctor Publishes Report</h3>
      <p style="font-size:0.85rem !important;margin:0;">Doctor reviews the appointment, adds diagnosis, medications, images, and follow-up date. Report is published and appointment marked complete.</p>
    </div>
  </div>

  <div class="timeline-item" style="padding-bottom:0;">
    <div class="tl-dot emergency">⚠</div>
    <div>
      <h3 style="margin-bottom:0.2rem;font-size:1rem !important;color:var(--mt-red) !important;">Emergency Fingerprint Scenario</h3>
      <p style="font-size:0.85rem !important;margin:0;">Doctor triggers scan mode → ESP32 reads finger → matches template → API returns patient identity + full medical history → displayed instantly on emergency dashboard.</p>
    </div>
  </div>

</div>

</div>

---

<!-- ══════════════════════════════════════════════════
     SLIDE 10 — FUTURE SCOPE + THANK YOU
     ══════════════════════════════════════════════════ -->

<div class="slide-label">09 — Future &amp; Close</div>
<div class="slide-num">10 / 10</div>

<div style="padding:2rem 3rem;height:100%;display:flex;align-items:center;gap:3rem;">

  <!-- Left: future scope -->
  <div style="flex:1.2;">
    <h2 style="margin-bottom:0.5rem;">What's Next</h2>
    <div class="glow-line" style="margin-bottom:1.5rem;"></div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.85rem;">

      <div class="mt-card" style="padding:1rem 1.25rem;">
        <div style="font-size:1.1rem;margin-bottom:0.4rem;">🏥</div>
        <strong style="font-size:0.82rem;display:block;margin-bottom:0.2rem;">Multi-Hospital Network</strong>
        <p style="font-size:0.75rem !important;margin:0;">Scale fingerprint profiles across hospital chains with shared patient identity.</p>
      </div>

      <div class="mt-card" style="padding:1rem 1.25rem;">
        <div style="font-size:1.1rem;margin-bottom:0.4rem;">📱</div>
        <strong style="font-size:0.82rem;display:block;margin-bottom:0.2rem;">Mobile Apps</strong>
        <p style="font-size:0.75rem !important;margin:0;">Native iOS &amp; Android apps for patients and doctors on the go.</p>
      </div>

      <div class="mt-card" style="padding:1rem 1.25rem;">
        <div style="font-size:1.1rem;margin-bottom:0.4rem;">🚨</div>
        <strong style="font-size:0.82rem;display:block;margin-bottom:0.2rem;">Emergency Alerts</strong>
        <p style="font-size:0.75rem !important;margin:0;">Auto SMS &amp; calls to emergency contacts upon biometric scan trigger.</p>
      </div>

      <div class="mt-card" style="padding:1rem 1.25rem;">
        <div style="font-size:1.1rem;margin-bottom:0.4rem;">🤖</div>
        <strong style="font-size:0.82rem;display:block;margin-bottom:0.2rem;">AI Analytics</strong>
        <p style="font-size:0.75rem !important;margin:0;">AI-driven insights for hospital management and disease trend tracking.</p>
      </div>

    </div>
  </div>

  <!-- Right: closing card -->
  <div style="flex:0.85;display:flex;flex-direction:column;gap:1rem;">
    <div class="mt-card" style="text-align:center;padding:2.5rem 1.5rem;">
      <h2 style="font-size:2.5rem !important;margin-bottom:0.5rem;">Thank You</h2>
      <p style="font-size:0.88rem !important;margin-bottom:1.75rem;">Questions? We'd love to talk about the hardware integration, the multi-device fingerprint architecture, or the codebase.</p>
      <div style="display:flex;flex-direction:column;gap:0.6rem;">
        <a href="https://medi-track-sable.vercel.app/" style="display:flex;align-items:center;justify-content:center;gap:0.5rem;padding:0.65rem 1rem;background:var(--mt-teal);color:#030B1A;border-radius:5px;font-weight:700;font-size:0.82rem;text-decoration:none;">
          ↗ medi-track-sable.vercel.app
        </a>
        <a href="https://github.com/hrithik18k/Hack-a-Thon" style="display:flex;align-items:center;justify-content:center;gap:0.5rem;padding:0.65rem 1rem;background:transparent;color:var(--mt-teal);border:1.5px solid var(--mt-teal);border-radius:5px;font-weight:700;font-size:0.82rem;text-decoration:none;">
          ⌥ github.com/hrithik18k/Hack-a-Thon
        </a>
      </div>
    </div>

    <div style="display:flex;justify-content:center;gap:1.25rem;">
      <div class="mt-stat" style="flex:1;padding:1rem;">
        <span class="num" style="font-size:1.8rem;">3</span>
        <span class="label">User Roles</span>
      </div>
      <div class="mt-stat" style="flex:1;padding:1rem;">
        <span class="num" style="font-size:1.8rem;">8+</span>
        <span class="label">API Modules</span>
      </div>
      <div class="mt-stat" style="flex:1;padding:1rem;">
        <span class="num" style="font-size:1.8rem;">1</span>
        <span class="label">Hardware Device</span>
      </div>
    </div>
  </div>

</div>