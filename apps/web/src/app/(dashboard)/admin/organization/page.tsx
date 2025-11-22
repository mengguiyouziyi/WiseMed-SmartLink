'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Building, Plus, Edit, Trash2, Users } from 'lucide-react';
import styles from '../users/page.module.css';

interface Department {
  id: string;
  name: string;
  parent?: string;
  staff: number;
  head: string;
}

export default function OrganizationPage() {
  const [departments] = useState<Department[]>([
    { id: '1', name: '技术部', staff: 12, head: '王工程师' },
    { id: '2', name: '影像科', staff: 8, head: '张主任' },
    { id: '3', name: '门诊部', staff: 15, head: '李主任' },
    { id: '4', name: '急诊科', staff: 20, head: '赵医生' },
  ]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>
            <Building size={32} />
            组织管理
          </h1>
          <p className={styles.subtitle}>
            管理机构和科室信息
          </p>
        </div>
        <Button leftIcon={<Plus size={20} />}>
          添加部门
        </Button>
      </div>

      {/* 统计 */}
      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <CardContent>
            <div className={styles.statIcon}>
              <Building size={24} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{departments.length}</div>
              <div className={styles.statLabel}>部门数量</div>
            </div>
          </CardContent>
        </Card>

        <Card className={styles.statCard}>
          <CardContent>
            <div className={styles.statIcon} style={{ background: 'var(--info-bg)' }}>
              <Users size={24} style={{ color: 'var(--info)' }} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{departments.reduce((sum, d) => sum + d.staff, 0)}</div>
              <div className={styles.statLabel}>总员工数</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 部门列表 */}
      <Card>
        <CardHeader>
          <CardTitle>部门列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>部门名称</th>
                  <th>负责人</th>
                  <th>员工数</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept) => (
                  <tr key={dept.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                        <Building size={16} />
                        <span>{dept.name}</span>
                      </div>
                    </td>
                    <td>{dept.head}</td>
                    <td>{dept.staff} 人</td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.actionBtn} title="编辑">
                          <Edit size={16} />
                        </button>
                        <button className={styles.actionBtn} title="删除">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
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
