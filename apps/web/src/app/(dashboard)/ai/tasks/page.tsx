'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Clock, CheckCircle, XCircle, Loader, Filter } from 'lucide-react';
import styles from '../models/page.module.css';

interface Task {
  id: string;
  type: string;
  model: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  createdAt: string;
  completedAt?: string;
  duration?: string;
  user: string;
}

export default function TasksPage() {
  const [tasks] = useState<Task[]>([
    {
      id: 'task-001',
      type: 'ASR 转录',
      model: 'Whisper Large-v3',
      status: 'completed',
      progress: 100,
      createdAt: '10:30:25',
      completedAt: '10:30:28',
      duration: '3.2s',
      user: '张医生',
    },
    {
      id: 'task-002',
      type: '医疗影像分析',
      model: 'DenseNet121',
      status: 'running',
      progress: 65,
      createdAt: '10:32:15',
      user: '李医生',
    },
    {
      id: 'task-003',
      type: '文本翻译',
      model: 'MarianMT',
      status: 'pending',
      progress: 0,
      createdAt: '10:33:01',
      user: '王护士',
    },
  ]);

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} style={{ color: 'var(--success)' }} />;
      case 'failed':
        return <XCircle size={16} style={{ color: 'var(--error)' }} />;
      case 'running':
        return <Loader size={16} style={{ color: 'var(--primary)' }} className={styles.spinning} />;
      default:
        return <Clock size={16} style={{ color: 'var(--text-tertiary)' }} />;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>
            <Clock size={32} />
            推理任务
          </h1>
          <p className={styles.subtitle}>
            查看和管理 AI 推理任务
          </p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <CardContent>
            <div className={styles.statIcon}>
              <Clock size={24} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{tasks.length}</div>
              <div className={styles.statLabel}>总任务数</div>
            </div>
          </CardContent>
        </Card>

        <Card className={styles.statCard}>
          <CardContent>
            <div className={styles.statIcon} style={{ background: 'var(--primary-bg)' }}>
              <Loader size={24} style={{ color: 'var(--primary)' }} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{tasks.filter(t => t.status === 'running').length}</div>
              <div className={styles.statLabel}>运行中</div>
            </div>
          </CardContent>
        </Card>

        <Card className={styles.statCard}>
          <CardContent>
            <div className={styles.statIcon} style={{ background: 'var(--success-bg)' }}>
              <CheckCircle size={24} style={{ color: 'var(--success)' }} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{tasks.filter(t => t.status === 'completed').length}</div>
              <div className={styles.statLabel}>已完成</div>
            </div>
          </CardContent>
        </Card>

        <Card className={styles.statCard}>
          <CardContent>
            <div className={styles.statIcon} style={{ background: 'var(--warning-bg)' }}>
              <Clock size={24} style={{ color: 'var(--warning)' }} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{tasks.filter(t => t.status === 'pending').length}</div>
              <div className={styles.statLabel}>等待中</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>任务列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>任务 ID</th>
                  <th>类型</th>
                  <th>模型</th>
                  <th>状态</th>
                  <th>进度</th>
                  <th>用户</th>
                  <th>创建时间</th>
                  <th>耗时</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td><code>{task.id}</code></td>
                    <td>{task.type}</td>
                    <td>{task.model}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {getStatusIcon(task.status)}
                        <span>{task.status}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                          flex: 1,
                          height: '6px',
                          background: 'var(--border)',
                          borderRadius: '3px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${task.progress}%`,
                            height: '100%',
                            background: 'var(--primary)',
                            transition: 'width 0.3s'
                          }} />
                        </div>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          {task.progress}%
                        </span>
                      </div>
                    </td>
                    <td>{task.user}</td>
                    <td>{task.createdAt}</td>
                    <td>{task.duration || '-'}</td>
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
