'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
    BarChart3,
    FolderKanban,
    FileSpreadsheet,
    ChevronLeft,
    ChevronRight,
    Building2,
    Menu,
    X,
    GanttChartSquare,
    LogOut
} from 'lucide-react';
import clsx from 'clsx';
import { useSidebar } from '@/contexts/SidebarContext';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
    name: string;
    nameTh: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
}

const navigation: NavItem[] = [
    { name: 'Projects', nameTh: 'Projects', href: '/projects', icon: FolderKanban },
    { name: 'Procurement', nameTh: 'Procurement', href: '/procurement', icon: BarChart3 },
    { name: 'Orders', nameTh: 'Orders', href: '/orders', icon: FileSpreadsheet },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useAuth();
    const { collapsed, toggleCollapsed } = useSidebar();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [brandName, setBrandName] = useState('Powertec');
    const [brandLogoBase64, setBrandLogoBase64] = useState('');

    const activeHref = useMemo(() => {
        const matches = navigation
            .map((item) => {
                const isMatch = pathname === item.href || pathname.startsWith(`${item.href}/`);
                if (isMatch) return item.href;
                return null;
            })
            .filter((value): value is string => value !== null);

        if (matches.length === 0) return null;
        return matches.sort((a, b) => b.length - a.length)[0];
    }, [pathname]);

    useEffect(() => {
        const loadBranding = () => {
            try {
                const stored = localStorage.getItem('srt-hst-settings');
                if (!stored) {
                    setBrandName('Powertec');
                    setBrandLogoBase64('');
                    return;
                }

                const parsed = JSON.parse(stored) as {
                    company?: {
                        name?: string;
                        logoBase64?: string;
                    };
                };

                setBrandName(parsed.company?.name?.trim() || 'Powertec');
                setBrandLogoBase64(parsed.company?.logoBase64 || '');
            } catch {
                setBrandName('Powertec');
                setBrandLogoBase64('');
            }
        };

        const handleSettingsUpdate = () => loadBranding();
        loadBranding();
        window.addEventListener('storage', handleSettingsUpdate);
        window.addEventListener('srt-hst-settings-updated', handleSettingsUpdate);
        return () => {
            window.removeEventListener('storage', handleSettingsUpdate);
            window.removeEventListener('srt-hst-settings-updated', handleSettingsUpdate);
        };
    }, []);

    const handleLogout = () => {
        logout();
        setMobileOpen(false);
        router.push('/login');
    };

    const navContent = (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-200">
                <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center overflow-hidden relative">
                    {brandLogoBase64 ? (
                        <Image
                            src={brandLogoBase64}
                            alt={brandName}
                            fill
                            unoptimized
                            sizes="36px"
                            className="object-cover"
                        />
                    ) : (
                        <Building2 className="w-5 h-5 text-white" />
                    )}
                </div>
                {!collapsed && (
                    <div>
                        <h3 className="text-gray-900 font-semibold text-base">{brandName}</h3>
                        <p className="text-gray-600 text-xs">Construction MS</p>
                    </div>
                )}
            </div>

            <nav className="flex-1 p-3 space-y-3 overflow-y-auto">
                {navigation.map((item) => {
                    const isActive = item.href === activeHref;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={clsx(
                                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm',
                                isActive
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                            )}
                            onClick={() => setMobileOpen(false)}
                        >
                            <item.icon className={clsx(
                                'w-5 h-5 shrink-0',
                                isActive ? 'text-blue-600' : 'text-gray-500'
                            )} />

                            {!collapsed && (
                                <div className="flex flex-col">
                                    <span className="leading-none">{item.name}</span>
                                    <span className={clsx(
                                        'text-[10px] mt-0.5',
                                        isActive ? 'text-blue-500' : 'text-gray-400'
                                    )}>
                                        {item.nameTh}
                                    </span>
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-3 border-t border-gray-200 space-y-2">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors text-sm"
                >
                    <LogOut className="w-4 h-4" />
                    {!collapsed && <span>Logout</span>}
                </button>

                <button
                    onClick={toggleCollapsed}
                    className="w-full items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors text-sm hidden lg:flex"
                >
                    {collapsed ? (
                        <ChevronRight className="w-4 h-4" />
                    ) : (
                        <>
                            <ChevronLeft className="w-4 h-4" />
                            <span>Collapse</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );

    return (
        <>
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden fixed top-3 left-4 z-50 p-2 rounded-lg bg-white border border-gray-200 text-gray-700 shadow-sm"
            >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/20 z-40"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <aside data-layout-sidebar className={clsx(
                'hidden lg:block fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-200 z-40',
                collapsed ? 'w-16' : 'w-56'
            )}>
                {navContent}
            </aside>

            <aside data-layout-sidebar className={clsx(
                'lg:hidden fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-200 z-50',
                mobileOpen ? 'translate-x-0' : '-translate-x-full'
            )}>
                {navContent}
            </aside>
        </>
    );
}
