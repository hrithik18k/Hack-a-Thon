"use client";

import PropTypes from "prop-types";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaCalendarCheck, FaHome, FaSignOutAlt, FaUserMd, FaUsers } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { setUserInfo } from "../redux/reducers/rootSlice";
import store from "@/redux/store";
import { logoutSession } from "@/lib/useAuthSession";

const links = [
  { href: "/dashboard/home", label: "Overview", icon: FaHome },
  { href: "/dashboard/users", label: "Patients", icon: FaUsers },
  { href: "/dashboard/doctors", label: "Doctors", icon: FaUserMd },
  { href: "/dashboard/appointments", label: "Appointments", icon: FaCalendarCheck },
];

const Sidebar = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const router = useRouter();

  const logoutFunc = async () => {
    await logoutSession();
    store.dispatch(setUserInfo({}));
    router.push("/login");
  };

  return (
    <aside className={`editorial-sidebar ${isOpen ? "is-open" : ""}`}>
      <button className="editorial-sidebar-close" onClick={onClose} title="Close admin navigation">
        <RxCross1 />
      </button>

      <div className="editorial-sidebar-brand">
        <span className="editorial-brand-mark" aria-hidden="true" />
        <div>
          <strong>Medi Track</strong>
          <span>Admin console</span>
        </div>
      </div>

      <nav className="editorial-sidebar-nav">
        {links.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={pathname === href ? "is-active" : ""} onClick={onClose}>
            <Icon />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <button className="editorial-sidebar-logout" onClick={logoutFunc}>
        <FaSignOutAlt />
        <span>Log out</span>
      </button>
    </aside>
  );
};

export default Sidebar;

Sidebar.propTypes = {
  isOpen: PropTypes.any,
  onClose: PropTypes.any,
};
