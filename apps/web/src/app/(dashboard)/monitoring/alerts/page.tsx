'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Bell, Plus, AlertTriangle, Info, XCircle, CheckCircle } from 'lucide-react';
import styles from '../../ai/models/page.module.css';

interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  service: string;
  time: string;
  status: 'active' | 'resolved';
}

export default function AlertsPage() {
  const [alerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'error',
      title: 'Redpanda 服务异常',
      message: '服务健康检查失败，可能存在端口冲突',
      service: 'redpanda',
      time: '2 分钟前',
      status: 'active',
    },
    {
      id: '2',
      type: 'warning',
      title: 'GPU 内存使用率过高',
      message: 'GPU 1 内存使用率达到 85%',
      service: 'asr-tts-nmt-service',
      time: '15 分钟前',
      status: 'active',
    },
    {
      id: '3',
      type: 'info',
      title: 'AI 模型更新完成',
      message: 'Whisper Large-v3 模型已成功更新到最新版本',
      service: 'ai-infer-service',
      time: '1 小时前',
      status: 'resolved',
    },
  ]);

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'error':
        return <XCircle size={20} style={{ color: 'var(--error)' }} />;
      case 'warning':
        return <AlertTriangle size={20} style={{ color: 'var(--warning)' }} />;
      case 'info':
        return <Info size={20} style={{ color: 'var(--info)' }} />;
    }
  };

  const getAlertColor = (type: Alert['type']) => {
    switch (type) {
      case 'error':
        return { bg: 'var(--error-bg)', color: 'var(--error)' };
      case 'warning':
        return { bg: 'var(--warning-bg)', color: 'var(--warning)' };
      case 'info':
        return { bg: 'var(--info-bg)', color: 'var(--info)' };
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>
            <Bell size={32} />
            告警管理
          </h1>
          <p className={styles.subtitle}>
            配置和管理系统告警
          </p>
        </div>
        <Button leftIcon={<Plus size={20} />}>
          添加告警规则
        </Button>
      </div>

      {/* 统计 */}
      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <CardContent>
            <div className={styles.statIcon}>
              <Bell size={24} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{alerts.length}</div>
              <div className={styles.statLabel}>总告警数</div>
            </div>
          </CardContent>
        </Card>

        <Card className={styles.statCard}>
          <CardContent>
            <div className={styles.statIcon} style={{ background: 'var(--error-bg)' }}>
              <XCircle size={24} style={{ color: 'var(--error)' }} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{alerts.filter(a => a.status === 'active' && a.type === 'error').length}</div>
              <div className={styles.statLabel}>严重告警</div>
            </div>
          </CardContent>
        </Card>

        <Card className={styles.statCard}>
          <CardContent>
            <div className={styles.statIcon} style={{ background: 'var(--warning-bg)' }}>
              <AlertTriangle size={24} style={{ color: 'var(--warning)' }} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{alerts.filter(a => a.status === 'active' && a.type === 'warning').length}</div>
              <div className={styles.statLabel}>警告</div>
            </div>
          </CardContent>
        </Card>

        <Card className={styles.statCard}>
          <CardContent>
            <div className={styles.statIcon} style={{ background: 'var(--success-bg)' }}>
              <CheckCircle size={24} style={{ color: 'var(--success)' }} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{alerts.filter(a => a.status === 'resolved').length}</div>
              <div className={styles.statLabel}>已解决</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 告警列表 */}
      <Card>
        <CardHeader>
          <CardTitle>告警历史</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {alerts.map((alert) => {
              const colors = getAlertColor(alert.type);
              return (
                <div key={alert.id} style={{
                  padding: '1rem',
                  border: `1px solid ${colors.bg}`,
                  borderRadius: '12px',
                  background: alert.status === 'active' ? colors.bg : 'transparent',
                  opacity: alert.status === 'resolved' ? 0.6 : 1
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ marginTop: '0.25rem' }}>
                      {getAlertIcon(alert.type)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <h3 style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {alert.title}
                        </h3>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          background: alert.status === 'active' ? colors.color : 'var(--success-bg)',
                          color: alert.status === 'active' ? 'white' : 'var(--success)'
                        }}>
                          {alert.status === 'active' ? '活跃' : '已解决'}
                        </span>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                        {alert.message}
                      </p>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
                        <span>服务: <code>{alert.service}</code></span>
                        <span>时间: {alert.time}</span>
                      </div>
                    </div>
                    {alert.status === 'active' && (
                      <Button variant="secondary" size="sm">
                        标记已解决
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
