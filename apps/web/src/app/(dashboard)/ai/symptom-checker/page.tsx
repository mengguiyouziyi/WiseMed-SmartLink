'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Brain, MessageSquare, Send, AlertTriangle } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
}

export default function SymptomCheckerPage() {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'ai', content: '您好，我是智能导诊助手。请描述您的症状，例如"头痛伴有发热"或"持续咳嗽三天"。' }
    ]);
    const [input, setInput] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsAnalyzing(true);

        // Mock AI Response
        setTimeout(() => {
            let aiResponse = '';
            if (input.includes('头痛') || input.includes('发热')) {
                aiResponse = '根据您的描述，可能涉及【神经内科】或【发热门诊】。建议监测体温，注意休息。如果体温超过38.5℃或头痛剧烈，请立即就医。';
            } else if (input.includes('咳嗽') || input.includes('喉咙')) {
                aiResponse = '症状指向【呼吸内科】。可能是上呼吸道感染。建议多喝水，避免辛辣食物。';
            } else if (input.includes('肚子') || input.includes('腹痛')) {
                aiResponse = '建议前往【消化内科】。请注意饮食卫生，避免生冷食物。';
            } else {
                aiResponse = '收到了您的描述。建议您前往【全科门诊】进行初步检查，由医生进行分诊。';
            }

            const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'ai', content: aiResponse };
            setMessages(prev => [...prev, aiMsg]);
            setIsAnalyzing(false);
        }, 1500);
    };

    return (
        <div className="p-8 max-w-[1000px] mx-auto h-[calc(100vh-64px)] flex flex-col">
            <div className="mb-6">
                <h1 className="flex items-center gap-4 text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    <Brain size={32} className="text-primary" />
                    智能导诊
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    基于 AI 的症状分析与科室推荐
                </p>
            </div>

            <Card className="flex-1 flex flex-col overflow-hidden">
                <CardContent className="flex-1 flex flex-col p-0">
                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900/50">
                        {messages.map(msg => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-4 rounded-lg ${msg.role === 'user'
                                            ? 'bg-primary text-white rounded-tr-none'
                                            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-tl-none shadow-sm'
                                        }`}
                                >
                                    {msg.role === 'ai' && (
                                        <div className="flex items-center gap-2 mb-2 text-primary font-bold text-sm">
                                            <Brain size={14} />
                                            AI 助手
                                        </div>
                                    )}
                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                        {isAnalyzing && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg rounded-tl-none border border-gray-200 dark:border-gray-700 shadow-sm">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <div className="animate-bounce">●</div>
                                        <div className="animate-bounce delay-100">●</div>
                                        <div className="animate-bounce delay-200">●</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                        <div className="flex gap-4">
                            <input
                                type="text"
                                className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="在此输入您的症状..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <Button onClick={handleSend} disabled={isAnalyzing || !input.trim()}>
                                <Send size={18} className="mr-2" />
                                发送
                            </Button>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                            <AlertTriangle size={12} />
                            AI 建议仅供参考，急重症请立即拨打 120 或前往急诊。
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
