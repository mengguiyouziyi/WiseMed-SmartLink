'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Activity, Heart, Thermometer, Plus } from 'lucide-react';

// Mock trend data
const TREND_DATA = [
    { date: '11-15', sys: 120, dia: 80, hr: 72 },
    { date: '11-16', sys: 118, dia: 78, hr: 70 },
    { date: '11-17', sys: 122, dia: 82, hr: 75 },
    { date: '11-18', sys: 125, dia: 85, hr: 78 },
    { date: '11-19', sys: 120, dia: 80, hr: 72 },
    { date: '11-20', sys: 115, dia: 75, hr: 68 },
    { date: '11-21', sys: 118, dia: 78, hr: 70 },
];

export default function VitalsPage() {
    const [vitals, setVitals] = useState({
        systolic: '',
        diastolic: '',
        heartRate: '',
        temperature: '',
        spo2: '',
        respiratoryRate: '',
        weight: '',
        height: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setVitals(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Vitals submitted:', vitals);
        alert('生命体征录入成功！');
        setVitals({
            systolic: '',
            diastolic: '',
            heartRate: '',
            temperature: '',
            spo2: '',
            respiratoryRate: '',
            weight: '',
            height: ''
        });
    };

    return (
        <div className="p-8 max-w-[1200px] mx-auto">
            <div className="mb-8">
                <h1 className="flex items-center gap-4 text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    <Activity size={32} className="text-primary" />
                    生命体征监测
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    录入患者生命体征数据并查看历史趋势
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Input Form */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Plus size={20} />
                                新增记录
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">收缩压 (mmHg)</label>
                                        <input
                                            type="number"
                                            name="systolic"
                                            className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700"
                                            value={vitals.systolic}
                                            onChange={handleChange}
                                            placeholder="120"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">舒张压 (mmHg)</label>
                                        <input
                                            type="number"
                                            name="diastolic"
                                            className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700"
                                            value={vitals.diastolic}
                                            onChange={handleChange}
                                            placeholder="80"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">心率 (bpm)</label>
                                    <input
                                        type="number"
                                        name="heartRate"
                                        className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700"
                                        value={vitals.heartRate}
                                        onChange={handleChange}
                                        placeholder="75"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">体温 (°C)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        name="temperature"
                                        className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700"
                                        value={vitals.temperature}
                                        onChange={handleChange}
                                        placeholder="36.5"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">血氧 (%)</label>
                                        <input
                                            type="number"
                                            name="spo2"
                                            className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700"
                                            value={vitals.spo2}
                                            onChange={handleChange}
                                            placeholder="98"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">呼吸 (bpm)</label>
                                        <input
                                            type="number"
                                            name="respiratoryRate"
                                            className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700"
                                            value={vitals.respiratoryRate}
                                            onChange={handleChange}
                                            placeholder="16"
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full">
                                    提交记录
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Heart size={20} className="text-red-500" />
                                血压趋势
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[200px] w-full flex items-end justify-between gap-2 px-4 pt-8 pb-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                {TREND_DATA.map((data, index) => (
                                    <div key={index} className="flex flex-col items-center gap-2 w-full">
                                        <div className="relative w-4 bg-gray-200 dark:bg-gray-700 rounded-full h-[150px]">
                                            {/* Systolic Bar */}
                                            <div
                                                className="absolute bottom-0 w-full bg-red-400 rounded-full opacity-80"
                                                style={{ height: `${(data.sys / 180) * 100}%` }}
                                            ></div>
                                            {/* Diastolic Bar (Overlay) */}
                                            <div
                                                className="absolute bottom-0 w-full bg-blue-400 rounded-full opacity-80"
                                                style={{ height: `${(data.dia / 180) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-gray-500">{data.date}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-center gap-6 mt-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                    <span>收缩压</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                                    <span>舒张压</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Thermometer size={20} className="text-orange-500" />
                                心率趋势
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[150px] w-full flex items-end justify-between gap-2 px-4 pt-8 pb-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                {TREND_DATA.map((data, index) => (
                                    <div key={index} className="flex flex-col items-center gap-2 w-full">
                                        <div
                                            className="w-4 bg-orange-400 rounded-t-lg transition-all hover:bg-orange-500"
                                            style={{ height: `${(data.hr / 120) * 100}%` }}
                                        ></div>
                                        <span className="text-xs text-gray-500">{data.date}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
