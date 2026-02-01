import React from 'react';

const Navbar: React.FC = () => {
    return (
        <div className="navbar bg-base-100 shadow-sm">
            {/* Navbar Start */}
            <div className="navbar-start">
                <div className="dropdown">
                    {/* Mobile Dropdown Button */}
                    <div
                        tabIndex={0}
                        role="button"
                        className="btn btn-ghost lg:hidden"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h8m-8 6h16"
                            />
                        </svg>
                    </div>

                    {/* Mobile Menu */}
                    <ul
                        tabIndex={-1}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
                    >
                        <li><a href="#">Item 1</a></li>
                        <li>
                            <a href="#">Parent</a>
                            <ul className="p-2">
                                <li><a href="#">Submenu 1</a></li>
                                <li><a href="#">Submenu 2</a></li>
                            </ul>
                        </li>
                        <li><a href="#">Item 3</a></li>
                    </ul>
                </div>

                {/* Logo */}
                <a className="btn btn-ghost text-xl">daisyUI</a>
            </div>

            {/* Navbar Center - Desktop */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><a href="#">Item 1</a></li>
                    <li>
                        <details>
                            <summary>Parent</summary>
                            <ul className="p-2 bg-base-100 w-40 z-10">
                                <li><a href="#">Submenu 1</a></li>
                                <li><a href="#">Submenu 2</a></li>
                            </ul>
                        </details>
                    </li>
                    <li><a href="#">Item 3</a></li>
                </ul>
            </div>

            {/* Navbar End */}
            <div className="navbar-end">
                <button className='btn btn-accent text-white'>Login</button>
            </div>
        </div>
    );
};

export default Navbar;