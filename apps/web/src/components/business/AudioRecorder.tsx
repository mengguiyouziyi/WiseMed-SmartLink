'use client';

import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from './AudioRecorder.module.css';

interface AudioRecorderProps {
    onRecordingComplete: (audioBlob: Blob) => void;
    isProcessing?: boolean;
}

export function AudioRecorder({ onRecordingComplete, isProcessing = false }: AudioRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
                onRecordingComplete(audioBlob);
                stream.getTracks().forEach((track) => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);

            // Start timer
            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
        } catch (error) {
            console.error('Failed to start recording:', error);
            alert('无法访问麦克风。请检查浏览器权限设置。');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);

            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className={styles.container}>
            <div className={styles.controls}>
                {!isRecording ? (
                    <Button
                        onClick={startRecording}
                        disabled={isProcessing}
                        size="lg"
                        leftIcon={isProcessing ? <Loader2 className={styles.spinner} size={20} /> : <Mic size={20} />}
                    >
                        {isProcessing ? 'Processing...' : 'Start Recording'}
                    </Button>
                ) : (
                    <>
                        <div className={styles.recordingIndicator}>
                            <div className={styles.pulse} />
                            <span className={styles.recordingText}>Recording...</span>
                            <span className={styles.timer}>{formatTime(recordingTime)}</span>
                        </div>
                        <Button
                            onClick={stopRecording}
                            variant="danger"
                            size="lg"
                            leftIcon={<Square size={20} />}
                        >
                            Stop
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
