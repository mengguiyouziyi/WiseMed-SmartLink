'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { AudioRecorder } from '@/components/business/AudioRecorder';
import { ConversationPanel, Message } from '@/components/business/ConversationPanel';
import { TranslationService } from '@/services/TranslationService';
import { Languages, AlertCircle } from 'lucide-react';
import styles from './page.module.css';

export default function ClinicPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRecordingComplete = async (audioBlob: Blob) => {
        setIsProcessing(true);
        setError(null);

        try {
            // Step 1: Transcribe audio
            const transcription = await TranslationService.transcribeAudio(audioBlob);

            // Step 2: Translate text
            const translation = await TranslationService.translateText(transcription.text);

            // Step 3: Add to conversation
            const newMessage: Message = {
                id: Date.now().toString(),
                originalText: translation.original_text,
                translatedText: translation.translated_text,
                matchedTerms: translation.matched_terms,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, newMessage]);
        } catch (err: any) {
            setError(err.message || 'Processing failed');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.heading}>
                        <Languages className={styles.icon} size={32} />
                        Global Clinic
                    </h1>
                    <p className={styles.subtitle}>
                        Real-time voice transcription and medical translation
                    </p>
                </div>
            </div>

            {error && (
                <div className={styles.error}>
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
            )}

            <div className={styles.grid}>
                {/* Recorder Section */}
                <div className={styles.recorderSection}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Voice Recorder</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <AudioRecorder
                                onRecordingComplete={handleRecordingComplete}
                                isProcessing={isProcessing}
                            />
                            <div className={styles.instructions}>
                                <p>📌 Instructions:</p>
                                <ul>
                                    <li>Click &quot;Start Recording&quot; to begin</li>
                                    <li>Speak clearly in Chinese</li>
                                    <li>Click &quot;Stop&quot; when finished</li>
                                    <li>AI will transcribe and translate automatically</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Conversation Section */}
                <div className={styles.conversationSection}>
                    <Card className={styles.conversationCard}>
                        <CardHeader>
                            <CardTitle>Conversation History</CardTitle>
                        </CardHeader>
                        <CardContent className={styles.conversationContent}>
                            <ConversationPanel messages={messages} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
