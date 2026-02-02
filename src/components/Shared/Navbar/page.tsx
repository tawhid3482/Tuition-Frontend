"use client"; 

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Navbar: React.FC = () => {
  const pathname = usePathname(); // current route

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="navbar bg-base-100 shadow-sm border-b border-base-200">
      {/* Navbar Start */}
      <div className="navbar-start">
        <Link
          href="/"
          className="btn btn-ghost text-xl font-bold text-primary"
        >
          CodeBase
        </Link>
      </div>

      {/* Navbar Center */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`${
                  isActive(item.href) ? "active font-bold" : "text-secondary"
                } hover:text-accent transition-colors`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Navbar End */}
      <div className="navbar-end">
        <Link href="/login">
          <button className="btn btn-secondary text-white">Login</button>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
