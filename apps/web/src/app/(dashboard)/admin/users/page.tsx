'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Users, Plus, Search, Edit, Trash2, Shield, Mail, Phone } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: '张医生', email: 'zhang@hospital.com', phone: '138****1234', role: 'doctor', department: '内科', status: 'active', createdAt: '2025-01-15' },
    { id: '2', name: '李护士', email: 'li@hospital.com', phone: '139****5678', role: 'nurse', department: '急诊科', status: 'active', createdAt: '2025-02-20' },
    { id: '3', name: '王管理员', email: 'wang@hospital.com', phone: '136****9012', role: 'admin', department: '信息科', status: 'active', createdAt: '2025-01-01' },
    { id: '4', name: '赵医生', email: 'zhao@hospital.com', phone: '137****3456', role: 'doctor', department: '外科', status: 'inactive', createdAt: '2025-03-10' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredUsers = users.filter(user =>
    user.name.includes(searchTerm) ||
    user.email.includes(searchTerm) ||
    user.department.includes(searchTerm)
  );

  const getRoleBadge = (role: string) => {
    const badges = {
      admin: { label: '管理员', class: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
      doctor: { label: '医生', class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
      nurse: { label: '护士', class: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
    };
    return badges[role as keyof typeof badges] || { label: role, class: 'bg-gray-100 text-gray-700' };
  };

  return (
    <div className="p-8 max-w-[1800px] mx-auto">
      <div className="mb-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-lg">
              <Users size={36} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                用户管理
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                管理系统用户、角色和权限
              </p>
            </div>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="px-6 py-3">
            <Plus size={20} className="mr-2" />
            新增用户
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  总用户数
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {users.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Users size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  活跃用户
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {users.filter(u => u.status === 'active').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <Users size={24} className="text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  医生
                </p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {users.filter(u => u.role === 'doctor').length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Shield size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  管理员
                </p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {users.filter(u => u.role === 'admin').length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <Shield size={24} className="text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">用户列表</CardTitle>
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="搜索用户、邮箱或科室..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    用户
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    联系方式
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    角色
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    科室
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map((user) => {
                  const roleBadge = getRoleBadge(user.role);
                  return (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold">
                            {user.name[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">ID: {user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Mail size={14} />
                            <span>{user.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Phone size={14} />
                            <span>{user.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${roleBadge.class}`}>
                          {roleBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-900 dark:text-white font-medium">{user.department}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${user.status === 'active'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                          {user.status === 'active' ? '活跃' : '停用'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                            <Edit size={18} />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
