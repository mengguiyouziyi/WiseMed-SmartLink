'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User } from 'lucide-react';
import styles from './Header.module.css';

export function Header() {
    const { user } = useAuth();

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                {/* Breadcrumbs or Title could go here */}
            </div>

            <div className={styles.right}>
                <div className={styles.userProfile}>
                    <div className={styles.avatar}>
                        <User size={20} />
                    </div>
                    <div className={styles.userInfo}>
                        <span className={styles.username}>{user?.username || 'Guest'}</span>
                        <span className={styles.role}>{user?.role || 'Viewer'}</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
