"use client";

import Link from "next/link";
import { FiArrowRight, FiHeart, FiShield } from "react-icons/fi";
import { HiOutlineCalendarDays, HiOutlineCpuChip, HiOutlineDocumentText, HiOutlineMagnifyingGlass } from "react-icons/hi2";

const previewDoctors = [
  {
    name: "Dr. Amara Okonkwo",
    specialty: "Cardiology",
    city: "San Francisco",
    hospital: "Sutter Heights",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Dr. Priya Sharma",
    specialty: "Pediatrics",
    city: "Seattle",
    hospital: "Lakeside Children's",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Dr. Kenji Sato",
    specialty: "Orthopedics",
    city: "San Diego",
    hospital: "Bay Sports Med.",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=900&q=80",
  },
];

const capabilityCards = [
  {
    title: "Find the right specialist faster",
    body: "Browse trusted clinicians by specialty, location, language, and availability in a calm patient-first directory.",
    href: "/doctors",
    icon: HiOutlineMagnifyingGlass,
  },
  {
    title: "Book visits with less friction",
    body: "Appointments, follow-ups, and clinician schedules stay aligned in one flow for patients, doctors, and staff.",
    href: "/appointments",
    icon: HiOutlineCalendarDays,
  },
  {
    title: "Keep one connected health record",
    body: "Reports, prescriptions, notes, and diagnosis history remain organized as one medical timeline.",
    href: "/medical-history",
    icon: HiOutlineDocumentText,
  },
  {
    title: "Enable emergency fingerprint access",
    body: "Critical patient details can be surfaced quickly at triage when time matters more than device navigation.",
    href: "/emergency",
    icon: FingerprintGlyph,
  },
];

export default function HomeExperience() {
  return (
    <main className="editorial-main">
      <section className="editorial-hero">
        <div className="editorial-shell editorial-hero-grid">
          <div className="editorial-hero-copy">
            <span className="editorial-eyebrow">Trusted digital care experience</span>
            <h1 className="editorial-display">
              Care feels warmer
              <br />
              when every step is clear.
            </h1>
            <p className="editorial-lede">
              Medi Track brings appointments, records, doctor discovery, and emergency access into one refined healthcare workspace designed to feel clinical, reassuring, and easy to use.
            </p>

            <div className="editorial-hero-actions">
              <Link href="/register" className="editorial-btn editorial-btn-primary">
                <span>Start your care profile</span>
                <FiArrowRight />
              </Link>
              <Link href="/doctors" className="editorial-btn editorial-btn-outline">
                Explore specialists
              </Link>
              <span className="editorial-inline-note">
                <FiShield />
                Secure records, verified care teams, and biometric access
              </span>
            </div>

            <div className="editorial-hero-stats">
              <div>
                <strong>12k+</strong>
                <span>Patient profiles supported</span>
              </div>
              <div>
                <strong>250+</strong>
                <span>Clinics and care desks</span>
              </div>
              <div>
                <strong>0.31s</strong>
                <span>Emergency lookup response</span>
              </div>
            </div>
          </div>

          <div className="editorial-hero-stage">
            <div className="editorial-stage-card editorial-stage-tall">
              <img
                src="https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?auto=format&fit=crop&w=1200&q=80"
                alt="Doctor meeting with a patient"
              />
            </div>
            <div className="editorial-stage-card">
              <img
                src="https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?auto=format&fit=crop&w=900&q=80"
                alt="Medical examination"
              />
            </div>
            <div className="editorial-stage-panel">
              <span className="editorial-stage-label">Clinical readiness</span>
              <strong>Reception to recovery, in one flow</strong>
              <p>Prepared for walk-ins, routine care, and urgent lookup without breaking the experience.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-band">
        <div className="editorial-shell editorial-band-grid">
          <div>
            <span className="editorial-eyebrow editorial-eyebrow-invert">Hospital-grade continuity</span>
            <h2 className="editorial-section-title editorial-section-title-invert">A hospitality tone for patients, with clinical control for staff.</h2>
            <p className="editorial-lede editorial-lede-invert">
              The interface now balances a welcoming front-door feel with the precision healthcare teams need for appointments, documentation, and emergency response.
            </p>
          </div>

          <div className="editorial-band-metrics">
            <div>
              <strong>99.94%</strong>
              <span>Biometric verification accuracy</span>
            </div>
            <div>
              <strong>142</strong>
              <span>Triage-ready care desks</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>Continuous care visibility</span>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section">
        <div className="editorial-shell">
          <div className="editorial-section-head">
            <div>
              <span className="editorial-eyebrow">Care journey</span>
              <h2 className="editorial-section-title">Every section now reads like a coordinated healthcare service.</h2>
            </div>
            <p className="editorial-lede">
              The homepage presents discovery, scheduling, records, and urgent access with clearer text, stronger alignment, and a cleaner sense of trust.
            </p>
          </div>

          <div className="editorial-capability-grid">
            {capabilityCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link key={card.title} href={card.href} className="editorial-capability-card">
                  <Icon />
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                  <span>
                    Explore
                    <FiArrowRight />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-section-tight">
        <div className="editorial-shell">
          <div className="editorial-section-head">
            <div>
              <span className="editorial-eyebrow">In network</span>
              <h2 className="editorial-section-title">Verified doctors are presented with more clarity and confidence.</h2>
            </div>
            <p className="editorial-lede">
              Provider cards now feel more consistent with a medical booking platform while still keeping the warm hospitality tone you asked for.
            </p>
          </div>

          <div className="editorial-preview-grid">
            {previewDoctors.map((doctor) => (
              <article key={doctor.name} className="editorial-preview-card">
                <div className="editorial-preview-media">
                  <img src={doctor.image} alt={doctor.name} />
                </div>
                <div className="editorial-preview-body">
                  <span>{doctor.specialty}</span>
                  <h3>{doctor.name}</h3>
                  <p>{doctor.hospital}</p>
                  <small>{doctor.city}</small>
                </div>
              </article>
            ))}
          </div>

          <div className="editorial-cta-row">
            <Link href="/doctors" className="editorial-btn editorial-btn-outline">
              Explore all doctors
            </Link>
            <Link href="/device-setup" className="editorial-btn editorial-btn-outline">
              <HiOutlineCpuChip />
              <span>Prepare emergency device access</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-promise-section">
        <div className="editorial-shell">
          <div className="editorial-promise-card">
            <div>
              <span className="editorial-eyebrow">Patient confidence</span>
              <h2 className="editorial-section-title">The experience feels welcoming at the front desk and dependable in treatment rooms.</h2>
            </div>
            <div className="editorial-promise-points">
              <div>
                <FiHeart />
                <p>Warmer language reduces friction for patients and families.</p>
              </div>
              <div>
                <FiShield />
                <p>Medical records remain protected with secure access patterns.</p>
              </div>
              <div>
                <HiOutlineCpuChip />
                <p>Emergency hardware stays integrated without dominating the interface.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function FingerprintGlyph(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
      <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
      <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
      <path d="M2 12a10 10 0 0 1 18-6" />
      <path d="M2 17.5a14.5 14.5 0 0 0 4.24 5.5" />
      <path d="M6 10a8 8 0 0 1 14.7-2.4" />
      <path d="M6 14a6 6 0 0 1 11.94-1.5" />
      <path d="M6.18 17A14 14 0 0 0 7 22" />
    </svg>
  );
}
