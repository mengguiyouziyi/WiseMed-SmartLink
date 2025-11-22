'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { FileSearch, Download, Calendar, User, Activity } from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  ip: string;
  status: 'success' | 'failed';
}

export default function AuditLogsPage() {
  const [logs] = useState<AuditLog[]>([
    { id: '1', timestamp: '2025-11-22 10:30:15', user: '张医生', action: '创建病历', resource: '患者ID: 12345', ip: '192.168.1.100', status: 'success' },
    { id: '2', timestamp: '2025-11-22 10:25:42', user: '李护士', action: '修改患者信息', resource: '患者ID: 12346', ip: '192.168.1.101', status: 'success' },
    { id: '3', timestamp: '2025-11-22 10:20:18', user: '王管理员', action: '删除用户', resource: '用户ID: 789', ip: '192.168.1.102', status: 'success' },
    { id: '4', timestamp: '2025-11-22 10:15:33', user: 'admin', action: '登录失败', resource: '系统登录', ip: '192.168.1.200', status: 'failed' },
    { id: '5', timestamp: '2025-11-22 10:10:55', user: '赵医生', action: '查看病历', resource: '患者ID: 12347', ip: '192.168.1.103', status: 'success' },
  ]);

  return (
    <div className="p-8 max-w-[1800px] mx-auto">
      <div className="mb-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl shadow-lg">
              <FileSearch size={36} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                审计日志
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                查看和导出系统操作日志
              </p>
            </div>
          </div>
          <button className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors">
            <Download size={20} />
            导出日志
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  今日操作
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {logs.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Activity size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  成功操作
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {logs.filter(l => l.status === 'success').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <Activity size={24} className="text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  失败操作
                </p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {logs.filter(l => l.status === 'failed').length}
                </p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                <Activity size={24} className="text-red-600 dark:text-red-400" />
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
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {new Set(logs.map(l => l.user)).size}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <User size={24} className="text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">操作日志</CardTitle>
            <div className="flex gap-3">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="date"
                  className="pl-10 pr-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />
              </div>
              <select className="px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-100">
                <option>全部操作</option>
                <option>登录</option>
                <option>创建</option>
                <option>修改</option>
                <option>删除</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                    时间
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                    用户
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                    操作
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                    资源
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                    IP地址
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                    状态
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-mono">
                      {log.timestamp}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                          <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm">
                            {log.user[0]}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{log.user}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {log.resource}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600 dark:text-gray-400">
                      {log.ip}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${log.status === 'success'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                        }`}>
                        {log.status === 'success' ? '成功' : '失败'}
                      </span>
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
