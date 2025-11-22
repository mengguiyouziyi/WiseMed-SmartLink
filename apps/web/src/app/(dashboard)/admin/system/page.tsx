'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Sliders } from 'lucide-react';
import styles from './page.module.css';

export default function admin_systemPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>
            <Sliders size={32} />
            系统配置
          </h1>
          <p className={styles.subtitle}>
            系统基础配置和参数
          </p>
        </div>
      </div>

      <div className={styles.content}>
        <Card>
          <CardContent>
            <div className={styles.placeholder}>
              <Sliders size={48} />
              <p>系统配置功能开发中...</p>
              <span>即将上线，敬请期待</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
