// src/components/navbar/DesktopNav.tsx
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { NavItem } from "./types";

interface DesktopNavProps {
  navItems: NavItem[];
  activeItem: string;
  dropdownOpen: string | null;
  setDropdownOpen: (itemName: string | null) => void;
  onItemClick: (itemName: string) => void;
}

export default function DesktopNav({
  navItems,
  activeItem,
  dropdownOpen,
  setDropdownOpen,
  onItemClick,
}: DesktopNavProps) {
  const isActive = (itemName: string) => activeItem === itemName;

  return (
    <div className="hidden lg:flex lg:ml-10 lg:items-center lg:space-x-8">
      {navItems.map((item) => (
        <div key={item.name} className="relative">
          {item.dropdown ? (
            <div className="relative">
              <button
                className={`flex items-center space-x-2 font-medium py-2 text-sm tracking-wide transition-all duration-200 group ${
                  isActive(item.name)
                    ? " text-primary"
                    : "text-gray-700 hover:text-primary"
                }`}
                onMouseEnter={() => setDropdownOpen(item.name)}
                onMouseLeave={() => setDropdownOpen(null)}
              >
                <span className="relative">
                  {item.name}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                      isActive(item.name)
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform ${
                    dropdownOpen === item.name ? "rotate-180" : ""
                  }`}
                />
              </button>

              {dropdownOpen === item.name && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 w-56 bg-white rounded-lg shadow-xl py-3 border border-gray-100 z-50 mt-1"
                  onMouseEnter={() => setDropdownOpen(item.name)}
                  onMouseLeave={() => setDropdownOpen(null)}
                >
                  {item.dropdown.map((subItem) => (
                    <Link
                      key={subItem.name}
                      href={subItem.href}
                      className="flex items-center px-5 py-2.5 text-gray-700 hover:bg-primary/5 hover:text-primary transition-all duration-200 group"
                      onClick={() => onItemClick(item.name)}
                    >
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      <span className="font-medium text-sm">
                        {subItem.name}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Link
              href={item.href}
              className={`flex items-center space-x-2 font-medium py-2 text-sm tracking-wide transition-all duration-200 group ${
                isActive(item.name)
                  ? " text-primary"
                  : "text-gray-700 hover:text-primary"
              }`}
              onClick={() => onItemClick(item.name)}
            >
              <div
                className={
                  isActive(item.name)
                    ? "text-primary"
                    : "text-gray-600 group-hover:text-primary"
                }
              >
                {item.icon}
              </div>
              <span className="relative">
                {item.name}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                    isActive(item.name)
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </span>
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}