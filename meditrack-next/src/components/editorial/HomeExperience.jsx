"use client";

import Link from "next/link";
import { FiArrowRight, FiShield } from "react-icons/fi";
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
    title: "Find the right specialist",
    body: "Search by city, hospital, specialization, and price without leaving your clinical history behind.",
    href: "/doctors",
    icon: HiOutlineMagnifyingGlass,
  },
  {
    title: "Book and manage visits",
    body: "Patients, doctors, and admins share one appointment layer instead of disconnected tools.",
    href: "/appointments",
    icon: HiOutlineCalendarDays,
  },
  {
    title: "Keep one medical timeline",
    body: "Reports, diagnoses, and prescriptions remain linked across every consultation.",
    href: "/medical-history",
    icon: HiOutlineDocumentText,
  },
  {
    title: "Use emergency fingerprint access",
    body: "An ESP32 reader can surface critical patient details when the patient cannot unlock a phone.",
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
            <span className="editorial-eyebrow">Clinical record platform</span>
            <h1 className="editorial-display">
              One patient file.
              <br />
              One fingerprint away.
            </h1>
            <p className="editorial-lede">
              Medi Track connects patient care, doctor workflow, and emergency lookup in a single system built around the real pace of hospitals and clinics.
            </p>

            <div className="editorial-hero-actions">
              <Link href="/register" className="editorial-btn editorial-btn-primary">
                <span>Create account</span>
                <FiArrowRight />
              </Link>
              <Link href="/doctors" className="editorial-btn editorial-btn-outline">
                Browse doctors
              </Link>
              <span className="editorial-inline-note">
                <FiShield />
                Secure sessions, audit trails, and biometric access
              </span>
            </div>

            <div className="editorial-hero-stats">
              <div>
                <strong>12k+</strong>
                <span>Patients onboarded</span>
              </div>
              <div>
                <strong>250+</strong>
                <span>Partner clinics</span>
              </div>
              <div>
                <strong>0.31s</strong>
                <span>Median fingerprint match</span>
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
              <span className="editorial-stage-label">Emergency stream</span>
              <strong>Live patient lookup</strong>
              <p>Reader paired, scan mode armed, triage file ready.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-band">
        <div className="editorial-shell editorial-band-grid">
          <div>
            <span className="editorial-eyebrow editorial-eyebrow-invert">Fingerprint layer</span>
            <h2 className="editorial-section-title editorial-section-title-invert">When seconds matter, the login screen should not.</h2>
            <p className="editorial-lede editorial-lede-invert">
              Device pairing, clinician verification, and patient record lookup are tied together so the emergency flow remains fast without becoming anonymous.
            </p>
          </div>

          <div className="editorial-band-metrics">
            <div>
              <strong>99.94%</strong>
              <span>True positive match rate</span>
            </div>
            <div>
              <strong>142</strong>
              <span>Partner triage desks</span>
            </div>
            <div>
              <strong>ESP32</strong>
              <span>Reader-based device network</span>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section">
        <div className="editorial-shell">
          <div className="editorial-section-head">
            <div>
              <span className="editorial-eyebrow">Care journey</span>
              <h2 className="editorial-section-title">The redesign maps directly to the workflows already in the app.</h2>
            </div>
            <p className="editorial-lede">
              The frontend now reflects the same structure the backend already supports: discovery, booking, records, clinician tools, and emergency access.
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
              <h2 className="editorial-section-title">Verified specialists already fit the new interface.</h2>
            </div>
            <p className="editorial-lede">
              The doctor directory remains connected to your backend filters and booking flow while the presentation becomes more deliberate.
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
              <span>Set up a device</span>
            </Link>
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
