'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Sparkles, Send, Copy, RefreshCw } from 'lucide-react';

export default function AIAssistantPage() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; content: string }>>([
        { role: 'ai', content: '您好！我是 WiseMed AI 医疗助手。我可以帮助您：\n\n• 解答医学知识问题\n• 分析检查报告\n• 提供用药建议\n• 辅助诊断思路\n\n请问有什么可以帮助您的？' }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user' as const, content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        // Mock AI response with medical context
        setTimeout(() => {
            let response = '';
            const lowerInput = input.toLowerCase();

            if (lowerInput.includes('血压') || lowerInput.includes('高血压')) {
                response = '关于血压管理，我的建议如下：\n\n**正常血压范围**：\n• 收缩压：90-120 mmHg\n• 舒张压：60-80 mmHg\n\n**高血压诊断标准**：\n• 收缩压 ≥ 140 mmHg 或舒张压 ≥ 90 mmHg\n\n**生活方式干预**：\n1. 低盐饮食（每日 <6g）\n2. 规律运动（每周 150 分钟中等强度）\n3. 控制体重（BMI <24）\n4. 戒烟限酒\n\n如需药物治疗，请咨询医生。';
            } else if (lowerInput.includes('糖尿病') || lowerInput.includes('血糖')) {
                response = '关于糖尿病管理：\n\n**血糖控制目标**：\n• 空腹血糖：4.4-7.0 mmol/L\n• 餐后2小时：<10.0 mmol/L\n• 糖化血红蛋白（HbA1c）：<7%\n\n**五驾马车**：\n1. 饮食控制\n2. 运动疗法\n3. 药物治疗\n4. 血糖监测\n5. 健康教育\n\n建议定期监测血糖，遵医嘱用药。';
            } else if (lowerInput.includes('发烧') || lowerInput.includes('发热')) {
                response = '发热处理建议：\n\n**体温分级**：\n• 低热：37.3-38°C\n• 中等热：38.1-39°C\n• 高热：39.1-41°C\n• 超高热：>41°C\n\n**处理措施**：\n1. 多饮水，保持休息\n2. 物理降温（温水擦浴）\n3. 体温 >38.5°C 可服用退热药\n4. 持续高热或伴有其他症状请及时就医\n\n**警示症状**（需立即就医）：\n• 持续高热 >3天\n• 伴有剧烈头痛、呕吐\n• 意识改变\n• 呼吸困难';
            } else {
                response = '我已收到您的问题。作为 AI 医疗助手，我可以提供一般性的医疗知识和建议，但请注意：\n\n⚠️ **重要提示**：\n• AI 建议仅供参考，不能替代专业医生诊断\n• 如有严重症状，请立即就医\n• 用药请遵医嘱，切勿自行调整\n\n您可以继续向我咨询其他医疗问题。';
            }

            setMessages(prev => [...prev, { role: 'ai', content: response }]);
            setIsLoading(false);
        }, 1500);
    };

    const inputClass = "flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-500";

    return (
        <div className="p-8 max-w-[1200px] mx-auto h-[calc(100vh-64px)] flex flex-col">
            <div className="mb-8">
                <h1 className="flex items-center gap-4 text-4xl font-bold text-gray-900 dark:text-white mb-3">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                        <Sparkles size={36} className="text-white" />
                    </div>
                    AI 医疗助手
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 ml-[68px]">
                    基于大语言模型的智能医疗问答与辅助诊断
                </p>
            </div>

            <Card className="flex-1 flex flex-col overflow-hidden shadow-lg">
                <CardContent className="flex-1 flex flex-col p-0">
                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-900">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] p-5 rounded-2xl ${msg.role === 'user'
                                            ? 'bg-gradient-to-br from-primary to-primary/80 text-white rounded-tr-none shadow-md'
                                            : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-tl-none shadow-sm'
                                        }`}
                                >
                                    {msg.role === 'ai' && (
                                        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                                            <Sparkles size={18} className="text-primary" />
                                            <span className="font-bold text-primary">AI 助手</span>
                                        </div>
                                    )}
                                    <div className="whitespace-pre-wrap leading-relaxed text-base">
                                        {msg.content}
                                    </div>
                                    {msg.role === 'ai' && (
                                        <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                                            <button className="text-xs text-gray-500 hover:text-primary flex items-center gap-1 transition-colors">
                                                <Copy size={14} /> 复制
                                            </button>
                                            <button className="text-xs text-gray-500 hover:text-primary flex items-center gap-1 transition-colors">
                                                <RefreshCw size={14} /> 重新生成
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl rounded-tl-none border-2 border-gray-200 dark:border-gray-700 shadow-sm">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-6 border-t-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                        <div className="flex gap-4">
                            <input
                                type="text"
                                className={inputClass}
                                placeholder="输入您的医疗问题，例如：如何控制血压？"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <Button onClick={handleSend} disabled={isLoading || !input.trim()} className="px-8 py-3">
                                <Send size={20} className="mr-2" />
                                发送
                            </Button>
                        </div>
                        <div className="mt-3 text-xs text-gray-400 flex items-center gap-2">
                            <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full"></span>
                            AI 建议仅供参考，不能替代医生诊断。如有紧急情况请立即就医或拨打 120。
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
