'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileText, Stethoscope, Pill, Search, User, Plus, Calendar } from 'lucide-react';
import styles from './page.module.css';

// Mock Data
const MOCK_PATIENTS = [
    { id: '1', name: '张三', age: 45, gender: '男', lastVisit: '2025-11-20', diagnosis: '高血压' },
    { id: '2', name: '李四', age: 32, gender: '女', lastVisit: '2025-11-18', diagnosis: '上呼吸道感染' },
    { id: '3', name: '王五', age: 67, gender: '男', lastVisit: '2025-11-15', diagnosis: '2型糖尿病' },
    { id: '4', name: '赵六', age: 28, gender: '女', lastVisit: '2025-11-10', diagnosis: '过敏性鼻炎' },
];

const MOCK_RECORDS = {
    '1': [
        { id: 'r1', date: '2025-11-20', type: '复诊', content: '患者自述血压控制良好，无头晕头痛。BP: 130/80 mmHg。建议继续目前治疗方案。' },
        { id: 'r2', date: '2025-10-20', type: '初诊', content: '患者因头晕就诊。BP: 160/100 mmHg。诊断为原发性高血压。' },
    ],
    '2': [
        { id: 'r3', date: '2025-11-18', type: '初诊', content: '咽痛、咳嗽3天。体温37.8℃。咽部充血。诊断为急性上呼吸道感染。' },
    ],
};

const MOCK_PRESCRIPTIONS = {
    '1': [
        { id: 'p1', date: '2025-11-20', medicines: ['氨氯地平片 5mg x 14片', '缬沙坦胶囊 80mg x 14粒'] },
    ],
    '2': [
        { id: 'p2', date: '2025-11-18', medicines: ['阿莫西林胶囊 0.5g x 24粒', '复方甘草片 x 1瓶'] },
    ],
};

export default function EMRPage() {
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'record' | 'prescription' | 'lab'>('record');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPatients = MOCK_PATIENTS.filter(p =>
        p.name.includes(searchTerm) || p.diagnosis.includes(searchTerm)
    );

    const selectedPatient = MOCK_PATIENTS.find(p => p.id === selectedPatientId);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.heading}>电子病历 (EMR)</h1>
                <p className={styles.subtitle}>
                    患者病历管理、处方开具与检查申请
                </p>
            </div>

            <div className={styles.mainContent}>
                {/* Left Panel: Patient List */}
                <div className={styles.patientListPanel}>
                    <div className={styles.searchBox}>
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="搜索患者姓名或诊断..."
                                className={`${styles.searchInput} pl-8`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={styles.patientList}>
                        {filteredPatients.map(patient => (
                            <div
                                key={patient.id}
                                className={`${styles.patientItem} ${selectedPatientId === patient.id ? styles.active : ''}`}
                                onClick={() => setSelectedPatientId(patient.id)}
                            >
                                <div className={styles.patientName}>{patient.name}</div>
                                <div className={styles.patientInfo}>
                                    {patient.gender} | {patient.age}岁 | {patient.diagnosis}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel: Details */}
                <div className={styles.detailsPanel}>
                    {selectedPatient ? (
                        <>
                            <Card>
                                <CardContent className="p-6">
                                    <div className={styles.patientHeader}>
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                <User size={24} />
                                            </div>
                                            <div>
                                                <div className={styles.patientTitle}>{selectedPatient.name}</div>
                                                <div className="text-sm text-gray-500">
                                                    ID: {selectedPatient.id} | 最近就诊: {selectedPatient.lastVisit}
                                                </div>
                                            </div>
                                        </div>
                                        <Button>
                                            <Plus size={16} className="mr-2" />
                                            新建记录
                                        </Button>
                                    </div>

                                    <div className={styles.tabs}>
                                        <div
                                            className={`${styles.tab} ${activeTab === 'record' ? styles.active : ''}`}
                                            onClick={() => setActiveTab('record')}
                                        >
                                            <FileText size={16} className="inline mr-2" />
                                            病历记录
                                        </div>
                                        <div
                                            className={`${styles.tab} ${activeTab === 'prescription' ? styles.active : ''}`}
                                            onClick={() => setActiveTab('prescription')}
                                        >
                                            <Pill size={16} className="inline mr-2" />
                                            处方记录
                                        </div>
                                        <div
                                            className={`${styles.tab} ${activeTab === 'lab' ? styles.active : ''}`}
                                            onClick={() => setActiveTab('lab')}
                                        >
                                            <Stethoscope size={16} className="inline mr-2" />
                                            检查申请
                                        </div>
                                    </div>

                                    <div className="min-h-[300px]">
                                        {activeTab === 'record' && (
                                            <div className="space-y-4">
                                                {MOCK_RECORDS[selectedPatient.id as keyof typeof MOCK_RECORDS]?.map(record => (
                                                    <Card key={record.id} className={styles.recordCard}>
                                                        <CardContent className="p-4">
                                                            <div className={styles.recordHeader}>
                                                                <span className="font-bold">{record.type}</span>
                                                                <span className={styles.recordDate}>
                                                                    <Calendar size={14} className="inline mr-1" />
                                                                    {record.date}
                                                                </span>
                                                            </div>
                                                            <p className={styles.recordContent}>{record.content}</p>
                                                        </CardContent>
                                                    </Card>
                                                )) || <div className="text-center text-gray-500 py-8">暂无记录</div>}
                                            </div>
                                        )}

                                        {activeTab === 'prescription' && (
                                            <div className="space-y-4">
                                                {MOCK_PRESCRIPTIONS[selectedPatient.id as keyof typeof MOCK_PRESCRIPTIONS]?.map(prescription => (
                                                    <Card key={prescription.id} className={styles.recordCard}>
                                                        <CardContent className="p-4">
                                                            <div className={styles.recordHeader}>
                                                                <span className="font-bold">处方单</span>
                                                                <span className={styles.recordDate}>{prescription.date}</span>
                                                            </div>
                                                            <ul className="list-disc list-inside space-y-1 mt-2">
                                                                {prescription.medicines.map((med, idx) => (
                                                                    <li key={idx}>{med}</li>
                                                                ))}
                                                            </ul>
                                                        </CardContent>
                                                    </Card>
                                                )) || <div className="text-center text-gray-500 py-8">暂无处方</div>}
                                            </div>
                                        )}

                                        {activeTab === 'lab' && (
                                            <div className={styles.emptyState}>
                                                <Stethoscope size={48} className="mb-4 opacity-20" />
                                                <p>暂无检查申请记录</p>
                                                <Button variant="outline" className="mt-4">
                                                    <Plus size={16} className="mr-2" />
                                                    开具检查
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    ) : (
                        <div className={styles.emptyState}>
                            <User size={64} className="mb-4 opacity-20" />
                            <p className="text-lg">请从左侧选择一位患者</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
