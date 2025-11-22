'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Volume2, Loader2 } from 'lucide-react';
import styles from './TranscriptionPanel.module.css';

interface TranscriptionPanelProps {
    originalText: string;
    translatedText: string;
    isProcessing: boolean;
    onPlayTranslation: (text: string) => void;
}

export function TranscriptionPanel({
    originalText,
    translatedText,
    isProcessing,
    onPlayTranslation,
}: TranscriptionPanelProps) {
    return (
        <div className={styles.container}>
            {isProcessing ? (
                <div className={styles.processing}>
                    <Loader2 className={styles.spinner} size={32} />
                    <p>正在处理音频...</p>
                </div>
            ) : (
                <>
                    {/* 原文 */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <span className={styles.label}>原文（中文）</span>
                        </div>
                        <div className={styles.textBox}>
                            {originalText || (
                                <span className={styles.placeholder}>
                                    录音后，识别的文本将显示在这里...
                                </span>
                            )}
                        </div>
                    </div>

                    {/* 译文 */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <span className={styles.label}>译文（英文）</span>
                            {translatedText && (
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    leftIcon={<Volume2 size={16} />}
                                    onClick={() => onPlayTranslation(translatedText)}
                                >
                                    播放
                                </Button>
                            )}
                        </div>
                        <div className={styles.textBox}>
                            {translatedText || (
                                <span className={styles.placeholder}>
                                    翻译结果将显示在这里...
                                </span>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
