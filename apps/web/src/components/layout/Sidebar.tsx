'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight, LogOut } from 'lucide-react';
import { navigationConfig } from '@/config/navigation';
import { MenuItem, SubMenuItem } from '@/types/navigation';
import styles from './Sidebar.module.css';

export function Sidebar() {
    const pathname = usePathname();
    const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());

    const toggleMenu = (menuId: string) => {
        setExpandedMenus((prev) => {
            const next = new Set(prev);
            if (next.has(menuId)) {
                next.delete(menuId);
            } else {
                next.add(menuId);
            }
            return next;
        });
    };

    const isActive = (path: string) => {
        return pathname === path || pathname.startsWith(path + '/');
    };

    const isMenuActive = (item: MenuItem) => {
        if (item.path && isActive(item.path)) return true;
        if (item.subItems) {
            return item.subItems.some((sub) => isActive(sub.path));
        }
        return false;
    };

    const renderSubMenu = (subItems: SubMenuItem[]) => {
        return (
            <ul className={styles.subMenu}>
                {subItems.map((subItem) => {
                    const Icon = subItem.icon;
                    const active = isActive(subItem.path);

                    return (
                        <li key={subItem.id}>
                            <Link
                                href={subItem.path}
                                className={`${styles.subMenuItem} ${active ? styles.active : ''}`}
                            >
                                {Icon && <Icon size={16} />}
                                <span>{subItem.label}</span>
                                {subItem.badge && (
                                    <span className={styles.badge}>{subItem.badge}</span>
                                )}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        );
    };

    const renderMenuItem = (item: MenuItem) => {
        const Icon = item.icon;
        const hasSubItems = item.subItems && item.subItems.length > 0;
        const isExpanded = expandedMenus.has(item.id);
        const active = isMenuActive(item);

        if (!hasSubItems && item.path) {
            return (
                <li key={item.id}>
                    <Link
                        href={item.path}
                        className={`${styles.menuItem} ${active ? styles.active : ''}`}
                    >
                        <Icon size={20} />
                        <span>{item.label}</span>
                        {item.badge && <span className={styles.badge}>{item.badge}</span>}
                    </Link>
                </li>
            );
        }

        return (
            <li key={item.id}>
                <button
                    onClick={() => toggleMenu(item.id)}
                    className={`${styles.menuItem} ${active ? styles.active : ''}`}
                >
                    <Icon size={20} />
                    <span>{item.label}</span>
                    {item.badge && <span className={styles.badge}>{item.badge}</span>}
                    {hasSubItems && (
                        <span className={styles.chevron}>
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </span>
                    )}
                </button>
                {hasSubItems && isExpanded && renderSubMenu(item.subItems!)}
            </li>
        );
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <h1>WiseMed</h1>
                <p>智慧医疗平台</p>
            </div>

            <nav className={styles.nav}>
                <ul className={styles.menu}>
                    {navigationConfig.mainMenu.map(renderMenuItem)}
                </ul>
            </nav>

            <div className={styles.footer}>
                <button className={styles.logoutButton}>
                    <LogOut size={20} />
                    <span>退出登录</span>
                </button>
            </div>
        </aside>
    );
}
