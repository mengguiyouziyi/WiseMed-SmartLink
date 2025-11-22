'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { BarChart3, TrendingUp, Users, Activity, Clock } from 'lucide-react';
import styles from '../../ai/models/page.module.css';

export default function BusinessMonitoringPage() {
  const metrics = [
    { label: '今日访问量', value: '12,847', change: '+12.5%', trend: 'up' },
    { label: '活跃用户', value: '3,421', change: '+8.2%', trend: 'up' },
    { label: 'API 调用', value: '45,231', change: '+15.3%', trend: 'up' },
    { label: '平均响应时间', value: '156ms', change: '-5.2%', trend: 'down' },
  ];

  const topServices = [
    { name: 'ASR 转录', calls: 15234, percentage: 34 },
    { name: '医疗影像分析', calls: 12847, percentage: 28 },
    { name: '文本翻译', calls: 8932, percentage: 20 },
    { name: 'TTS 合成', calls: 5421, percentage: 12 },
    { name: '其他', calls: 2797, percentage: 6 },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>
            <BarChart3 size={32} />
            业务监控
          </h1>
          <p className={styles.subtitle}>
            业务指标和统计分析
          </p>
        </div>
      </div>

      {/* 关键指标 */}
      <div className={styles.statsGrid}>
        {metrics.map((metric, index) => (
          <Card key={index} className={styles.statCard}>
            <CardContent>
              <div className={styles.statInfo}>
                <div className={styles.statLabel}>{metric.label}</div>
                <div className={styles.statValue}>{metric.value}</div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: metric.trend === 'up' ? 'var(--success)' : 'var(--info)',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}>
                  {metric.trend === 'up' ? <TrendingUp size={16} /> : <TrendingUp size={16} style={{ transform: 'rotate(180deg)' }} />}
                  <span>{metric.change}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 服务使用统计 */}
      <Card>
        <CardHeader>
          <CardTitle>服务使用排行</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {topServices.map((service, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ minWidth: '120px', fontWeight: 500 }}>{service.name}</div>
                <div style={{ flex: 1, height: '32px', background: 'var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${service.percentage}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--primary), var(--primary-light))',
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: '1rem',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    transition: 'width 0.5s'
                  }}>
                    {service.percentage}%
                  </div>
                </div>
                <div style={{ minWidth: '80px', textAlign: 'right', color: 'var(--text-secondary)' }}>
                  {service.calls.toLocaleString()} 次
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 时段分析 */}
      <Card>
        <CardHeader>
          <CardTitle>24小时访问趋势</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '0.5rem',
            height: '200px',
            padding: '1rem 0'
          }}>
            {Array.from({ length: 24 }, (_, i) => {
              const height = Math.random() * 80 + 20;
              return (
                <div key={i} style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <div style={{
                    width: '100%',
                    height: `${height}%`,
                    background: 'linear-gradient(180deg, var(--primary), var(--primary-light))',
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.3s'
                  }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                    {i}h
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
