'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Building, Plus, Edit, Trash2, Users, Monitor } from 'lucide-react';

interface Department {
  id: string;
  name: string;
  head: string;
  staff: number;
  location: string;
}

interface Device {
  id: string;
  name: string;
  type: string;
  department: string;
  status: 'online' | 'offline' | 'maintenance';
}

export default function OrganizationPage() {
  const [activeTab, setActiveTab] = useState<'departments' | 'devices'>('departments');

  const departments: Department[] = [
    { id: '1', name: '内科', head: '张主任', staff: 15, location: '3楼东区' },
    { id: '2', name: '外科', head: '李主任', staff: 12, location: '4楼西区' },
    { id: '3', name: '急诊科', head: '王主任', staff: 20, location: '1楼' },
    { id: '4', name: '影像科', head: '赵主任', staff: 8, location: '2楼' },
  ];

  const devices: Device[] = [
    { id: '1', name: 'CT-01', type: 'CT扫描仪', department: '影像科', status: 'online' },
    { id: '2', name: 'MRI-01', type: 'MRI设备', department: '影像科', status: 'online' },
    { id: '3', name: 'X-RAY-01', type: 'X光机', department: '影像科', status: 'maintenance' },
    { id: '4', name: 'ECG-01', type: '心电图机', department: '内科', status: 'online' },
  ];

  return (
    <div className="p-8 max-w-[1800px] mx-auto">
      <div className="mb-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-teal-500 to-green-500 rounded-xl shadow-lg">
              <Building size={36} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                组织管理
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                管理科室、设备和组织架构
              </p>
            </div>
          </div>
          <Button className="px-6 py-3">
            <Plus size={20} className="mr-2" />
            {activeTab === 'departments' ? '新增科室' : '新增设备'}
          </Button>
        </div>
      </div>

      <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('departments')}
          className={`px-6 py-3 font-semibold transition-colors ${activeTab === 'departments'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
        >
          科室管理
        </button>
        <button
          onClick={() => setActiveTab('devices')}
          className={`px-6 py-3 font-semibold transition-colors ${activeTab === 'devices'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
        >
          设备管理
        </button>
      </div>

      {activeTab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {departments.map((dept) => (
            <Card key={dept.id} className="hover:shadow-xl transition-all">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{dept.name}</CardTitle>
                  <div className="flex gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                      <Edit size={16} />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">负责人</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{dept.head}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">员工数</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{dept.staff} 人</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">位置</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{dept.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'devices' && (
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                      设备名称
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                      类型
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                      所属科室
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                      状态
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {devices.map((device) => (
                    <tr key={device.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Monitor size={20} className="text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white">{device.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white">{device.type}</td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white">{device.department}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${device.status === 'online' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                            device.status === 'offline' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                              'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                          }`}>
                          {device.status === 'online' && '在线'}
                          {device.status === 'offline' && '离线'}
                          {device.status === 'maintenance' && '维护中'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                            <Edit size={18} />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                            <Trash2 size={18} />
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
      )}
    </div>
  );
}
