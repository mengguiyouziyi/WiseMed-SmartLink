'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Bell, AlertTriangle, Info, CheckCircle, X, Clock } from 'lucide-react';

interface Alert {
  id: string;
  severity: string;
  service: string;
  message: string;
  timestamp: string;
  resolved: boolean;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<'all' | 'unresolved' | 'resolved'>('unresolved');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, [filter]);

  const fetchAlerts = async () => {
    try {
      const url = filter === 'all' ? '/api/monitoring/alerts' : `/api/monitoring/alerts?resolved=${filter === 'resolved'}`;
      const res = await fetch(url);
      const data = await res.json();
      setAlerts(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
      setAlerts([
        { id: 'alert-1', severity: 'warning', service: 'ai-infer-service', message: 'GPU 使用率超过 80%', timestamp: new Date().toISOString(), resolved: false },
        { id: 'alert-2', severity: 'info', service: 'pacs-gw-service', message: '存储空间使用率 65%', timestamp: new Date().toISOString(), resolved: false },
        { id: 'alert-3', severity: 'critical', service: 'web-service', message: '响应时间超过 1000ms', timestamp: new Date(Date.now() - 3600000).toISOString(), resolved: true },
      ]);
      setLoading(false);
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      await fetch(`/api/monitoring/alerts/${alertId}/resolve`, { method: 'POST' });
      fetchAlerts();
    } catch (error) {
      console.error('Failed to resolve alert:', error);
      setAlerts(alerts.map(a => a.id === alertId ? { ...a, resolved: true } : a));
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return AlertTriangle;
      case 'warning': return Bell;
      case 'info': return Info;
      default: return Bell;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500';
      case 'warning': return 'text-orange-500';
      case 'info': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 dark:bg-red-900/30';
      case 'warning': return 'bg-orange-100 dark:bg-orange-900/30';
      case 'info': return 'bg-blue-100 dark:bg-blue-900/30';
      default: return 'bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const filteredAlerts = alerts;

  return (
    <div className="p-8 max-w-[1800px] mx-auto">
      <div className="mb-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl shadow-lg">
              <Bell size={36} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                告警管理
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                实时监控系统告警和异常事件
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">配置规则</Button>
            <Button>新建告警</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  未解决告警
                </p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {alerts.filter(a => !a.resolved).length}
                </p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                <AlertTriangle size={24} className="text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  已解决告警
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {alerts.filter(a => a.resolved).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  总告警数
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {alerts.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Bell size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">告警列表</CardTitle>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${filter === 'all'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
              >
                全部
              </button>
              <button
                onClick={() => setFilter('unresolved')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${filter === 'unresolved'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
              >
                未解决
              </button>
              <button
                onClick={() => setFilter('resolved')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${filter === 'resolved'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
              >
                已解决
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="text-center py-20">
              <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
              <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                暂无告警
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                系统运行正常，没有待处理的告警
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAlerts.map((alert) => {
                const SeverityIcon = getSeverityIcon(alert.severity);
                return (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-xl border-2 transition-all ${alert.resolved
                        ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30'
                        : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10'
                      }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`p-3 ${getSeverityBg(alert.severity)} rounded-lg`}>
                          <SeverityIcon size={24} className={getSeverityColor(alert.severity)} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${alert.severity === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                                alert.severity === 'warning' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                                  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                              }`}>
                              {alert.severity === 'critical' && '严重'}
                              {alert.severity === 'warning' && '警告'}
                              {alert.severity === 'info' && '信息'}
                            </span>
                            <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                              {alert.service}
                            </code>
                          </div>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {alert.message}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Clock size={14} />
                            <span>{new Date(alert.timestamp).toLocaleString('zh-CN')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {alert.resolved ? (
                          <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg font-semibold flex items-center gap-2">
                            <CheckCircle size={18} />
                            已解决
                          </span>
                        ) : (
                          <Button
                            onClick={() => resolveAlert(alert.id)}
                            size="sm"
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <CheckCircle size={18} className="mr-2" />
                            标记已解决
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
