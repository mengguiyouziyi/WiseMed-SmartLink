'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Users, Plus, Edit, Trash2, Search, Shield, Mail, Phone } from 'lucide-react';
import styles from './page.module.css';

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      username: 'admin',
      name: '系统管理员',
      email: 'admin@wisemed.com',
      phone: '138****8888',
      role: '超级管理员',
      department: '技术部',
      status: 'active',
      lastLogin: '2 分钟前',
      createdAt: '2024-01-01',
    },
    {
      id: '2',
      username: 'doctor_zhang',
      name: '张医生',
      email: 'zhang@wisemed.com',
      phone: '139****6666',
      role: '医生',
      department: '影像科',
      status: 'active',
      lastLogin: '1 小时前',
      createdAt: '2024-03-15',
    },
    {
      id: '3',
      username: 'nurse_li',
      name: '李护士',
      email: 'li@wisemed.com',
      phone: '136****5555',
      role: '护士',
      department: '门诊部',
      status: 'active',
      lastLogin: '3 小时前',
      createdAt: '2024-05-20',
    },
    {
      id: '4',
      username: 'tech_wang',
      name: '王工程师',
      email: 'wang@wisemed.com',
      phone: '137****7777',
      role: '技术支持',
      department: '技术部',
      status: 'inactive',
      lastLogin: '2 天前',
      createdAt: '2024-02-10',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (userId: string) => {
    if (confirm('确定要删除此用户吗？')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        return { ...u, status: u.status === 'active' ? 'inactive' : 'active' as User['status'] };
      }
      return u;
    }));
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case '超级管理员':
        return styles.roleAdmin;
      case '医生':
        return styles.roleDoctor;
      case '护士':
        return styles.roleNurse;
      default:
        return styles.roleDefault;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>
            <Users size={32} />
            用户管理
          </h1>
          <p className={styles.subtitle}>
            管理系统用户和权限
          </p>
        </div>
        <Button leftIcon={<Plus size={20} />} onClick={() => setShowAddModal(true)}>
          添加用户
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <CardContent>
            <div className={styles.statIcon}>
              <Users size={24} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{users.length}</div>
              <div className={styles.statLabel}>总用户数</div>
            </div>
          </CardContent>
        </Card>

        <Card className={styles.statCard}>
          <CardContent>
            <div className={styles.statIcon} style={{ background: 'var(--success-bg)' }}>
              <Users size={24} style={{ color: 'var(--success)' }} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{users.filter(u => u.status === 'active').length}</div>
              <div className={styles.statLabel}>活跃用户</div>
            </div>
          </CardContent>
        </Card>

        <Card className={styles.statCard}>
          <CardContent>
            <div className={styles.statIcon} style={{ background: 'var(--warning-bg)' }}>
              <Shield size={24} style={{ color: 'var(--warning)' }} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{users.filter(u => u.role === '超级管理员').length}</div>
              <div className={styles.statLabel}>管理员</div>
            </div>
          </CardContent>
        </Card>

        <Card className={styles.statCard}>
          <CardContent>
            <div className={styles.statIcon} style={{ background: 'var(--info-bg)' }}>
              <Users size={24} style={{ color: 'var(--info)' }} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{users.filter(u => u.role === '医生').length}</div>
              <div className={styles.statLabel}>医生</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和筛选 */}
      <Card className={styles.searchCard}>
        <CardContent>
          <div className={styles.searchBar}>
            <Search size={20} />
            <input
              type="text"
              placeholder="搜索用户名、姓名或邮箱..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </CardContent>
      </Card>

      {/* 用户列表 */}
      <Card>
        <CardHeader>
          <CardTitle>用户列表 ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>用户名</th>
                  <th>姓名</th>
                  <th>角色</th>
                  <th>部门</th>
                  <th>联系方式</th>
                  <th>状态</th>
                  <th>最后登录</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className={styles.username}>
                        <Users size={16} />
                        <span>{user.username}</span>
                      </div>
                    </td>
                    <td>{user.name}</td>
                    <td>
                      <span className={`${styles.roleBadge} ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>{user.department}</td>
                    <td>
                      <div className={styles.contact}>
                        <div>
                          <Mail size={14} />
                          <span>{user.email}</span>
                        </div>
                        <div>
                          <Phone size={14} />
                          <span>{user.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <button
                        className={`${styles.statusBadge} ${user.status === 'active' ? styles.statusActive : styles.statusInactive}`}
                        onClick={() => handleToggleStatus(user.id)}
                      >
                        {user.status === 'active' ? '活跃' : '停用'}
                      </button>
                    </td>
                    <td>{user.lastLogin}</td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.actionBtn}
                          onClick={() => setEditingUser(user)}
                          title="编辑"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className={styles.actionBtn}
                          onClick={() => handleDelete(user.id)}
                          title="删除"
                        >
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

      {/* 添加/编辑用户模态框 */}
      {(showAddModal || editingUser) && (
        <div className={styles.modal} onClick={() => { setShowAddModal(false); setEditingUser(null); }}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>{editingUser ? '编辑用户' : '添加新用户'}</h2>
            <p className={styles.modalDesc}>填写用户信息</p>

            <div className={styles.form}>
              <div className={styles.formGroup}>
                <label>用户名</label>
                <input type="text" placeholder="输入用户名" defaultValue={editingUser?.username} />
              </div>
              <div className={styles.formGroup}>
                <label>姓名</label>
                <input type="text" placeholder="输入姓名" defaultValue={editingUser?.name} />
              </div>
              <div className={styles.formGroup}>
                <label>邮箱</label>
                <input type="email" placeholder="输入邮箱" defaultValue={editingUser?.email} />
              </div>
              <div className={styles.formGroup}>
                <label>电话</label>
                <input type="tel" placeholder="输入电话" defaultValue={editingUser?.phone} />
              </div>
              <div className={styles.formGroup}>
                <label>角色</label>
                <select defaultValue={editingUser?.role}>
                  <option>超级管理员</option>
                  <option>医生</option>
                  <option>护士</option>
                  <option>技术支持</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>部门</label>
                <input type="text" placeholder="输入部门" defaultValue={editingUser?.department} />
              </div>
            </div>

            <div className={styles.modalActions}>
              <Button variant="secondary" onClick={() => { setShowAddModal(false); setEditingUser(null); }}>
                取消
              </Button>
              <Button>
                {editingUser ? '保存' : '添加'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
