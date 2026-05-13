"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FiArrowRight, FiBell, FiGrid, FiLogOut, FiMenu, FiUser, FiX } from "react-icons/fi";
import { HiOutlineCalendarDays, HiOutlineCpuChip, HiOutlineDocumentText, HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { logoutSession, useAuthSession } from "@/lib/useAuthSession";
import { setUserInfo } from "@/redux/reducers/rootSlice";
import axios from "axios";

const brand = (
  <>
    <span className="editorial-brand-mark" aria-hidden="true" />
    <span className="editorial-brand-text">Medi Track</span>
  </>
);

function getNavItems(role, unreadCount) {
  if (role === "Doctor") {
    return [
      { href: "/appointments", label: "Appointments", icon: HiOutlineCalendarDays },
      { href: "/emergency", label: "Emergency", icon: FingerprintGlyph },
      { href: "/device-setup", label: "Device Setup", icon: HiOutlineCpuChip },
      { href: "/notifications", label: "Inbox", icon: FiBell, badge: unreadCount || null },
      { href: "/profile", label: "Profile", icon: FiUser },
    ];
  }

  if (role === "Admin") {
    return [{ href: "/dashboard/home", label: "Dashboard", icon: FiGrid }];
  }

  if (role === "Patient") {
    return [
      { href: "/doctors", label: "Find Doctors", icon: HiOutlineMagnifyingGlass },
      { href: "/appointments", label: "Appointments", icon: HiOutlineCalendarDays },
      { href: "/medical-history", label: "Records", icon: HiOutlineDocumentText },
      { href: "/notifications", label: "Inbox", icon: FiBell, badge: unreadCount || null },
      { href: "/profile", label: "Profile", icon: FiUser },
    ];
  }

  return [];
}

export default function EditorialShell({ children }) {
  return (
    <>
      <EditorialNavbar />
      {children}
      <EditorialFooter />
    </>
  );
}

export function EditorialNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { ready, user } = useAuthSession();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!ready || !user) {
      setUnreadCount(0);
      return;
    }

    let active = true;

    async function fetchUnreadCount() {
      try {
        const { data } = await axios.get("/api/notification/unreadcount");
        if (active && data.success) {
          setUnreadCount(data.count || 0);
        }
      } catch {
        if (active) {
          setUnreadCount(0);
        }
      }
    }

    fetchUnreadCount();

    const handleClearCount = () => setUnreadCount(0);
    window.addEventListener("notifications_read", handleClearCount);

    return () => {
      active = false;
      window.removeEventListener("notifications_read", handleClearCount);
    };
  }, [ready, user]);

  const navItems = useMemo(() => getNavItems(user?.role, unreadCount), [user?.role, unreadCount]);
  const loggedIn = ready && !!user;

  async function handleLogout() {
    await logoutSession();
    dispatch(setUserInfo({}));
    router.push("/login");
  }

  return (
    <header className="editorial-nav-shell">
      <div className="editorial-shell">
        <nav className="editorial-nav">
          <Link href="/" className="editorial-brand" aria-label="Medi Track home">
            {brand}
          </Link>

          <button
            type="button"
            className="editorial-nav-toggle"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <FiX /> : <FiMenu />}
          </button>

          <div className={`editorial-nav-panel ${mobileOpen ? "is-open" : ""}`}>
            <div className="editorial-nav-links">
              <EditorialNavLink href="/" label="Home" pathname={pathname} />
              {navItems.map((item) => (
                <EditorialNavLink key={item.href} {...item} pathname={pathname} />
              ))}
            </div>

            <div className="editorial-nav-actions">
              {loggedIn ? (
                <>
                  <div className="editorial-user-chip">
                    <span className="editorial-user-kicker">{user.role}</span>
                    <span>{user.firstname || user.name || user.email}</span>
                  </div>
                  <button type="button" className="editorial-btn editorial-btn-outline" onClick={handleLogout}>
                    <FiLogOut />
                    <span>Log out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="editorial-btn editorial-btn-outline">
                    Sign in
                  </Link>
                  <Link href="/register" className="editorial-btn editorial-btn-primary">
                    <span>Open your file</span>
                    <FiArrowRight />
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

function EditorialNavLink({ href, label, pathname, icon: Icon, badge }) {
  const active = href === "/" ? pathname === href : pathname.startsWith(href);

  return (
    <Link href={href} className={`editorial-nav-link ${active ? "is-active" : ""}`}>
      {Icon ? <Icon aria-hidden="true" /> : null}
      <span>{label}</span>
      {badge ? <span className="editorial-nav-badge">{badge}</span> : null}
    </Link>
  );
}

export function EditorialFooter() {
  return (
    <footer className="editorial-footer">
      <div className="editorial-shell">
        <div className="editorial-footer-grid">
          <div>
            <Link href="/" className="editorial-brand editorial-brand-footer">
              {brand}
            </Link>
            <p className="editorial-footer-copy">
              Clinical records, booking workflows, doctor operations, and emergency fingerprint lookup in one platform.
            </p>
          </div>

          <div>
            <h3 className="editorial-footer-title">Platform</h3>
            <div className="editorial-footer-links">
              <Link href="/doctors">Find Doctors</Link>
              <Link href="/appointments">Appointments</Link>
              <Link href="/medical-history">Medical History</Link>
              <Link href="/emergency">Emergency Lookup</Link>
            </div>
          </div>

          <div>
            <h3 className="editorial-footer-title">Access</h3>
            <div className="editorial-footer-links">
              <Link href="/login">Sign In</Link>
              <Link href="/register">Register</Link>
              <Link href="/device-setup">Device Setup</Link>
              <Link href="/dashboard/home">Admin Dashboard</Link>
            </div>
          </div>
        </div>

        <div className="editorial-footer-bottom">
          <span>Built for Medi Track</span>
          <span>Secure sessions, audit trails, and biometric emergency access</span>
        </div>
      </div>
    </footer>
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
