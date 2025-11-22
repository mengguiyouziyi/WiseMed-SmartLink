'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { FileSearch } from 'lucide-react';
import styles from './page.module.css';

export default function admin_auditPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>
            <FileSearch size={32} />
            审计日志
          </h1>
          <p className={styles.subtitle}>
            查看系统操作日志
          </p>
        </div>
      </div>

      <div className={styles.content}>
        <Card>
          <CardContent>
            <div className={styles.placeholder}>
              <FileSearch size={48} />
              <p>审计日志功能开发中...</p>
              <span>即将上线，敬请期待</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
