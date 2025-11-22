'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Activity, Users, FileText, Server } from 'lucide-react';
import styles from './page.module.css';

const STATS = [
    { label: '活跃会话', value: '12', icon: Users, color: 'text-blue-500' },
    { label: '已处理影像', value: '1,284', icon: FileText, color: 'text-green-500' },
    { label: '系统状态', value: '健康', icon: Activity, color: 'text-emerald-500' },
    { label: 'API 延迟', value: '45ms', icon: Server, color: 'text-purple-500' },
];

export default function DashboardPage() {
    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>系统概览</h1>

            <div className={styles.grid}>
                {STATS.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.label} className={styles.statCard}>
                            <CardContent className={styles.statContent}>
                                <div className={styles.statInfo}>
                                    <p className={styles.statLabel}>{stat.label}</p>
                                    <p className={styles.statValue}>{stat.value}</p>
                                </div>
                                <div className={styles.iconWrapper}>
                                    <Icon size={24} />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className={styles.section}>
                <Card className={styles.chartCard}>
                    <CardHeader>
                        <CardTitle>近期活动</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={styles.placeholderChart}>
                            图表占位符 (即将集成 Recharts/Chart.js)
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
