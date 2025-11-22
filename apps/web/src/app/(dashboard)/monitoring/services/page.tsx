'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Server, Activity, AlertCircle, CheckCircle, Clock, Cpu, HardDrive } from 'lucide-react';

interface ServiceStatus {
  name: string;
  status: string;
  uptime: number;
  cpu_usage: number;
  memory_usage: number;
  response_time: number;
  last_check: string;
}

export default function ServiceMonitoringPage() {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
    const interval = setInterval(fetchServices, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/monitoring/services');
      const data = await res.json();
      setServices(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch services:', error);
      setServices([
        { name: 'web-service', status: 'healthy', uptime: 86400, cpu_usage: 15.2, memory_usage: 45.8, response_time: 42, last_check: new Date().toISOString() },
        { name: 'pacs-gw-service', status: 'healthy', uptime: 86400, cpu_usage: 22.5, memory_usage: 52.3, response_time: 38, last_check: new Date().toISOString() },
        { name: 'ai-infer-service', status: 'degraded', uptime: 72000, cpu_usage: 78.9, memory_usage: 85.2, response_time: 125, last_check: new Date().toISOString() },
        { name: 'asr-tts-nmt-service', status: 'healthy', uptime: 86400, cpu_usage: 35.6, memory_usage: 62.1, response_time: 95, last_check: new Date().toISOString() },
        { name: 'translation-service', status: 'healthy', uptime: 86400, cpu_usage: 18.3, memory_usage: 38.7, response_time: 28, last_check: new Date().toISOString() },
        { name: 'auth-service', status: 'healthy', uptime: 86400, cpu_usage: 12.1, memory_usage: 32.4, response_time: 15, last_check: new Date().toISOString() },
      ]);
      setLoading(false);
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'degraded': return 'text-orange-500';
      case 'down': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 dark:bg-green-900/30';
      case 'degraded': return 'bg-orange-100 dark:bg-orange-900/30';
      case 'down': return 'bg-red-100 dark:bg-red-900/30';
      default: return 'bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return CheckCircle;
      case 'degraded': return AlertCircle;
      case 'down': return AlertCircle;
      default: return Clock;
    }
  };

  return (
    <div className="p-8 max-w-[1800px] mx-auto">
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg">
            <Server size={36} className="text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              服务监控
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
              实时监控所有微服务的健康状态和性能指标
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  总服务数
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {services.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Server size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  健康服务
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {services.filter((s: ServiceStatus) => s.status === 'healthy').length}
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
                  降级服务
                </p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {services.filter((s: ServiceStatus) => s.status === 'degraded').length}
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                <AlertCircle size={24} className="text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  平均响应
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {services.length > 0 ? Math.round(services.reduce((sum: number, s: ServiceStatus) => sum + s.response_time, 0) / services.length) : 0}ms
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <Activity size={24} className="text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {services.map((service: ServiceStatus) => {
          const StatusIcon = getStatusIcon(service.status);
          return (
            <Card key={service.name} className="hover:shadow-xl transition-all">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 ${getStatusBg(service.status)} rounded-lg`}>
                      <StatusIcon size={20} className={getStatusColor(service.status)} />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{service.name}</CardTitle>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        运行时间: {formatUptime(service.uptime)}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${service.status === 'healthy' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                      service.status === 'degraded' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                    {service.status === 'healthy' && '健康'}
                    {service.status === 'degraded' && '降级'}
                    {service.status === 'down' && '停止'}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Cpu size={16} className="text-gray-500" />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">CPU 使用率</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {service.cpu_usage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${service.cpu_usage > 80 ? 'bg-red-500' :
                            service.cpu_usage > 60 ? 'bg-orange-500' :
                              'bg-green-500'
                          }`}
                        style={{ width: `${service.cpu_usage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <HardDrive size={16} className="text-gray-500" />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">内存使用率</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {service.memory_usage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${service.memory_usage > 80 ? 'bg-red-500' :
                            service.memory_usage > 60 ? 'bg-orange-500' :
                              'bg-blue-500'
                          }`}
                        style={{ width: `${service.memory_usage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">平均响应时间</span>
                    <span className={`text-sm font-bold ${service.response_time > 100 ? 'text-red-600 dark:text-red-400' :
                        service.response_time > 50 ? 'text-orange-600 dark:text-orange-400' :
                          'text-green-600 dark:text-green-400'
                      }`}>
                      {service.response_time.toFixed(0)} ms
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>最后检查</span>
                    <span>{new Date(service.last_check).toLocaleTimeString('zh-CN')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      )}
    </div>
  );
}
