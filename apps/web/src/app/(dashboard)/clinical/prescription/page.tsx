'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileText, Plus, Trash2, Save, Printer, Search } from 'lucide-react';

interface Medication {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    route: string;
    quantity: string;
}

interface LabTest {
    id: string;
    category: string;
    testName: string;
    urgency: string;
    notes: string;
}

export default function PrescriptionPage() {
    const [medications, setMedications] = useState<Medication[]>([]);
    const [labTests, setLabTests] = useState<LabTest[]>([]);
    const [activeTab, setActiveTab] = useState<'prescription' | 'lab'>('prescription');

    const [newMed, setNewMed] = useState<Medication>({
        id: '',
        name: '',
        dosage: '',
        frequency: '一日三次',
        duration: '7',
        route: '口服',
        quantity: ''
    });

    const [newTest, setNewTest] = useState<LabTest>({
        id: '',
        category: 'blood',
        testName: '',
        urgency: 'routine',
        notes: ''
    });

    const addMedication = () => {
        if (!newMed.name || !newMed.dosage || !newMed.quantity) {
            alert('请填写完整的药品信息');
            return;
        }
        setMedications([...medications, { ...newMed, id: Date.now().toString() }]);
        setNewMed({ id: '', name: '', dosage: '', frequency: '一日三次', duration: '7', route: '口服', quantity: '' });
    };

    const removeMedication = (id: string) => {
        setMedications(medications.filter(m => m.id !== id));
    };

    const addLabTest = () => {
        if (!newTest.testName) {
            alert('请填写检查项目名称');
            return;
        }
        setLabTests([...labTests, { ...newTest, id: Date.now().toString() }]);
        setNewTest({ id: '', category: 'blood', testName: '', urgency: 'routine', notes: '' });
    };

    const removeLabTest = (id: string) => {
        setLabTests(labTests.filter(t => t.id !== id));
    };

    const handleSave = () => {
        console.log('Prescription:', medications);
        console.log('Lab Tests:', labTests);
        alert('处方已保存（模拟）');
    };

    const handlePrint = () => {
        alert('打印处方（模拟）');
    };

    const inputClass = "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent transition-all";
    const labelClass = "block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300";

    return (
        <div className="p-8 max-w-[1600px] mx-auto">
            <div className="mb-10">
                <h1 className="flex items-center gap-4 text-4xl font-bold text-gray-900 dark:text-white mb-3">
                    <div className="p-3 bg-primary/10 rounded-xl">
                        <FileText size={36} className="text-primary" />
                    </div>
                    诊疗开单
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 ml-[68px]">
                    结构化处方开具与检查检验申请
                </p>
            </div>

            {/* Patient Info Card */}
            <Card className="mb-8">
                <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <CardTitle className="text-xl">患者信息</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div>
                            <label className={labelClass}>患者姓名</label>
                            <div className="flex gap-2">
                                <input type="text" placeholder="输入姓名或ID" className={inputClass} />
                                <Button size="sm" className="px-4">
                                    <Search size={18} />
                                </Button>
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>性别</label>
                            <input type="text" value="男" disabled className={inputClass + " bg-gray-100 dark:bg-gray-700"} />
                        </div>
                        <div>
                            <label className={labelClass}>年龄</label>
                            <input type="text" value="45 岁" disabled className={inputClass + " bg-gray-100 dark:bg-gray-700"} />
                        </div>
                        <div>
                            <label className={labelClass}>诊断</label>
                            <input type="text" placeholder="输入诊断" className={inputClass} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setActiveTab('prescription')}
                    className={`px-6 py-3 font-semibold transition-colors ${activeTab === 'prescription'
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                >
                    药品处方
                </button>
                <button
                    onClick={() => setActiveTab('lab')}
                    className={`px-6 py-3 font-semibold transition-colors ${activeTab === 'lab'
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                >
                    检查检验
                </button>
            </div>

            {/* Prescription Tab */}
            {activeTab === 'prescription' && (
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
                            <CardTitle className="text-xl">添加药品</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
                                <div className="md:col-span-2">
                                    <label className={labelClass}>药品名称 *</label>
                                    <input
                                        type="text"
                                        placeholder="搜索药品名称"
                                        className={inputClass}
                                        value={newMed.name}
                                        onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>剂量 *</label>
                                    <input
                                        type="text"
                                        placeholder="如: 500mg"
                                        className={inputClass}
                                        value={newMed.dosage}
                                        onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>频次</label>
                                    <select
                                        className={inputClass}
                                        value={newMed.frequency}
                                        onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                                    >
                                        <option>一日一次</option>
                                        <option>一日两次</option>
                                        <option>一日三次</option>
                                        <option>一日四次</option>
                                        <option>每8小时一次</option>
                                        <option>必要时</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>用法</label>
                                    <select
                                        className={inputClass}
                                        value={newMed.route}
                                        onChange={(e) => setNewMed({ ...newMed, route: e.target.value })}
                                    >
                                        <option>口服</option>
                                        <option>静脉注射</option>
                                        <option>肌肉注射</option>
                                        <option>皮下注射</option>
                                        <option>外用</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>天数</label>
                                    <input
                                        type="number"
                                        className={inputClass}
                                        value={newMed.duration}
                                        onChange={(e) => setNewMed({ ...newMed, duration: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                                <div>
                                    <label className={labelClass}>数量 *</label>
                                    <input
                                        type="text"
                                        placeholder="如: 21片"
                                        className={inputClass}
                                        value={newMed.quantity}
                                        onChange={(e) => setNewMed({ ...newMed, quantity: e.target.value })}
                                    />
                                </div>
                                <div className="flex items-end">
                                    <Button onClick={addMedication} className="w-full">
                                        <Plus size={18} className="mr-2" />
                                        添加
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {medications.length > 0 && (
                        <Card>
                            <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
                                <CardTitle className="text-xl">处方明细</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-3">
                                    {medications.map((med, idx) => (
                                        <div key={med.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <div className="flex-1 grid grid-cols-6 gap-4">
                                                <div className="col-span-2">
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">药品</div>
                                                    <div className="font-semibold text-gray-900 dark:text-white">{med.name}</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">剂量</div>
                                                    <div className="font-medium">{med.dosage}</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">频次</div>
                                                    <div className="font-medium">{med.frequency}</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">用法</div>
                                                    <div className="font-medium">{med.route}</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">数量</div>
                                                    <div className="font-medium">{med.quantity} ({med.duration}天)</div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeMedication(med.id)}
                                                className="ml-4 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            {/* Lab Test Tab */}
            {activeTab === 'lab' && (
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
                            <CardTitle className="text-xl">添加检查检验</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                <div>
                                    <label className={labelClass}>检查类别</label>
                                    <select
                                        className={inputClass}
                                        value={newTest.category}
                                        onChange={(e) => setNewTest({ ...newTest, category: e.target.value })}
                                    >
                                        <option value="blood">血液检查</option>
                                        <option value="urine">尿液检查</option>
                                        <option value="imaging">影像检查</option>
                                        <option value="ecg">心电图</option>
                                        <option value="ultrasound">超声检查</option>
                                        <option value="other">其他</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>检查项目 *</label>
                                    <input
                                        type="text"
                                        placeholder="输入检查项目"
                                        className={inputClass}
                                        value={newTest.testName}
                                        onChange={(e) => setNewTest({ ...newTest, testName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>紧急程度</label>
                                    <select
                                        className={inputClass}
                                        value={newTest.urgency}
                                        onChange={(e) => setNewTest({ ...newTest, urgency: e.target.value })}
                                    >
                                        <option value="routine">常规</option>
                                        <option value="urgent">紧急</option>
                                        <option value="stat">立即</option>
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <Button onClick={addLabTest} className="w-full">
                                        <Plus size={18} className="mr-2" />
                                        添加
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>备注</label>
                                <textarea
                                    rows={2}
                                    placeholder="输入检查说明或注意事项"
                                    className={inputClass}
                                    value={newTest.notes}
                                    onChange={(e) => setNewTest({ ...newTest, notes: e.target.value })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {labTests.length > 0 && (
                        <Card>
                            <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
                                <CardTitle className="text-xl">检查申请单</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-3">
                                    {labTests.map((test) => (
                                        <div key={test.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <div className="flex-1 grid grid-cols-4 gap-4">
                                                <div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">类别</div>
                                                    <div className="font-semibold text-gray-900 dark:text-white">
                                                        {test.category === 'blood' && '血液检查'}
                                                        {test.category === 'urine' && '尿液检查'}
                                                        {test.category === 'imaging' && '影像检查'}
                                                        {test.category === 'ecg' && '心电图'}
                                                        {test.category === 'ultrasound' && '超声检查'}
                                                        {test.category === 'other' && '其他'}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">项目</div>
                                                    <div className="font-medium">{test.testName}</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">紧急程度</div>
                                                    <div className={`inline-block px-2 py-1 rounded text-sm font-medium ${test.urgency === 'stat' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                                                            test.urgency === 'urgent' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                                                                'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                                        }`}>
                                                        {test.urgency === 'routine' && '常规'}
                                                        {test.urgency === 'urgent' && '紧急'}
                                                        {test.urgency === 'stat' && '立即'}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">备注</div>
                                                    <div className="font-medium text-sm">{test.notes || '-'}</div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeLabTest(test.id)}
                                                className="ml-4 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            {/* Action Buttons */}
            <div className="mt-10 flex justify-end gap-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                <Button variant="outline" onClick={() => window.history.back()} className="px-8 py-3">
                    取消
                </Button>
                <Button variant="outline" onClick={handlePrint} className="px-8 py-3">
                    <Printer size={20} className="mr-2" />
                    打印
                </Button>
                <Button onClick={handleSave} className="px-10 py-3 font-semibold">
                    <Save size={20} className="mr-2" />
                    保存处方
                </Button>
            </div>
        </div>
    );
}
