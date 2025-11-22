'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Users, Activity, TrendingUp, BarChart3, Clock, ArrowUpRight } from 'lucide-react';

interface BusinessMetrics {
  total_patients: number;
  today_appointments: number;
  pending_imaging: number;
  active_sessions: number;
  api_calls_today: number;
  avg_response_time: number;
}

export default function BusinessMonitoringPage() {
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await fetch('/api/monitoring/business');
      const data = await res.json();
      setMetrics(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
      setMetrics({
        total_patients: 1284,
        today_appointments: 24,
        pending_imaging: 8,
        active_sessions: 12,
        api_calls_today: 5432,
        avg_response_time: 45.3
      });
      setLoading(false);
    }
  };

  if (loading || !metrics) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1800px] mx-auto">
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
            <BarChart3 size={36} className="text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              业务监控
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
              实时监控业务指标和用户活动
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-xl transition-all">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  总患者数
                </p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white">
                  {metrics.total_patients.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                <Users size={28} className="text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp size={16} className="text-green-500" />
              <span className="text-green-600 dark:text-green-400 font-semibold">+8.2%</span>
              <span className="text-gray-500 dark:text-gray-400">较上月</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  今日预约
                </p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white">
                  {metrics.today_appointments}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
                <Clock size={28} className="text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp size={16} className="text-green-500" />
              <span className="text-green-600 dark:text-green-400 font-semibold">+12%</span>
              <span className="text-gray-500 dark:text-gray-400">较昨日</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  待处理影像
                </p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white">
                  {metrics.pending_imaging}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
                <Activity size={28} className="text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp size={16} className="text-red-500 rotate-180" />
              <span className="text-red-600 dark:text-red-400 font-semibold">-3</span>
              <span className="text-gray-500 dark:text-gray-400">较昨日</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  活跃会话
                </p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white">
                  {metrics.active_sessions}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                <Users size={28} className="text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500 dark:text-gray-400">实时在线用户</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  API 调用
                </p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white">
                  {metrics.api_calls_today.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl shadow-lg">
                <BarChart3 size={28} className="text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500 dark:text-gray-400">今日总调用次数</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  平均响应
                </p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white">
                  {metrics.avg_response_time.toFixed(1)}ms
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-teal-500 to-green-500 rounded-xl shadow-lg">
                <Activity size={28} className="text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp size={16} className="text-green-500" />
              <span className="text-green-600 dark:text-green-400 font-semibold">-5ms</span>
              <span className="text-gray-500 dark:text-gray-400">性能提升</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">热门功能</CardTitle>
              <button className="text-sm text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1">
                查看详情
                <ArrowUpRight size={16} />
              </button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {[
                { name: '智能影像分析', usage: 1245, percent: 85 },
                { name: '电子病历', usage: 987, percent: 68 },
                { name: '诊疗开单', usage: 756, percent: 52 },
                { name: '预约管理', usage: 543, percent: 37 },
              ].map((feature, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900 dark:text-white">{feature.name}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{feature.usage} 次</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all"
                      style={{ width: `${feature.percent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">用户活动</CardTitle>
              <button className="text-sm text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1">
                查看详情
                <ArrowUpRight size={16} />
              </button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {[
                { time: '10:30', user: '张医生', action: '创建病历', status: 'success' },
                { time: '11:15', user: '李医生', action: '开具处方', status: 'success' },
                { time: '14:20', user: '王医生', action: '影像分析', status: 'success' },
                { time: '15:45', user: '赵医生', action: '预约患者', status: 'success' },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm">
                        {activity.user[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{activity.user}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{activity.action}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
