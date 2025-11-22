'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ShieldAlert, Pill, Plus, X, CheckCircle, AlertTriangle } from 'lucide-react';

// Mock Drug Database
const DRUG_DB = [
    { id: '1', name: '阿司匹林 (Aspirin)', type: '抗血小板' },
    { id: '2', name: '华法林 (Warfarin)', type: '抗凝血' },
    { id: '3', name: '布洛芬 (Ibuprofen)', type: 'NSAID' },
    { id: '4', name: '阿莫西林 (Amoxicillin)', type: '抗生素' },
    { id: '5', name: '头孢拉定 (Cefradine)', type: '抗生素' },
    { id: '6', name: '硝酸甘油 (Nitroglycerin)', type: '血管扩张' },
    { id: '7', name: '西地那非 (Sildenafil)', type: 'PDE5抑制剂' },
];

// Mock Interactions
const INTERACTIONS: Record<string, string> = {
    '1-2': '【严重】阿司匹林与华法林合用会显著增加出血风险。',
    '1-3': '【中度】布洛芬可能会减弱阿司匹林的心血管保护作用，并增加胃肠道出血风险。',
    '6-7': '【禁忌】硝酸甘油与西地那非合用会导致血压急剧下降，危及生命。',
};

export default function DrugInteractionPage() {
    const [selectedDrugs, setSelectedDrugs] = useState<typeof DRUG_DB>([]);
    const [results, setResults] = useState<string[]>([]);
    const [isChecking, setIsChecking] = useState(false);

    const addDrug = (drugId: string) => {
        const drug = DRUG_DB.find(d => d.id === drugId);
        if (drug && !selectedDrugs.find(d => d.id === drugId)) {
            setSelectedDrugs(prev => [...prev, drug]);
            setResults([]); // Clear previous results
        }
    };

    const removeDrug = (drugId: string) => {
        setSelectedDrugs(prev => prev.filter(d => d.id !== drugId));
        setResults([]);
    };

    const handleCheck = () => {
        setIsChecking(true);
        setTimeout(() => {
            const newResults: string[] = [];

            // Simple O(N^2) check for demo
            for (let i = 0; i < selectedDrugs.length; i++) {
                for (let j = i + 1; j < selectedDrugs.length; j++) {
                    const id1 = selectedDrugs[i].id;
                    const id2 = selectedDrugs[j].id;
                    const key1 = `${id1}-${id2}`;
                    const key2 = `${id2}-${id1}`;

                    if (INTERACTIONS[key1]) newResults.push(INTERACTIONS[key1]);
                    if (INTERACTIONS[key2]) newResults.push(INTERACTIONS[key2]);
                }
            }

            if (newResults.length === 0 && selectedDrugs.length > 1) {
                newResults.push('【安全】未发现明显的药物相互作用。');
            } else if (selectedDrugs.length <= 1) {
                newResults.push('请至少选择两种药物进行检查。');
            }

            setResults(newResults);
            setIsChecking(false);
        }, 1000);
    };

    return (
        <div className="p-8 max-w-[1000px] mx-auto">
            <div className="mb-8">
                <h1 className="flex items-center gap-4 text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    <ShieldAlert size={32} className="text-primary" />
                    用药安全检查
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    检测处方药物之间的潜在相互作用与禁忌
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Drug Selection */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Pill size={20} />
                            选择药物
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {DRUG_DB.map(drug => (
                                    <button
                                        key={drug.id}
                                        onClick={() => addDrug(drug.id)}
                                        disabled={!!selectedDrugs.find(d => d.id === drug.id)}
                                        className={`px-3 py-1 text-sm rounded-full border transition-colors
                                            ${selectedDrugs.find(d => d.id === drug.id)
                                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                                : 'bg-white hover:bg-primary/10 border-gray-300 text-gray-700 hover:border-primary'
                                            }
                                        `}
                                    >
                                        {drug.name}
                                    </button>
                                ))}
                            </div>

                            <div className="min-h-[200px] p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800">
                                <h3 className="text-sm font-medium text-gray-500 mb-3">已选药物清单：</h3>
                                {selectedDrugs.length === 0 ? (
                                    <div className="text-center text-gray-400 py-8">
                                        请从上方点击添加药物
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {selectedDrugs.map(drug => (
                                            <div key={drug.id} className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded shadow-sm">
                                                <span className="font-medium">{drug.name}</span>
                                                <button
                                                    onClick={() => removeDrug(drug.id)}
                                                    className="text-gray-400 hover:text-red-500"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Button
                                onClick={handleCheck}
                                disabled={isChecking || selectedDrugs.length < 2}
                                className="w-full"
                            >
                                {isChecking ? '正在分析...' : '开始检查'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Right: Results */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldAlert size={20} />
                            检查结果
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-full min-h-[300px] flex flex-col">
                            {results.length > 0 ? (
                                <div className="space-y-4">
                                    {results.map((result, idx) => (
                                        <div
                                            key={idx}
                                            className={`p-4 rounded-lg border flex items-start gap-3
                                                ${result.includes('【安全】')
                                                    ? 'bg-green-50 border-green-200 text-green-800'
                                                    : result.includes('【严重】') || result.includes('【禁忌】')
                                                        ? 'bg-red-50 border-red-200 text-red-800'
                                                        : 'bg-orange-50 border-orange-200 text-orange-800'
                                                }
                                            `}
                                        >
                                            {result.includes('【安全】') ? (
                                                <CheckCircle size={20} className="mt-0.5 shrink-0" />
                                            ) : (
                                                <AlertTriangle size={20} className="mt-0.5 shrink-0" />
                                            )}
                                            <p>{result}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                                    <ShieldAlert size={48} className="mb-4 opacity-20" />
                                    <p>结果将显示在这里</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
