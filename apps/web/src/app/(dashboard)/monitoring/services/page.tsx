'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Cpu, Activity, CheckCircle, XCircle, Clock } from 'lucide-react';
import styles from '../../ai/models/page.module.css';

interface Service {
  name: string;
  status: 'healthy' | 'unhealthy' | 'starting';
  uptime: string;
  cpu: number;
  memory: number;
  requests: number;
}

export default function ServicesMonitoringPage() {
  const services: Service[] = [
    { name: 'web-service', status: 'healthy', uptime: '2d 5h', cpu: 12, memory: 45, requests: 15234 },
    { name: 'auth-service', status: 'healthy', uptime: '2d 5h', cpu: 5, memory: 28, requests: 8932 },
    { name: 'ai-infer-service', status: 'healthy', uptime: '2d 5h', cpu: 35, memory: 62, requests: 3421 },
    { name: 'asr-tts-nmt-service', status: 'starting', uptime: '0h', cpu: 0, memory: 0, requests: 0 },
    { name: 'translation-service', status: 'healthy', uptime: '2d 5h', cpu: 8, memory: 34, requests: 1247 },
    { name: 'pacs-gw-service', status: 'healthy', uptime: '2d 5h', cpu: 3, memory: 22, requests: 892 },
    { name: 'postgres', status: 'healthy', uptime: '2d 5h', cpu: 15, memory: 58, requests: 45231 },
    { name: 'redpanda', status: 'unhealthy', uptime: '0h', cpu: 0, memory: 0, requests: 0 },
  ];

  const getStatusIcon = (status: Service['status']) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle size={16} style={{ color: 'var(--success)' }} />;
      case 'unhealthy':
        return <XCircle size={16} style={{ color: 'var(--error)' }} />;
      case 'starting':
        return <Clock size={16} style={{ color: 'var(--warning)' }} />;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>
            <Cpu size={32} />
            服务监控
          </h1>
          <p className={styles.subtitle}>
            实时监控系统服务状态
          </p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <CardContent>
            <div className={styles.statIcon}>
              <Activity size={24} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{services.length}</div>
              <div className={styles.statLabel}>总服务数</div>
            </div>
          </CardContent>
        </Card>

        <Card className={styles.statCard}>
          <CardContent>
            <div className={styles.statIcon} style={{ background: 'var(--success-bg)' }}>
              <CheckCircle size={24} style={{ color: 'var(--success)' }} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{services.filter(s => s.status === 'healthy').length}</div>
              <div className={styles.statLabel}>健康</div>
            </div>
          </CardContent>
        </Card>

        <Card className={styles.statCard}>
          <CardContent>
            <div className={styles.statIcon} style={{ background: 'var(--error-bg)' }}>
              <XCircle size={24} style={{ color: 'var(--error)' }} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{services.filter(s => s.status === 'unhealthy').length}</div>
              <div className={styles.statLabel}>异常</div>
            </div>
          </CardContent>
        </Card>

        <Card className={styles.statCard}>
          <CardContent>
            <div className={styles.statIcon} style={{ background: 'var(--primary-bg)' }}>
              <Cpu size={24} style={{ color: 'var(--primary)' }} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>
                {Math.round(services.reduce((sum, s) => sum + s.cpu, 0) / services.length)}%
              </div>
              <div className={styles.statLabel}>平均 CPU</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>服务列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>服务名称</th>
                  <th>状态</th>
                  <th>运行时间</th>
                  <th>CPU 使用率</th>
                  <th>内存使用率</th>
                  <th>请求数</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.name}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                        <Cpu size={16} />
                        <code>{service.name}</code>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {getStatusIcon(service.status)}
                        <span>{service.status}</span>
                      </div>
                    </td>
                    <td>{service.uptime}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                          flex: 1,
                          height: '6px',
                          background: 'var(--border)',
                          borderRadius: '3px',
                          overflow: 'hidden',
                          maxWidth: '100px'
                        }}>
                          <div style={{
                            width: `${service.cpu}%`,
                            height: '100%',
                            background: service.cpu > 70 ? 'var(--error)' : service.cpu > 50 ? 'var(--warning)' : 'var(--success)'
                          }} />
                        </div>
                        <span style={{ fontSize: '0.875rem' }}>{service.cpu}%</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                          flex: 1,
                          height: '6px',
                          background: 'var(--border)',
                          borderRadius: '3px',
                          overflow: 'hidden',
                          maxWidth: '100px'
                        }}>
                          <div style={{
                            width: `${service.memory}%`,
                            height: '100%',
                            background: service.memory > 70 ? 'var(--error)' : service.memory > 50 ? 'var(--warning)' : 'var(--info)'
                          }} />
                        </div>
                        <span style={{ fontSize: '0.875rem' }}>{service.memory}%</span>
                      </div>
                    </td>
                    <td>{service.requests.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
