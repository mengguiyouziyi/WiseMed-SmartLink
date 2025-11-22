'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Calendar, Clock, User, Plus, CheckCircle } from 'lucide-react';

const MOCK_APPOINTMENTS = [
    { id: '1', time: '09:00', patient: '张三', type: '初诊', status: 'confirmed' },
    { id: '2', time: '09:30', patient: '李四', type: '复诊', status: 'confirmed' },
    { id: '3', time: '10:00', patient: '王五', type: '体检', status: 'pending' },
    { id: '4', time: '10:30', patient: '赵六', type: '初诊', status: 'confirmed' },
    { id: '5', time: '11:00', patient: '钱七', type: '复诊', status: 'completed' },
];

export default function AppointmentPage() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);

    const inputClass = "w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent transition-all";
    const labelClass = "block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300";

    return (
        <div className="p-8 max-w-[1400px] mx-auto">
            <div className="mb-10">
                <h1 className="flex items-center gap-4 text-4xl font-bold text-gray-900 dark:text-white mb-3">
                    <div className="p-3 bg-primary/10 rounded-xl">
                        <Calendar size={36} className="text-primary" />
                    </div>
                    预约管理
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 ml-[68px]">
                    查看和管理患者预约信息
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Calendar & New Appointment */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
                            <CardTitle className="text-xl">选择日期</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className={inputClass}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
                            <CardTitle className="text-xl">新增预约</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div>
                                <label className={labelClass}>患者姓名</label>
                                <input type="text" placeholder="请输入患者姓名" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>预约时间</label>
                                <input type="time" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>就诊类型</label>
                                <select className={inputClass}>
                                    <option>初诊</option>
                                    <option>复诊</option>
                                    <option>体检</option>
                                </select>
                            </div>
                            <Button className="w-full py-3">
                                <Plus size={18} className="mr-2" />
                                添加预约
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Appointment List */}
                <Card className="lg:col-span-2">
                    <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
                        <CardTitle className="text-xl">今日预约列表</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-3">
                            {appointments.map(apt => (
                                <div
                                    key={apt.id}
                                    className="flex items-center justify-between p-5 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-2 text-primary font-bold text-lg min-w-[80px]">
                                            <Clock size={20} />
                                            {apt.time}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <User size={18} className="text-gray-400" />
                                            <span className="font-semibold text-gray-900 dark:text-white">{apt.patient}</span>
                                        </div>
                                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                                            {apt.type}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {apt.status === 'completed' && (
                                            <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
                                                <CheckCircle size={18} />
                                                已完成
                                            </span>
                                        )}
                                        {apt.status === 'confirmed' && (
                                            <Button size="sm" className="px-4">开始接诊</Button>
                                        )}
                                        {apt.status === 'pending' && (
                                            <Button size="sm" variant="outline" className="px-4">确认</Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
