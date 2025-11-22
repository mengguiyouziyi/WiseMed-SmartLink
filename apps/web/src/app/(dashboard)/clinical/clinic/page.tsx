'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AudioRecorder } from '@/components/clinic/AudioRecorder';
import { TranscriptionPanel } from '@/components/clinic/TranscriptionPanel';
import { ConversationHistory } from '@/components/clinic/ConversationHistory';
import { MessageSquare, Globe, Mic } from 'lucide-react';
import styles from './page.module.css';

interface ConversationEntry {
    id: string;
    timestamp: Date;
    originalText: string;
    translatedText: string;
    language: string;
    audioUrl?: string;
}

export default function ClinicPage() {
    const [conversations, setConversations] = useState<ConversationEntry[]>([]);
    const [currentTranscription, setCurrentTranscription] = useState<string>('');
    const [currentTranslation, setCurrentTranslation] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleRecordingComplete = async (audioBlob: Blob) => {
        setIsProcessing(true);

        try {
            // 1. 上传音频并进行 ASR
            const formData = new FormData();
            formData.append('file', audioBlob, 'recording.wav');
            formData.append('language', 'zh');

            const asrResponse = await fetch('/api/clinic/transcribe', {
                method: 'POST',
                body: formData,
            });

            if (!asrResponse.ok) {
                throw new Error('ASR failed');
            }

            const asrResult = await asrResponse.json();
            const transcribedText = asrResult.text;
            setCurrentTranscription(transcribedText);

            // 2. 翻译文本
            const translateResponse = await fetch('/api/clinic/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: transcribedText,
                    source_lang: 'zh',
                    target_lang: 'en',
                }),
            });

            if (!translateResponse.ok) {
                throw new Error('Translation failed');
            }

            const translateResult = await translateResponse.json();
            const translatedText = translateResult.translated_text;
            setCurrentTranslation(translatedText);

            // 3. 保存到对话历史
            const newEntry: ConversationEntry = {
                id: Date.now().toString(),
                timestamp: new Date(),
                originalText: transcribedText,
                translatedText: translatedText,
                language: 'zh',
            };

            setConversations((prev) => [newEntry, ...prev]);

        } catch (error) {
            console.error('Processing error:', error);
            alert('处理失败，请重试');
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePlayTranslation = async (text: string) => {
        try {
            const response = await fetch('/api/clinic/synthesize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    language: 'en',
                }),
            });

            if (!response.ok) {
                throw new Error('TTS failed');
            }

            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.play();

        } catch (error) {
            console.error('TTS error:', error);
            alert('语音合成失败');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.heading}>
                        <Globe size={32} />
                        全球诊所
                    </h1>
                    <p className={styles.subtitle}>
                        实时多语言诊疗 - 语音识别、翻译与播放
                    </p>
                </div>
            </div>

            <div className={styles.mainContent}>
                {/* 左侧：录音与转录 */}
                <div className={styles.leftPanel}>
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <Mic size={20} />
                                语音录制
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <AudioRecorder
                                onRecordingComplete={handleRecordingComplete}
                                isProcessing={isProcessing}
                            />

                            <div className={styles.instructions}>
                                <p>📝 使用说明：</p>
                                <ol>
                                    <li>点击"开始录音"按钮开始录制</li>
                                    <li>说出您的诊疗内容（支持中文）</li>
                                    <li>点击"停止"结束录音</li>
                                    <li>系统将自动识别、翻译并显示结果</li>
                                </ol>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className={styles.transcriptionCard}>
                        <CardHeader>
                            <CardTitle>
                                <MessageSquare size={20} />
                                实时转录与翻译
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <TranscriptionPanel
                                originalText={currentTranscription}
                                translatedText={currentTranslation}
                                isProcessing={isProcessing}
                                onPlayTranslation={handlePlayTranslation}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* 右侧：对话历史 */}
                <div className={styles.rightPanel}>
                    <Card className={styles.historyCard}>
                        <CardHeader>
                            <CardTitle>对话历史</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ConversationHistory
                                conversations={conversations}
                                onPlayTranslation={handlePlayTranslation}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
