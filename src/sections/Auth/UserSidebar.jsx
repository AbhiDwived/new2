"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { IoMdLogOut } from 'react-icons/io';
import { FaUser } from 'react-icons/fa';
import { VscChecklist } from 'react-icons/vsc';
import { FaPeopleGroup } from 'react-icons/fa6';
import { TbDeviceImacSearch, TbBaselineDensityMedium } from 'react-icons/tb';
import { IoMdSettings } from 'react-icons/io';

const UserSidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const menuItems = [
        { to: '/mywedding', label: 'My Wedding' },
        { to: '/profile', label: 'Profile', icon: <FaUser /> },
        { to: '/overview', label: 'Overview', icon: <TbDeviceImacSearch /> },
        { to: '/checklist', label: 'Checklist', icon: <VscChecklist /> },
        { to: '/vendors', label: 'Vendors' },
        { to: '/guestlist', label: 'Guest List', icon: <FaPeopleGroup /> },
        { to: '/setting', label: 'Settings', icon: <IoMdSettings /> },
        { to: '/logout', label: 'Logout', icon: <IoMdLogOut /> },
    ];

    return (
        <aside
            className={` top-0 left-0  bg-black shadow-md transition-all duration-300 z-50 ${isSidebarOpen ? 'w-64' : 'w-20'}`}
        >
            {/* Toggle Button */}
            <div className="flex items-center justify-between p-4">
                <h1
                    className={`text-white text-xl font-bold  transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}
                >
                    User 
                </h1>
                <button onClick={toggleSidebar} className="text-gray-700">
                    <TbBaselineDensityMedium className="w-6 h-6" />
                </button>
            </div>

            {/* Menu */}
            <nav className="mt-4">
                <ul className="space-y-2 p-2">
                    {menuItems.map(({ to, label, icon }) => (
                        <li key={to}>
                            <Link
                                href={to}
                                style={{ textDecoration: 'none' }}
                                className="flex items-center gap-3 p-2 text-white hover:bg-cyan-900  rounded-md transition-all duration-200"
                            >
                                <span className="text-lg">{icon || '🔗'}</span>
                                <span
                                    className={`whitespace-nowrap transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'
                                        }`}
                                >
                                    {label}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

        </aside>
    );
};

export default UserSidebar;
