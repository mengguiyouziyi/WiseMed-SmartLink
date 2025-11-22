'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import {
    Activity, Users, FileText, Server, TrendingUp, Calendar,
    Clock, AlertCircle, CheckCircle, ArrowUpRight
} from 'lucide-react';

const STATS = [
    {
        label: '今日接诊',
        value: '24',
        change: '+12%',
        trend: 'up',
        icon: Users,
        gradient: 'from-blue-500 to-cyan-500',
        bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20'
    },
    {
        label: '待处理影像',
        value: '8',
        change: '-3',
        trend: 'down',
        icon: FileText,
        gradient: 'from-purple-500 to-pink-500',
        bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20'
    },
    {
        label: '系统健康度',
        value: '98%',
        change: '+2%',
        trend: 'up',
        icon: Activity,
        gradient: 'from-green-500 to-emerald-500',
        bgGradient: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20'
    },
    {
        label: 'API 响应',
        value: '45ms',
        change: '-5ms',
        trend: 'up',
        icon: Server,
        gradient: 'from-orange-500 to-red-500',
        bgGradient: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20'
    },
];

const RECENT_ACTIVITIES = [
    { id: 1, type: 'appointment', patient: '张三', time: '10:30', status: 'completed', icon: CheckCircle, color: 'text-green-500' },
    { id: 2, type: 'imaging', patient: '李四', time: '11:15', status: 'pending', icon: Clock, color: 'text-orange-500' },
    { id: 3, type: 'prescription', patient: '王五', time: '14:20', status: 'completed', icon: CheckCircle, color: 'text-green-500' },
    { id: 4, type: 'alert', patient: '赵六', time: '15:45', status: 'urgent', icon: AlertCircle, color: 'text-red-500' },
];

const QUICK_ACTIONS = [
    { label: '新增患者', icon: Users, href: '/clinical/patient-registration', color: 'bg-blue-500 hover:bg-blue-600' },
    { label: '开具处方', icon: FileText, href: '/clinical/prescription', color: 'bg-purple-500 hover:bg-purple-600' },
    { label: '预约管理', icon: Calendar, href: '/clinical/appointments', color: 'bg-green-500 hover:bg-green-600' },
    { label: '影像分析', icon: Activity, href: '/imaging', color: 'bg-orange-500 hover:bg-orange-600' },
];

export default function DashboardPage() {
    return (
        <div className="p-8 max-w-[1800px] mx-auto">
            {/* Page Header */}
            <div className="mb-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            工作台
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            欢迎回来，今天是 {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:border-primary-500 hover:text-primary-600 transition-all">
                            查看报表
                        </button>
                        <button className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all">
                            快速接诊
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {STATS.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card
                            key={stat.label}
                            className="relative overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50 group-hover:opacity-70 transition-opacity`}></div>
                            <CardContent className="relative pt-6 pb-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                                            {stat.label}
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                            {stat.value}
                                        </p>
                                    </div>
                                    <div className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg`}>
                                        <Icon size={24} className="text-white" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center gap-1 text-sm font-semibold ${stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                        }`}>
                                        <TrendingUp size={16} className={stat.trend === 'down' ? 'rotate-180' : ''} />
                                        {stat.change}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        较昨日
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activities */}
                <Card className="lg:col-span-2 hover:shadow-lg transition-shadow">
                    <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl font-bold">近期活动</CardTitle>
                            <button className="text-sm text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1">
                                查看全部
                                <ArrowUpRight size={16} />
                            </button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            {RECENT_ACTIVITIES.map((activity) => {
                                const Icon = activity.icon;
                                return (
                                    <div
                                        key={activity.id}
                                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg ${activity.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30' :
                                                    activity.status === 'pending' ? 'bg-orange-100 dark:bg-orange-900/30' :
                                                        'bg-red-100 dark:bg-red-900/30'
                                                }`}>
                                                <Icon size={20} className={activity.color} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {activity.patient}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {activity.type === 'appointment' && '预约就诊'}
                                                    {activity.type === 'imaging' && '影像检查'}
                                                    {activity.type === 'prescription' && '处方开具'}
                                                    {activity.type === 'alert' && '紧急提醒'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {activity.time}
                                            </p>
                                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${activity.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                                    activity.status === 'pending' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                                                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                                }`}>
                                                {activity.status === 'completed' && '已完成'}
                                                {activity.status === 'pending' && '进行中'}
                                                {activity.status === 'urgent' && '紧急'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
                        <CardTitle className="text-2xl font-bold">快捷操作</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-3">
                            {QUICK_ACTIONS.map((action) => {
                                const Icon = action.icon;
                                return (
                                    <a
                                        key={action.label}
                                        href={action.href}
                                        className={`flex items-center gap-4 p-4 ${action.color} text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all cursor-pointer`}
                                    >
                                        <div className="p-2 bg-white/20 rounded-lg">
                                            <Icon size={24} />
                                        </div>
                                        <span className="font-semibold text-lg">{action.label}</span>
                                    </a>
                                );
                            })}
                        </div>

                        <div className="mt-6 p-4 bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-xl border-2 border-primary-200 dark:border-primary-800">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-primary-500 rounded-lg">
                                    <Activity size={20} className="text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white mb-1">
                                        系统提示
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        今日还有 3 个预约待确认，请及时处理。
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
