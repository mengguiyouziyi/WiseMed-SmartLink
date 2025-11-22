'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Settings, Save, Shield, Database, Link } from 'lucide-react';

export default function SystemConfigPage() {
  const [activeTab, setActiveTab] = useState<'basic' | 'security' | 'integration'>('basic');

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="mb-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
              <Settings size={36} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                系统配置
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                配置系统参数、安全策略和集成设置
              </p>
            </div>
          </div>
          <Button className="px-6 py-3">
            <Save size={20} className="mr-2" />
            保存配置
          </Button>
        </div>
      </div>

      <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('basic')}
          className={`px-6 py-3 font-semibold transition-colors ${activeTab === 'basic'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
        >
          基础配置
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-6 py-3 font-semibold transition-colors ${activeTab === 'security'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
        >
          安全配置
        </button>
        <button
          onClick={() => setActiveTab('integration')}
          className={`px-6 py-3 font-semibold transition-colors ${activeTab === 'integration'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
        >
          集成配置
        </button>
      </div>

      {activeTab === 'basic' && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-xl">系统信息</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    系统名称
                  </label>
                  <input
                    type="text"
                    defaultValue="WiseMed-SmartLink"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    系统版本
                  </label>
                  <input
                    type="text"
                    defaultValue="v1.0.0"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    医院名称
                  </label>
                  <input
                    type="text"
                    defaultValue="示范医院"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    联系电话
                  </label>
                  <input
                    type="text"
                    defaultValue="400-123-4567"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-xl">业务配置</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">启用预约功能</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">允许患者在线预约</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">启用AI分析</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">使用AI进行影像分析</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Shield size={24} className="text-primary-600" />
                <CardTitle className="text-xl">密码策略</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    最小密码长度
                  </label>
                  <input
                    type="number"
                    defaultValue="8"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    密码有效期（天）
                  </label>
                  <input
                    type="number"
                    defaultValue="90"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-xl">会话管理</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    会话超时（分钟）
                  </label>
                  <input
                    type="number"
                    defaultValue="30"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    最大登录失败次数
                  </label>
                  <input
                    type="number"
                    defaultValue="5"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'integration' && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Database size={24} className="text-primary-600" />
                <CardTitle className="text-xl">PACS 集成</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    PACS 服务器地址
                  </label>
                  <input
                    type="text"
                    defaultValue="http://pacs-gw-service:8005"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    AE Title
                  </label>
                  <input
                    type="text"
                    defaultValue="WISEMED"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Link size={24} className="text-primary-600" />
                <CardTitle className="text-xl">AI 服务集成</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    AI 推理服务地址
                  </label>
                  <input
                    type="text"
                    defaultValue="http://ai-infer-service:8002"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    翻译服务地址
                  </label>
                  <input
                    type="text"
                    defaultValue="http://translation-service:8004"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
