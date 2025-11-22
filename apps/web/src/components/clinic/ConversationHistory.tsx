'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Volume2, Clock } from 'lucide-react';
import styles from './ConversationHistory.module.css';

interface ConversationEntry {
    id: string;
    timestamp: Date;
    originalText: string;
    translatedText: string;
    language: string;
}

interface ConversationHistoryProps {
    conversations: ConversationEntry[];
    onPlayTranslation: (text: string) => void;
}

export function ConversationHistory({
    conversations,
    onPlayTranslation,
}: ConversationHistoryProps) {
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    if (conversations.length === 0) {
        return (
            <div className={styles.empty}>
                <Clock size={48} />
                <p>暂无对话记录</p>
                <span>开始录音后，对话历史将显示在这里</span>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {conversations.map((conv) => (
                <div key={conv.id} className={styles.entry}>
                    <div className={styles.entryHeader}>
                        <span className={styles.timestamp}>{formatTime(conv.timestamp)}</span>
                        <Button
                            size="sm"
                            variant="ghost"
                            leftIcon={<Volume2 size={14} />}
                            onClick={() => onPlayTranslation(conv.translatedText)}
                        >
                            播放
                        </Button>
                    </div>

                    <div className={styles.textBlock}>
                        <div className={styles.textLabel}>原文</div>
                        <div className={styles.text}>{conv.originalText}</div>
                    </div>

                    <div className={styles.textBlock}>
                        <div className={styles.textLabel}>译文</div>
                        <div className={styles.text}>{conv.translatedText}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}
